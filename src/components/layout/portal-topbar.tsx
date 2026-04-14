"use client";

import { useAuth } from "@/lib/auth";
import { LogOut, Menu, } from "lucide-react";
import Image from "next/image";
import { NotificationPanel } from "@/features/system/components/notifications/notification-panel";
import { Button } from "@/components/ui/button";

interface PortalTopbarProps {
  onMenuClick: () => void;
}

export function PortalTopbar({ onMenuClick }: PortalTopbarProps) {
  const { user, revokeIdentitySession } = useAuth();

  return (
    <header 
      className="fixed top-0 right-0 left-0 md:left-64 z-40 bg-background/80 backdrop-blur-xl border-b border-border h-16 transition-all"
      style={{ WebkitBackdropFilter: 'blur(20px)' }}
    >
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        <div className="flex-1 flex items-center pr-4 gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMenuClick}
            className="md:hidden text-zinc-500 hover:text-foreground hover:bg-zinc-100 h-9 w-9"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
              Verified Access
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <NotificationPanel />
          
          <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-border/50 ml-1 sm:ml-2">
            <div className="text-right hidden sm:block leading-tight pr-2">
              <p className="text-[12.5px] font-black text-foreground leading-none">{user?.displayName || "Stakeholder"}</p>
              <p className="text-[10.5px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Client Partner</p>
            </div>
            
            {user?.photoURL ? (
              <Image 
                src={user.photoURL} 
                alt="Avatar" 
                width={36} 
                height={36} 
                priority
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-1 ring-border" 
              />
            ) : (
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs sm:text-sm font-black ring-1 ring-emerald-500/20">
                {user?.email?.charAt(0).toUpperCase() || "C"}
              </div>
            )}
 
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={revokeIdentitySession}
              className="text-zinc-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all h-9 w-9 rounded-xl ml-2"
              title="End Session"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
