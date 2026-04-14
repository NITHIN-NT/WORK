"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  CheckSquare, 
  FileText, 
  Calendar as CalendarIcon, 
  FolderOpen, 
  Receipt, 
  Mail, 
  Activity 
} from "lucide-react";
import { useParams } from "next/navigation";

const projectNav = [
  { name: "Overview", icon: BarChart, path: "" },
  { name: "Tasks", icon: CheckSquare, path: "/tasks" },
  { name: "Notes", icon: FileText, path: "/notes" },
  { name: "Calendar", icon: CalendarIcon, path: "/calendar" },
  { name: "Documents", icon: FolderOpen, path: "/documents" },
  { name: "Invoices", icon: Receipt, path: "/invoices" },
  { name: "Emails", icon: Mail, path: "/emails" },
  { name: "Activity", icon: Activity, path: "/activity" },
];

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const projectId = params.id as string;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="border-b border-border pb-2 overflow-x-auto no-scrollbar bg-card/30 backdrop-blur-sm sticky top-0 z-10 -mx-6 px-6">
        <nav className="flex space-x-1 min-w-max">
          {projectNav.map((item) => {
            const href = `/projects/${projectId}${item.path}`;
            const isActive = item.path === "" 
              ? pathname === href
              : pathname.startsWith(href);

            return (
              <Link
                key={item.name}
                href={href}
                className={cn(
                  "group flex items-center px-5 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-primary/5 text-primary shadow-sm border border-primary/10"
                    : "text-zinc-400 hover:bg-zinc-50 hover:text-foreground border border-transparent"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-2.5 h-4 w-4 transition-colors",
                    isActive ? "text-primary" : "text-zinc-400 group-hover:text-foreground"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="px-1">{children}</div>
    </div>
  );
}
