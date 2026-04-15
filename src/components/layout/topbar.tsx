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
      className="fixed top-2 right-4 left-4 md:left-72 z-40 glass rounded-2xl h-16 transition-all duration-500 shadow-lg border-white/5"
    >
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex-1 flex items-center pr-4 gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMenuClick}
            className="md:hidden text-zinc-400 hover:text-white hover:bg-white/5 h-10 w-10 rounded-xl"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden lg:flex items-center gap-6 min-w-0">
            <Breadcrumbs />
          </div>
          <div className="flex-1 max-w-sm min-w-0 ml-4">
            <GlobalSearch />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="h-8 w-[1px] bg-white/5 mx-2 hidden sm:block" />
          <NotificationPanel />
        </div>
      </div>
    </header>
  );
}

