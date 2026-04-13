"use client";

import { useState } from "react";
import { TaskBoard } from "@/components/tasks/task-board";
import { TaskUpsertModal } from "@/components/tasks/task-upsert-modal";
import { useTasks } from "@/hooks/use-tasks";
import { Task, TaskStatus } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { TaskFilterBar } from "@/components/tasks/task-filter-bar";
import { useToast } from "@/components/ui/toast";

export default function ProjectTasks() {
  const params = useParams();
  const projectId = params.id as string;
  const { tasks, addTask, updateTask } = useTasks(projectId);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Partial<Task> | null>(null);
  const [activeFilters, setActiveFilters] = useState<{ priority: string[] }>({ priority: [] });

  const handleAddTask = (status: TaskStatus) => {
    setActiveTask({ status });
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setActiveTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (activeTask?.id) {
      updateTask(activeTask.id, taskData);
      toast("Task updated successfully", "success");
    } else {
      addTask({
        projectId,
        title: taskData.title || "Untitled Task",
        description: taskData.description || "",
        status: taskData.status || 'Todo',
        priority: taskData.priority || 'Medium',
        tags: taskData.tags || [],
      });
      toast("New task created", "success");
    }
    setIsModalOpen(false);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = activeFilters.priority.length === 0 || 
                           activeFilters.priority.includes(task.priority);
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Project Board</h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium tracking-tight uppercase tracking-widest text-[10px]">Active Workspace: {projectId}</p>
        </div>
        
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => handleAddTask('Todo')}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Task
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-10 h-10 bg-white border-border focus:border-primary/50 transition-all text-sm text-foreground shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <TaskFilterBar onFilterChange={(f) => setActiveFilters({ priority: f.priority })} />
      </div>

      <TaskBoard 
        tasks={filteredTasks} 
        onAddTask={handleAddTask} 
        onEditTask={handleEditTask}
      />

      <TaskUpsertModal 
        key={activeTask?.id || 'new'}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleSaveTask}
        projectId={projectId}
        initialData={activeTask || undefined}
      />
    </div>
  );
}
