"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Client } from "@/services/directory.service";
import { Building2, User, Mail, Phone, ShieldCheck } from "lucide-react";
import { UserRole } from "@/types/user";
import { useToast } from "@/components/ui/toast";
import { isInputPopulated, validateEmailIdentity, validateContactString } from "@/lib/validation";

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
    accountManager: "System Admin",
  });

  const dispatchClientRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isInputPopulated(formData.company)) {
      toast("Company name is required", "error");
      return;
    }
    if (!isInputPopulated(formData.name)) {
      toast("Contact name is required", "error");
      return;
    }
    if (!validateEmailIdentity(formData.email)) {
      toast("Valid email is required", "error");
      return;
    }
    if (formData.phone && !validateContactString(formData.phone)) {
      toast("Valid phone number is required", "error");
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
      accountManager: "System Admin" 
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Client">
      <form noValidate onSubmit={dispatchClientRegistration} className="space-y-10 py-4">
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
              <Building2 className="w-3.5 h-3.5 text-zinc-300" /> Company Name
            </label>
            <Input 
              required
              placeholder="e.g. Acme Corp" 
              className="bg-zinc-50 border-border focus:bg-white text-foreground h-12 rounded-xl shadow-none font-bold transition-all"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
              <User className="w-3.5 h-3.5 text-zinc-300" /> Primary Contact
            </label>
            <Input 
              required
              placeholder="e.g. Sarah Mitchell" 
              className="bg-zinc-50 border-border focus:bg-white text-foreground h-12 rounded-xl shadow-none font-bold transition-all"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
            <Mail className="w-3.5 h-3.5 text-zinc-300" /> Email Address
          </label>
          <Input 
            required
            type="email"
            placeholder="contact@entity.com" 
            className="bg-zinc-50 border-border focus:bg-white text-foreground h-12 rounded-xl shadow-none font-bold transition-all"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
              <Phone className="w-3.5 h-3.5 text-zinc-300" /> Phone Number
            </label>
            <Input 
              placeholder="+1 (555) 000-0000" 
              className="bg-zinc-50 border-border focus:bg-white text-foreground h-12 rounded-xl shadow-none font-bold transition-all"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" /> Status
            </label>
            <select 
              className="w-full bg-zinc-50 border border-border focus:bg-white text-foreground h-12 rounded-xl px-4 text-sm font-bold outline-none transition-all shadow-none appearance-none cursor-pointer"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'Active' | 'Inactive' | 'Lead' }))}
            >
              <option value="Lead">Lead / Prospect</option>
              <option value="Active">Active Partner</option>
              <option value="Inactive">Inactive</option>
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
            Save Client
          </Button>
        </div>
      </form>
    </Modal>
  );
}

