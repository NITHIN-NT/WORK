import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { ActivityLog } from "@/types/activity";

export function useActivity(projectId: string) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const activityRef = collection(db, "projects", projectId, "activity");
    const q = query(activityRef, orderBy("timestamp", "desc"), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to ISO string for the UI
        timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
      })) as ActivityLog[];
      
      setActivities(logs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [projectId]);

  return { activities, loading };
}
