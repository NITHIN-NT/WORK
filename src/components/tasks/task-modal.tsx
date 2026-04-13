"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task, TaskStatus, TaskPriority } from "@/types/task";

import { useToast } from "@/components/ui/toast";
import { isNotEmpty } from "@/lib/validation";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialData?: Partial<Task>;
}

const statusOptions: TaskStatus[] = ['Todo', 'In Progress', 'Review', 'Blocked', 'Completed'];
const priorityOptions: TaskPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

export function TaskModal({ isOpen, onClose, onSave, initialData }: TaskModalProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState<TaskStatus>(initialData?.status || 'Todo');
  const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || 'Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom Validation
    if (!isNotEmpty(title)) {
      toast("Task title is required", "error");
      return;
    }

    onSave({ title, description, status, priority });
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData?.id ? "Edit Task Detail" : "Assign New Task"}
    >
      <form noValidate onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Task Title</label>
          <Input 
            required 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            placeholder="Assign a title..."
            className="bg-zinc-50 border-border text-foreground font-bold h-11 focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Description</label>
          <textarea 
            rows={4}
            value={description} 
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the task parameters..."
            className="w-full rounded-xl border border-border bg-zinc-50 px-4 py-3 text-sm text-foreground font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/10 transition-all min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</label>
            <select 
              value={status} 
              onChange={e => setStatus(e.target.value as TaskStatus)}
              className="w-full rounded-xl border border-border bg-zinc-50 px-4 h-11 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer"
            >
              {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Priority</label>
            <select 
              value={priority} 
              onChange={e => setPriority(e.target.value as TaskPriority)}
              className="w-full rounded-xl border border-border bg-zinc-50 px-4 h-11 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/10 transition-all outline-none appearance-none cursor-pointer"
            >
              {priorityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-500 hover:text-foreground font-bold">
            Discard
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-10 shadow-lg shadow-primary/20 h-11 transition-all hover:scale-[1.02] rounded-xl">
            {initialData?.id ? "Update Parameters" : "Dispatch Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
