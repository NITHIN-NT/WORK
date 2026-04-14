import { db } from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  collectionGroup,
  serverTimestamp
} from "firebase/firestore";
import { ActivityLog, ActivityType } from "@/types/activity";

export interface NotificationPayload {
  userId: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export const SystemService = {
  /**
   * Dispatch a real-time notification relay to a specific user endpoint.
   */
  async dispatchNotificationRelay(payload: NotificationPayload) {
    const notificationsRef = collection(db, "notifications");
    await addDoc(notificationsRef, {
      ...payload,
      read: false,
      timestamp: serverTimestamp(),
    });
  },

  /**
   * Log a forensic activity entry to the workspace ledger.
   */
  async dispatchActivityLedger(params: {
    projectId: string;
    type: ActivityType;
    title: string;
    description: string;
    userId: string;
    userName: string;
    metadata?: Record<string, unknown>;
  }) {
    const { projectId, ...data } = params;
    const activityRef = collection(db, "projects", projectId, "activity");
    await addDoc(activityRef, {
      ...data,
      timestamp: serverTimestamp(),
      metadata: data.metadata || {}
    });
  },

  /**
   * Subscribe to the global activity stream (cross-project)
   */
  subscribeToActivity(callback: (activities: ActivityLog[]) => void, maxResults = 20) {
    const activityGroupRef = collectionGroup(db, "activity");
    const q = query(
      activityGroupRef, 
      orderBy("timestamp", "desc"), 
      limit(maxResults)
    );

    return onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        projectId: doc.ref.parent.parent?.id || '',
        timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
      })) as ActivityLog[];
      callback(logs);
    }, (error) => {
      console.error("[SystemService] Activity subscription error:", error);
    });
  },

  /**
   * Subscribe to a specific project's activity
   */
  subscribeToProjectActivity(projectId: string, callback: (activities: ActivityLog[]) => void) {
    const projectActivityRef = collection(db, "projects", projectId, "activity");
    const q = query(projectActivityRef, orderBy("timestamp", "desc"), limit(50));

    return onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
      })) as ActivityLog[];
      callback(logs);
    }, (error) => {
      console.error(`[SystemService] Project activity error for ${projectId}:`, error);
    });
  }
};
