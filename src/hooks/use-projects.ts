"use client";

import { useState, useCallback, useEffect } from 'react';
import { Project } from '@/types/project';
import { logActivity } from '@/lib/activity-store';
import { useAuthStore } from '@/store/user';

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
  where
} from "firebase/firestore";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    // If no user, sync state without triggering cascading render warnings
    if (!user) {
      queueMicrotask(() => {
        setProjects([]);
        setLoading(false);
      });
      return;
    }

    const projectsRef = collection(db, "projects");
    // Secure query: Only fetch projects where the user is a member
    const q = query(
      projectsRef, 
      where("memberIds", "array-contains", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt || new Date().toISOString(),
      })) as Project[];
      
      setProjects(projectsList);
      setLoading(false);
    }, (error) => {
      console.error("Projects subscription error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addProject = useCallback(async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'tasksCount'>) => {
    if (!user) throw new Error("Authentication required to create projects");

    try {
      const projectsRef = collection(db, "projects");
      const docRef = await addDoc(projectsRef, {
        ...projectData,
        memberIds: [user.uid], // Set the creator as the first member
        progress: 0,
        tasksCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await logActivity({
        projectId: docRef.id,
        type: 'project_created',
        title: 'New Workspace Initialized',
        description: `The project "${projectData.name}" was created for ${projectData.client}.`,
        userId: user.uid,
        userName: user.displayName || 'User',
      });

      return { id: docRef.id, ...projectData };
    } catch (error) {
      console.error("Failed to add project:", error);
      throw error;
    }
  }, [user]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    try {
      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      const projectRef = doc(db, "projects", id);
      await deleteDoc(projectRef);
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  }, []);

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
  };
}
