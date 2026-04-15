"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useAuthStore } from "@/store/user";
import { Users2, LayoutDashboard, Calendar, Settings, Activity, LogOut, Folder, FileText } from "lucide-react";

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
    { name: "Clients", href: "/clients", icon: Users2 },
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
          "fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-md md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className={cn(
        "fixed inset-y-4 left-4 z-50 w-64 glass rounded-[2rem] flex flex-col transition-transform duration-500 ease-out md:translate-x-0 shadow-2xl border-white/5",
        isOpen ? "translate-x-0" : "-translate-x-[120%]"
      )}>
        <div className="flex flex-col flex-grow pt-10 pb-6 overflow-y-auto overflow-x-hidden">
          <div className="flex items-center flex-shrink-0 px-10 mb-12">
            <span className="text-3xl font-black tracking-tighter text-white uppercase italic">
              WORK
            </span>
            <div className="ml-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <p className="px-6 mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Navigation Registry</p>
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
                      "group flex items-center px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 border mb-1",
                      isActive
                        ? "bg-primary/20 text-white border-primary/30 shadow-[0_0_20px_rgba(var(--primary),0.2)]"
                        : "text-zinc-400 border-transparent hover:bg-white/5 hover:text-white hover:border-white/5"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-4 flex-shrink-0 h-4 w-4 transition-all duration-300 group-hover:scale-110",
                        isActive ? "text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]" : "text-zinc-500 group-hover:text-white"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
          
          <div className="px-4 py-6 mt-auto">
            <div className="glass bg-white/5 rounded-[1.5rem] p-5 border-white/5 flex items-center justify-between group/footer hover:bg-white/10 transition-all duration-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg">
                  {profile?.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">Role</p>
                  <p className="text-[11px] font-black text-white tracking-tight leading-none">{profile?.role || 'Personnel'}</p>
                </div>
              </div>
              <button 
                onClick={() => revokeIdentitySession()}
                className="h-10 w-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-rose-400 hover:bg-rose-400/10 transition-all duration-300"
                title="Deauthorize Session"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
