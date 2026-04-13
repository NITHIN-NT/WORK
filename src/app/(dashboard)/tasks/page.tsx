"use client";


import { Task } from "@/types/task";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, Filter, Search, Plus, ArrowUpRight, Clock, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";

const GLOBAL_TASKS: (Task & { project: string })[] = [
  {
    id: '1', projectId: 'p1', project: 'Acme Corp', title: 'Setup Authentication', description: 'Integrate Firebase Auth', status: 'Completed', priority: 'High', assignedTo: 'Sarah', deadline: '2026-04-10', tags: [], createdAt: '', updatedAt: '', createdBy: ''
  },
  {
    id: '2', projectId: 'p2', project: 'Nexus Tech', title: 'Design System', description: 'Create dark mode tokens', status: 'In Progress', priority: 'Medium', assignedTo: 'Alex', deadline: '2026-04-15', tags: [], createdAt: '', updatedAt: '', createdBy: ''
  },
  {
    id: '3', projectId: 'p3', project: 'Startup Inc', title: 'Invoice Logic', description: 'Auto-calculate totals', status: 'Todo', priority: 'Urgent', assignedTo: 'You', deadline: '2026-04-14', tags: [], createdAt: '', updatedAt: '', createdBy: ''
  },
];

const priorityColors = {
  Urgent: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  High: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  Medium: "text-secondary bg-secondary/10 border-secondary/20",
  Low: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
};

export default function GlobalTasks() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-1">Task Center</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Consolidated task management across all active workspace environments.</p>
        </div>
        
        <div className="flex gap-3">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 h-[52px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
            <Plus className="w-4 h-4 mr-2" />
            Quick Task
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card border-border shadow-sm group hover:border-primary/20 transition-all rounded-[2rem] overflow-hidden">
          <CardContent className="p-8 flex items-center gap-6">
            <div className="h-14 w-14 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Pending Today</p>
              <p className="text-3xl font-black text-foreground">12 tasks</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm group hover:border-rose-500/20 transition-all rounded-[2rem] overflow-hidden">
          <CardContent className="p-8 flex items-center gap-6">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">High Priority</p>
              <p className="text-3xl font-black text-foreground">5 items</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm group hover:border-emerald-500/20 transition-all rounded-[2rem] overflow-hidden">
          <CardContent className="p-8 flex items-center gap-6">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Completed Week</p>
              <p className="text-3xl font-black text-foreground">24 tasks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card p-5 rounded-3xl border border-border shadow-sm">
        <div className="relative flex-1 max-w-sm group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search all tasks..." 
            className="pl-11 h-11 bg-zinc-50 border-border rounded-xl text-sm font-bold shadow-xs focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
        <Button variant="outline" className="border-border bg-white text-zinc-600 font-bold px-6 h-11 rounded-xl shadow-sm hover:bg-zinc-50 transition-all">
          <Filter className="w-4 h-4 mr-2" />
          Status Filter
        </Button>
      </div>

      <div className="space-y-4">
        {GLOBAL_TASKS.map((task) => (
          <Link href={`/projects/${task.projectId}/tasks`} key={task.id} className="block">
            <div className="group flex items-center justify-between p-6 bg-card border border-border rounded-2xl hover:bg-zinc-50 hover:border-primary/20 transition-all shadow-sm">
              <div className="flex items-center gap-6">
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center border-2 shadow-sm transition-transform group-hover:scale-105",
                  priorityColors[task.priority as keyof typeof priorityColors]
                )}>
                  <CheckSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-foreground group-hover:text-primary transition-colors tracking-tight">{task.title}</h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-black text-primary/70 uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">{task.project}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target: {task.deadline}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Status</p>
                  <p className="text-xs font-black text-foreground">{task.status}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
