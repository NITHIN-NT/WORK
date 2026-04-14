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
  orderBy
} from "firebase/firestore";
import { ProjectDocument } from "@/types/document";
import { SystemService } from "./system.service";

export const DocumentService = {
  /**
   * Subscribe to documents for a specific project
   */
  subscribeToDocuments(projectId: string, callback: (docs: ProjectDocument[]) => void) {
    const docsRef = collection(db, "projects", projectId, "documents");
    const q = query(docsRef, orderBy("updatedAt", "desc"));

    return onSnapshot(q, (snapshot) => {
      const documents = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          projectId,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
        };
      }) as ProjectDocument[];
      callback(documents);
    }, (error) => {
      console.error(`[DocumentService] Subscription error for ${projectId}:`, error);
    });
  },

  /**
   * Initialize a new document within a project workspace
   */
  async createDocument(projectId: string, docData: Omit<ProjectDocument, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'projectId'>, user: Record<string, unknown>) {
    const docsRef = collection(db, "projects", projectId, "documents");
    const docRef = await addDoc(docsRef, {
      ...docData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: user?.displayName || 'System',
    });

    await SystemService.dispatchActivityLedger({
      projectId,
      type: 'document_created',
      title: 'Document Initialized',
      description: `New protocol record "${docData.title}" was drafted in the workspace.`,
      userId: (user.uid as string),
      userName: (user.displayName as string) || 'User',
      metadata: { documentId: docRef.id }
    });

    return { id: docRef.id, ...docData, projectId };
  },

  /**
   * Update an existing document record
   */
  async synchronizeDocument(projectId: string, documentId: string, updates: Partial<ProjectDocument>) {
    const docRef = doc(db, "projects", projectId, "documents", documentId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Purge a document record from the ledger
   */
  async purgeDocument(projectId: string, documentId: string) {
    const docRef = doc(db, "projects", projectId, "documents", documentId);
    await deleteDoc(docRef);
  }
};
