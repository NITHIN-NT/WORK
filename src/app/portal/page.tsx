"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FolderKanban, 
  Target,
  FileText,
  ArrowUpRight,
  Briefcase,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePortal } from "@/hooks/use-portal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function PortalDashboard() {
  const { projects, invoices, tasks, loading, clientId } = usePortal();

  const activeProjectsCount = projects.filter(p => p.status === 'In Progress').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'Completed').length;
  const unpaidBalance = invoices.reduce((s, i) => s + (i.status !== 'Paid' ? i.total : 0), 0);
  const completedProjectsCount = projects.filter(p => p.status === 'Completed').length;

  if (loading) {
    return (
      <div className="space-y-10 animate-in fade-in duration-150">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-64 rounded-sm" />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-36 w-full rounded-sm" />)}
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 border-t border-border pt-10">
          <Skeleton className="col-span-4 h-96 rounded-sm" />
          <Skeleton className="col-span-3 h-96 rounded-sm" />
        </div>
      </div>
    );
  }

  if (!clientId) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="h-20 w-20 rounded-sm bg-amber-50 flex items-center justify-center mb-8 border border-amber-100">
          <FileText className="h-10 w-10 text-amber-500" />
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight mb-3">No Entity Association Found</h1>
        <p className="max-w-md text-zinc-500 font-medium leading-relaxed mb-8">
          Your account is not currently associated with an active client entity. Please contact your account manager to activate portal access.
        </p>
        <Button className="bg-zinc-900 text-white font-black px-8 h-12 rounded-sm">
          Contact Support
        </Button>
      </div>
    );
  }

  const statCards = [
    {
      title: "Active Projects",
      value: activeProjectsCount.toString(),
      description: "Ongoing development",
      icon: FolderKanban,
      color: "text-zinc-900",
      bgColor: "bg-zinc-100",
      borderColor: "hover:border-zinc-300"
    },
    {
      title: "Pending Tasks",
      value: pendingTasksCount.toString(),
      description: "Items in pipeline",
      icon: Target,
      color: "text-zinc-700",
      bgColor: "bg-zinc-100",
      borderColor: "hover:border-zinc-300"
    },
    {
      title: "Settlement Dues",
      value: `₹${unpaidBalance.toLocaleString()}`,
      description: "Awaiting reconciliation",
      icon: FileText,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "hover:border-amber-200"
    },
    {
      title: "Milestones Reached",
      value: completedProjectsCount.toString(),
      description: "Successfully delivered",
      icon: Briefcase,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "hover:border-emerald-200"
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      {/* Portal Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="text-5xl font-black text-foreground tracking-tighter">
            Workspace Hub
            <span className="text-primary">.</span>
          </h1>
          <p className="text-zinc-400 font-black text-[10px] uppercase tracking-[0.25em]">
            Transparent monitoring and resource management.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 px-6 rounded-sm font-bold text-xs border-border shadow-none">
            Support Ticket
          </Button>
          <Button className="h-11 px-6 rounded-sm font-black text-xs bg-primary text-white shadow-lg shadow-primary/20">
            Request Change
          </Button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card 
            key={stat.title} 
            className={cn(
              "group bg-white border-border/60 shadow-none transition-all duration-300 hover:border-zinc-300 rounded-sm",
              stat.borderColor
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardDescription className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
                {stat.title}
              </CardDescription>
              <div className={cn("p-2.5 rounded-sm transition-all group-hover:bg-zinc-900 group-hover:text-white", stat.bgColor)}>
                <stat.icon className={cn("w-4 h-4", stat.color, "group-hover:text-white")} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-foreground tracking-tighter mb-2">{stat.value}</div>
              <p className="text-[10px] font-black text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/60 shadow-none rounded-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-8 bg-zinc-50/50 border-b border-border/40 mb-6">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black text-foreground tracking-tighter">Your Projects</CardTitle>
              <CardDescription className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                {projects.length} workspaces synchronized.
              </CardDescription>
            </div>
            <Link href="/portal/projects">
              <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 hover:text-foreground">
                Expanded View
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center border border-dashed border-border rounded-sm bg-zinc-50/30">
                  <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">Project Repository Empty</p>
                </div>
              ) : (
                projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="group p-6 rounded-sm bg-white hover:bg-zinc-50 transition-all border border-border/60 hover:border-primary/20">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-5">
                        <div className="h-12 w-12 rounded-sm bg-zinc-50 flex items-center justify-center border border-border group-hover:bg-white transition-all">
                          <Briefcase className="h-5 w-5 text-zinc-400 group-hover:text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-foreground tracking-tight">{project.name}</h4>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.1em] mt-0.5">Status: {project.status}</p>
                        </div>
                      </div>
                      <Link href={`/portal/projects/${project.id}`}>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-300 hover:text-primary">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    {/* Progress Bar */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-zinc-400 text-xs">Completion</span>
                        <span className="text-primary">{project.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300 ease-out"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/60 shadow-none rounded-sm bg-white h-fit">
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl font-black text-foreground tracking-tighter">Active Tasks</CardTitle>
            <CardDescription className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Items currently in development pipeline.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center border border-dashed border-border rounded-sm">
                  <p className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em]">Zero Queue</p>
                </div>
              ) : (
                tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center gap-4 p-4 rounded-sm bg-zinc-50 border border-transparent hover:border-border/50 transition-all">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      task.status === 'Completed' ? "bg-emerald-500" : 
                      task.status === 'In Progress' ? "bg-primary" : "bg-zinc-300"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{task.title}</p>
                      <p className="text-[9px] text-zinc-400 font-black uppercase tracking-wider">{task.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
