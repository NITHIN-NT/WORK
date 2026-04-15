"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/user";

export interface PresenceUser {
  userId: string;
  userName: string;
  onlineAt: string;
}

/**
 * Hook to track and return a list of currently online users in the workspace.
 */
export function usePresence() {
  const { user } = useAuthStore();
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('workspace_presence', {
      config: {
        presence: {
          key: user.uid,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users: PresenceUser[] = [];
        
        Object.keys(state).forEach((key) => {
          const presenceArray = state[key] as unknown as Array<{ userName?: string; onlineAt: string }>;
          const p = presenceArray[0];
          users.push({
            userId: key,
            userName: p?.userName || 'Unknown User',
            onlineAt: p?.onlineAt,
          });
        });
        
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            userName: user.displayName || user.email || 'Unknown',
            onlineAt: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return onlineUsers;
}
