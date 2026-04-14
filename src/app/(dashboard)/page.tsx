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
import { useAppStore } from "@/store/app";
import { useEffect } from "react";

export default function DashboardPage() {
  const { projects, loading: projectsLoading } = useProjects();
  const { invoices, loading: invoicesLoading } = useInvoices();
  const { tasks, loading: tasksLoading } = useTasks("global");
  const { activities, loading: activityLoading } = useGlobalActivity();
  const { setDataReady } = useAppStore();

  const isLoading = projectsLoading || invoicesLoading || tasksLoading || activityLoading;

  useEffect(() => {
    if (!isLoading) {
      setDataReady(true);
    }
  }, [isLoading, setDataReady]);

  const totalRevenue = invoices.reduce((s, i) => s + (i.status === 'Paid' ? i.total : 0), 0);
  const activeProjectsCount = projects.filter(p => p.status === 'In Progress').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'Completed').length;
  const unpaidBalance = invoices.reduce((s, i) => s + (i.status !== 'Paid' ? i.total : 0), 0);

  if (isLoading) {

    return (
      <div className="space-y-10 animate-in fade-in duration-150">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-64 rounded-sm" />
          <Skeleton className="h-10 w-32 rounded-sm" />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-36 w-full rounded-sm" />)}
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-96 rounded-sm" />
          <Skeleton className="col-span-3 h-96 rounded-sm" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Active Projects",
      value: activeProjectsCount.toString(),
      description: "Projects currently in progress",
      icon: FolderKanban,
      color: "text-zinc-900",
      bgColor: "bg-zinc-100",
      borderColor: "hover:border-zinc-300"
    },
    {
      title: "Open Tasks",
      value: pendingTasksCount.toString(),
      description: "Tasks awaiting completion",
      icon: Target,
      color: "text-zinc-700",
      bgColor: "bg-zinc-100",
      borderColor: "hover:border-zinc-300"
    },
    {
      title: "Unpaid Balance",
      value: `₹${unpaidBalance.toLocaleString()}`,
      description: "Fees to be collected",
      icon: FileText,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "hover:border-amber-200"
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      description: "Total earnings to date",
      icon: Activity,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "hover:border-emerald-200"
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-10">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-foreground tracking-tighter flex items-center gap-2">
            Dashboard
            <span className="text-primary">.</span>
          </h1>
          <p className="text-zinc-400 font-bold tracking-tight text-sm uppercase tracking-[0.2em]">
            Overview of your projects and latest updates.
          </p>
        </div>
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card 
            key={stat.title} 
            className={cn(
              "group bg-zinc-50/50 border-border/40 shadow-none transition-all duration-300 hover:bg-white hover:border-zinc-300 rounded-sm",
              stat.borderColor
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
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
        <Card className="lg:col-span-4 border-border/40 shadow-none rounded-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black text-foreground tracking-tighter">Recent Projects</CardTitle>
              <CardDescription className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                {projects.length > 0 ? `${projects.length} projects currently in progress.` : "No projects found."}
              </CardDescription>
            </div>
            <Link href="/projects">
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 hover:text-foreground">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center border border-dashed border-border rounded-sm bg-zinc-50/50">
                  <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">No projects yet</p>
                </div>
              ) : (
                projects.slice(0, 4).map((project) => (
                  <Link href={`/projects/${project.id}`} key={project.id}>
                    <div className="flex items-center justify-between px-6 py-5 rounded-sm bg-zinc-50/50 hover:bg-zinc-100 transition-all border border-border/20 cursor-pointer group">
                      <div className="flex items-center gap-5">
                        <div className="h-12 w-12 rounded-sm bg-white flex items-center justify-center border border-border/50 shadow-sm group-hover:bg-zinc-900 group-hover:border-zinc-900 transition-all">
                          <Briefcase className="h-5 w-5 text-zinc-400 group-hover:text-white transition-all" />
                        </div>
                        <div>
                          <p className="text-base font-black text-foreground tracking-tight">{project.name}</p>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.1em] mt-0.5">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-[9px] px-3 py-1 rounded-full bg-zinc-900 text-white font-black uppercase tracking-[0.2em]">
                        {project.status}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/40 shadow-none rounded-sm bg-white">
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl font-black text-foreground tracking-tighter">Activity Log</CardTitle>
            <CardDescription className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Recent updates from your projects and tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityTimeline activities={activities} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
