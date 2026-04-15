"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FolderKanban, 
  Activity, 
  Target,
  FileText,
  ArrowUpRight,
  Briefcase,
  Clock
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
      <div className="space-y-10 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <Skeleton className="h-14 w-80 rounded-2xl bg-white/5" />
          <Skeleton className="h-10 w-32 rounded-xl bg-white/5" />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 w-full rounded-2xl bg-white/5" />)}
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-[500px] rounded-[2.5rem] bg-white/5" />
          <Skeleton className="col-span-3 h-[500px] rounded-[2.5rem] bg-white/5" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Active Projects",
      value: activeProjectsCount.toString(),
      description: "Deployed Operations",
      icon: FolderKanban,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "hover:border-blue-500/30"
    },
    {
      title: "Open Tasks",
      value: pendingTasksCount.toString(),
      description: "Strategic Objectives",
      icon: Target,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "hover:border-indigo-500/30"
    },
    {
      title: "Unpaid Balance",
      value: `₹${unpaidBalance.toLocaleString()}`,
      description: "Pending Liquidity",
      icon: FileText,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "hover:border-amber-500/30"
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      description: "Growth Metric",
      icon: Activity,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "hover:border-emerald-500/30"
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-black text-white tracking-tighter flex items-center gap-2 italic">
            Dashboard
            <span className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]">.</span>
          </h1>
          <p className="text-zinc-500 font-bold tracking-tight text-[11px] uppercase tracking-[0.4em]">
            Strategic Intelligence Overview
          </p>
        </div>
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card 
            key={stat.title} 
            className={cn(
              "p-4 border-white/5 hover:border-primary/30 transition-all duration-500",
              stat.borderColor
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <CardDescription className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                {stat.title}
              </CardDescription>
              <div className={cn("p-3 rounded-xl transition-all group-hover:bg-primary shadow-lg", stat.bgColor)}>
                <stat.icon className={cn("w-4 h-4", stat.color, "group-hover:text-white")} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-black text-white tracking-tighter mb-3 italic">{stat.value}</div>
              <p className="text-[10px] font-black text-zinc-500 flex items-center gap-2 uppercase tracking-widest">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-white/5 shadow-none transition-all duration-500">
          <CardHeader className="flex flex-row items-center justify-between pb-10">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-black text-white tracking-tighter italic">Recent Projects</CardTitle>
              <CardDescription className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                {projects.length > 0 ? `${projects.length} Nodes Synchronized` : "No Active Nodes"}
              </CardDescription>
            </div>
            <Link href="/projects">
              <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white rounded-xl">
                Access All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">No Project Instances</p>
                </div>
              ) : (
                projects.slice(0, 4).map((project) => (
                  <Link href={`/projects/${project.id}`} key={project.id}>
                    <div className="flex items-center justify-between px-8 py-6 rounded-2xl glass bg-white/[0.02] hover:bg-white/[0.08] transition-all duration-500 border-white/5 cursor-pointer group mb-4">
                      <div className="flex items-center gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                          <Briefcase className="h-6 w-6 text-zinc-400 group-hover:text-white transition-all" />
                        </div>
                        <div>
                          <p className="text-lg font-black text-white tracking-tight leading-tight">{project.name}</p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                            <Clock className="w-3 h-3" /> {new Date(project.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-[8px] px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-black uppercase tracking-[0.3em] shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                        {project.status}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-white/5 shadow-none transition-all duration-500">
          <CardHeader className="pb-10">
            <CardTitle className="text-3xl font-black text-white tracking-tighter italic">Activity Registry</CardTitle>
            <CardDescription className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Real-time operational streams</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityTimeline activities={activities} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
