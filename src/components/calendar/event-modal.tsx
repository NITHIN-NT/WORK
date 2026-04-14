"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, CornerDownRight } from "lucide-react";
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
    <Modal isOpen={isOpen} onClose={onClose} title="Calendar Entry">
      <form noValidate onSubmit={handleSave} className="space-y-10">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
              Event Designation
            </label>
            <Input 
              placeholder="e.g. PROJECT_SYNC_X" 
              className="bg-zinc-50 border-zinc-100 h-14 rounded-none shadow-none font-bold focus:bg-white focus:border-primary transition-all px-6 text-base"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                Registry Date
              </label>
              <Input 
                type="date"
                className="bg-zinc-50 border-zinc-100 h-14 rounded-none shadow-none font-bold focus:bg-white focus:border-primary transition-all px-6"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                Entry Type
              </label>
              <div className="relative group">
                <select 
                  className="w-full bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-primary text-foreground h-14 rounded-none px-6 text-sm font-bold outline-none transition-all shadow-none appearance-none cursor-pointer"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'task' | 'milestone' | 'meeting' }))}
                >
                  <option value="meeting">Meeting</option>
                  <option value="milestone">Milestone</option>
                  <option value="task">Deadline</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-300">
                   <CornerDownRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
              Workspace Domain
            </label>
            <div className="relative group">
              <select 
                className="w-full bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-primary text-foreground h-14 rounded-none px-6 text-sm font-bold outline-none transition-all shadow-none appearance-none cursor-pointer"
                value={formData.project}
                onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
              >
                <option value="Global">Global Context</option>
                {projects.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-300">
                 <Briefcase className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <Button 
            type="submit" 
            className="flex-[2] bg-zinc-950 hover:bg-zinc-800 text-white font-black h-14 rounded-none shadow-none transition-all uppercase tracking-[0.2em] text-[10px]"
          >
            Register Entry
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onClose}
            className="flex-1 text-zinc-400 font-bold hover:text-zinc-950 h-14 rounded-none transition-all uppercase tracking-widest text-[9px]"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
