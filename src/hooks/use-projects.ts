"use client";

import { useState, useCallback, useEffect } from 'react';
import { Project } from '@/types/project';
import { useAuthStore } from '@/store/user';
import { ProjectService } from '@/services/project.service';

/**
 * Domain-driven orchestration hook for Project management and workspace synchronization.
 */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      queueMicrotask(() => {
        setProjects([]);
        setLoading(false);
      });
      return;
    }

    const unsubscribe = ProjectService.subscribeToProjects(user.uid, (projectsList) => {
      setProjects(projectsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const launchProject = useCallback(async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'tasksCount'>) => {
    if (!user) throw new Error("Authentication required to internalize workspaces");

    try {
      const newProject = await ProjectService.createProject(user.uid, projectData, user as unknown as Record<string, unknown>);
      return newProject;
    } catch (error) {
      console.error("[useProjects] launchProject failure:", error);
      throw error;
    }
  }, [user]);

  const updateProjectMetadata = useCallback(async (id: string, updates: Partial<Project>) => {
    try {
      await ProjectService.updateProject(id, updates);
    } catch (error) {
      console.error("[useProjects] updateProjectMetadata failure:", error);
    }
  }, []);

  const decommissionProject = useCallback(async (id: string) => {
    try {
      await ProjectService.deleteProject(id);
    } catch (error) {
      console.error("[useProjects] decommissionProject failure:", error);
    }
  }, []);

  return {
    projects,
    loading,
    addProject: launchProject,
    updateProject: updateProjectMetadata,
    deleteProject: decommissionProject,
  };
}

