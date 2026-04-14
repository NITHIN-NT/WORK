"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useAuthStore } from "@/store/user";
import { LayoutDashboard, Folder, Users, Calendar, Settings, FileText, Activity, Users2, LogOut } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {

  const pathname = usePathname();
  const { profile } = useAuthStore();
  const { revokeIdentitySession } = useAuth();
  const isAdmin = profile?.role === 'Administrator';

  // Base navigation for everyone
  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Projects", href: "/projects", icon: Folder },
    { name: "Tasks", href: "/tasks", icon: Activity },
    { name: "Invoices", href: "/invoices", icon: FileText },
    { name: "Calendar", href: "/calendar", icon: Calendar },
  ];

  // Add Team & Miscellaneous links for Admins
  if (isAdmin) {
    navItems.push({ name: "Team", href: "/team", icon: Users2 });
    navItems.push({ name: "Miscellaneous", href: "/team/miscellaneous", icon: Settings });
  }

  // Settings is always at the bottom
  navItems.push({ name: "Settings", href: "/settings", icon: Settings });

  return (

    <>
      {/* Mobile Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-zinc-900/10 backdrop-blur-sm md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 shadow-sm",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col flex-grow pt-8 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-8 mb-10">
            <span className="text-2xl font-black tracking-tight text-foreground uppercase">
              WORK
            </span>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            <div className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = item.href === "/" 
                  ? pathname === "/" 
                  : (item.href === "/team" ? pathname === "/team" : pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center px-4 py-3 text-[11.5px] font-black uppercase tracking-[0.15em] rounded-sm transition-all duration-300 border",
                      isActive
                        ? "bg-primary/5 text-primary border-primary/10 shadow-sm"
                        : "text-zinc-500 border-transparent hover:bg-zinc-50 hover:text-foreground hover:border-zinc-100"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-4 flex-shrink-0 h-4 w-4 transition-colors",
                        isActive ? "text-primary" : "text-zinc-400 group-hover:text-foreground"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
          
          <div className="px-6 py-8 mt-auto border-t border-border group/footer">
            <div className="bg-zinc-50 rounded-sm p-4 border border-border flex items-center justify-between group-hover/footer:bg-white transition-all">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Access Protocol</p>
                <p className="text-xs font-black text-foreground">{profile?.role || 'Personnel'}</p>
              </div>
              <button 
                onClick={() => revokeIdentitySession()}
                className="h-8 w-8 rounded-sm flex items-center justify-center text-zinc-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all outline-none"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
