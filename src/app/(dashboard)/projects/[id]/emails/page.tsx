"use client";

import { useState } from "react";
import { EmailComposer } from "@/components/email/email-composer";
import { EmailLog } from "@/types/email";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  Search, 
  Filter, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MOCK_EMAILS: EmailLog[] = [
  {
    id: '1', projectId: '1', to: ['client@acme.com'], subject: 'Project Proposal - Q2',
    body: '<p>Hi Team, attached is the updated proposal...</p>',
    status: 'Sent', sentAt: '2026-04-10T14:30:00Z', createdBy: 'Sarah'
  },
  {
    id: '2', projectId: '1', to: ['dev@acme.com'], subject: 'Technical Access Credentials',
    body: '<p>Following up on our meeting, here are the requested details...</p>',
    status: 'Sent', sentAt: '2026-04-05T09:15:00Z', createdBy: 'Alex'
  },
  {
    id: '3', projectId: '1', to: ['finance@acme.com'], subject: 'Invoice INV-2026-003',
    body: '<p>Please find the latest invoice for April milestone...</p>',
    status: 'Failed', error: 'SMTP connection timeout', createdBy: 'System'
  },
];

const statusIcons = {
  Sent: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  Failed: <AlertCircle className="w-4 h-4 text-rose-500" />,
  Draft: <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />,
};

export default function ProjectEmails() {
  const [showComposer, setShowComposer] = useState(false);

  return (
    <div className="relative min-h-[calc(100vh-120px)] space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
            Communication Log
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Outbound email history and client communications.</p>
        </div>
        
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 h-12 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
          onClick={() => setShowComposer(true)}
        >
          <Send className="w-4 h-4 mr-2" />
          Compose Message
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card p-5 rounded-3xl border border-border shadow-sm">
        <div className="relative flex-1 w-full max-w-sm group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search communications..." 
            className="pl-11 bg-zinc-50 border-border h-11 rounded-xl text-sm font-bold shadow-xs transition-all"
          />
        </div>
        <Button variant="outline" size="sm" className="w-full sm:w-auto border-border bg-white text-zinc-600 font-bold px-6 h-11 rounded-xl hover:bg-zinc-50">
          <Filter className="w-4 h-4 mr-2" />
          Status Filter
        </Button>
      </div>

      <div className="space-y-4">
        {MOCK_EMAILS.map((email) => (
          <Card key={email.id} className="bg-card border-border hover:border-primary/20 hover:shadow-lg transition-all group rounded-2xl overflow-hidden">
            <CardContent className="p-5 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-zinc-50 border border-border flex items-center justify-center shrink-0 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                  <Mail className="h-6 w-6 text-zinc-400 group-hover:text-primary transition-colors duration-500" />
                </div>
                
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-black text-foreground group-hover:text-primary transition-colors truncate tracking-tight">
                      {email.subject}
                    </h4>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] whitespace-nowrap">
                      {email.sentAt ? new Date(email.sentAt).toLocaleDateString() : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <span className="text-primary/70">Recipient:</span>
                    <span className="text-foreground">{email.to.join(', ')}</span>
                    <span className="text-zinc-300 mx-1">/</span>
                    <span className="text-primary/70">Author:</span>
                    <span className="text-foreground">{email.createdBy}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 border-t sm:border-t-0 pt-6 sm:pt-0 border-border/50">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-zinc-50 border border-border">
                    {statusIcons[email.status as keyof typeof statusIcons]}
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      email.status === 'Sent' ? "text-emerald-500" : email.status === 'Failed' ? "text-rose-500" : "text-zinc-500"
                    )}>
                      {email.status}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {email.status === 'Failed' && (
                <div className="mt-6 px-5 py-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500/80 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  Transmission Fault: {email.error}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Floating Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/20 backdrop-blur-xl" onClick={() => setShowComposer(false)} />
          <div className="relative w-full max-w-2xl h-[90vh] animate-in zoom-in-95 duration-300">
            <EmailComposer 
              onClose={() => setShowComposer(false)} 
              onSend={(data) => {
                console.log('Sending email:', data);
                setShowComposer(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
