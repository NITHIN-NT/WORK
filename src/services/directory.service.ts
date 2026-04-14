import { supabase } from "@/lib/supabase";
import { SystemService } from "./system.service";

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Lead';
  activeProjects: number;
  totalLTV: number;
  unpaidBalance: number;
  lastContact: string;
  stakeholderRole?: string;
  accountManager?: string;
}

export const DirectoryService = {
  /**
   * Subscribe to all clients in the directory
   */
  subscribeToClients(callback: (clients: Client[]) => void) {
    const fetchClients = async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });
      
      if (!error && data) {
        callback(data as unknown as Client[]);
      }
    };

    fetchClients();

    const channelId = `directory_sync_${Math.random().toString(36).substring(7)}`;
    const channel = supabase.channel(channelId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => {
        fetchClients();
      })
      .subscribe();

    return () => { 
      supabase.removeChannel(channel);
    };

  },

  /**
   * Create a new client profile
   */
  async createClient(clientData: Omit<Client, 'id' | 'activeProjects' | 'totalLTV' | 'unpaidBalance' | 'lastContact'>, user: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('clients')
      .insert([
        {
          ...clientData,
          active_projects: 0,
          total_ltv: 0,
          unpaid_balance: 0,
          last_contact: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    await SystemService.dispatchActivityLedger({
      projectId: 'global',
      type: 'requirement_updated',
      title: 'Strategic Onboarding',
      description: `${clientData.company} has been registered as an active client partner.`,
      userId: (user.uid as string) || (user.id as string),
      userName: (user.displayName as string) || 'User',
    });

    return data as unknown as Client;
  },

  /**
   * Remove a client from the directory
   */
  async deleteClient(clientId: string, user: Record<string, unknown>) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);
    
    if (error) throw error;
    
    await SystemService.dispatchActivityLedger({
      projectId: 'global',
      type: 'requirement_updated',
      title: 'Directory Update',
      description: 'A client profile has been decommissioned from the active directory.',
      userId: (user.uid as string) || (user.id as string),
      userName: (user.displayName as string) || 'User',
    });
  },

  /**
   * Update workspace user roles (Admin feature)
   */
  async updateUserRole(userId: string, role: string) {
    const { error } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId);
    
    if (error) throw error;
  }
};

