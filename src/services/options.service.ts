import { supabase } from "@/lib/supabase";

export interface WorkspaceOption {
  id: string;
  category: string;
  label: string;
  value: string;
  color?: string;
  order_index: number;
  is_system: boolean;
}

export const OptionService = {
  async fetchOptions() {
    const { data, error } = await supabase
      .from('workspace_options')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.warn("[OptionService] Failed to fetch from 'workspace_options':", error.message);
      throw error;
    }
    return data as WorkspaceOption[];
  },

  async createOption(option: Omit<WorkspaceOption, 'id' | 'is_system'>) {
    const { data, error } = await supabase
      .from('workspace_options')
      .insert([option])
      .select()
      .single();

    if (error) throw error;
    return data as WorkspaceOption;
  },

  async updateOption(id: string, updates: Partial<WorkspaceOption>) {
    const { data, error } = await supabase
      .from('workspace_options')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as WorkspaceOption;
  },

  async deleteOption(id: string) {
    const { error } = await supabase
      .from('workspace_options')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
