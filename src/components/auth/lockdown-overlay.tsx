"use client";

import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ShieldAlert, LogOut, Lock, ExternalLink } from "lucide-react";
import { useAuthStore } from "@/store/user";

export function LockdownOverlay() {
  const { revokeIdentitySession } = useAuth();
  const { profile } = useAuthStore();

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-8 overflow-hidden backdrop-blur-md bg-white/40">
      <div className="w-full max-w-xl bg-white border border-rose-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-sm overflow-hidden">
        {/* Security Header */}
        <div className="bg-rose-50 px-12 py-8 flex items-center justify-between border-b border-rose-100">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-sm bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-200">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Security Protocol</p>
              <h2 className="text-xl font-bold text-zinc-950">Access Revoked</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 rounded-sm">
             <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
             <span className="text-[9px] font-black uppercase tracking-widest text-rose-600 italic">Locked</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-12 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <Lock className="w-4 h-4 text-zinc-400" />
               <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest leading-none pt-1">Identification: {profile?.email}</p>
            </div>
            <h3 className="text-3xl font-black tracking-tight text-zinc-950 leading-[1.1]">
              Your workspace access has been decommissioned.
            </h3>
            <p className="text-sm font-medium text-zinc-500 leading-relaxed max-w-sm">
              The administrator has revoked your terminal permissions. All active sessions have been frozen for security audit.
            </p>
          </div>

          <div className="p-6 bg-zinc-50 rounded-sm border border-zinc-100 space-y-3">
             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Reason for Restriction</p>
             <p className="text-xs font-semibold text-zinc-700 leading-relaxed italic">
               &quot;Security compliance review required. Re-verification of identity protocol is pending administrative approval.&quot;
             </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-4 pt-4">
            <Button 
              onClick={revokeIdentitySession}
              className="px-8 h-12 bg-zinc-950 text-white rounded-sm font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all group flex items-center gap-3"
            >
              <LogOut className="w-4 h-4" />
              Revoke Session
            </Button>
            <Button 
              variant="ghost" 
              className="px-6 h-12 text-zinc-400 hover:text-zinc-950 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2"
            >
              Contact Support
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* System Meta */}
        <div className="bg-zinc-50/50 px-12 py-6 border-t border-zinc-100 flex items-center justify-between">
           <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-300">AuthRef: {profile?.uid?.slice(0, 8)}</p>
           <p className="text-[8px] font-medium text-zinc-400">Timestamp: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}
