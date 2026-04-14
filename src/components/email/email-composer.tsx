"use client";

import { useState } from 'react';
import { NoteEditor } from "@/components/notes/note-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  X, 
  Paperclip, 
  Mail,
  Users
} from "lucide-react";


interface EmailComposerProps {
  onSend: (email: { to: string; subject: string; body: string }) => void;
  onClose: () => void;
  defaultRecipient?: string;
  defaultSubject?: string;
}

export function EmailComposer({ onSend, onClose, defaultRecipient, defaultSubject }: EmailComposerProps) {
  const [to, setTo] = useState(defaultRecipient || "");
  const [subject, setSubject] = useState(defaultSubject || "");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    setIsSending(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    onSend({ to, subject, body });
    setIsSending(false);
  };

  return (
    <div 
      className="flex flex-col h-full bg-white/98 backdrop-blur-3xl border border-border rounded-sm shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-150"
      style={{ WebkitBackdropFilter: 'blur(60px)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-sm bg-primary/10 flex items-center justify-center">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground tracking-tight leading-none">New Communication</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Direct Message</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-foreground hover:bg-zinc-100 rounded-lg">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Inputs */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-12 gap-6 items-center">
          <label className="col-span-1 text-[10px] font-black text-zinc-400 uppercase tracking-widest">To</label>
          <div className="col-span-11 relative">
            <Input 
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="bg-zinc-100/30 border-border pl-10 text-sm font-bold placeholder:text-zinc-400 focus:ring-2 focus:ring-primary/10 transition-all h-11"
            />
            <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 items-center">
          <label className="col-span-1 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sub</label>
          <div className="col-span-11">
            <Input 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Regarding project milestones..."
              className="bg-zinc-100/30 border-border text-sm font-bold placeholder:text-zinc-400 focus:ring-2 focus:ring-primary/10 transition-all h-11"
            />
          </div>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto px-6 min-h-[300px] no-scrollbar">
        <NoteEditor 
          content={body} 
          onChange={setBody} 
        />
      </div>

      {/* Footer / Actions */}
      <div className="p-6 border-t border-border flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="h-11 w-11 border-border bg-white text-zinc-400 hover:text-primary hover:border-primary/20 transition-all rounded-sm shadow-sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <span className="text-[10px] items-center text-zinc-400 font-black uppercase tracking-widest bg-white border border-border px-3 py-1.5 rounded-lg shadow-xs">
            0 Attachments
          </span>
        </div>
        
        <div className="flex gap-4">
          <Button variant="ghost" onClick={onClose} className="text-zinc-500 hover:text-rose-500 font-bold">
            Discard
          </Button>
          <Button 
            onClick={handleSend}
            disabled={!to || isSending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 shadow-xl shadow-primary/20 h-11 rounded-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSending ? (
              <span className="flex items-center gap-2">
                <div className="h-3 w-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Dispatching...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Process Send
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
