"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Shield } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { UserRole } from "@/types/user";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: string) => Promise<void>;
}

export function InviteUserModal({ isOpen, onClose, onInvite }: InviteUserModalProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Team Member");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast("Please enter a valid email address.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await onInvite(email, role);
      onClose();
      setEmail("");
      setRole("Team Member");
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
                className="w-full bg-zinc-50 border border-border focus:bg-white text-foreground h-12 rounded-xl pl-11 pr-4 text-sm font-bold outline-none transition-all shadow-none appearance-none cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isSubmitting}
              >
                {Object.values(UserRole).map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
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
            disabled={isSubmitting}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-2xl shadow-none transition-all"
          >
            {isSubmitting ? "Inviting..." : "Send Invitation"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
