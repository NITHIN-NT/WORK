import { supabase } from "@/lib/supabase";
import { Invoice, InvoiceStatus } from "@/types/invoice";
import { SystemService } from "./system.service";

export const FinancialService = {
  /**
   * Subscribe to invoices, filtered by project if provided
   */
  subscribeToInvoices(projectId: string | undefined, callback: (invoices: Invoice[]) => void) {
    const fetchInvoices = async () => {
      let query = supabase
        .from('invoices')
        .select('*');

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('issue_date', { ascending: false });
      
      if (!error && data) {
        callback(data as unknown as Invoice[]);
      }
    };

    // Initial fetch
    fetchInvoices();

    // Real-time subscription
    const channelId = `invoices_updates_${projectId || 'global'}_${Math.random().toString(36).substring(7)}`;
    const channel = supabase.channel(channelId)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'invoices',
        filter: projectId ? `project_id=eq.${projectId}` : undefined
      }, () => {
        fetchInvoices();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  },

  /**
   * Generate a new invoice record
   */
  async createInvoice(invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'invoiceNumber'>, user: Record<string, unknown>) {
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    
    const { data, error } = await supabase
      .from('invoices')
      .insert([
        {
          ...invoiceData,
          project_id: invoiceData.projectId || null,
          invoice_number: invoiceNumber,
        }
      ])
      .select()
      .single();

    if (error) throw error;

    await SystemService.dispatchActivityLedger({
      projectId: invoiceData.projectId || 'global',
      type: 'financial_update',
      title: 'Invoice Dispatched',
      description: `New financial record ${invoiceNumber} created for ${invoiceData.currency} ${invoiceData.total.toLocaleString()}.`,
      userId: (user.uid as string) || (user.id as string),
      userName: (user.displayName as string) || 'User',
    });

    return data as unknown as Invoice;
  },

  /**
   * Update the status of a specific invoice
   */
  async updateInvoiceStatus(invoiceId: string, status: InvoiceStatus, user: Record<string, unknown>, projectId?: string) {
    const { error } = await supabase
      .from('invoices')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', invoiceId);

    if (error) throw error;

    await SystemService.dispatchActivityLedger({
      projectId: projectId || 'global',
      type: 'financial_update',
      title: 'Payment Reconciliation',
      description: `Invoice marked as ${status}. Settlement confirmed.`,
      userId: (user.uid as string) || (user.id as string),
      userName: (user.displayName as string) || 'User',
      metadata: { invoiceId, status }
    });
  }
};

