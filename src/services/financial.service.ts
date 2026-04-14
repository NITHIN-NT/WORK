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
import { Invoice, InvoiceStatus } from "@/types/invoice";
import { SystemService } from "./system.service";

export const FinancialService = {
  /**
   * Subscribe to invoices, filtered by project if provided
   */
  subscribeToInvoices(projectId: string | undefined, callback: (invoices: Invoice[]) => void) {
    const invoicesRef = collection(db, "invoices");
    let q = query(invoicesRef, orderBy("date", "desc"));

    if (projectId) {
      q = query(invoicesRef, where("projectId", "==", projectId), orderBy("date", "desc"));
    }

    return onSnapshot(q, (snapshot) => {
      const invoices = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
        };
      }) as Invoice[];
      callback(invoices);
    }, (error) => {
      console.error("[FinancialService] Subscription error:", error);
    });
  },

  /**
   * Generate a new invoice record
   */
  async createInvoice(invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'invoiceNumber'>, user: Record<string, unknown>) {
    const invoicesRef = collection(db, "invoices");
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    
    const docRef = await addDoc(invoicesRef, {
      ...invoiceData,
      invoiceNumber,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await SystemService.dispatchActivityLedger({
      projectId: invoiceData.projectId || 'global',
      type: 'financial_update',
      title: 'Invoice Dispatched',
      description: `New financial record ${invoiceNumber} created for ${invoiceData.currency} ${invoiceData.total.toLocaleString()}.`,
      userId: (user.uid as string),
      userName: (user.displayName as string) || 'User',
    });

    await SystemService.dispatchNotificationRelay({
      userId: (user.uid as string),
      title: "Financial Instrument Dispatched",
      body: `Billing ledger generated: ${invoiceNumber} for ${invoiceData.currency} ${invoiceData.total.toLocaleString()}.`,
      type: 'info'
    });

    return { id: docRef.id, invoiceNumber, ...invoiceData };
  },

  /**
   * Update the status of a specific invoice
   */
  async updateInvoiceStatus(invoiceId: string, status: InvoiceStatus, user: Record<string, unknown>, projectId?: string) {
    const invoiceRef = doc(db, "invoices", invoiceId);
    await updateDoc(invoiceRef, {
      status,
      updatedAt: serverTimestamp(),
    });

    await SystemService.dispatchActivityLedger({
      projectId: projectId || 'global',
      type: 'financial_update',
      title: 'Payment Reconciliation',
      description: `Invoice marked as ${status}. Settlement confirmed.`,
      userId: (user.uid as string),
      userName: (user.displayName as string) || 'User',
      metadata: { invoiceId, status }
    });

    if (status === 'Paid') {
      await SystemService.dispatchNotificationRelay({
        userId: (user.uid as string),
        title: "Capital Reconciliation",
        body: "Financial settlement confirmed. Ledger successfully balanced.",
        type: 'success'
      });
    }
  }
};
