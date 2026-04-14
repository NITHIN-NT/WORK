import { supabase } from "@/lib/supabase";
import { Task } from "@/types/task";
import { SystemService } from "./system.service";

export const TaskService = {
  /**
   * Subscribe to tasks for a specific project or globally
   */
  subscribeToTasks(projectId: string, callback: (tasks: Task[]) => void) {
    const fetchTasks = async () => {
      let query = supabase
        .from('tasks')
        .select('*');

      if (projectId !== "global") {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('created_at', { ascending: projectId !== "global" });
      
      if (!error && data) {
        callback(data as unknown as Task[]);
      }
    };

    // Initial fetch
    fetchTasks();

    // Real-time subscription
    const channelId = `tasks_updates_${projectId}_${Math.random().toString(36).substring(7)}`;
    const channel = supabase.channel(channelId)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks',
        filter: projectId !== "global" ? `project_id=eq.${projectId}` : undefined
      }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  },

  /**
   * Create a new task within a project
   */
  async createTask(projectId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>, user: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          ...taskData,
          project_id: projectId,
          created_by: (user.displayName as string) || 'System',
        }
      ])
      .select()
      .single();

    if (error) throw error;

    await SystemService.dispatchActivityLedger({
      projectId,
      type: 'task_created',
      title: 'Task Created',
      description: `Task "${taskData.title}" was successfully initialized.`,
      userId: (user.uid as string) || (user.id as string),
      userName: (user.displayName as string) || 'User',
      metadata: { taskId: data.id }
    });

    return data as unknown as Task;
  },

  /**
   * Update an existing task
   */
  async updateTask(projectId: string, taskId: string, updates: Partial<Task>, user: Record<string, unknown>) {
    const { error } = await supabase
      .from('tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);

    if (error) throw error;

    if (updates.status) {
      await SystemService.dispatchActivityLedger({
        projectId,
        type: 'task_updated',
        title: 'Status Synchronized',
        description: `Task status transitioned to ${updates.status}.`,
        userId: (user.uid as string) || (user.id as string),
        userName: (user.displayName as string) || 'User',
        metadata: { taskId, status: updates.status }
      });
    }
  },

  /**
   * Remove a task from the system
   */
  async deleteTask(projectId: string, taskId: string, user: Record<string, unknown>) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;

    await SystemService.dispatchActivityLedger({
      projectId,
      type: 'task_updated',
      title: 'Record Purged',
      description: 'A task has been permanently removed from the ledger.',
      userId: (user.uid as string) || (user.id as string),
      userName: (user.displayName as string) || 'User',
      metadata: { taskId }
    });
  }
};

