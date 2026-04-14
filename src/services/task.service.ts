import { db } from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  query,
  orderBy,
  collectionGroup,
  Query,
  DocumentData
} from "firebase/firestore";
import { Task } from "@/types/task";
import { SystemService } from "./system.service";

export const TaskService = {
  /**
   * Subscribe to tasks for a specific project or globally
   */
  subscribeToTasks(projectId: string, callback: (tasks: Task[]) => void) {
    let q: Query<DocumentData>;
    
    if (projectId === "global") {
      q = query(collectionGroup(db, "tasks"), orderBy("createdAt", "desc"));
    } else {
      q = query(collection(db, "projects", projectId, "tasks"), orderBy("createdAt", "asc"));
    }

    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          projectId: projectId === "global" ? doc.ref.parent.parent?.id : projectId,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
        };
      }) as Task[];
      callback(tasks);
    }, (error) => {
      console.error(`[TaskService] Subscription error for ${projectId}:`, error);
    });
  },

  /**
   * Create a new task within a project
   */
  async createTask(projectId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>, user: Record<string, unknown>) {
    const tasksRef = collection(db, "projects", projectId, "tasks");
    const docRef = await addDoc(tasksRef, {
      ...taskData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: user?.displayName || 'System',
    });

    await SystemService.dispatchActivityLedger({
      projectId,
      type: 'task_created',
      title: 'Task Created',
      description: `Task "${taskData.title}" was successfully initialized.`,
      userId: (user.uid as string),
      userName: (user.displayName as string) || 'User',
      metadata: { taskId: docRef.id }
    });

    await SystemService.dispatchNotificationRelay({
      userId: (user.uid as string),
      title: "Task Assigned",
      body: `You initialized "${taskData.title}" in the workspace.`,
      type: taskData.priority === 'Urgent' ? 'warning' : 'info'
    });

    return { id: docRef.id, ...taskData };
  },

  /**
   * Update an existing task
   */
  async updateTask(projectId: string, taskId: string, updates: Partial<Task>, user: Record<string, unknown>) {
    const taskRef = doc(db, "projects", projectId, "tasks", taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    if (updates.status) {
      await SystemService.dispatchActivityLedger({
        projectId,
        type: 'task_updated',
        title: 'Status Synchronized',
        description: `Task status transitioned to ${updates.status}.`,
        userId: (user.uid as string),
        userName: (user.displayName as string) || 'User',
        metadata: { taskId, status: updates.status }
      });

      if (updates.status === 'Completed') {
        await SystemService.dispatchNotificationRelay({
          userId: (user.uid as string),
          title: "Milestone Finalized",
          body: "A workspace task has been successfully finalized.",
          type: 'success'
        });
      }
    }
  },

  /**
   * Remove a task from the system
   */
  async deleteTask(projectId: string, taskId: string, user: Record<string, unknown>) {
    const taskRef = doc(db, "projects", projectId, "tasks", taskId);
    await deleteDoc(taskRef);

    await SystemService.dispatchActivityLedger({
      projectId,
      type: 'task_updated',
      title: 'Record Purged',
      description: 'A task has been permanently removed from the ledger.',
      userId: (user.uid as string),
      userName: (user.displayName as string) || 'User',
      metadata: { taskId }
    });

    await SystemService.dispatchNotificationRelay({
      userId: (user.uid as string),
      title: "Archive Mutation",
      body: "A task record has been purged from the ledger.",
      type: 'error'
    });
  }
};
