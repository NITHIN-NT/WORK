"use client";

import { useState } from 'react';
import { NoteEditor } from "@/components/notes/note-editor";
import { ProjectDocument, DocumentType } from "@/types/document";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Share2, 
  Save, 
  History, 
  ChevronLeft,
  Globe,
  Lock,
  Trash2
} from "lucide-react";
import { useAuthStore } from "@/store/user";

interface DocumentEditorProps {
  projectId: string;
  initialDocument?: Partial<ProjectDocument>;
  onSave: (doc: Partial<ProjectDocument>) => void;
  onBack?: () => void;
}

const DOCUMENT_TYPES: DocumentType[] = [
  'Proposal', 
  'Agreement', 
  'Requirement Specification', 
  'Meeting Summary', 
  'Technical Documentation', 
  'Internal Documentation'
];

const MOCK_HISTORY_LOG = [
  { user: 'Sarah Chen', action: 'Modified Content', time: '2m ago' },
  { user: 'System Relay', action: 'Auto-saved', time: '15m ago' },
  { user: 'Sarah Chen', action: 'Initialized Protocol', time: '1h ago' },
];

export function DocumentEditor({ initialDocument, onSave, onBack }: DocumentEditorProps) {
  const [title, setTitle] = useState(initialDocument?.title || "Untitled Protocol");
  const [type, setType] = useState<DocumentType>(initialDocument?.type || 'Technical Documentation');
  const [content, setContent] = useState(initialDocument?.content || "");
  const [isPublic, setIsPublic] = useState(initialDocument?.isPublic || false);
  useAuthStore();

  const synchronizeChanges = async () => {
    onSave({ title, type, content, isPublic });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-white p-6 rounded-3xl border border-border shadow-none sticky top-0 z-10 transition-all">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-zinc-300 hover:text-foreground hover:bg-zinc-50 rounded-xl transition-all">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="space-y-1">
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-none text-2xl font-bold text-foreground focus:ring-0 p-0 w-full min-w-[300px] tracking-tight placeholder:text-zinc-200"
              placeholder="Protocol Title..."
            />
            <div className="flex items-center gap-3">
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as DocumentType)}
                className="bg-zinc-50 border-none text-[10px] font-black uppercase tracking-widest text-zinc-400 focus:ring-0 rounded-lg px-2 py-0.5 cursor-pointer hover:bg-zinc-100 transition-colors"
              >
                {DOCUMENT_TYPES.map(t => <option key={t} value={t} className="bg-white text-foreground">{t}</option>)}
              </select>
              <div className="h-1 w-1 rounded-full bg-zinc-200" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                Temporal Delta: 2m ago
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="border-border bg-white text-zinc-500 font-bold hover:bg-zinc-50 rounded-xl h-12 px-6" onClick={() => setIsPublic(!isPublic)}>
            {isPublic ? <Globe className="h-4 w-4 mr-3 text-primary" /> : <Lock className="h-4 w-4 mr-3 text-zinc-300" />}
            {isPublic ? "Public Protocol" : "Restricted Node"}
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white font-black h-12 px-8 rounded-xl shadow-none transition-all" onClick={synchronizeChanges}>
            <Save className="h-4 w-4 mr-3" />
            Synchronize
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2rem] border border-border shadow-none overflow-hidden min-h-[600px] transition-all">
            <NoteEditor content={content} onChange={setContent} />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-zinc-50/50 p-8 rounded-3xl border border-border h-fit">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6 px-1">Control Operations</h4>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start border-border bg-white text-zinc-600 hover:text-foreground hover:border-primary transition-all font-bold h-12 rounded-xl px-5">
                <FileText className="h-4 w-4 mr-4 text-zinc-400" />
                Export Ledger (PDF)
              </Button>
              <Button variant="outline" className="w-full justify-start border-border bg-white text-zinc-600 hover:text-foreground hover:border-primary transition-all font-bold h-12 rounded-xl px-5">
                <Share2 className="h-4 w-4 mr-4 text-zinc-400" />
                Relay Link
              </Button>
              <div className="pt-4 mt-4 border-t border-border">
                <Button variant="ghost" className="w-full justify-start text-rose-500 hover:text-white hover:bg-rose-500 font-bold h-12 rounded-xl px-5 transition-all">
                  <Trash2 className="h-4 w-4 mr-4" />
                  Purge Record
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-border h-fit">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-8 flex items-center justify-between px-1">
              Forensic Log
              <History className="h-4 w-4" />
            </h4>
            <div className="space-y-6">
              {MOCK_HISTORY_LOG.map((h, i) => (
                <div key={i} className="flex gap-5 relative group">
                  {i < MOCK_HISTORY_LOG.length - 1 && (
                    <div className="absolute left-[9px] top-6 bottom-[-24px] w-px bg-zinc-100 group-hover:bg-primary/20 transition-all" />
                  )}
                  <div className="h-[18px] w-[18px] rounded-full border-2 border-zinc-200 bg-white flex-shrink-0 relative z-10 transition-all group-hover:border-primary" />
                  <div className="space-y-1.5 pb-2">
                    <p className="text-[13px] font-bold text-foreground tracking-tight">{h.user}</p>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      {h.action} <span className="text-zinc-300 px-1">|</span> {h.time}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full text-[10px] text-zinc-400 hover:text-foreground font-black uppercase mt-6 tracking-widest transition-all">
                Audit Full Protocol Log
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
