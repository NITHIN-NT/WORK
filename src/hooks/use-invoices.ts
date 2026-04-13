"use client";

import { useState, useCallback, useEffect } from 'react';
import { Invoice, InvoiceStatus } from '@/types/invoice';
import { logActivity } from '@/lib/activity-store';
import { useAuthStore } from '@/store/user';

import { db } from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  query,
  orderBy,
  where
} from "firebase/firestore";

export function useInvoices(projectId?: string) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const invoicesRef = collection(db, "invoices");
    let q = query(invoicesRef, orderBy("date", "desc"));

    if (projectId) {
      q = query(invoicesRef, where("projectId", "==", projectId), orderBy("date", "desc"));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const invoicesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt || new Date().toISOString(),
      })) as Invoice[];
      
      setInvoices(invoicesList);
      setLoading(false);
    }, (error) => {
      console.error("Invoices subscription error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [projectId]);

  const addInvoice = useCallback(async (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'invoiceNumber'>) => {
    try {
      const invoicesRef = collection(db, "invoices");
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      
      const docRef = await addDoc(invoicesRef, {
        ...invoiceData,
        invoiceNumber,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      if (user) {
        await logActivity({
          projectId: invoiceData.projectId,
          type: 'financial_update',
          title: 'New Invoice Generated',
          description: `Financial update: A new invoice for ${invoiceData.currency} ${invoiceData.total.toLocaleString()} was generated.`,
          userId: user.uid,
          userName: user.displayName || 'User',
        });
      }

      return { id: docRef.id, invoiceNumber, ...invoiceData };
    } catch (error) {
      console.error("Failed to add invoice:", error);
      throw error;
    }
  }, [user]);

  const updateInvoiceStatus = useCallback(async (id: string, status: InvoiceStatus) => {
    try {
      const invoiceRef = doc(db, "invoices", id);
      await updateDoc(invoiceRef, {
        status,
        updatedAt: serverTimestamp(),
      });

      if (user) {
        // Fetch invoice details for better logging
        await logActivity({
          projectId: projectId || 'global',
          type: 'financial_update',
          title: 'Payment Status Updated',
          description: `An invoice has been marked as ${status}.`,
          userId: user.uid,
          userName: user.displayName || 'User',
          metadata: { invoiceId: id, status }
        });
      }
    } catch (error) {
      console.error("Failed to update invoice status:", error);
    }
  }, [user, projectId]);

  return {
    invoices,
    loading,
    addInvoice,
    updateInvoiceStatus,
  };
}
