"use client";

import { ActivityTimeline } from "@/components/activity/activity-timeline";
import { Button } from "@/components/ui/button";
import { Search, History, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { useActivity } from "@/hooks/use-activity";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

export default function ProjectActivity() {
  const params = useParams();
  const projectId = params.id as string;
  const { activities, loading } = useActivity(projectId);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-150">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64 bg-zinc-100" />
          <Skeleton className="h-4 w-48 bg-zinc-50" />
        </div>
        <div className="bg-zinc-50 border border-border rounded-sm p-12 space-y-8 shadow-sm">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-12 w-12 rounded-sm bg-zinc-100 border border-border" />
              <div className="flex-1 space-y-3 py-1">
                <Skeleton className="h-4 w-1/3 bg-zinc-100" />
                <Skeleton className="h-4 w-full bg-zinc-50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Activity History</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Real-time audit log for this workspace context.</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="border-border bg-white text-zinc-600 font-bold px-6 h-11 rounded-sm shadow-sm hover:bg-zinc-50 transition-all">
            <Download className="w-4 h-4 mr-2" />
            Export Log
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Search activity feed..." 
          className="pl-11 h-11 bg-white border-border rounded-sm text-sm font-bold shadow-xs focus:ring-4 focus:ring-primary/5 transition-all"
        />
      </div>

      <div className="bg-card border border-border rounded-sm p-8 sm:p-12 shadow-sm">
        {activities.length === 0 ? (
          <EmptyState 
            icon={History}
            title="No Activity Yet"
            description="Actions performed in this workspace will appear here in chronological order."
          />
        ) : (
          <ActivityTimeline activities={activities} />
        )}
      </div>
    </div>
  );
}
