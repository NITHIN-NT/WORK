"use client";

import { useState, useCallback, useEffect } from 'react';
import { UserRole } from '@/types/user';

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Lead';
  activeProjects: number;
  totalLTV: number;
  unpaidBalance: number;
  lastContact: string;
  stakeholderRole: UserRole;
  accountManager: string;
}

import { db } from "@/lib/firebase";
import { logActivity } from "@/lib/activity-store";
import { useAuthStore } from "@/store/user";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const clientsRef = collection(db, "clients");
    const q = query(clientsRef, orderBy("name", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clientsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastContact: doc.data().lastContact?.toDate?.()?.toISOString() || doc.data().lastContact || 'Never',
      })) as Client[];
      
      setClients(clientsList);
      setLoading(false);
    }, (error) => {
      console.error("Clients subscription error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addClient = useCallback(async (clientData: Omit<Client, 'id' | 'activeProjects' | 'totalLTV' | 'unpaidBalance' | 'lastContact'>) => {
    try {
      const clientsRef = collection(db, "clients");
      const docRef = await addDoc(clientsRef, {
        ...clientData,
        activeProjects: 0,
        totalLTV: 0,
        unpaidBalance: 0,
        lastContact: serverTimestamp(),
      });

      if (user) {
        await logActivity({
          projectId: 'global', // Clients are currently global in this schema
          type: 'requirement_updated', // Using requirement_updated as a proxy for client info changes
          title: 'New Client Profile Created',
          description: `Strategic expansion: ${clientData.company} has been added as a new client partner.`,
          userId: user.uid,
          userName: user.displayName || 'User',
        });
      }

      return { id: docRef.id, ...clientData };
    } catch (error) {
      console.error("Failed to add client:", error);
      throw error;
    }
  }, [user]);

  const deleteClient = useCallback(async (id: string) => {
    try {
      const clientRef = doc(db, "clients", id);
      await deleteDoc(clientRef);
      
      if (user) {
        await logActivity({
          projectId: 'global',
          type: 'requirement_updated',
          title: 'Client Profile Archived',
          description: 'A client profile was removed from the active database.',
          userId: user.uid,
          userName: user.displayName || 'User',
        });
      }
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  }, [user]);

  return {
    clients,
    loading,
    addClient,
    deleteClient,
  };
}
