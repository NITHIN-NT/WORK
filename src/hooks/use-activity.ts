import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ActivityLog } from "@/types/activity";

export function useActivity(projectId: string) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchActivities = async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (!error && data) {
        setActivities(data as unknown as ActivityLog[]);
      }
      setLoading(false);
    };

    fetchActivities();

    const channel = supabase.channel(`activity_${projectId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'activities',
        filter: `project_id=eq.${projectId}`
      }, () => {
        fetchActivities();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, [projectId]);

  return { activities, loading };
}

