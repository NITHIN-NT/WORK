import { supabase } from "@/lib/supabase";
import { ActivityLog, ActivityType } from "@/types/activity";

export interface NotificationPayload {
  userId: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export const SystemService = {
  /**
   * Dispatch a real-time notification relay to a specific user endpoint.
   */
  async dispatchNotificationRelay(payload: NotificationPayload) {
    const { error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: payload.userId,
          title: payload.title,
          body: payload.body,
          type: payload.type,
          read: false,
        }
      ]);

    if (error) console.error("[SystemService] Email relay error:", error);
  },

  /**
   * Log a forensic activity entry to the workspace ledger.
   */
  async dispatchActivityLedger(params: {
    projectId: string;
    type: ActivityType;
    title: string;
    description: string;
    userId: string;
    userName: string;
    metadata?: Record<string, unknown>;
  }) {
    const { projectId, ...data } = params;
    const { error } = await supabase
      .from('activities')
      .insert([
        {
          project_id: projectId,
          user_id: data.userId,
          user_name: data.userName,
          type: data.type,
          title: data.title,
          description: data.description,
          metadata: data.metadata || {}
        }
      ]);

    if (error) console.error("[SystemService] Ledger entry error:", error);
  },

  /**
   * Subscribe to the global activity stream (cross-project)
   */
  subscribeToActivity(callback: (activities: ActivityLog[]) => void, maxResults = 20) {
    const fetchActivities = async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(maxResults);
      
      if (!error && data) {
        callback(data as unknown as ActivityLog[]);
      }
    };

    fetchActivities();

    const channelId = `global_activity_${Math.random().toString(36).substring(7)}`;
    const channel = supabase.channel(channelId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activities' }, () => {
        fetchActivities();
      })
      .subscribe();

    return () => { 
      supabase.removeChannel(channel);
    };

  },

  /**
   * Subscribe to a specific project's activity
   */
  subscribeToProjectActivity(projectId: string, callback: (activities: ActivityLog[]) => void) {
    const fetchProjectActivities = async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (!error && data) {
        callback(data as unknown as ActivityLog[]);
      }
    };

    fetchProjectActivities();

    const channel = supabase.channel(`project_activity_${projectId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'activities',
        filter: `project_id=eq.${projectId}`
      }, () => {
        fetchProjectActivities();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }
};

