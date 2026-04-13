"use client";

import { CalendarView } from "@/components/calendar/calendar-view";
import { Button } from "@/components/ui/button";
import { Filter, List } from "lucide-react";

const MOCK_EVENTS = [
  { id: '1', title: 'Auth Implementation', date: new Date(2026, 3, 10), type: 'task' as const },
  { id: '2', title: 'Design Review', date: new Date(2026, 3, 15), type: 'meeting' as const },
  { id: '3', title: 'Phase 1 Delivery', date: new Date(2026, 3, 20), type: 'milestone' as const },
  { id: '4', title: 'Client Meeting', date: new Date(2026, 3, 14), type: 'meeting' as const },
  { id: '5', title: 'Setup CI/CD', date: new Date(2026, 3, 18), type: 'task' as const },
];

export default function ProjectCalendar() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-foreground tracking-tight">Project Calendar</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Workspace schedule and delivery milestones.</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="border-border bg-white text-zinc-600 font-bold px-6 h-11 rounded-xl shadow-sm hover:bg-zinc-50 transition-all">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="border-border bg-white text-zinc-600 font-bold px-6 h-11 rounded-xl shadow-sm hover:bg-zinc-50 transition-all">
            <List className="w-4 h-4 mr-2" />
            Agenda View
          </Button>
        </div>
      </div>

      <CalendarView 
        events={MOCK_EVENTS} 
        onAddEvent={(date) => console.log('Add event on:', date)} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-border">
        <div className="flex gap-4 items-center group">
          <div className="w-4 h-4 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center p-0.5">
            <div className="w-full h-full rounded-full bg-primary shadow-lg shadow-primary/20" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black text-zinc-400 tracking-widest leading-none">Category</span>
            <span className="text-sm font-black text-foreground mt-1">Project Tasks</span>
          </div>
        </div>
        <div className="flex gap-4 items-center group">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center p-0.5">
            <div className="w-full h-full rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black text-zinc-400 tracking-widest leading-none">Category</span>
            <span className="text-sm font-black text-foreground mt-1">Milestones</span>
          </div>
        </div>
        <div className="flex gap-4 items-center group">
          <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center p-0.5">
            <div className="w-full h-full rounded-full bg-amber-500 shadow-lg shadow-amber-500/20" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black text-zinc-400 tracking-widest leading-none">Category</span>
            <span className="text-sm font-black text-foreground mt-1">Collaborations</span>
          </div>
        </div>
      </div>
    </div>
  );
}
