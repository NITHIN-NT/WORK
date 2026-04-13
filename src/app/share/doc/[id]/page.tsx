"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProjectDocument } from "@/types/document";
import { FileText, Download, Calendar, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";


// Mock fetching logic for public viewer
const getPublicDoc = (id: string): ProjectDocument | null => {
  return {
    id,
    projectId: 'p1',
    title: 'Acme E-commerce Proposal',
    type: 'Proposal',
    content: '<h1>Project Proposal</h1><p>This is a shared document view. In a real scenario, this would fetch from Firestore using the public token.</p><h2>Overview</h2><p>Acme Corp is looking to modernize their digital presence...</p>',
    isPublic: true,
    createdAt: '2026-03-20',
    updatedAt: '2026-04-12',
    createdBy: 'Sarah Chen'
  };
};

export default function SharedDocumentViewer() {
  const params = useParams();
  const id = params.id as string;
  const [doc, setDoc] = useState<ProjectDocument | null>(null);

  useEffect(() => {
    // Simulate API call
    setDoc(getPublicDoc(id));
  }, [id]);

  if (!doc) return <div className="h-screen flex items-center justify-center bg-background text-zinc-500 font-black uppercase tracking-widest text-[10px]">Synchronizing document context...</div>;

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10 selection:text-primary">
      {/* Public Branding Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-black text-foreground tracking-tight uppercase">Workspace Portal</span>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-6 h-10 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
            <Download className="h-4 w-4 mr-2" />
            Secure Export
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-36 pb-24">
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 w-fit px-3 py-1 rounded-lg border border-primary/10">
              <span>{doc.type}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-zinc-500">Public Access Portal</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
              {doc.title}
            </h1>
            <div className="flex flex-wrap gap-8 pt-6 border-t border-border">
              <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Last Revision: {doc.updatedAt}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <User className="w-4 h-4 text-emerald-500" />
                <span>Prepared by: {doc.createdBy}</span>
              </div>
            </div>
          </div>

          <article 
            className="prose prose-zinc max-w-none mt-16 bg-white rounded-[2rem] p-8 sm:p-16 border border-border shadow-2xl shadow-zinc-200/50"
            dangerouslySetInnerHTML={{ __html: doc.content }}
          />
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-6 py-16 border-t border-border mt-12 text-center">
        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] mb-2 font-mono">
          End of Document context
        </p>
        <p className="text-[10px] text-zinc-300 font-black uppercase tracking-widest">
          Securely delivered via Project Workspace OS © 2026
        </p>
      </footer>
    </div>
  );
}
