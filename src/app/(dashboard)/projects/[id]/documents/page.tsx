"use client";

import { useState } from "react";
import { DocumentEditor } from "@/components/documents/document-editor";
import { ProjectDocument } from "@/types/document";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileText, Globe, Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";

const MOCK_DOCS: ProjectDocument[] = [
  { 
    id: '1', projectId: '1', title: 'Acme E-commerce Proposal', type: 'Proposal', 
    content: '<h2>Project Proposal</h2><p>Overview of the e-commerce goals...</p>',
    isPublic: true, sharedLinkToken: 'token123',
    createdAt: '2026-03-20', updatedAt: '2026-04-10', createdBy: 'Sarah' 
  },
  { 
    id: '2', projectId: '1', title: 'Technical Architecture', type: 'Technical Documentation', 
    content: '<h2>Architecture Diagram</h2><p>Details about the system design...</p>',
    isPublic: false,
    createdAt: '2026-04-05', updatedAt: '2026-04-05', createdBy: 'Alex' 
  },
  { 
    id: '3', projectId: '1', title: 'Client Meeting Summary', type: 'Meeting Summary', 
    content: '<h2>Meeting Notes - April 12</h2><p>Discussed dashboard widgets and milestones.</p>',
    isPublic: false,
    createdAt: '2026-04-12', updatedAt: '2026-04-12', createdBy: 'Sarah' 
  },
];

export default function ProjectDocuments() {
  const params = useParams();
  const projectId = params.id as string;

  const [view, setView] = useState<'list' | 'edit'>('list');
  const [activeDoc, setActiveDoc] = useState<Partial<ProjectDocument> | null>(null);

  const handleEdit = (doc: ProjectDocument) => {
    setActiveDoc(doc);
    setView('edit');
  };

  const handleCreate = () => {
    setActiveDoc({ title: "New Document", type: "Technical Documentation" });
    setView('edit');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
            Project Documents
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Proposals, agreements, and technical specs.</p>
        </div>
        
        {view === 'list' && (
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 h-12 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
            onClick={handleCreate}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Document
          </Button>
        )}
      </div>

      {view === 'list' ? (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-card p-5 rounded-3xl border border-border shadow-sm">
            <div className="relative flex-1 w-full max-w-sm group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search documents..." 
                className="pl-11 bg-zinc-50 border-border h-11 rounded-xl text-sm font-bold shadow-xs transition-all"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {['All', 'Proposals', 'Technical', 'Legal'].map(f => (
                <Button key={f} variant="outline" size="sm" className="border-border bg-white text-zinc-500 font-bold px-4 h-9 rounded-xl hover:bg-zinc-50 hover:text-foreground">
                  {f}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {MOCK_DOCS.map((doc) => (
              <Card 
                key={doc.id} 
                onClick={() => handleEdit(doc)}
                className="bg-card border-border hover:border-primary/20 hover:shadow-xl transition-all cursor-pointer group rounded-[2rem] overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-100 border border-border flex items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                      <FileText className="h-6 w-6 text-zinc-400 group-hover:text-primary transition-transform duration-150" />
                    </div>
                    {doc.isPublic ? (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest shadow-sm shadow-emerald-500/5">
                        <Globe className="w-3.5 h-3.5" /> Shared
                      </div>
                    ) : (
                      <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-100/50 px-3 py-1 rounded-xl border border-border">
                        Internal
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-1 mb-1">
                    {doc.title}
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-6">
                    {doc.type}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-border/50 text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-zinc-300" /> {doc.updatedAt}</span>
                    <span className="flex items-center gap-1.5"><User className="w-3 h-3 text-zinc-300" /> {doc.createdBy}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <DocumentEditor 
          projectId={projectId}
          initialDocument={activeDoc || {}} 
          onSave={(data) => {
            console.log('Save doc:', data);
            setView('list');
          }} 
          onBack={() => setView('list')}
        />
      )}
    </div>
  );
}
