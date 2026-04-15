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
  task_updated: "text-indigo-400",
  task_completed: "text-emerald-400",
  note_updated: "text-blue-400",
  invoice_generated: "text-amber-400",
  invoice_sent: "text-primary",
  document_uploaded: "text-zinc-400",
  document_created: "text-zinc-400",
  financial_update: "text-emerald-500",
  project_created: "text-white",
  requirement_updated: "text-rose-400",
};

export function ActivityTimeline({ activities, className }: ActivityTimelineProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {activities.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl bg-white/5">
          <Activity className="h-12 w-12 text-zinc-700 mb-6 animate-pulse" />
          <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em]">No Operational Data</p>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-tight mt-2 text-center max-w-[220px]">
            Synchronizing with workspace stream...
          </p>
        </div>
      ) : (
        <div className="flow-root">
          <ul role="list" className="-mb-12">
            {activities.map((activity, idx) => {
              const Icon = activityIconMap[activity.type] || Activity;
              return (
                <li key={activity.id}>
                  <div className="relative pb-12 group">
                    {idx !== activities.length - 1 && (
                      <span 
                        className="absolute left-[19px] top-6 -ml-px h-full w-[1px] bg-white/5 group-hover:bg-primary/30 transition-all duration-500" 
                        aria-hidden="true" 
                      />
                    )}
                    <div className="relative flex space-x-6 items-start">
                      <div className="relative">
                        <span className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/5 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary",
                          activityColorMap[activity.type]
                        )}>
                          <Icon className="h-4.5 w-4.5 group-hover:text-white transition-colors" aria-hidden="true" />
                        </span>
                        {/* Status Pulse for active items */}
                        {idx === 0 && (
                          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-ping opacity-75" />
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div className="space-y-1.5">
                          <p className="text-[14px] text-zinc-400 font-medium leading-relaxed">
                            <span className="font-black text-white hover:text-primary transition-colors cursor-pointer">{activity.userName}</span>{' '}
                            <span className="text-zinc-500">{activity.title}</span>
                          </p>
                          {activity.description && (
                            <p className="text-[12px] text-zinc-500 font-bold leading-relaxed border-l-2 border-white/5 pl-4 py-1 italic">
                              "{activity.description}"
                            </p>
                          )}
                        </div>
                        <div className="whitespace-nowrap text-right text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mt-1.5">
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

