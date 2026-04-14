import { db } from "@/lib/firebase";
import { doc, updateDoc, collection, query, getDocs } from "firebase/firestore";

export interface UserProfileUpdate {
  name?: string;
  photoURL?: string;
}

export const UserService = {
  synchronizeProfileIdentity: async (userId: string, data: UserProfileUpdate) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data as unknown as Record<string, unknown>);
  },

  fetchCoreTeamRegistry: async () => {
    // Logic to fetch team members for a specific workspace
    const usersRef = collection(db, "users");
    // This is a placeholder since we don't have a formal workspace_users junction in this prototype yet
    // In a real app, we'd query by workspaceId
    const q = query(usersRef);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
