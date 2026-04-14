"use client";

import { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./task-card";
import { Plus, MoreHorizontal, Pencil, Eraser, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/toast";

const STAGES: TaskStatus[] = ['Todo', 'In Progress', 'Review', 'Blocked', 'Completed'];

interface TaskBoardProps {
  tasks: Task[];
  initializeTaskCreation: (status: TaskStatus) => void;
  dispatchTaskAudit: (task: Task) => void;
}

export function TaskBoard({ tasks, initializeTaskCreation, dispatchTaskAudit }: TaskBoardProps) {
  const { toast } = useToast();
  
  return (
    <div className="flex gap-8 h-[calc(100vh-18rem)] overflow-x-auto pb-4 no-scrollbar">
      {STAGES.map((status) => {
        const stageTasks = tasks.filter((t) => t.status === status);
        
        return (
          <div key={status} className="flex flex-col w-80 shrink-0">
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-3">
                <h3 className="text-xs font-black text-foreground uppercase tracking-[0.2em]">{status}</h3>
                <span className="text-[10px] font-black tabular-nums bg-white text-zinc-400 px-2.5 py-1 rounded-full border border-border">
                  {stageTasks.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-zinc-400 hover:text-foreground"
                  onClick={() => initializeTaskCreation(status)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <DropdownMenu 
                  trigger={
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  }
                >
                  <DropdownMenuItem onClick={() => toast(`Modify Stage: ${status}`, "info")}>
                    <Pencil className="w-3.5 h-3.5 mr-2" /> Edit Blueprint
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast(`Purged ${status} Stage`, "info")}>
                    <Eraser className="w-3.5 h-3.5 mr-2" /> flush Cache
                  </DropdownMenuItem>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex-1 bg-white/40 rounded-sm border border-border/60 p-4 space-y-4 overflow-y-auto no-scrollbar">
              {stageTasks.length === 0 ? (
                <div className="group h-32 flex flex-col items-center justify-center border border-dashed border-border/50 rounded-sm hover:border-primary/50 transition-colors">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest opacity-60">Null Vector</p>
                </div>
              ) : (
                stageTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onClick={() => dispatchTaskAudit(task)} />
                ))
              )}
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-[11px] font-black uppercase tracking-[0.1em] text-zinc-400 hover:text-primary hover:bg-primary/5 h-11 px-4 mt-2 border border-transparent hover:border-primary/10 rounded-sm"
                onClick={() => initializeTaskCreation(status)}
              >
                <Plus className="h-4 w-4 mr-3" />
                Initialize Task
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

