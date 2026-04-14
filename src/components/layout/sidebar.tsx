"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Folder, Users, Calendar, Settings, FileText, Activity } from "lucide-react";

const mainNav = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Tasks", href: "/tasks", icon: Activity },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

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
              {mainNav.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center px-4 py-3 text-[11.5px] font-black uppercase tracking-[0.15em] rounded-2xl transition-all duration-300 border",
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
          
          <div className="px-6 py-8 mt-auto border-t border-border">
            <div className="bg-zinc-50 rounded-2xl p-4 border border-border">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Current Plan</p>
              <p className="text-xs font-black text-foreground">Professional Plan 0.1</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
