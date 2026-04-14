"use client";

import { ActivityLog, ActivityType } from '@/types/activity';
import { 
  CheckCircle2, 
  FileText, 
  PlusCircle, 
  Send, 
  FileUp, 
  AlertCircle,
  Clock,
  Briefcase,
  Activity,
  LucideIcon,
  FilePlus,
  CreditCard,
  FolderPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';

interface ActivityTimelineProps {
  activities: ActivityLog[];
  className?: string;
}

const activityIconMap: Record<ActivityType, LucideIcon> = {
  task_created: PlusCircle,
  task_updated: Clock,
  task_completed: CheckCircle2,
  note_updated: FileText,
  invoice_generated: Briefcase,
  invoice_sent: Send,
  document_uploaded: FileUp,
  document_created: FilePlus,
  financial_update: CreditCard,
  project_created: FolderPlus,
  requirement_updated: AlertCircle,
};

const activityColorMap: Record<ActivityType, string> = {
  task_created: "text-zinc-500",
  task_updated: "text-zinc-400",
  task_completed: "text-emerald-600",
  note_updated: "text-zinc-500",
  invoice_generated: "text-zinc-600",
  invoice_sent: "text-primary",
  document_uploaded: "text-zinc-500",
  document_created: "text-zinc-500",
  financial_update: "text-zinc-600",
  project_created: "text-foreground",
  requirement_updated: "text-rose-600",
};

export function ActivityTimeline({ activities, className }: ActivityTimelineProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {activities.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center border border-dashed border-border rounded-sm bg-white/50">
          <Activity className="h-10 w-10 text-zinc-200 mb-4" />
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">No activity yet</p>
          <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-tight mt-1 items-center flex gap-1 text-center max-w-[200px]">
            Updates will appear here as you work.
          </p>
        </div>
      ) : (
        <div className="flow-root">
          <ul role="list" className="-mb-10">
            {activities.map((activity, idx) => {
              const Icon = activityIconMap[activity.type] || Activity;
              return (
                <li key={activity.id}>
                  <div className="relative pb-10 group">
                    {idx !== activities.length - 1 && (
                      <span 
                        className="absolute left-4 top-4 -ml-px h-full w-[1px] bg-zinc-100 group-hover:bg-zinc-200 transition-colors" 
                        aria-hidden="true" 
                      />
                    )}
                    <div className="relative flex space-x-6 items-start">
                      <div>
                        <span className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center bg-white border border-border shadow-sm transition-transform group-hover:scale-105",
                          activityColorMap[activity.type]
                        )}>
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1">
                        <div>
                          <p className="text-[13px] text-zinc-500 font-medium leading-relaxed">
                            <span className="font-bold text-foreground">{activity.userName}</span>{' '}
                            {activity.title}
                            {activity.description && (
                              <span className="block text-[11.5px] text-zinc-400 mt-0.5 leading-relaxed">
                                {activity.description}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-[9px] font-black text-zinc-300 uppercase tracking-widest mt-1">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

