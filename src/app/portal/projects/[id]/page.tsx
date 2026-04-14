"use client";

import { usePortal } from "@/hooks/use-portal";
import { 
  Calendar, 
  ChevronLeft, 
  Clock, 
  CheckCircle2, 
  FileText,
  MessageSquare
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function PortalProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { projects, tasks, loading } = usePortal();

  const project = projects.find(p => p.id === id);
  const projectTasks = tasks.filter(t => t.projectId === id);

  if (loading) {
    return (
      <div className="space-y-10 animate-in fade-in duration-150">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid gap-8 md:grid-cols-3">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
        </div>
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-black text-foreground mb-4">Workspace not found or access restricted.</h2>
        <Button onClick={() => router.push("/portal/projects")} variant="outline" className="h-11 rounded-xl px-6">
          Return to Workspaces
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.push("/portal/projects")}
          className="h-10 w-10 text-zinc-400 hover:text-foreground hover:bg-white border border-transparent hover:border-border transition-all rounded-xl"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-foreground tracking-tighter">Workspace Detail</h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{project.name}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-4 bg-white border-border/60 shadow-none rounded-3xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 rounded-full bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.25em]">
                  {project.status}
                </span>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-50 px-3 py-1.5 rounded-full border border-border">
                  Project ID: {project.id.slice(0, 8)}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1]">{project.name}</h2>
              <div className="flex flex-wrap gap-8 pt-6 border-t border-border/50">
                <div className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-zinc-400">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Target: {new Date(project.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-zinc-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{project.progress}% Complete</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-48 w-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-zinc-100"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 80}
                  strokeDashoffset={2 * Math.PI * 80 * (1 - project.progress / 100)}
                  className="text-primary transition-all duration-300 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-foreground tracking-tighter">{project.progress}%</span>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Velocity</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 shadow-none rounded-3xl bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-8 bg-zinc-50/50 border-b border-border/40">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black text-foreground tracking-tighter">Tasks & Deliverables</CardTitle>
              <CardDescription className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Detailed breakdown of current iteration.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {projectTasks.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center bg-white/50">
                  <Clock className="h-10 w-10 text-zinc-200 mb-6" />
                  <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">No tasks indexed for this workspace</p>
                </div>
              ) : (
                projectTasks.map((task) => (
                  <div key={task.id} className="p-6 flex items-center justify-between hover:bg-zinc-50/50 transition-colors group">
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center border transition-all",
                        task.status === 'Completed' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                        task.status === 'In Progress' ? "bg-primary/5 border-primary/20 text-primary uppercase" :
                        "bg-zinc-50 border-zinc-200 text-zinc-400"
                      )}>
                        {task.status === 'Completed' ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="text-[15px] font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{task.title}</h4>
                        <div className="flex items-center gap-4 mt-1.5">
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                            task.priority === 'High' ? "bg-rose-50 text-rose-600" : "bg-zinc-100 text-zinc-500"
                          )}>
                            {task.priority} Priority
                          </span>
                          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    {task.deadline && (
                      <div className="text-right hidden sm:block">
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Target</p>
                        <p className="text-[13px] font-bold text-foreground">{new Date(task.deadline).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60 shadow-none rounded-3xl bg-white overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black text-foreground tracking-tighter uppercase tracking-[0.1em]">Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-between h-14 rounded-2xl border-zinc-100 shadow-none hover:bg-zinc-50 hover:border-zinc-200 transition-all font-bold text-[13px]">
                  Project Brief
                  <FileText className="h-4 w-4 text-zinc-400" />
                </Button>
                <Button variant="outline" className="w-full justify-between h-14 rounded-2xl border-zinc-100 shadow-none hover:bg-zinc-50 hover:border-zinc-200 transition-all font-bold text-[13px]">
                  Brand Assets
                  <FileText className="h-4 w-4 text-zinc-400" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-none rounded-3xl bg-zinc-900 border-zinc-800 text-white overflow-hidden p-8">
            <div className="space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight mb-2">Need a Status Update?</h3>
                <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                  Direct communication with your dedicated account controller for this workspace.
                </p>
              </div>
              <Button className="w-full bg-white text-zinc-900 hover:bg-zinc-100 font-black h-12 rounded-xl text-xs uppercase tracking-widest">
                Initiate Dialogue
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
