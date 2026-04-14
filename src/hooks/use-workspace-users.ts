"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  updateDoc, 
  doc, 
  query,
  orderBy,
  deleteDoc,
  addDoc
} from "firebase/firestore";
import { WorkspaceUser, UserRole } from "@/types/user";
import { sendInviteEmailAction } from "@/actions/send-invite";

export function useWorkspaceUsers() {
  const [users, setUsers] = useState<WorkspaceUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("name", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastSeen: doc.data().lastSeen?.toDate?.()?.toLocaleString() || doc.data().lastSeen || 'Never'
      })) as WorkspaceUser[];
      
      setUsers(usersList);
      setLoading(false);
    }, (error) => {
      console.error("Workspace users subscription error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUserRole = useCallback(async (userId: string, role: UserRole) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role });
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  }, []);

  const updateUserStatus = useCallback(async (userId: string, status: string) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { status });
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  }, []);

  const removeUser = useCallback(async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);
    } catch (error) {
      console.error("Failed to remove user:", error);
    }
  }, []);

  const inviteUser = useCallback(async (email: string, role: string) => {
    try {
      const emailResult = await sendInviteEmailAction(email, role);
      if (!emailResult.success) {
        throw new Error("Failed to dispatch email");
      }

      const usersRef = collection(db, "users");
      const newUser = {
        name: email.split('@')[0],
        email: email,
        role: role,
        status: 'Pending',
        lastSeen: new Date(),
      };
      
      // Fire-and-forget to prevent Firestore hanging on offline/dev mode
      addDoc(usersRef, newUser).catch(err => console.error("Firebase write error:", err));
      
    } catch (error) {
      console.error("Failed to invite user:", error);
      throw error; // Rethrow to let UI catch it
    }
  }, []);

  return { users, loading, updateUserRole, updateUserStatus, removeUser, inviteUser };
}
