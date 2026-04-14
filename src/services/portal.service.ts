import { supabase } from "@/lib/supabase";
import { Project } from "@/types/project";
import { Invoice } from "@/types/invoice";
import { Task } from "@/types/task";

export const PortalService = {
  /**
   * Subscribe to projects belonging to a specific client
   */
  subscribeToClientProjects(clientName: string, callback: (projects: Project[]) => void) {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client', clientName)
        .order('created_at', { ascending: false });

      if (!error && data) {
        callback(data as unknown as Project[]);
      }
    };

    fetch();

    const channel = supabase.channel(`portal_projects_${clientName}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'projects',
        filter: `client=eq.${clientName}`
      }, () => {
        fetch();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  },

  /**
   * Subscribe to invoices for a specific client
   */
  subscribeToClientInvoices(clientName: string, callback: (invoices: Invoice[]) => void) {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          projects!inner (
            client
          )
        `)
        .eq('projects.client', clientName)
        .order('issue_date', { ascending: false });

      if (!error && data) {
        callback(data as unknown as Invoice[]);
      }
    };

    fetch();

    const channel = supabase.channel(`portal_invoices_${clientName}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => {
        fetch();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  },

  /**
   * Subscribe to all tasks for a list of projects
   */
  subscribeToClientTasks(projectIds: string[], callback: (tasks: Task[]) => void) {
    if (projectIds.length === 0) {
      callback([]);
      return () => {};
    }

    const fetch = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .in('project_id', projectIds)
        .order('created_at', { ascending: false });

      if (!error && data) {
        callback(data as unknown as Task[]);
      }
    };

    fetch();

    const channelId = `portal_tasks_${Math.random().toString(36).substring(7)}`;
    const channel = supabase.channel(channelId)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks'
      }, () => {
        fetch();
      })
      .subscribe();

    return () => { 
      supabase.removeChannel(channel);
    };

  }
};

