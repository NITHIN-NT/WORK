"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClients } from "@/hooks/use-clients";
import { Project, ProjectStatus } from "@/types/project";
import { Building2, Calendar, Target, Briefcase } from "lucide-react";

import { useToast } from "@/components/ui/toast";
import { isNotEmpty } from "@/lib/validation";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom Validation
    if (!isNotEmpty(formData.name)) {
      toast("Project name is required", "error");
      return;
    }
    if (!isNotEmpty(formData.clientId)) {
      toast("Please assign a client", "error");
      return;
    }
    if (!isNotEmpty(formData.deadline)) {
      toast("Deadline is required", "error");
      return;
    }

    onSuccess(formData);
    onClose();
    setFormData({ name: "", client: "", clientId: "", status: "Planning", deadline: "" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Initialize New Project">
      <form noValidate onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Target className="w-3 h-3" /> Project Name
            </label>
            <Input 
              required
              placeholder="e.g. Acme Corp UX Audit" 
              className="bg-zinc-50 border-border focus:border-primary/50 text-foreground h-11 shadow-sm"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Building2 className="w-3 h-3" /> Assign Client
            </label>
            <select 
              required
              className="w-full bg-zinc-50 border border-border focus:border-primary/50 text-foreground h-11 rounded-lg px-3 text-sm font-black outline-none transition-all shadow-sm"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Deadline
              </label>
              <Input 
                type="date"
                required
                className="bg-zinc-50 border-border focus:border-primary/50 text-foreground h-11 shadow-sm"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-3 h-3" /> Phase
              </label>
              <select 
                className="w-full bg-zinc-50 border border-border focus:border-primary/50 text-foreground h-11 rounded-lg px-3 text-sm font-black outline-none transition-all shadow-sm"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ProjectStatus }))}
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
              </select>
            </div>
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
            Launch Project
          </Button>
        </div>
      </form>
    </Modal>
  );
}
