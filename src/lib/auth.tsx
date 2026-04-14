"use client";

import { useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./firebase";
import { useAuthStore } from "@/store/user";
import { useRouter } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      // Sync auth state with cookie for middleware protection
      if (typeof window !== 'undefined') {
        const secure = window.location.protocol === 'https:' ? 'Secure;' : '';
        if (user) {
          document.cookie = `__session_active=true; path=/; max-age=3600; SameSite=Lax; ${secure}`;
        } else {
          document.cookie = `__session_active=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; ${secure}`;
        }
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
}

export function useAuth() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  const authenticateIdentityGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/"); // Transition to primary dashboard
    } catch (error) {
      console.error("[Auth] Identity handshake failed:", error);
      throw error;
    }
  };

  const revokeIdentitySession = async () => {
    try {
      await firebaseSignOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("[Auth] Session revocation error:", error);
      throw error;
    }
  };

  return {
    user,
    isLoading,
    authenticateIdentityGoogle,
    revokeIdentitySession,
  };
}
