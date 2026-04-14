"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface WorkspaceSettings {
  currency: string;
  timezone: string;
  theme: 'custom' | 'dark';
  milestone_alerts: boolean;
  financial_alerts: boolean;
  mfa_enabled: boolean;
  updated_at?: Date | string;
}

const DEFAULT_SETTINGS: WorkspaceSettings = {
  currency: 'INR',
  timezone: '(GMT+05:30) Mumbai, New Delhi',
  theme: 'custom',
  milestone_alerts: true,
  financial_alerts: false,
  mfa_enabled: false,
};

export function useWorkspaceSettings() {
  const [settings, setSettings] = useState<WorkspaceSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'workspace')
      .single();

    if (!error && data) {
      setSettings(data as unknown as WorkspaceSettings);
      
      // Theme synchronization
      if (typeof window !== 'undefined') {
        if (data.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } else if (error && error.code === 'PGRST116') {
      // Record not found - initialize with defaults
      await supabase
        .from('settings')
        .insert([{ id: 'workspace', ...DEFAULT_SETTINGS }]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();

    const channel = supabase.channel('settings_sync')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings', filter: 'id=eq.workspace' }, () => {
        fetchSettings();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, [fetchSettings]);

  const updateSettings = useCallback(async (updates: Partial<WorkspaceSettings>) => {
    try {
      const { error } = await supabase
        .from('settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', 'workspace');
      
      if (error) throw error;
    } catch (error) {
      console.error("Failed to update workspace settings:", error);
    }
  }, []);


  return { settings, loading, updateSettings };
}

