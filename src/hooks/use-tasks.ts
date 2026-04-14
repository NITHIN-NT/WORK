"use client";

import { useState, useCallback, useEffect } from 'react';
import { Task } from '@/types/task';
import { useAuthStore } from '@/store/user';
import { TaskService } from '@/services/task.service';

/**
 * Domain-driven hook for orchestration of task states and synchronization.
 */
export function useTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!projectId) {
      queueMicrotask(() => setLoading(false));
      return;
    }

    const unsubscribe = TaskService.subscribeToTasks(projectId, (tasksList) => {
      setTasks(tasksList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [projectId]);

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    if (!user) return;
    try {
      setLoading(true);
      const newTask = await TaskService.createTask(projectId, taskData, user as unknown as Record<string, unknown>);
      setLoading(false);
      return newTask;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, [projectId, user]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    if (!user) return;
    try {
      await TaskService.updateTask(projectId, taskId, updates, user as unknown as Record<string, unknown>);
    } catch (error) {
      console.error("[useTasks] updateTask failure:", error);
    }
  }, [projectId, user]);

  const deleteTask = useCallback(async (taskId: string) => {
    if (!user) return;
    try {
      await TaskService.deleteTask(projectId, taskId, user as unknown as Record<string, unknown>);
    } catch (error) {
      console.error("[useTasks] deleteTask failure:", error);
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

