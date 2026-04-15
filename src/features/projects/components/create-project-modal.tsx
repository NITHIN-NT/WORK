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

import { useOptions } from "@/hooks/use-options";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'tasksCount'>) => void;
}

export function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const { clients } = useClients();
  const { toast } = useToast();
  const { getByCategory, loading: loadingOptions } = useOptions();
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    clientId: "",
    status: "" as ProjectStatus,
    deadline: "",
  });

  const statuses = getByCategory('project_status');

  // No longer using synchronous useEffect for defaulting to avoid cascading renders

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
    const finalData = {
      ...formData,
      status: formData.status || (statuses[0]?.value as ProjectStatus) || "Planning"
    };

    onSuccess(finalData);
    onClose();
    // Default back to first status
    setFormData({ 
      name: "", 
      client: "", 
      clientId: "", 
      status: (statuses[0]?.value as ProjectStatus) || "Planning", 
      deadline: "" 
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form noValidate onSubmit={handleCreateProject} className="space-y-10 py-4">
        {/* ... existing fields ... */}
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
              <Target className="w-4 h-4 text-zinc-300" /> Project Name
            </label>
            <Input 
              required
              placeholder="e.g. Website Redesign" 
              className="font-black"
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
              className="w-full glass rounded-xl px-6 h-14 text-sm font-black text-white hover:bg-white/5 outline-none transition-all appearance-none cursor-pointer"
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
                className="font-black"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
                <Briefcase className="w-4 h-4 text-zinc-300" /> Status
              </label>
              <select 
                className="w-full glass rounded-xl px-6 h-14 text-sm font-black text-white hover:bg-white/5 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50"
                value={formData.status || (statuses[0]?.value as ProjectStatus) || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ProjectStatus }))}
                disabled={loadingOptions}
              >
                {loadingOptions ? (
                   <option>Synchronizing...</option>
                ) : (
                  statuses.map(s => (
                    <option key={s.id} value={s.value}>{s.label}</option>
                  ))
                )}
              </select>
            </div>
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
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
}

