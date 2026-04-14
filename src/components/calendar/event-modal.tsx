"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, Type, Briefcase } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { isInputPopulated } from "@/lib/validation";
import { useProjects } from "@/hooks/use-projects";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: { title: string; date: Date; type: 'task' | 'milestone' | 'meeting'; project: string }) => void;
  initialDate?: Date;
}

export function EventModal({ isOpen, onClose, onSave, initialDate }: EventModalProps) {
  const { toast } = useToast();
  const { projects } = useProjects();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    type: "meeting" as 'task' | 'milestone' | 'meeting',
    project: "Global"
  });

  useEffect(() => {
    if (initialDate) {
      queueMicrotask(() => {
        setFormData(prev => ({ 
          ...prev, 
          date: initialDate.toISOString().split('T')[0] 
        }));
      });
    }
  }, [initialDate, isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isInputPopulated(formData.title)) {
      toast("Event name required", "error");
      return;
    }
    if (!isInputPopulated(formData.date)) {
      toast("Date required", "error");
      return;
    }

    onSave({
      title: formData.title,
      date: new Date(formData.date),
      type: formData.type,
      project: formData.project
    });
    
    onClose();
    setFormData({ title: "", date: "", type: "meeting", project: "Global" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Event">
      <form noValidate onSubmit={handleSave} className="space-y-10 py-4">
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
              <Tag className="w-3.5 h-3.5 text-zinc-300" /> Event Name
            </label>
            <Input 
              placeholder="e.g. Weekly Standup" 
              className="bg-zinc-50 border-border h-12 rounded-xl shadow-none font-bold focus:bg-white transition-all"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
                <Tag className="w-3.5 h-3.5 text-zinc-300" /> Date
              </label>
              <Input 
                type="date"
                className="bg-zinc-50 border-border h-12 rounded-xl shadow-none font-bold focus:bg-white transition-all"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
                <Type className="w-3.5 h-3.5 text-zinc-300" /> Event Type
              </label>
              <select 
                className="w-full bg-zinc-50 border border-border focus:bg-white text-foreground h-12 rounded-xl px-4 text-sm font-bold outline-none transition-all shadow-none appearance-none cursor-pointer"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'task' | 'milestone' | 'meeting' }))}
              >
                <option value="meeting">Meeting</option>
                <option value="milestone">Milestone</option>
                <option value="task">Deadline</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
              <Briefcase className="w-3.5 h-3.5 text-zinc-300" /> Project
            </label>
            <select 
              className="w-full bg-zinc-50 border border-border focus:bg-white text-foreground h-12 rounded-xl px-4 text-sm font-bold outline-none transition-all shadow-none appearance-none cursor-pointer"
              value={formData.project}
              onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
            >
              <option value="Global">Global</option>
              {projects.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-8 flex gap-6">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onClose}
            className="flex-1 text-zinc-400 font-bold hover:text-foreground h-14 rounded-2xl transition-all"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-2xl shadow-none transition-all"
          >
            Save Event
          </Button>
        </div>
      </form>
    </Modal>
  );
}
