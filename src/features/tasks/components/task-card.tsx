"use client";

import { Task, TaskPriority } from "@/types/task";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const priorityConfig: Record<TaskPriority, { label: string; dot: string }> = {
  Low: { label: "text-zinc-400", dot: "bg-emerald-500" },
  Medium: { label: "text-zinc-400", dot: "bg-amber-400" },
  High: { label: "text-zinc-600", dot: "bg-orange-500" },
  Urgent: { label: "text-rose-600 font-black", dot: "bg-rose-600" },
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const config = priorityConfig[task.priority];

  return (
    <Card 
      onClick={onClick}
      className="bg-white border-border/60 hover:border-primary transition-all cursor-grab active:cursor-grabbing group shadow-none hover:shadow-sm"
    >
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", config.dot)} />
            <span className={cn("text-[10px] uppercase tracking-[0.15em]", config.label)}>
              {task.priority}
            </span>
          </div>
        </div>

        <h4 className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-[11.5px] text-zinc-400 line-clamp-2 leading-relaxed font-medium">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-black uppercase tracking-widest">
            <Calendar className="w-3 h-3" />
            <span>{task.deadline || "No Target"}</span>
          </div>
          
          <div className="flex">
            <div className="w-6 h-6 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[10px] font-black text-zinc-600">
              {task.assignedTo?.charAt(0) || "U"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

