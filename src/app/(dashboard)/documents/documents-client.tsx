"use client";

import { Button } from "@/components/ui/button";
import { FolderOpen, Search, Filter, Download, FileText, Plus, Globe, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";

const GLOBAL_DOCS = [
  { id: '1', title: 'Acme Proposal', project: 'E-commerce', type: 'Proposal', updatedAt: '2026-04-10', shared: true, projectId: 'p1' },
  { id: '2', title: 'Technical Arch', project: 'Dashboard', type: 'Technical', updatedAt: '2026-04-05', shared: false, projectId: 'p2' },
  { id: '3', title: 'Nexus Agreement', project: 'Nexus API', type: 'Agreement', updatedAt: '2026-04-12', shared: true, projectId: 'p3' },
  { id: '4', title: 'Meeting Notes', project: 'Redesign', type: 'Meeting', updatedAt: '2026-04-13', shared: false, projectId: 'p4' },
];

export default function GlobalDocuments() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground mb-1">Documents</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Manage your files and documents across all projects.</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="border-border bg-white text-zinc-600 font-bold hover:bg-zinc-50 h-11 px-6 rounded-xl transition-all">
            <FolderOpen className="w-4 h-4 mr-2" />
            Archive
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 h-11 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
            <Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card border-border shadow-sm group hover:border-primary/20 transition-all rounded-3xl overflow-hidden">
          <CardContent className="p-6 flex items-center gap-5">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Shared Files</p>
              <p className="text-2xl font-black text-foreground tracking-tight">42 docs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm group hover:border-emerald-500/20 transition-all rounded-3xl overflow-hidden">
          <CardContent className="p-6 flex items-center gap-5">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Links</p>
              <p className="text-2xl font-black text-foreground tracking-tight">12 shared</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm group hover:border-secondary/20 transition-all rounded-3xl overflow-hidden">
          <CardContent className="p-6 flex items-center gap-5">
            <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
              <Download className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Storage Used</p>
              <p className="text-2xl font-black text-foreground tracking-tight">256 MB</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search documents..." 
            className="pl-11 bg-white border-border h-11 rounded-xl text-sm font-bold shadow-xs focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <Button variant="outline" className="border-border bg-white text-zinc-600 font-bold h-11 px-6 rounded-xl hover:bg-zinc-50">
          <Filter className="w-4 h-4 mr-2" />
          Categories
        </Button>
      </div>

      <div className="grid gap-3">
        {GLOBAL_DOCS.map((doc) => (
          <Link href={`/projects/${doc.projectId}/documents`} key={doc.id}>
            <div className="group flex items-center justify-between p-5 bg-card border border-border rounded-2xl hover:bg-zinc-50/50 hover:border-primary/20 hover:shadow-md transition-all">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-xl bg-zinc-50 border border-border flex items-center justify-center group-hover:bg-white transition-all">
                  <FileText className={cn("w-5 h-5 transition-colors", doc.shared ? "text-primary" : "text-zinc-400")} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-foreground group-hover:text-primary transition-colors tracking-tight">{doc.title}</h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{doc.project}</span>
                    <div className="h-1 w-1 rounded-full bg-zinc-300" />
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{doc.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Last Updated</p>
                  <p className="text-xs font-black text-foreground mt-2">{doc.updatedAt}</p>
                </div>
                {doc.shared && (
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
                    <Globe className="w-4 h-4 text-emerald-500" />
                  </div>
                )}
                <ArrowUpRight className="w-5 h-5 text-zinc-300 group-hover:text-primary transition-all mr-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
