"use client";


import { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./task-card";
import { Plus, MoreHorizontal, Pencil, Eraser, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/toast";

const COLUMNS: TaskStatus[] = ['Todo', 'In Progress', 'Review', 'Blocked', 'Completed'];

interface TaskBoardProps {
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
}

export function TaskBoard({ tasks, onAddTask, onEditTask }: TaskBoardProps) {
  const { toast } = useToast();
  return (
    <div className="flex gap-6 h-[calc(100vh-16rem)] overflow-x-auto pb-4 no-scrollbar">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col);
        
        return (
          <div key={col} className="flex flex-col w-80 shrink-0">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-foreground uppercase tracking-wider">{col}</h3>
                <span className="text-[10px] font-black bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full border border-border">
                  {columnTasks.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-zinc-400 hover:text-foreground hover:bg-zinc-100"
                  onClick={() => onAddTask(col)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <DropdownMenu 
                  trigger={
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-foreground hover:bg-zinc-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  }
                >
                  <DropdownMenuItem onClick={() => toast(`Rename ${col} Stage`, "info")}>
                    <Pencil className="w-3.5 h-3.5 mr-2" /> Rename Stage
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast(`${col} Stage cleared`, "success")}>
                    <Eraser className="w-3.5 h-3.5 mr-2" /> Clear Stage
                  </DropdownMenuItem>
                  <div className="h-px bg-border my-1" />
                  <DropdownMenuItem variant="destructive" onClick={() => toast(`${col} Stage removal requested`, "info")}>
                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Stage
                  </DropdownMenuItem>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex-1 bg-zinc-50/50 rounded-2xl border border-border p-3 space-y-3 overflow-y-auto no-scrollbar shadow-inner">
              {columnTasks.length === 0 ? (
                <div className="h-24 flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-xl">
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Stage Empty</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onClick={() => onEditTask(task)} />
                ))
              )}
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-foreground hover:bg-zinc-100 mt-2"
                onClick={() => onAddTask(col)}
              >
                <Plus className="h-3 w-3 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
