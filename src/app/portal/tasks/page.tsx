"use client";

import { usePortal } from "@/hooks/use-portal";
import { 
  Activity, 
  Search, 
  Clock, 
  CheckCircle2, 
  Briefcase
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TaskStatus } from "@/types/task";

export default function PortalTasksPage() {
  const { tasks, projects, loading } = usePortal();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All');

  const filteredTasks = tasks.filter(t => {
    const matchesQuery = t.title.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.name || "Unknown Project";
  };

  if (loading) {
    return (
      <div className="space-y-10 animate-in fade-in duration-150">
        <Skeleton className="h-12 w-64 rounded-sm" />
        <div className="flex gap-4">
          <Skeleton className="h-12 flex-1 rounded-sm" />
          <Skeleton className="h-12 w-32 rounded-sm" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-20 w-full rounded-sm" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-black text-foreground tracking-tighter">Task Tracker</h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Aggregated activity stream across all workspaces.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-sm border border-border/60">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Filter by task title..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-12 bg-zinc-50 border-none rounded-sm text-sm font-bold shadow-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {(['All', 'Todo', 'In Progress', 'Review', 'Completed'] as const).map((status) => (
            <Button
              key={status}
              variant="ghost"
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={cn(
                "h-10 px-4 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all",
                statusFilter === status 
                  ? "bg-zinc-900 text-white shadow-lg" 
                  : "text-zinc-400 hover:text-foreground hover:bg-zinc-100"
              )}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <Card className="border-border/60 shadow-none rounded-md bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
            {filteredTasks.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center bg-zinc-50/20">
                <Activity className="h-12 w-12 text-zinc-200 mb-6" />
                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Zero Activity Matched</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-zinc-50/50 transition-all group">
                  <div className="flex items-start gap-6">
                    <div className={cn(
                      "h-14 w-14 rounded-sm flex items-center justify-center border transition-all flex-shrink-0 shadow-sm",
                      task.status === 'Completed' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                      task.status === 'In Progress' ? "bg-primary/5 border-primary/20 text-primary" :
                      "bg-zinc-50 border-zinc-200 text-zinc-300 group-hover:bg-white group-hover:text-zinc-600"
                    )}>
                      {task.status === 'Completed' ? <CheckCircle2 className="h-7 w-7" /> : <Clock className="h-7 w-7" />}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-foreground tracking-tight group-hover:text-primary transition-colors mb-2">{task.title}</h4>
                      <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-3.5 w-3.5 text-zinc-400" />
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{getProjectName(task.projectId)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em]",
                            task.priority === 'High' || task.priority === 'Urgent' ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-zinc-100 text-zinc-500 border border-border"
                          )}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border",
                            task.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            task.status === 'In Progress' ? "bg-primary text-white border-primary" :
                            "bg-white text-zinc-400 border-border"
                          )}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t sm:border-t-0 border-border/40 pt-6 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Target Delivery</p>
                      <p className="text-sm font-black text-foreground tabular-nums">
                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Unscheduled'}
                      </p>
                    </div>
                    {task.status !== 'Completed' && (
                      <Button variant="outline" size="sm" className="h-9 px-4 rounded-sm border-zinc-100 shadow-none text-[9px] font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all">
                        Request Pulse
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
