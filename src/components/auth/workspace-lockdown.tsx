"use client";

import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ShieldAlert, LogOut, Lock, ExternalLink, HardDrive } from "lucide-react";
import { useAuthStore } from "@/store/user";

export function WorkspaceLockdown() {
  const { revokeIdentitySession } = useAuth();
  const { profile } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-4xl mx-auto">
      <div className="w-full bg-white border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-md overflow-hidden">
        {/* Minimalist Locked Header */}
        <div className="bg-zinc-50/50 px-10 py-6 flex items-center justify-between border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-sm bg-zinc-950 flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Security State</p>
              <h2 className="text-sm font-bold text-zinc-900 leading-none">Access Restricted</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-lg">
             <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
             <span className="text-[8px] font-black uppercase tracking-widest text-red-600">Locked</span>
          </div>
        </div>

        {/* Content Section - More integrated feel */}
        <div className="p-10 md:p-14 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-3">
               <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Identity: {profile?.email}</p>
               <h3 className="text-4xl font-black tracking-tight text-zinc-950 leading-[1.05]">
                 Workspace connection <br/>terminated.
               </h3>
               <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                 You are currently operating in a restricted terminal mode. Administrative privileges have been revoked for this session.
               </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button 
                onClick={revokeIdentitySession}
                className="px-8 h-12 bg-zinc-950 text-white rounded-sm font-black text-[10px] uppercase tracking-[0.15em] hover:bg-zinc-800 transition-all flex items-center gap-3"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
              <Button 
                variant="outline" 
                className="px-6 h-12 text-zinc-500 border-zinc-200 hover:text-zinc-950 font-black text-[10px] uppercase tracking-[0.15em] rounded-sm flex items-center gap-2"
              >
                Relay Support
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-zinc-50 rounded-sm border border-border/60">
               <div className="flex items-center gap-2 mb-4">
                 <ShieldAlert className="w-4 h-4 text-zinc-950" />
                 <p className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Protocol Message</p>
               </div>
               <p className="text-xs font-semibold text-zinc-600 leading-relaxed italic">
                 &quot;Automatic lockdown triggered due to status change. Please contact your workspace administrator to restore project access.&quot;
               </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-border rounded-sm">
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Session ID</p>
                <p className="text-[10px] font-mono font-bold text-zinc-900">{profile?.uid?.slice(0, 12)}</p>
              </div>
              <div className="p-4 bg-white border border-border rounded-sm">
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Network Role</p>
                <p className="text-[10px] font-bold text-zinc-900 italic">Revoked</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Meta */}
        <div className="bg-zinc-50/30 px-10 py-5 border-t border-border/40 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <HardDrive className="w-3 h-3 text-zinc-300" />
             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-300">Terminal: WORK-OS-v0.1</p>
           </div>
           <p className="text-[8px] font-medium text-zinc-400 uppercase tracking-widest">Verified: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
