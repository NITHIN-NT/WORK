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

const activityIcons: Record<ActivityType, LucideIcon> = {
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

const activityColors: Record<ActivityType, string> = {
  task_created: "text-secondary bg-secondary/10 border-secondary/20",
  task_updated: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  task_completed: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  note_updated: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  invoice_generated: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  invoice_sent: "text-sky-500 bg-sky-500/10 border-sky-500/20",
  document_uploaded: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
  document_created: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  financial_update: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  project_created: "text-primary bg-primary/10 border-primary/20",
  requirement_updated: "text-rose-500 bg-rose-500/10 border-rose-500/20",
};

export function ActivityTimeline({ activities, className }: ActivityTimelineProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {activities.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-zinc-50/50">
          <p className="text-sm font-black text-zinc-400 uppercase tracking-widest text-[10px]">No activity recorded</p>
        </div>
      ) : (
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            {activities.map((activity, idx) => {
              const Icon = activityIcons[activity.type] || Activity;
              return (
                <li key={activity.id}>
                  <div className="relative pb-8 group">
                    {idx !== activities.length - 1 && (
                      <span 
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-zinc-100 group-hover:bg-primary/20 transition-colors" 
                        aria-hidden="true" 
                      />
                    )}
                    <div className="relative flex space-x-4 items-start">
                      <div>
                        <span className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white border border-border shadow-sm transition-transform group-hover:scale-110",
                          activityColors[activity.type]
                        )}>
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-zinc-600 font-medium">
                            <span className="font-black text-foreground">{activity.userName}</span>{' '}
                            {activity.title}
                            {activity.description && (
                              <span className="block text-xs text-zinc-500 mt-1 leading-relaxed font-medium">
                                {activity.description}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">
                          {formatDistanceToNow(new Date(activity.timestamp))} ago
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
