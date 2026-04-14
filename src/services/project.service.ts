import { supabase } from "@/lib/supabase";
import { Project } from "@/types/project";
import { SystemService } from "./system.service";

export const ProjectService = {
  /**
   * Subscribe to projects the user is a member of
   */
  subscribeToProjects(userId: string, callback: (projects: Project[]) => void) {
    // Initial fetch
    supabase
      .from('projects')
      .select('*')
      .contains('member_ids', [userId])
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          callback(data as unknown as Project[]);
        }
      });

    // Realtime subscription
    const channelId = `projects_updates_${userId}_${Math.random().toString(36).substring(7)}`;
    const channel = supabase.channel(channelId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        // Refetch on any change for simplicity in this migration
        supabase
          .from('projects')
          .select('*')
          .contains('member_ids', [userId])
          .order('created_at', { ascending: false })
          .then(({ data }) => {
            if (data) callback(data as unknown as Project[]);
          });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  },

  /**
   * Create a new project workspace
   */
  async createProject(userId: string, projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'tasksCount'>, user: Record<string, unknown> | null) {
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          ...projectData,
          member_ids: [userId],
          progress: 0,
          tasks_count: 0
        }
      ])
      .select()
      .single();

    if (error) throw error;

    await SystemService.dispatchActivityLedger({
      projectId: data.id,
      type: 'project_created',
      title: 'Workspace Initialized',
      description: `New project workspace "${projectData.name}" created for ${projectData.client}.`,
      userId: (user?.uid as string) || (user?.id as string) || 'system',
      userName: (user?.displayName as string) || ((user?.user_metadata as Record<string, string>)?.full_name as string) || 'User',
    });

    return data as unknown as Project;
  },

  /**
   * Update project metadata
   */
  async updateProject(projectId: string, updates: Partial<Project>) {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId);

    if (error) throw error;
  },

  /**
   * Permanently remove a project workspace
   */
  async deleteProject(projectId: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
      
    if (error) throw error;
  }
};

