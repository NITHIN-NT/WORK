"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Clock, FileText, Activity } from "lucide-react";
import { useParams } from "next/navigation";

export default function ProjectDashboard() {
  const params = useParams();
  const projectId = params.id as string;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black tracking-tight text-foreground">Acme Corp E-commerce</h1>
            <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
              In Progress
            </span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Project overview and core delivery metrics for {projectId}.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border shadow-sm rounded-3xl overflow-hidden group hover:border-primary/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Task Completion</CardTitle>
            <CheckSquare className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground tracking-tight">18/24</div>
            <div className="mt-4 h-2 w-full bg-zinc-100 rounded-full overflow-hidden border border-border/50">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-1000" 
                style={{ width: "75%" }} 
              />
            </div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-3">75% Total Delivery</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm rounded-3xl overflow-hidden group hover:border-secondary/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Time Tracking</CardTitle>
            <Clock className="w-4 h-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground tracking-tight">42h 15m</div>
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest mt-2 bg-secondary/5 w-fit px-2 py-0.5 rounded-lg border border-secondary/10">10h logged this week</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm rounded-3xl overflow-hidden group hover:border-purple-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Open Requirements</CardTitle>
            <FileText className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground tracking-tight">3 Pending</div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-2">Awaiting client approval</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm rounded-3xl overflow-hidden group hover:border-emerald-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Recent Activity</CardTitle>
            <Activity className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-foreground tracking-tight">12 Actions</div>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-2 bg-emerald-500/5 w-fit px-2 py-0.5 rounded-lg border border-emerald-500/10">In last 24h</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
