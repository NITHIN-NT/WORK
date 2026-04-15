"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task, TaskStatus, TaskPriority } from "@/types/task";
import { ListTodo, AlignLeft, BarChart2, Clock, Tag } from "lucide-react";

import { useToast } from "@/components/ui/toast";
import { isInputPopulated } from "@/lib/validation";
import { useOptions } from "@/hooks/use-options";

interface TaskUpsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  projectId: string;
  initialData?: Partial<Task>;
}

export function TaskUpsertModal({ isOpen, onClose, onSuccess, projectId, initialData }: TaskUpsertModalProps) {
  const { toast } = useToast();
  const { getByCategory, loading: loadingOptions } = useOptions();
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    status: initialData?.status || "" as TaskStatus,
    priority: initialData?.priority || "" as TaskPriority,
    deadline: initialData?.deadline || "",
    tags: initialData?.tags || [] as string[],
  });

  const statuses = getByCategory('task_status');
  const priorities = getByCategory('task_priority');

  // Removed synchronous effect for defaulting to prevent performance warnings and cascading renders

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isInputPopulated(formData.title)) {
      toast("A task name is required", "error");
      return;
    }
    
    const finalData = {
      ...formData,
      projectId,
      status: formData.status || (statuses[0]?.value as TaskStatus) || "Todo",
      priority: formData.priority || (priorities.find(p => p.value === 'Medium')?.value || priorities[0]?.value) as TaskPriority || "Medium"
    };

    onSuccess(finalData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData?.id ? "Edit Task" : "New Task"}>
      <form noValidate onSubmit={handleTaskSubmit} className="space-y-10 py-4">
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
              <ListTodo className="w-3.5 h-3.5 text-zinc-300" /> Task Name
            </label>
            <Input 
              required
              placeholder="e.g. Design Review" 
              className="bg-zinc-50 border-border focus:bg-white text-foreground h-12 rounded-sm shadow-none font-bold transition-all"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
              <AlignLeft className="w-3.5 h-3.5 text-zinc-300" /> Description
            </label>
            <textarea 
              className="w-full bg-zinc-50 border border-border focus:bg-white text-foreground min-h-[120px] rounded-sm p-4 text-sm font-bold outline-none transition-all shadow-none placeholder:text-zinc-300"
              placeholder="Summarize the work to be done..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
                <BarChart2 className="w-3.5 h-3.5 text-zinc-300" /> Priority
              </label>
              <select 
                className="w-full bg-zinc-50 border border-border focus:bg-white text-foreground h-12 rounded-sm px-4 text-sm font-bold outline-none transition-all shadow-none appearance-none cursor-pointer disabled:opacity-50"
                value={formData.priority || (!initialData?.id ? (priorities.find(p => p.value === 'Medium')?.value || priorities[0]?.value) : "") || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
                disabled={loadingOptions}
              >
                {loadingOptions ? (
                  <option>Syncing...</option>
                ) : (
                  priorities.map(p => (
                    <option key={p.id} value={p.value}>{p.label}</option>
                  ))
                )}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
                <Clock className="w-3.5 h-3.5 text-zinc-300" /> Due Date
              </label>
              <Input 
                type="date"
                className="bg-zinc-50 border-border focus:bg-white text-foreground h-12 rounded-sm shadow-none font-bold transition-all"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
                <BarChart2 className="w-3.5 h-3.5 text-zinc-300" /> Status
              </label>
              <select 
                className="w-full bg-zinc-50 border border-border focus:bg-white text-foreground h-12 rounded-sm px-4 text-sm font-bold outline-none transition-all shadow-none appearance-none cursor-pointer disabled:opacity-50"
                value={formData.status || (!initialData?.id ? statuses[0]?.value : "") || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TaskStatus }))}
                disabled={loadingOptions}
              >
                {loadingOptions ? (
                  <option>Syncing...</option>
                ) : (
                  statuses.map(s => (
                    <option key={s.id} value={s.value}>{s.label}</option>
                  ))
                )}
              </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
              <Tag className="w-3.5 h-3.5 text-zinc-300" /> Tags
            </label>
            <Input 
              placeholder="e.g. design, development" 
              className="bg-zinc-50 border-border focus:bg-white text-foreground h-12 rounded-sm shadow-none font-bold transition-all"
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) }))}
            />
          </div>
        </div>

        <div className="pt-8 flex gap-6">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onClose}
            className="flex-1 text-zinc-400 font-bold hover:text-foreground h-14 rounded-sm transition-all"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-sm shadow-none transition-all"
          >
            {initialData?.id ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
