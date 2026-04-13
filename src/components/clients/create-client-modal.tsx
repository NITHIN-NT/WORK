"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Client } from "@/hooks/use-clients";
import { Building2, User, Mail, Phone, ShieldCheck } from "lucide-react";
import { UserRole } from "@/types/user";

import { useToast } from "@/components/ui/toast";
import { isNotEmpty, validateEmail, validatePhone } from "@/lib/validation";

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (client: Omit<Client, 'id' | 'activeProjects' | 'totalLTV' | 'unpaidBalance' | 'lastContact'>) => void;
}

export function CreateClientModal({ isOpen, onClose, onSuccess }: CreateClientModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "Lead" as 'Active' | 'Inactive' | 'Lead',
    stakeholderRole: UserRole.CLIENT,
    accountManager: "Sarah Chen", // Default for now
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom Validation
    if (!isNotEmpty(formData.company)) {
      toast("Company name is required", "error");
      return;
    }
    if (!isNotEmpty(formData.name)) {
      toast("Contact name is required", "error");
      return;
    }
    if (!validateEmail(formData.email)) {
      toast("Please enter a valid email address", "error");
      return;
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      toast("Please enter a valid phone number", "error");
      return;
    }

    onSuccess(formData);
    onClose();
    setFormData({ 
      name: "", 
      company: "", 
      email: "", 
      phone: "", 
      status: "Lead", 
      stakeholderRole: UserRole.CLIENT,
      accountManager: "Sarah Chen" 
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Client">
      <form noValidate onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Building2 className="w-3 h-3" /> Company Name
            </label>
            <Input 
              required
              placeholder="e.g. Acme Corp" 
              className="bg-zinc-50 border-border focus:border-primary/50 text-foreground h-11 shadow-sm"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <User className="w-3 h-3" /> Primary Contact
            </label>
            <Input 
              required
              placeholder="e.g. Sarah Mitchell" 
              className="bg-zinc-50 border-border focus:border-primary/50 text-foreground h-11 shadow-sm"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Mail className="w-3 h-3" /> Email Address
          </label>
          <Input 
            required
            type="email"
            placeholder="contact@company.com" 
            className="bg-zinc-50 border-border focus:border-primary/50 text-foreground h-11 shadow-sm"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Phone className="w-3 h-3" /> Phone Number
            </label>
            <Input 
              placeholder="+1 (555) 000-0000" 
              className="bg-zinc-50 border-border focus:border-primary/50 text-foreground h-11 shadow-sm"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> Onboarding Status
            </label>
            <select 
              className="w-full bg-zinc-50 border border-border focus:border-primary/50 text-foreground h-11 rounded-lg px-3 text-sm font-black outline-none transition-all shadow-sm"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'Active' | 'Inactive' | 'Lead' }))}
            >
              <option value="Lead">Lead / Prospect</option>
              <option value="Active">Active Partner</option>
              <option value="Inactive">Inactive</option>
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
            Create Profile
          </Button>
        </div>
      </form>
    </Modal>
  );
}
