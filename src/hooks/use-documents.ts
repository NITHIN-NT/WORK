"use client";

import { useState, useCallback, useEffect } from 'react';
import { ProjectDocument } from '@/types/document';
import { logActivity } from '@/lib/activity-store';
import { useAuthStore } from '@/store/user';

const INITIAL_DOCS: ProjectDocument[] = [
  { 
    id: '1', projectId: '1', title: 'Acme E-commerce Proposal', type: 'Proposal', 
    content: '<h2>Project Proposal</h2><p>Overview of the e-commerce goals...</p>',
    isPublic: true, sharedLinkToken: 'token123',
    createdAt: '2026-03-20', updatedAt: '2026-04-10', createdBy: 'Sarah Mitchell' 
  },
  { 
    id: '2', projectId: '2', title: 'Technical Architecture', type: 'Technical Documentation', 
    content: '<h2>Architecture Diagram</h2><p>Details about the system design...</p>',
    isPublic: false,
    createdAt: '2026-04-05', updatedAt: '2026-04-05', createdBy: 'Alex Rivers' 
  },
];

export function useDocuments(projectId?: string) {
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      let data = INITIAL_DOCS;
      if (projectId) {
        data = data.filter(doc => doc.projectId === projectId);
      }
      setDocuments(data);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [projectId]);

  const addDocument = useCallback(async (docData: Omit<ProjectDocument, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    const newDoc: ProjectDocument = {
      ...docData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user?.displayName || 'User',
    };

    setDocuments(prev => [newDoc, ...prev]);

    if (user) {
      await logActivity({
        projectId: newDoc.projectId,
        type: 'document_created',
        title: 'New Document Drafted',
        description: `The document "${newDoc.title}" was added to the workspace.`,
        userId: user.uid,
        userName: user.displayName || 'User',
      });
    }

    return newDoc;
  }, [user]);

  const updateDocument = useCallback(async (id: string, updates: Partial<ProjectDocument>) => {
    setDocuments(prev => prev.map(doc => {
        if (doc.id === id) {
            const updated = { ...doc, ...updates, updatedAt: new Date().toISOString() };
            return updated;
        }
        return doc;
    }));
  }, []);

  const deleteDocument = useCallback(async (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  }, []);

  return {
    documents,
    loading,
    addDocument,
    updateDocument,
    deleteDocument,
  };
}
