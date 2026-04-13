"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  updateDoc, 
  doc, 
  query,
  orderBy
} from "firebase/firestore";
import { WorkspaceUser, UserRole } from "@/types/user";

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

  return { users, loading, updateUserRole, updateUserStatus };
}
