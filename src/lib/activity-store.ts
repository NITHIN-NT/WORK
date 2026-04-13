import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ActivityType, MetadataValue } from "@/types/activity";

interface LogActivityParams {
  projectId: string;
  type: ActivityType;
  title: string;
  description: string;
  userId: string;
  userName: string;
  metadata?: Record<string, MetadataValue>;
}

export async function logActivity({
  projectId,
  type,
  title,
  description,
  userId,
  userName,
  metadata
}: LogActivityParams) {
  try {
    const activityRef = collection(db, "projects", projectId, "activity");
    await addDoc(activityRef, {
      type,
      title,
      description,
      userId,
      userName,
      timestamp: serverTimestamp(),
      metadata: metadata || {}
    });
    console.log(`Activity logged: ${title}`);
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
