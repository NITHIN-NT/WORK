"use client";

import { useState, useEffect } from "react";
import { ActivityLog } from "@/types/activity";
import { useAuthStore } from "@/store/user";
import { SystemService } from "@/services/system.service";

/**
 * Domain-driven hook for orchestration of the global activity stream.
 */
export function useGlobalActivity() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      queueMicrotask(() => {
        setActivities([]);
        setLoading(false);
      });
      return;
    }

    const unsubscribe = SystemService.subscribeToActivity((logs) => {
      setActivities(logs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { activities, loading };
}

