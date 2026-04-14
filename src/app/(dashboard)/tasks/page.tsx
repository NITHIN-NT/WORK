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
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Tasks</h1>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Manage and track your tasks across all projects.</p>
        </div>
        
        <div className="flex gap-4">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-10 h-14 rounded-sm shadow-none">
            <Plus className="w-5 h-5 mr-3" />
            New </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="bg-white border-border/60 shadow-none hover:border-primary/20 transition-all rounded-sm overflow-hidden">
          <CardContent className="p-8 flex items-center gap-6">
            <div className="h-14 w-14 rounded-sm bg-zinc-50 border border-border flex items-center justify-center">
              <Clock className="w-6 h-6 text-zinc-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Pending</p>
              <p className="text-3xl font-bold text-foreground tabular-nums">{pendings}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-border/60 shadow-none hover:border-primary/20 transition-all rounded-sm overflow-hidden">
          <CardContent className="p-8 flex items-center gap-6">
            <div className="h-14 w-14 rounded-sm bg-zinc-50 border border-border flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Critical</p>
              <p className="text-3xl font-bold text-foreground tabular-nums">{criticalItems}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-border/60 shadow-none hover:border-primary/20 transition-all rounded-sm overflow-hidden">
          <CardContent className="p-8 flex items-center gap-6">
            <div className="h-14 w-14 rounded-sm bg-zinc-50 border border-border flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Completed</p>
              <p className="text-3xl font-bold text-foreground tabular-nums">{archivedCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-sm border border-border/60">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-12 h-12 bg-zinc-50/50 border-border rounded-sm text-sm font-bold shadow-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>
          <Button variant="outline" className="border-border bg-white text-zinc-500 font-bold px-8 h-12 rounded-sm hover:bg-zinc-50 shadow-none">
            <Filter className="w-4 h-4 mr-3" />
            Filter
          </Button>
        </div>

        {tasks.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center border border-dashed border-border rounded-sm bg-white/50">
            <CheckSquare className="h-12 w-12 text-zinc-200 mb-6" />
            <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">No tasks found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Link href={`/projects/${task.projectId}/tasks`} key={task.id} className="block group">
                <div className="flex items-center justify-between p-6 bg-white border border-border/60 rounded-sm hover:border-primary/30 transition-all shadow-none">
                  <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-sm bg-zinc-50 border border-border flex items-center justify-center group-hover:bg-white transition-colors">
                      <CheckSquare className={cn("w-5 h-5", task.status === 'Completed' ? "text-emerald-500" : "text-zinc-400")} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{task.title}</h4>
                      <div className="flex items-center gap-3 mt-1.5 font-black text-[9px] uppercase tracking-widest">
                        <span className="text-primary/70">
                          {projectMap[task.projectId || ""] || "Project"}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-zinc-200" />
                        <span className="text-zinc-400">Due: {task.deadline || "None"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-right hidden md:block">
                      <p className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em] leading-none mb-1.5 text-right">Status</p>
                      <p className="text-[11px] font-black text-foreground uppercase tracking-wider">{task.status}</p>
                    </div>
                    <div className="h-10 w-10 rounded-sm bg-zinc-50 border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                      <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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

