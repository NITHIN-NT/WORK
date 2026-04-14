"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, FileText, Briefcase, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProjects } from '@/hooks/use-projects';
import { useClients } from '@/hooks/use-clients';

interface SearchResult {
  id: string;
  title: string;
  type: 'project' | 'task' | 'document';
  projectId?: string;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { projects } = useProjects();
  const { clients } = useClients();

  const handleSearchToggle = useCallback(() => setIsOpen(open => !open), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSearchToggle();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSearchToggle]);

  const results: SearchResult[] = [];
  
  if (query.trim()) {
    const searchLower = query.toLowerCase();
    
    projects.forEach(p => {
      if (p.name.toLowerCase().includes(searchLower)) {
        results.push({ id: p.id, title: p.name, type: 'project' });
      }
    });

    clients.forEach(c => {
      if (c.name.toLowerCase().includes(searchLower) || c.company.toLowerCase().includes(searchLower)) {
        results.push({ id: c.id, title: `${c.name} (${c.company})`, type: 'document' });
      }
    });
  }

  const navigateToResult = (result: SearchResult) => {
    setIsOpen(false);
    if (result.type === 'project') {
      router.push(`/projects/${result.id}`);
    } else if (result.type === 'document') {
      router.push(`/clients`);
    }
  };

  return (
    <>
      <button 
        onClick={handleSearchToggle}
        className="flex items-center gap-4 px-4 py-2 rounded-xl bg-zinc-100 border border-border hover:border-zinc-300 transition-all text-zinc-500 hover:text-foreground w-full max-w-sm group"
      >
        <Search className="h-4 w-4 shrink-0 transition-colors group-hover:text-primary" />
        <span className="text-[11px] font-black uppercase tracking-[0.15em] opacity-60 truncate">
          Search projects...
        </span>
        <kbd className="hidden lg:inline-flex ml-auto pointer-events-none h-5 select-none items-center gap-1 rounded bg-white px-2 font-mono text-[10px] font-black text-zinc-300 border border-border uppercase tracking-widest h-full">
          CMD K
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] p-4">
          <div 
            className="absolute inset-0 bg-white/20 backdrop-blur-md" 
            onClick={() => setIsOpen(false)} 
          />
          <div 
            className="relative w-full max-w-2xl bg-white border border-border rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-border/50 flex items-center gap-4">
              <Search className="h-6 w-6 text-primary" />
              <input 
                autoFocus
                placeholder="Search everything (projects, clients, invoices)..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent border-none text-foreground focus:ring-0 p-0 flex-1 outline-none text-xl font-bold tracking-tight"
              />
              <button 
                onClick={() => setIsOpen(false)} 
                className="h-10 w-10 flex items-center justify-center bg-zinc-50 border border-border rounded-xl text-zinc-400 hover:text-foreground transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-4 no-scrollbar">
              {query.trim() && results.length === 0 ? (
                <div className="py-16 text-center text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px]">
                  No results found
                </div>
              ) : (
                <div className="space-y-1">
                  {results.map((res) => (
                    <button
                      key={`${res.type}-${res.id}`}
                      onClick={() => navigateToResult(res)}
                      className="w-full flex items-center gap-6 px-5 py-4 rounded-2xl hover:bg-zinc-50 transition-all text-left group"
                    >
                      <div className="h-12 w-12 rounded-xl bg-zinc-100 border border-border flex items-center justify-center group-hover:bg-white group-hover:border-primary/20 transition-all">
                        {res.type === 'project' && <Briefcase className="h-5 w-5 text-zinc-500" />}
                        {res.type === 'document' && <FileText className="h-5 w-5 text-zinc-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{res.title}</p>
                        <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1 block">
                          {res.type === 'project' ? 'Project' : 'Client'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border/50 flex items-center gap-8 text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">
              <div className="flex items-center gap-3">
                <kbd className="px-2 py-1 rounded-md bg-zinc-100 border border-border text-[9px]">ENTER</kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="px-2 py-1 rounded-md bg-zinc-100 border border-border text-[9px]">ESC</kbd>
                <span>Close</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

