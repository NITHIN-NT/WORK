"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collectionGroup, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { ActivityLog } from "@/types/activity";
import { useAuthStore } from "@/store/user";

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

    // Collection Group query to fetch activities from all subcollections named 'activity'
    // Security rules will automatically filter these based on project membership
    const activityGroupRef = collectionGroup(db, "activity");
    const q = query(
      activityGroupRef, 
      orderBy("timestamp", "desc"), 
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Extract projectId from path for the UI if needed
        projectId: doc.ref.parent.parent?.id || '',
        timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
      })) as ActivityLog[];
      
      setActivities(logs);
      setLoading(false);
    }, (error) => {
      console.error("Global activity subscription error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { activities, loading };
}
