"use client";

import { useState, useCallback, useEffect } from 'react';
import { ProjectDocument } from '@/types/document';
import { useAuthStore } from '@/store/user';
import { DocumentService } from '@/services/document.service';

export function useDocuments(projectId?: string) {
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!projectId || projectId === 'global') {
      queueMicrotask(() => setLoading(false));
      return;
    }

    const unsubscribe = DocumentService.subscribeToDocuments(projectId, (data) => {
      setDocuments(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [projectId]);

  const addDocument = useCallback(async (docData: Omit<ProjectDocument, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'projectId'>) => {
    if (!user || !projectId) return;
    return await DocumentService.createDocument(projectId, docData, user as unknown as Record<string, unknown>);
  }, [user, projectId]);

  const updateDocument = useCallback(async (id: string, updates: Partial<ProjectDocument>) => {
    if (!projectId) return;
    await DocumentService.synchronizeDocument(projectId, id, updates);
  }, [projectId]);

  const deleteDocument = useCallback(async (id: string) => {
    if (!projectId) return;
    await DocumentService.purgeDocument(projectId, id);
  }, [projectId]);

  return {
    documents,
    loading,
    addDocument,
    updateDocument,
    deleteDocument,
  };
}
