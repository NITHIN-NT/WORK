"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Shield } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useOptions } from "@/hooks/use-options";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: string) => Promise<void>;
}

export function InviteUserModal({ isOpen, onClose, onInvite }: InviteUserModalProps) {
  const { toast } = useToast();
  const { getByCategory, loading: loadingOptions } = useOptions();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = getByCategory('user_role');

  // Set default role once options are loaded
  useEffect(() => {
    if (roles.length > 0 && !role) {
      setRole(roles[0].value);
    }
  }, [roles, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast("Please enter a valid email address.", "error");
      return;
    }
    if (!role) {
      toast("Please select a role protocol.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await onInvite(email, role);
      onClose();
      setEmail("");
    } catch {
      toast("Failed to invite user.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite New Member">
      <form onSubmit={handleSubmit} className="space-y-8 py-4">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
              <Mail className="w-3.5 h-3.5 text-zinc-300" /> Email Address
            </label>
            <Input 
              type="email"
              placeholder="e.g. jane@company.com" 
              className="bg-zinc-50 border-border h-12 rounded-xl shadow-none font-bold focus:bg-white transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] flex items-center gap-2 pl-1">
               Role Assignment
            </label>
            <div className="relative">
              <Shield className="w-3.5 h-3.5 text-zinc-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select 
                className="w-full bg-zinc-50 border border-border focus:bg-white text-foreground h-12 rounded-xl pl-11 pr-4 text-sm font-bold outline-none transition-all shadow-none appearance-none cursor-pointer disabled:opacity-50"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isSubmitting || loadingOptions}
              >
                {loadingOptions ? (
                  <option>Loading protocols...</option>
                ) : (
                  roles.map(r => (
                    <option key={r.id} value={r.value}>{r.label}</option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6 flex gap-6">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 text-zinc-400 font-bold hover:text-foreground h-14 rounded-2xl transition-all"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || loadingOptions}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-2xl shadow-none transition-all"
          >
            {isSubmitting ? "Inviting..." : "Send Invitation"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
