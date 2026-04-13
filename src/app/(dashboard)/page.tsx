"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FolderKanban, 
  Activity, 
  Target,
  FileText,
  ArrowUpRight,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/use-projects";
import { useInvoices } from "@/hooks/use-invoices";
import { useTasks } from "@/hooks/use-tasks";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { useGlobalActivity } from "@/hooks/use-global-activity";
import { ActivityTimeline } from "@/components/activity/activity-timeline";

export default function DashboardPage() {
  const { projects, loading: projectsLoading } = useProjects();
  const { invoices, loading: invoicesLoading } = useInvoices();
  const { tasks, loading: tasksLoading } = useTasks("global");
  const { activities, loading: activityLoading } = useGlobalActivity();

  const totalRevenue = invoices.reduce((s, i) => s + (i.status === 'Paid' ? i.total : 0), 0);
  const activeProjectsCount = projects.filter(p => p.status === 'In Progress').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'Completed').length;
  const unpaidBalance = invoices.reduce((s, i) => s + (i.status !== 'Paid' ? i.total : 0), 0);

  const isLoading = projectsLoading || invoicesLoading || tasksLoading || activityLoading;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-96 rounded-2xl" />
          <Skeleton className="col-span-3 h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Active Projects",
      value: activeProjectsCount.toString(),
      description: "Across your portfolio",
      icon: FolderKanban,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "group-hover:border-primary/30"
    },
    {
      title: "Pending Tasks",
      value: pendingTasksCount.toString(),
      description: "Needs attention",
      icon: Target,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "group-hover:border-secondary/30"
    },
    {
      title: "Unpaid Balance",
      value: `₹${unpaidBalance.toLocaleString()}`,
      description: "Across all invoices",
      icon: FileText,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "group-hover:border-amber-500/30"
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      description: "+12.5% this month",
      icon: Activity,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "group-hover:border-emerald-500/30"
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
            Command Center
            <span className="text-primary animate-pulse">.</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-medium">Welcome back. Here is what is happening across your workspaces.</p>
        </div>
        <div className="flex gap-3">
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card 
            key={stat.title} 
            className={cn(
              "group bg-card border-border/50 shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md",
              stat.borderColor
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardDescription className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                {stat.title}
              </CardDescription>
              <div className={cn("p-2 rounded-xl transition-colors", stat.bgColor)}>
                <stat.icon className={cn("w-4 h-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-foreground tracking-tight mb-1">{stat.value}</div>
              <p className="text-[10px] font-bold text-zinc-500 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/50 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-black text-foreground tracking-tight">Recent Workspaces</CardTitle>
              <CardDescription className="text-xs font-bold text-zinc-500 uppercase tracking-widest">You have {projects.length} active projects.</CardDescription>
            </div>
            <Link href="/projects">
              <Button variant="outline" size="sm" className="border-border hover:bg-zinc-50 text-xs font-bold uppercase tracking-widest text-foreground">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => (
                <Link href={`/projects/${project.id}`} key={project.id}>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-all border border-border cursor-pointer group mb-2">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-border">
                        <Briefcase className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground tracking-tight">{project.name}</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-[9px] px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10 font-black uppercase tracking-widest">
                      {project.status}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/50 bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-black text-foreground tracking-tight">Productivity Pulse</CardTitle>
            <CardDescription className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Latest updates across your team.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityTimeline activities={activities} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
