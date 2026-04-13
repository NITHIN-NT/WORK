"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, FileText, Briefcase, X } from 'lucide-react';

import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string;
  type: 'project' | 'task' | 'document';
  projectId?: string;
}

import { useProjects } from '@/hooks/use-projects';
import { useClients } from '@/hooks/use-clients';

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { projects } = useProjects();
  const { clients } = useClients();

  const toggle = useCallback(() => setIsOpen(open => !open), []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggle]);

  const results: SearchResult[] = [];
  
  if (query.trim()) {
    const searchLower = query.toLowerCase();
    
    // Search Projects
    projects.forEach(p => {
      if (p.name.toLowerCase().includes(searchLower)) {
        results.push({ id: p.id, title: p.name, type: 'project' });
      }
    });

    // Search Clients
    clients.forEach(c => {
      if (c.name.toLowerCase().includes(searchLower) || c.company.toLowerCase().includes(searchLower)) {
        results.push({ id: c.id, title: `${c.name} (${c.company})`, type: 'document' }); // Reusing 'document' icon for clients or I can add a client type
      }
    });
  }

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    if (result.type === 'project') {
      router.push(`/projects/${result.id}`);
    } else if (result.type === 'document') {
      router.push(`/clients`); // Client list
    }
  };

  return (
    <>
      <button 
        onClick={toggle}
        className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 rounded-xl bg-zinc-100/50 border border-border hover:bg-zinc-100 hover:border-zinc-300 transition-all text-zinc-500 hover:text-foreground w-full max-w-sm min-w-0 group shadow-sm overflow-hidden"
      >
        <Search className="h-4 w-4 shrink-0 group-hover:text-primary transition-colors" />
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-60 truncate">
          <span className="hidden xs:inline">Search database...</span>
          <span className="xs:hidden">Search...</span>
        </span>
        <kbd className="hidden lg:inline-flex ml-auto pointer-events-none h-5 select-none items-center gap-1 rounded bg-white px-2 font-mono text-[10px] font-black text-zinc-400 border border-border uppercase tracking-widest shadow-xs shrink-0">
          K
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh] p-4">
          <div 
            className="absolute inset-0 bg-white/5 backdrop-blur-2xl animate-in fade-in duration-500" 
            style={{ WebkitBackdropFilter: 'blur(30px)' }}
            onClick={() => setIsOpen(false)} 
          />
          <div 
            className="relative w-full max-w-2xl bg-white border border-border rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] animate-in zoom-in-95 duration-500 overflow-hidden"
          >
            <div className="p-6 border-b border-border bg-zinc-50/30 flex items-center gap-4">
              <Search className="h-6 w-6 text-primary" />
              <input 
                autoFocus
                placeholder="Search across all active projects and clients..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent border-none text-foreground focus:ring-0 p-0 flex-1 outline-none text-xl font-black tracking-tighter"
              />
              <button 
                onClick={() => setIsOpen(false)} 
                className="h-10 w-10 flex items-center justify-center bg-white border border-border rounded-xl text-zinc-400 hover:text-foreground shadow-sm transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-4 no-scrollbar">
              {query.trim() && results.length === 0 ? (
                <div className="py-12 text-center text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
                  No records found in database.
                </div>
              ) : (
                <div className="space-y-1.5 pl-1 pr-1">
                  {results.map((res) => (
                    <button
                      key={`${res.type}-${res.id}`}
                      onClick={() => handleSelect(res)}
                      className="w-full flex items-center gap-6 px-5 py-5 rounded-[1.5rem] hover:bg-zinc-50 transition-all text-left group border border-transparent hover:border-zinc-100"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-border flex items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                        {res.type === 'project' && <Briefcase className="h-5 w-5 text-blue-500" />}
                        {res.type === 'document' && <FileText className="h-5 w-5 text-emerald-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-black text-foreground group-hover:text-primary transition-colors tracking-tight">{res.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest leading-none">
                            {res.type === 'project' ? 'Workspace' : 'Client Profile'}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 bg-zinc-50/50 border-t border-border flex items-center gap-8 text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">
              <div className="flex items-center gap-3">
                <kbd className="px-2.5 py-1.5 rounded-xl bg-white border border-border shadow-sm text-xs text-foreground">⏎</kbd>
                <span>Select Item</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="px-2.5 py-1.5 rounded-xl bg-white border border-border shadow-sm text-xs text-foreground">Esc</kbd>
                <span>Close Relay</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
