"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { useAuthStore } from "@/store/user";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowRight, Loader2, Link2, Clock, ShieldCheck } from "lucide-react";

export function AccessRequested() {
  const { revokeIdentitySession, user } = useAuth();
  const { setUser, profile, isLoading } = useAuthStore();
  const [isBootstrapping, setIsBootstrapping] = useState(false);

  const attemptBootstrap = useCallback(async () => {
    if (!user || isBootstrapping) return;
    setIsBootstrapping(true);
    
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/auth/bootstrap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      
      if (response.ok && data.success && data.profile) {
        // Update store with newly created profile to trigger immediate transition
        setUser(user, data.profile);
      }
    } catch (error) {
      console.error("[AccessRequested] Bootstrapping attempt failed:", error);
    } finally {
      setIsBootstrapping(false);
    }
  }, [user, isBootstrapping, setUser]);

  useEffect(() => {
    const isAdmin = user?.email === 'nithinnt07@gmail.com' || user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const isProfilePending = !profile || profile.status === 'Pending';

    if (!isLoading && isAdmin && isProfilePending && !isBootstrapping) {
      attemptBootstrap();
    }
  }, [user, profile, isLoading, attemptBootstrap, isBootstrapping]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-4xl mx-auto py-12">
      <div className="w-full bg-white border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-md overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-zinc-50/50 px-10 py-6 flex items-center justify-between border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-sm bg-primary flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Identity Audit</p>
              <h2 className="text-sm font-bold text-zinc-900 leading-none">Authentication Pending</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
             <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
             <span className="text-[8px] font-black uppercase tracking-widest text-primary italic">Syncing</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-10 md:p-14 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-3">
               <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Identity: {user?.email}</p>
               <h3 className="text-4xl font-black tracking-tight text-zinc-950 leading-[1.05]">
                 Registration <br/>in progress.
               </h3>
               <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                 Your authentication is verified, but your workspace profile is currently awaiting final synchronization for security compliance.
               </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button 
                disabled={isBootstrapping}
                onClick={attemptBootstrap}
                className="px-8 h-12 bg-zinc-950 text-white rounded-sm font-black text-[10px] uppercase tracking-[0.15em] hover:bg-zinc-800 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                {isBootstrapping ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {isBootstrapping ? "Checking..." : "Re-Verify"}
              </Button>
              <Button 
                variant="outline" 
                onClick={revokeIdentitySession}
                className="px-6 h-12 text-zinc-500 border-zinc-200 hover:text-zinc-950 font-black text-[10px] uppercase tracking-[0.15em] rounded-sm flex items-center gap-2"
              >
                Sign Out
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-primary/5 rounded-sm border border-primary/10">
               <div className="flex items-center gap-2 mb-4">
                 <Clock className="w-4 h-4 text-primary" />
                 <p className="text-[10px] font-black text-primary uppercase tracking-widest">Onboarding Status</p>
               </div>
               <p className="text-xs font-semibold text-zinc-600 leading-relaxed italic">
                 {isBootstrapping 
                   ? "Negotiating initial handshake with the workspace treasury. This may take up to 2.0 seconds..." 
                   : "Waiting for identity propagation. Administrative users will be auto-synced upon detection."}
               </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-border rounded-sm">
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Gatekeeper</p>
                <p className="text-[10px] font-bold text-zinc-900 truncate">Supabase/Auth</p>
              </div>
              <div className="p-4 bg-white border border-border rounded-sm">
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">State</p>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  <p className="text-[10px] font-bold text-zinc-900 italic">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Meta */}
        <div className="bg-zinc-50/30 px-10 py-5 border-t border-border/40 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Link2 className="w-3 h-3 text-zinc-300" />
             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-300">Channel: AUTH_SILENT_HANDSHAKE</p>
           </div>
           <p className="text-[8px] font-medium text-zinc-400 uppercase tracking-widest">Verified: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
