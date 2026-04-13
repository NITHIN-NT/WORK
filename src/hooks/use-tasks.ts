"use client";

import { useState, useCallback, useEffect } from 'react';
import { Task } from '@/types/task';
import { logActivity } from '@/lib/activity-store';
import { useAuthStore } from '@/store/user';

// Placeholder for real Firestore logic
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
  orderBy
} from "firebase/firestore";

// Placeholder for real Firestore logic
export function useTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!projectId || projectId === "global") {
      queueMicrotask(() => {
        setLoading(false);
        setTasks([]);
      });
      return;
    }

    const tasksRef = collection(db, "projects", projectId, "tasks");
    const q = query(tasksRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt || new Date().toISOString(),
      })) as Task[];
      
      setTasks(tasksList);
      setLoading(false);
    }, (error) => {
      console.error("Tasks subscription error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [projectId]);

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    try {
      setLoading(true);
      const tasksRef = collection(db, "projects", projectId, "tasks");
      const docRef = await addDoc(tasksRef, {
        ...taskData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user?.displayName || 'User',
      });

      if (user) {
        await logActivity({
          projectId,
          type: 'task_created',
          title: 'New Task Created',
          description: `Task "${taskData.title}" was added to the board.`,
          userId: user.uid,
          userName: user.displayName || 'User',
          metadata: { taskId: docRef.id }
        });
      }
      setLoading(false);
      return { id: docRef.id, ...taskData };
    } catch (error) {
      console.error("Failed to add task:", error);
      setLoading(false);
      throw error;
    }
  }, [projectId, user]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      const taskRef = doc(db, "projects", projectId, "tasks", taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      
      if (user && updates.status) {
        await logActivity({
          projectId,
          type: 'task_updated',
          title: 'Task Status Updated',
          description: `Task status moved to ${updates.status}.`,
          userId: user.uid,
          userName: user.displayName || 'User',
          metadata: { taskId, status: updates.status }
        });
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }, [projectId, user]);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      const taskRef = doc(db, "projects", projectId, "tasks", taskId);
      await deleteDoc(taskRef);
      
      if (user) {
        await logActivity({
          projectId,
          type: 'task_updated',
          title: 'Task Deleted',
          description: 'A task was permanently removed from the workspace.',
          userId: user.uid,
          userName: user.displayName || 'User',
          metadata: { taskId }
        });
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }, [projectId, user]);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    setTasks,
  };
}
