"use client";

import { useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./firebase";
import { useAuthStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          
          // Exchange Firebase token for Supabase JWT
          const sessionResponse = await fetch('/api/auth/session', {
            method: 'POST',
            body: JSON.stringify({
              idToken,
              uid: user.uid,
              email: user.email
            })
          });

          if (sessionResponse.ok) {
            const { token } = await sessionResponse.json();
            // Authenticate Supabase client
            await supabase.auth.setSession({
              access_token: token,
              refresh_token: token // We don't have a double-token setup yet, so reuse
            });
            console.log("[Auth] Supabase session synchronized via JWT Exchange");
          }

          // Fetch user profile from Supabase with the now-authenticated session
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.uid)
            .single();
          
          if (!error && profile) {
            setUser(user, profile);
          } else {
            console.log("[Auth] Profile not found in Supabase:", user.email);
            setUser(user, null);
          }
        } catch (error) {
          console.error("[Auth] Session sync error:", error);
          setUser(user, null);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null, null);
        // Clear Supabase session on logout
        await supabase.auth.signOut();
        setLoading(false);
      }
      
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
