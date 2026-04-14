import { useAuth } from "@/lib/auth";
import { LogOut, Menu } from "lucide-react";
import Image from "next/image";
import { GlobalSearch } from "@/features/system/components/search/global-search";
import { NotificationPanel } from "@/features/system/components/notifications/notification-panel";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
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
          <div className="flex-1 max-w-sm min-w-0">
            <GlobalSearch />
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <NotificationPanel />
          
          <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-border/50 ml-1 sm:ml-2">
            <div className="text-right hidden sm:block leading-tight pr-2">
              <p className="text-[12.5px] font-black text-foreground leading-none">{user?.displayName || "Project Manager"}</p>
              <p className="text-[10.5px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Administrator</p>
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
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs sm:text-sm font-black ring-1 ring-primary/20">
                {user?.email?.charAt(0).toUpperCase() || "P"}
              </div>
            )}
 
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={revokeIdentitySession}
              className="text-zinc-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all h-9 w-9 rounded-xl"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

