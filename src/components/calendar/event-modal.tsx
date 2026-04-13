"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Tag, Type, Briefcase } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { isNotEmpty } from "@/lib/validation";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: { title: string; date: Date; type: 'task' | 'milestone' | 'meeting'; project: string }) => void;
  initialDate?: Date;
}

export function EventModal({ isOpen, onClose, onSave, initialDate }: EventModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    type: "meeting" as 'task' | 'milestone' | 'meeting',
    project: "All Projects"
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom Validation
    if (!isNotEmpty(formData.title)) {
      toast("Event title is required", "error");
      return;
    }
    if (!isNotEmpty(formData.date)) {
      toast("Please select a date", "error");
      return;
    }

    onSave({
      title: formData.title,
      date: new Date(formData.date),
      type: formData.type,
      project: formData.project
    });
    
    onClose();
    setFormData({ title: "", date: "", type: "meeting", project: "All Projects" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule New Event">
      <form noValidate onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Tag className="w-3 h-3" /> Event Title
            </label>
            <Input 
              placeholder="e.g. Sync with Acme Team" 
              className="bg-zinc-50 border-border h-11 shadow-sm"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Event Date
              </label>
              <Input 
                type="date"
                className="bg-zinc-50 border-border h-11 shadow-sm"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Type className="w-3 h-3" /> Event Type
              </label>
              <select 
                className="w-full bg-zinc-50 border border-border focus:border-primary/50 text-foreground h-11 rounded-lg px-3 text-sm font-black outline-none transition-all shadow-sm"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'task' | 'milestone' | 'meeting' }))}
              >
                <option value="meeting">Team Meeting</option>
                <option value="milestone">Project Milestone</option>
                <option value="task">Deadline / Task</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Briefcase className="w-3 h-3" /> Workspace
            </label>
            <select 
              className="w-full bg-zinc-50 border border-border focus:border-primary/50 text-foreground h-11 rounded-lg px-3 text-sm font-black outline-none transition-all shadow-sm"
              value={formData.project}
              onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
            >
              {["All Projects", "Acme Corp", "Nexus Tech", "Innova", "Startup Inc"].map((proj) => (
                <option key={proj} value={proj}>{proj}</option>
              ))}
            </select>
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
            Create Event
          </Button>
        </div>
      </form>
    </Modal>
  );
}
