"use client";

import { useEffect, useState, useCallback } from "react";
import { messaging } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { useAuthStore } from "@/store/user";

export function useNotifications() {
  const { user } = useAuthStore();
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !messaging) return;

    try {
      const status = await Notification.requestPermission();
      setPermission(status);
      
      if (status === "granted") {
        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
        });
        
        if (currentToken) {
          setToken(currentToken);
          console.log("FCM Token obtained:", currentToken);
          // In real implementation, save to Firestore: users/{userId}/fcmTokens
        }
      }
    } catch (error) {
      console.error("An error occurred while requesting permission ", error);
    }
  }, []);

  useEffect(() => {
    const initNotifications = async () => {
      if (user && typeof window !== "undefined") {
        await requestPermission();
      }
    };
    
    initNotifications();
    
    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground message received:", payload);
        // Dispatch global notification event or show toast
      });
      return () => unsubscribe();
    }
  }, [user, requestPermission]);

  return { token, permission, requestPermission };
}
