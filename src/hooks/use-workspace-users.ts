"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { WorkspaceUser, UserRole } from "@/types/user";
import { sendInviteEmailAction } from "@/actions/send-invite";

export function useWorkspaceUsers() {
  const [users, setUsers] = useState<WorkspaceUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name', { ascending: true });

    if (!error && data) {
      const mappedUsers = (data as any[]).map(u => ({
        ...u,
        lastSeen: u.last_seen,
        avatarUrl: u.avatar_url,
      }));
      setUsers(mappedUsers as WorkspaceUser[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();

    // Real-time updates for the team directory
    const channel = supabase.channel('users_directory')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        fetchUsers();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, [fetchUsers]);

  const updateUserRole = useCallback(async (userId: string, role: UserRole) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);
      if (error) throw error;
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  }, []);

  const updateUserStatus = useCallback(async (userId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId);
      if (error) throw error;
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  }, []);

  const removeUser = useCallback(async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      if (error) throw error;
    } catch (error) {
      console.error("Failed to remove user:", error);
    }
  }, []);

  const inviteUser = useCallback(async (email: string, role: string) => {
    try {
      // 1. Dispatch the email via Resend
      const emailResult = await sendInviteEmailAction(email, role);
      if (!emailResult.success) {
        throw new Error("Failed to dispatch email");
      }

      // 2. Pre-add the user record to Supabase with 'Pending' status
      const { error } = await supabase
        .from('users')
        .insert([
          {
            id: `pending_${Math.random().toString(36).substring(7)}`, // Temporary ID until they sign in
            name: email.split('@')[0],
            email: email,
            role: role,
            status: 'Pending',
          }
        ]);
      
      if (error) throw error;
      
    } catch (error) {
      console.error("Failed to invite user:", error);
      throw error;
    }
  }, []);

  return { users, loading, updateUserRole, updateUserStatus, removeUser, inviteUser };
}

