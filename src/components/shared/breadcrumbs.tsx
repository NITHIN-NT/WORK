"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const routeMap: Record<string, string> = {
  dashboard: "Dashboard",
  team: "Team",
  projects: "Projects",
  settings: "Settings",
  notifications: "Notifications",
  security: "Security",
  portal: "Client Portal",
  tasks: "Tasks",
  documents: "Documents",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  
  if (!pathname || pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-2 overflow-hidden">
      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const label = routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <div key={path} className="flex items-center gap-2 min-w-0">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-zinc-300 shrink-0" />
            )}
            {isLast ? (
              <span className="text-[11px] font-black text-foreground uppercase tracking-wider truncate">
                {label}
              </span>
            ) : (
              <Link
                href={path}
                className="text-[11px] font-bold text-zinc-400 hover:text-foreground uppercase tracking-widest transition-colors truncate"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
