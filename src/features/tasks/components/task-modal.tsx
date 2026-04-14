"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task, TaskStatus, TaskPriority } from "@/types/task";

import { useToast } from "@/components/ui/toast";
import { isInputPopulated } from "@/lib/validation";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialData?: Partial<Task>;
}

import { useOptions } from "@/hooks/use-options";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialData?: Partial<Task>;
}

export function TaskModal({ isOpen, onClose, onSave, initialData }: TaskModalProps) {
  const { toast } = useToast();
  const { getByCategory, loading: loadingOptions } = useOptions();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState<TaskStatus>(initialData?.status || 'Todo' as TaskStatus);
  const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || 'Medium' as TaskPriority);

  const statusOptions = getByCategory('task_status');
  const priorityOptions = getByCategory('task_priority');

  const dispatchTaskRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isInputPopulated(title)) {
      toast("Operational identifier required", "error");
      return;
    }

    onSave({ title, description, status, priority });
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData?.id ? "Synchronize Delta" : "Initialize Task Node"}
    >
      <form noValidate onSubmit={dispatchTaskRegistration} className="space-y-10 py-4">
        {/* ... existing title and description fields ... */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] pl-1">Task Identity</label>
          <Input 
            required 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            placeholder="Assign unique identity..."
            className="bg-zinc-50 border-border text-foreground font-bold h-12 rounded-sm shadow-none focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] pl-1">Operational Context</label>
          <textarea 
            rows={4}
            value={description} 
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the task parameters..."
            className="w-full rounded-sm border border-border bg-zinc-50 px-4 py-4 text-sm text-foreground font-bold placeholder:text-zinc-300 focus:bg-white outline-none transition-all min-h-[140px] shadow-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] pl-1">Sync Status</label>
            <select 
              value={status} 
              onChange={e => setStatus(e.target.value as TaskStatus)}
              className="w-full rounded-sm border border-border bg-zinc-50 px-4 h-12 text-sm font-bold text-foreground focus:bg-white outline-none appearance-none cursor-pointer transition-all shadow-none disabled:opacity-50"
              disabled={loadingOptions}
            >
              {loadingOptions ? (
                <option>Syncing...</option>
              ) : (
                statusOptions.map(opt => <option key={opt.id} value={opt.value as TaskStatus}>{opt.label}</option>)
              )}
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] pl-1">Priority Vector</label>
            <select 
              value={priority} 
              onChange={e => setPriority(e.target.value as TaskPriority)}
              className="w-full rounded-sm border border-border bg-zinc-50 px-4 h-12 text-sm font-bold text-foreground focus:bg-white outline-none appearance-none cursor-pointer transition-all shadow-none disabled:opacity-50"
              disabled={loadingOptions}
            >
              {loadingOptions ? (
                <option>Syncing...</option>
              ) : (
                priorityOptions.map(opt => <option key={opt.id} value={opt.value as TaskPriority}>{opt.label}</option>)
              )}
            </select>
          </div>
        </div>

        <div className="flex gap-6 pt-8">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-zinc-400 font-bold hover:text-foreground h-14 rounded-sm transition-all">
            Abort
          </Button>
          <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-sm shadow-none transition-all active:scale-[0.98]">
            {initialData?.id ? "Update Node" : "Dispatch Link"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
