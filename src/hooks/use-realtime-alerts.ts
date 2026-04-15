"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/user";
import { SystemService } from "@/services/system.service";
import { useToast } from "@/components/ui/toast";

/**
 * Global hook to listen for real-time notification events.
 * Dispatches UI toasts for immediate user attention.
 */
export function useRealtimeAlerts() {
  const { user } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    // 1. Subscribe to persisting database notifications
    const unsubscribeDb = SystemService.subscribeToNotifications(user.uid, (payload) => {
      // Map 'warning' (from NotificationPayload) to 'info' (from ToastType)
      const toastType = (payload.type === 'warning' ? 'info' : payload.type) as 'info' | 'success' | 'error';
      toast(payload.message || payload.body, toastType);
    });

    return () => {
      unsubscribeDb();
    };
  }, [user, toast]);
}
