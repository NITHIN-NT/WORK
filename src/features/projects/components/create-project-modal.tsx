"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClients } from "@/hooks/use-clients";
import { Project, ProjectStatus } from "@/types/project";
import { Building2, Calendar, Target, Briefcase } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { isInputPopulated } from "@/lib/validation";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'tasksCount'>) => void;
}

export function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const { clients } = useClients();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    clientId: "",
    status: "Planning" as ProjectStatus,
    deadline: "",
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isInputPopulated(formData.name)) {
      toast("Project name is required", "error");
      return;
    }
    if (!isInputPopulated(formData.clientId)) {
      toast("Please select a client", "error");
      return;
    }
    if (!isInputPopulated(formData.deadline)) {
      toast("Please set a project deadline", "error");
      return;
    }

    onSuccess(formData);
    onClose();
    setFormData({ name: "", client: "", clientId: "", status: "Planning", deadline: "" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form noValidate onSubmit={handleCreateProject} className="space-y-10 py-4">
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
              <Target className="w-4 h-4 text-zinc-300" /> Project Name
            </label>
            <Input 
              required
              placeholder="e.g. Website Redesign" 
              className="bg-zinc-50 border-border focus:bg-white text-foreground h-12 rounded-xl shadow-none font-bold transition-all"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
              <Building2 className="w-4 h-4 text-zinc-300" /> Client
            </label>
            <select 
              required
              className="w-full bg-zinc-50 border border-border focus:bg-white text-foreground h-12 rounded-xl px-4 text-sm font-bold outline-none transition-all shadow-none appearance-none cursor-pointer"
              value={formData.clientId}
              onChange={(e) => {
                const client = clients.find(c => c.id === e.target.value);
                setFormData(prev => ({ 
                  ...prev, 
                  clientId: e.target.value, 
                  client: client?.company || "" 
                }));
              }}
            >
              <option value="">Select a client...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.company}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
                <Calendar className="w-4 h-4 text-zinc-300" /> Project Deadline
              </label>
              <Input 
                type="date"
                required
                className="bg-zinc-50 border-border focus:bg-white text-foreground h-12 rounded-xl shadow-none font-bold transition-all"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
                <Briefcase className="w-4 h-4 text-zinc-300" /> Status
              </label>
              <select 
                className="w-full bg-zinc-50 border border-border focus:bg-white text-foreground h-12 rounded-xl px-4 text-sm font-bold outline-none transition-all shadow-none appearance-none cursor-pointer"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ProjectStatus }))}
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Under Review</option>
              </select>
            </div>
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
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
}

