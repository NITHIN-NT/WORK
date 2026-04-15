"use client";

import { } from "@/types/task";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, Filter, Search, Plus, ArrowUpRight, Clock, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTasks } from "@/hooks/use-tasks";
import { useProjects } from "@/hooks/use-projects";
import { Skeleton } from "@/components/ui/skeleton";

export default function Globals() {
  const { tasks, loading: tasksLoading } = useTasks("global");
  const { projects, loading: projectsLoading } = useProjects();
  
  const loading = tasksLoading || projectsLoading;

  const projectMap = projects.reduce((acc, p) => ({ ...acc, [p.id]: p.name }), {} as Record<string, string>);

  const pendings = tasks.filter(t => t.status !== 'Completed').length;
  const criticalItems = tasks.filter(t => t.priority === 'High' || t.priority === 'Urgent').length;
  const archivedCount = tasks.filter(t => t.status === 'Completed').length;

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-12 w-40 rounded-sm" />
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-sm" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-reveal-up pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-black text-white tracking-tighter italic">
            Tasks
            <span className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]">.</span>
          </h1>
          <p className="text-zinc-500 font-bold tracking-tight text-[11px] uppercase tracking-[0.4em]">Integrated Objective Tracking</p>
        </div>
        
        <div className="flex gap-4">
          <Button className="px-12 h-16 rounded-2xl shadow-2xl">
            <Plus className="w-5 h-5 mr-3" />
            Initialize Task
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="glass border-white/5 hover:border-primary/20 transition-all duration-500 overflow-hidden">
          <CardContent className="p-10 flex items-center gap-8">
            <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/5 shadow-2xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-indigo-400 drop-shadow-[0_0_8px_rgba(var(--indigo-400),0.3)]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1.5">Pending</p>
              <p className="text-4xl font-black text-white tabular-nums italic tracking-tighter">{pendings}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/5 hover:border-rose-500/20 transition-all duration-500 overflow-hidden">
          <CardContent className="p-10 flex items-center gap-8">
            <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/5 shadow-2xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-rose-500 drop-shadow-[0_0_8px_rgba(var(--rose-500),0.3)]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1.5">Critical</p>
              <p className="text-4xl font-black text-white tabular-nums italic tracking-tighter">{criticalItems}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/5 hover:border-emerald-500/20 transition-all duration-500 overflow-hidden">
          <CardContent className="p-10 flex items-center gap-8">
            <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/5 shadow-2xl flex items-center justify-center">
              <CheckSquare className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_8px_rgba(var(--emerald-400),0.3)]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1.5">Resolved</p>
              <p className="text-4xl font-black text-white tabular-nums italic tracking-tighter">{archivedCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row gap-6 glass p-8 rounded-[2.5rem] border-white/5">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-white transition-colors" />
            <Input 
              placeholder="Filter active objectives..." 
              className="pl-14 text-white font-black"
            />
          </div>
          <Button variant="ghost" className="text-zinc-500 font-black px-10 h-14 rounded-xl hover:bg-white/5 hover:text-white transition-all">
            <Filter className="w-5 h-5 mr-3" />
            Sync Filters
          </Button>
        </div>

        {tasks.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[2.5rem] bg-white/5">
            <CheckSquare className="h-16 w-16 text-zinc-700 mb-8 animate-pulse" />
            <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em]">Operational Stream Empty</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <Link href={`/projects/${task.projectId}/tasks`} key={task.id} className="block group">
                <div className="flex items-center justify-between p-8 glass border-white/5 hover:border-primary/30 transition-all duration-500 rounded-[2rem] relative overflow-hidden">
                  <div className="flex items-center gap-8">
                    <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500 shadow-xl">
                      <CheckSquare className={cn("w-6 h-6 transition-colors duration-500", 
                        task.status === 'Completed' ? "text-emerald-400 group-hover:text-white" : "text-zinc-500 group-hover:text-white"
                      )} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white group-hover:text-primary transition-colors tracking-tight italic">{task.title}</h4>
                      <div className="flex items-center gap-4 mt-2 font-black text-[10px] uppercase tracking-[0.2em]">
                        <span className="text-primary/80">
                          {projectMap[task.projectId || ""] || "Project"}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors">Deadline: {task.deadline || "TBD"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <div className="text-right hidden md:block">
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-2">Protocol Status</p>
                      <div className="inline-flex px-4 py-1.5 rounded-full bg-white/5 border border-white/5 font-black text-[10px] text-white uppercase tracking-widest shadow-inner">
                        {task.status}
                      </div>
                    </div>
                    <div className="h-14 w-14 rounded-xl bg-white shadow-2xl flex items-center justify-center group-hover:bg-primary transition-all duration-500">
                      <ArrowUpRight className="w-6 h-6 text-zinc-400 group-hover:text-white transition-all duration-500 group-hover:scale-110" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

