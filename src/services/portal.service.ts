import { db } from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";
import { Project } from "@/types/project";
import { Invoice } from "@/types/invoice";
import { Task } from "@/types/task";

export const PortalService = {
  /**
   * Subscribe to projects belonging to a specific client
   */
  subscribeToClientProjects(clientId: string, callback: (projects: Project[]) => void) {
    const projectsRef = collection(db, "projects");
    const q = query(
      projectsRef, 
      where("clientId", "==", clientId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
        } as Project;
      });
      callback(projects);
    }, (error) => {
      console.error("[PortalService] Projects subscription error:", error);
    });
  },

  /**
   * Subscribe to invoices for a specific client
   */
  subscribeToClientInvoices(clientId: string, callback: (invoices: Invoice[]) => void) {
    const invoicesRef = collection(db, "invoices");
    const q = query(
      invoicesRef, 
      where("clientId", "==", clientId),
      orderBy("date", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const invoices = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
        } as Invoice;
      });
      callback(invoices);
    }, (error) => {
      console.error("[PortalService] Invoices subscription error:", error);
    });
  },

  /**
   * Subscribe to all tasks for a list of projects
   */
  subscribeToClientTasks(projectIds: string[], callback: (tasks: Task[]) => void) {
    if (projectIds.length === 0) {
      callback([]);
      return () => {};
    }

    const tasksRef = collection(db, "tasks");
    // Note: Firestore 'in' operator is limited to 10-30 items depending on configuration.
    // For a client portal, they likely won't have more than 10-30 active projects.
    const q = query(
      tasksRef, 
      where("projectId", "in", projectIds),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
        } as Task;
      });
      callback(tasks);
    }, (error) => {
      // If 'in' query fails due to too many IDs, we'd need to chunk the requests.
      console.error("[PortalService] Tasks subscription error:", error);
    });
  }
};
