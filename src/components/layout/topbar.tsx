import { Menu } from "lucide-react";
import { GlobalSearch } from "@/features/system/components/search/global-search";
import { NotificationPanel } from "@/features/system/components/notifications/notification-panel";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {

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
          <div className="hidden lg:flex items-center gap-4 min-w-0">
            <Breadcrumbs />
            <div className="h-4 w-[1px] bg-border mx-2" />
          </div>
          <div className="flex-1 max-w-sm min-w-0">
            <GlobalSearch />
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <NotificationPanel />
          
        </div>
      </div>
    </header>
  );
}

