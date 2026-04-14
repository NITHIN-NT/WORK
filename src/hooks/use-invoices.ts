"use client";

import { useState, useCallback, useEffect } from 'react';
import { Invoice, InvoiceStatus } from '@/types/invoice';
import { useAuthStore } from '@/store/user';
import { FinancialService } from '@/services/financial.service';

/**
 * Domain-driven orchestration hook for Financial management and invoice synchronization.
 */
export function useInvoices(projectId?: string) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const unsubscribe = FinancialService.subscribeToInvoices(projectId, (invoicesList) => {
      setInvoices(invoicesList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [projectId]);

  const dispatchInvoice = useCallback(async (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'invoiceNumber'>) => {
    if (!user) throw new Error("Authentication required to dispatch financial records");
    try {
      const newInvoice = await FinancialService.createInvoice(invoiceData, user as unknown as Record<string, unknown>);
      return newInvoice;
    } catch (error) {
      console.error("[useInvoices] dispatchInvoice failure:", error);
      throw error;
    }
  }, [user]);

  const reconcilePaymentStatus = useCallback(async (id: string, status: InvoiceStatus) => {
    if (!user) return;
    try {
      await FinancialService.updateInvoiceStatus(id, status, user as unknown as Record<string, unknown>, projectId);
    } catch (error) {
      console.error("[useInvoices] reconcilePaymentStatus failure:", error);
    }
  }, [user, projectId]);

  return {
    invoices,
    loading,
    addInvoice: dispatchInvoice,
    updateInvoiceStatus: reconcilePaymentStatus,
  };
}

