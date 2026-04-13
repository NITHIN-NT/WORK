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
import { logActivity } from "@/lib/activity-store";
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

const MOCK_HISTORY = [
  { user: 'Sarah Chen', action: 'Modified Content', time: '2m ago' },
  { user: 'System Alpha', action: 'Auto-saved', time: '15m ago' },
  { user: 'Sarah Chen', action: 'Initialized Doc', time: '1h ago' },
];

export function DocumentEditor({ projectId, initialDocument, onSave, onBack }: DocumentEditorProps) {
  const [title, setTitle] = useState(initialDocument?.title || "Untitled Document");
  const [type, setType] = useState<DocumentType>(initialDocument?.type || 'Technical Documentation');
  const [content, setContent] = useState(initialDocument?.content || "");
  const [isPublic, setIsPublic] = useState(initialDocument?.isPublic || false);
  const { user } = useAuthStore();

  const handleSave = async () => {
    onSave({ title, type, content, isPublic });
    
    if (user) {
      await logActivity({
        projectId,
        type: 'document_uploaded',
        title: 'Document Updated',
        description: `Documentation "${title}" was modified.`,
        userId: user.uid,
        userName: user.displayName || 'User',
        metadata: { docTitle: title, type }
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-sm sticky top-0 z-10"
        style={{ WebkitBackdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-zinc-500 hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-0.5">
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-none text-xl font-black text-foreground focus:ring-0 p-0 w-full min-w-[200px] tracking-tight"
            />
            <div className="flex items-center gap-2">
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as DocumentType)}
                className="bg-zinc-100/50 border-none text-[10px] font-black uppercase tracking-widest text-zinc-500 focus:ring-0 rounded px-1.5 cursor-pointer hover:bg-zinc-100 transition-colors"
              >
                {DOCUMENT_TYPES.map(t => <option key={t} value={t} className="bg-white text-foreground">{t}</option>)}
              </select>
              <div className="h-1 w-1 rounded-full bg-zinc-300" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Last Edit: 2m ago
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-border bg-white text-zinc-600 font-bold hover:bg-zinc-50" onClick={() => setIsPublic(!isPublic)}>
            {isPublic ? <Globe className="h-4 w-4 mr-2 text-emerald-500" /> : <Lock className="h-4 w-4 mr-2 text-amber-500" />}
            {isPublic ? "Public Access" : "Internal Only"}
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black shadow-lg shadow-primary/20" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <NoteEditor content={content} onChange={setContent} />
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-50 p-6 rounded-xl border border-border h-fit shadow-xs">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Quick Actions</h4>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start border-border bg-white text-zinc-600 hover:text-foreground hover:border-primary/20 transition-all font-bold">
                <FileText className="h-4 w-4 mr-3 text-blue-500" />
                Export as PDF
              </Button>
              <Button variant="outline" className="w-full justify-start border-border bg-white text-zinc-600 hover:text-foreground hover:border-primary/20 transition-all font-bold">
                <Share2 className="h-4 w-4 mr-3 text-emerald-500" />
                Share Document
              </Button>
              <Button variant="ghost" className="w-full justify-start text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold">
                <Trash2 className="h-4 w-4 mr-3" />
                Delete Permanently
              </Button>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border h-fit shadow-xs">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center justify-between">
              History
              <History className="h-3 w-3" />
            </h4>
            <div className="space-y-4">
              {MOCK_HISTORY.map((h, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i < MOCK_HISTORY.length - 1 && (
                    <div className="absolute left-[7px] top-4 bottom-[-16px] w-px bg-border" />
                  )}
                  <div className="h-4 w-4 rounded-full bg-zinc-100 border border-border flex-shrink-0 relative z-10" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-foreground">{h.user}</p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {h.action} · <span className="text-zinc-400">{h.time}</span>
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full text-[10px] text-zinc-500 hover:text-foreground font-black uppercase mt-2 tracking-widest">
                View Full Logs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
