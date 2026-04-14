"use client";

import { useState } from "react";
import { NoteEditor } from "@/components/notes/note-editor";
import { Button } from "@/components/ui/button";
import { Download, Save, History, FileText, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';
import { NotePDF } from "@/lib/pdf/note-pdf";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

type NoteType = 'internal' | 'requirements';

export default function ProjectNotes() {
  const [activeTab, setActiveTab] = useState<NoteType>('requirements');
  const [internalNote, setInternalNote] = useState('<h2>Internal Project Notes</h2><p>Restricted to team members only.</p>');
  const [requirementsNote, setRequirementsNote] = useState('<h1>Client Requirements</h1><p>Key feature list and project scope definitions...</p>');

  const handleSave = () => {
    console.log("Saving notes...");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Workspace Notes</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Documentation and requirement tracking.</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="border-border bg-white text-zinc-600 font-bold hover:bg-zinc-50 px-6 h-11 rounded-sm shadow-sm transition-all" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          
          <PDFDownloadLink
            document={
              <NotePDF 
                title={activeTab === 'requirements' ? "Client Requirements" : "Internal Notes"} 
                content={activeTab === 'requirements' ? requirementsNote : internalNote} 
                projectName="Acme Corp E-commerce"
              />
            }
            fileName={`${activeTab === 'requirements' ? 'requirements' : 'internal'}-notes.pdf`}
          >
            {({ loading }) => (
              <Button 
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 h-11 rounded-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
              >
                <Download className="w-4 h-4 mr-2" />
                {loading ? 'Preparing...' : 'Export PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <div className="bg-zinc-100/50 p-1.5 rounded-sm flex gap-1.5 w-fit border border-border shadow-sm">
        <button
          onClick={() => setActiveTab('requirements')}
          className={cn(
            "flex items-center gap-2 px-8 py-2.5 rounded-sm text-sm font-black uppercase tracking-widest transition-all",
            activeTab === 'requirements' 
              ? "bg-white text-foreground shadow-md border border-border" 
              : "text-zinc-500 hover:text-foreground hover:bg-white/50"
          )}
        >
          <FileText className={cn("w-4 h-4", activeTab === 'requirements' ? "text-primary" : "text-zinc-400")} />
          Requirements
        </button>
        <button
          onClick={() => setActiveTab('internal')}
          className={cn(
            "flex items-center gap-2 px-8 py-2.5 rounded-sm text-sm font-black uppercase tracking-widest transition-all",
            activeTab === 'internal' 
              ? "bg-white text-foreground shadow-md border border-border" 
              : "text-zinc-500 hover:text-foreground hover:bg-white/50"
          )}
        >
          <Lock className={cn("w-4 h-4", activeTab === 'internal' ? "text-amber-500" : "text-zinc-400")} />
          Team Notes
        </button>
      </div>

      <div className="relative">
        {activeTab === 'requirements' ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <NoteEditor 
              content={requirementsNote} 
              onChange={setRequirementsNote}
            />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <NoteEditor 
              content={internalNote} 
              onChange={setInternalNote}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-8 pt-8 border-t border-border">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Last Modified</span>
          <span className="text-sm font-black text-foreground mt-1">2 hours ago by Sarah</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Status</span>
          <span className="text-sm font-black text-primary mt-1">Draft - In Review</span>
        </div>
        <Button variant="ghost" size="sm" className="ml-auto text-zinc-500 hover:text-foreground hover:bg-zinc-100 font-bold px-4 h-10 rounded-sm transition-all">
          <History className="w-4 h-4 mr-2" />
          Version History
        </Button>
      </div>
    </div>
  );
}
