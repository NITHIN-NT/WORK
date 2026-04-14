"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectDocument } from "@/types/document";
import { FileText, Download, Calendar, User, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export default function SharedDocumentViewer() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [doc, setDoc] = useState<ProjectDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoc() {
      try {
        // Attempt to fetch from the specific project's documents if we had the context, 
        // but since this is a public share route, we'd typically use a public access token 
        // or a dedicated 'shared_docs' collection.
        // For now, we remove the dummy data and attempt a direct fetch if possible, 
        // otherwise show the proper empty state.
        setLoading(true);
        // Note: Real implementation would require a public access strategy
        setDoc(null); 
      } catch (error) {
        console.error("Error fetching shared document:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDoc();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-sm bg-primary/10 flex items-center justify-center animate-pulse">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest animate-pulse">Synchronizing document context...</p>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="h-screen flex items-center justify-center bg-background px-6">
        <EmptyState 
          icon={AlertCircle}
          title="Document not found"
          description="The document you are looking for might have been moved, deleted, or you might not have permission to view it."
          action={{
            label: "Go to Dashboard",
            onClick: () => router.push("/")
          }}
          className="max-w-md w-full border-none bg-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10 selection:text-primary">
      {/* Public Branding Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-sm bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-black text-foreground tracking-tight uppercase">Workspace Portal</span>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-6 h-10 rounded-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
            <Download className="h-4 w-4 mr-2" />
            Secure Export
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
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
            className="prose prose-zinc max-w-none mt-16 bg-white rounded-md p-8 sm:p-16 border border-border shadow-2xl shadow-zinc-200/50"
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
