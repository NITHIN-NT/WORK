"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task, TaskStatus, TaskPriority } from "@/types/task";
import { ListTodo, AlignLeft, BarChart2, Clock, Tag } from "lucide-react";

import { useToast } from "@/components/ui/toast";
import { isNotEmpty } from "@/lib/validation";

interface TaskUpsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  projectId: string;
  initialData?: Partial<Task>;
}

export function TaskUpsertModal({ isOpen, onClose, onSuccess, projectId, initialData }: TaskUpsertModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    status: initialData?.status || "Todo" as TaskStatus,
    priority: initialData?.priority || "Medium" as TaskPriority,
    deadline: initialData?.deadline || "",
    tags: initialData?.tags || [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom Validation
    if (!isNotEmpty(formData.title)) {
      toast("Task title is required", "error");
      return;
    }

    onSuccess({ ...formData, projectId });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData?.id ? "Edit Task" : "Create New Task"}>
      <form noValidate onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <ListTodo className="w-3 h-3" /> Task Title
            </label>
            <Input 
              required
              placeholder="e.g. Design System Audit" 
              className="bg-zinc-50 border-border focus:border-primary/50 text-foreground h-11 shadow-sm"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <AlignLeft className="w-3 h-3" /> Description
            </label>
            <textarea 
              className="w-full bg-zinc-50 border border-border focus:border-primary/50 text-foreground min-h-[100px] rounded-lg p-3 text-sm font-black outline-none transition-all shadow-sm"
              placeholder="Provide context and requirements..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <BarChart2 className="w-3 h-3" /> Priority
              </label>
              <select 
                className="w-full bg-zinc-50 border border-border focus:border-primary/50 text-foreground h-11 rounded-lg px-3 text-sm font-black outline-none transition-all shadow-sm"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-3 h-3" /> Deadline
              </label>
              <Input 
                type="date"
                className="bg-zinc-50 border-border focus:border-primary/50 text-foreground h-11 shadow-sm"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Tag className="w-3 h-3" /> Tags (Comma separated)
            </label>
            <Input 
              placeholder="design, dev, audit" 
              className="bg-zinc-50 border-border focus:border-primary/50 text-foreground h-11 shadow-sm"
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) }))}
            />
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onClose}
            className="flex-1 text-zinc-400 font-bold hover:text-foreground hover:bg-zinc-100"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-black shadow-lg shadow-primary/20"
          >
            {initialData?.id ? "Update Task" : "Add Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
