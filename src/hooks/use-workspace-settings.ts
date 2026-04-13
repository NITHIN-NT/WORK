"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  serverTimestamp 
} from "firebase/firestore";

interface WorkspaceSettings {
  currency: string;
  timezone: string;
  updatedAt?: Date | string | { toDate: () => Date };
}

const DEFAULT_SETTINGS: WorkspaceSettings = {
  currency: 'INR',
  timezone: '(GMT+05:30) Mumbai, New Delhi',
};

export function useWorkspaceSettings() {
  const [settings, setSettings] = useState<WorkspaceSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We store global settings in a fixed document ID
    const settingsRef = doc(db, "settings", "workspace");

    const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as WorkspaceSettings);
      } else {
        // Initialize if not exists
        setDoc(settingsRef, DEFAULT_SETTINGS);
      }
      setLoading(false);
    }, (error) => {
      console.error("Workspace settings subscription error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateSettings = useCallback(async (updates: Partial<WorkspaceSettings>) => {
    try {
      const settingsRef = doc(db, "settings", "workspace");
      await setDoc(settingsRef, {
        ...settings,
        ...updates,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error("Failed to update workspace settings:", error);
    }
  }, [settings]);

  return { settings, loading, updateSettings };
}
