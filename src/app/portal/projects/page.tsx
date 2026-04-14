"use client";

import { usePortal } from "@/hooks/use-portal";
import { 
  Briefcase, 
  Calendar, 
  LayoutGrid, 
  List, 
  Search,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import { Card, } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PortalProjectsPage() {
  const { projects, loading } = usePortal();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-10 animate-in fade-in duration-150">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="flex gap-4">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 w-32 rounded-xl" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-black text-foreground tracking-tighter">My Workspaces</h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Active and archived project repositories.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-border/60 shadow-sm">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setView('grid')}
            className={cn("h-9 w-9 p-0 rounded-lg transition-all", view === 'grid' ? "bg-zinc-900 text-white shadow-lg" : "text-zinc-400 hover:text-foreground")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setView('list')}
            className={cn("h-9 w-9 p-0 rounded-lg transition-all", view === 'list' ? "bg-zinc-900 text-white shadow-lg" : "text-zinc-400 hover:text-foreground")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-border/60">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search within workspaces..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-12 bg-zinc-50 border-none rounded-xl text-sm font-bold shadow-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center border border-dashed border-border rounded-[2.5rem] bg-zinc-50/50">
          <Briefcase className="h-12 w-12 text-zinc-200 mb-6" />
          <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Repository Index Empty</p>
        </div>
      ) : (
        <div className={cn(
          "grid gap-6",
          view === 'grid' ? "md:grid-cols-2" : "grid-cols-1"
        )}>
          {filteredProjects.map((project) => (
            <Card 
              key={project.id}
              className="group bg-white border-border/60 hover:border-primary/20 transition-all rounded-3xl overflow-hidden shadow-none"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-50 flex items-center justify-center border border-border group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                      <Briefcase className="h-7 w-7 text-zinc-300 group-hover:text-primary transition-all" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{project.name}</h3>
                        <span className="px-3 py-1 rounded-full bg-zinc-900 text-white text-[9px] font-black uppercase tracking-[0.2em]">
                          {project.status}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        Due {new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <Link href={`/portal/projects/${project.id}`}>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-300 group-hover:text-primary">
                      <ExternalLink className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-zinc-500">Project Velocity</span>
                    <span className="text-primary font-black">{project.progress}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-8">
                  <div>
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.15em] mb-1">Items Tracked</p>
                    <p className="text-sm font-black text-foreground">{project.tasksCount} Active Tasks</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.15em] mb-1">Last Update</p>
                    <p className="text-sm font-black text-zinc-500">Recently Sync&apos;d</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
