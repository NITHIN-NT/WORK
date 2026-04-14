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
import { SystemService } from "./system.service";

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
  stakeholderRole?: string;
  accountManager?: string;
}

export const DirectoryService = {
  /**
   * Subscribe to all clients in the directory
   */
  subscribeToClients(callback: (clients: Client[]) => void) {
    const clientsRef = collection(db, "clients");
    const q = query(clientsRef, orderBy("name", "asc"));

    return onSnapshot(q, (snapshot) => {
      const clients = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          lastContact: data.lastContact?.toDate?.()?.toISOString() || data.lastContact || 'Never',
        };
      }) as Client[];
      callback(clients);
    }, (error) => {
      console.error("[DirectoryService] Clients subscription error:", error);
    });
  },

  /**
   * Create a new client profile
   */
  async createClient(clientData: Omit<Client, 'id' | 'activeProjects' | 'totalLTV' | 'unpaidBalance' | 'lastContact'>, user: Record<string, unknown>) {
    const clientsRef = collection(db, "clients");
    const docRef = await addDoc(clientsRef, {
      ...clientData,
      activeProjects: 0,
      totalLTV: 0,
      unpaidBalance: 0,
      lastContact: serverTimestamp(),
    });

    await SystemService.dispatchActivityLedger({
      projectId: 'global',
      type: 'requirement_updated',
      title: 'Strategic Onboarding',
      description: `${clientData.company} has been registered as an active client partner.`,
      userId: (user.uid as string),
      userName: (user.displayName as string) || 'User',
    });

    return { id: docRef.id, ...clientData };
  },

  /**
   * Remove a client from the directory
   */
  async deleteClient(clientId: string, user: Record<string, unknown>) {
    const clientRef = doc(db, "clients", clientId);
    await deleteDoc(clientRef);
    
    await SystemService.dispatchActivityLedger({
      projectId: 'global',
      type: 'requirement_updated',
      title: 'Directory Update',
      description: 'A client profile has been decommissioned from the active directory.',
      userId: (user.uid as string),
      userName: (user.displayName as string) || 'User',
    });
  },

  /**
   * Update workspace user roles (Admin feature)
   */
  async updateUserRole(userId: string, role: string) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      role,
      updatedAt: serverTimestamp(),
    });
  }
};
