"use client";

import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store/user';
import { DirectoryService, Client } from '@/services/directory.service';

/**
 * Domain-driven orchestration hook for Client directory management.
 */
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const unsubscribe = DirectoryService.subscribeToClients((clientsList) => {
      setClients(clientsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onboardClient = useCallback(async (clientData: Omit<Client, 'id' | 'activeProjects' | 'totalLTV' | 'unpaidBalance' | 'lastContact'>) => {
    if (!user) throw new Error("Authentication required to register client partners");
    try {
      const newClient = await DirectoryService.createClient(clientData, user as unknown as Record<string, unknown>);
      return newClient;
    } catch (error) {
      console.error("[useClients] onboardClient failure:", error);
      throw error;
    }
  }, [user]);

  const archiveClientProfile = useCallback(async (id: string) => {
    if (!user) return;
    try {
      await DirectoryService.deleteClient(id, user as unknown as Record<string, unknown>);
    } catch (error) {
      console.error("[useClients] archiveClientProfile failure:", error);
    }
  }, [user]);

  return {
    clients,
    loading,
    addClient: onboardClient,
    deleteClient: archiveClientProfile,
  };
}

