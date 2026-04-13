"use client";

import { Task, TaskPriority } from "@/types/task";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar, AlertCircle } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const priorityColors: Record<TaskPriority, string> = {
  Low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Medium: "bg-secondary/10 text-secondary border-secondary/20",
  High: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Urgent: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="bg-card border-border/50 hover:border-primary/30 transition-all cursor-grab active:cursor-grabbing group overflow-hidden shadow-sm hover:shadow-md"
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className={cn(
            "text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded border shadow-sm",
            priorityColors[task.priority]
          )}>
            {task.priority}
          </div>
          {task.priority === 'Urgent' && <AlertCircle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />}
        </div>

        <h4 className="text-sm font-black text-foreground group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-medium">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
            <Calendar className="w-3 h-3" />
            <span>{task.deadline || "No deadline"}</span>
          </div>
          
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-white flex items-center justify-center text-[10px] font-black text-primary shadow-sm">
              {task.assignedTo?.charAt(0) || "?"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
