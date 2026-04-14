import { supabase } from "@/lib/supabase";

export interface UserProfileUpdate {
  name?: string;
  photo_url?: string;
}

export const UserService = {
  synchronizeProfileIdentity: async (userId: string, data: UserProfileUpdate) => {
    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', userId);
      
    if (error) throw error;
  },


  fetchCoreTeamRegistry: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) throw error;
    return data;
  }
};

