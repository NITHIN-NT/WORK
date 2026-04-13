"use client";

import { CalendarView } from "@/components/calendar/calendar-view";
import { Button } from "@/components/ui/button";
import { Filter, List, Plus, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { useCalendarEvents } from "@/hooks/use-calendar-events";
import { EventModal } from "@/components/calendar/event-modal";
import { useToast } from "@/components/ui/toast";

export default function GlobalCalendar() {
  const [view, setView] = useState<'calendar' | 'agenda'>('calendar');
  const { events, loading, addEvent } = useCalendarEvents();
  const [activeFilter, setActiveFilter] = useState("All Projects");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const { toast } = useToast();

  const handleAddEvent = async (eventData: { title: string; date: Date; type: 'task' | 'milestone' | 'meeting'; project: string }) => {
    try {
      await addEvent(eventData);
      toast("Event scheduled successfully", "success");
    } catch {
      toast("Failed to schedule event", "error");
    }
  };

  const filteredEvents = events.filter(e => {
    if (activeFilter === "All Projects") return true;
    return e.project === activeFilter;
  });

  const openCreateModal = (date?: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground mb-1">Global Calendar</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Master schedule across all project workspaces.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="bg-zinc-100/50 p-1.5 rounded-2xl border border-border flex gap-1.5 shadow-xs">
            <Button 
              variant={view === 'calendar' ? 'secondary' : 'ghost'} 
              size="sm" 
              className={cn(
                "h-9 px-4 gap-2 rounded-xl transition-all font-bold",
                view === 'calendar' ? "bg-white shadow-sm text-foreground" : "text-zinc-500 hover:text-foreground"
              )}
              onClick={() => setView('calendar')}
            >
              <LayoutGrid className="w-4 h-4" />
              Calendar
            </Button>
            <Button 
              variant={view === 'agenda' ? 'secondary' : 'ghost'} 
              size="sm" 
              className={cn(
                "h-9 px-4 gap-2 rounded-xl transition-all font-bold",
                view === 'agenda' ? "bg-white shadow-sm text-foreground" : "text-zinc-500 hover:text-foreground"
              )}
              onClick={() => setView('agenda')}
            >
              <List className="w-4 h-4" />
              Agenda
            </Button>
          </div>
          <Button 
            onClick={() => openCreateModal()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 h-[52px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-5 rounded-2xl border border-border shadow-sm">
        <div className="flex-1 flex gap-3 overflow-x-auto no-scrollbar">
          {["All Projects", "Acme Corp", "Nexus Tech", "Innova", "Startup Inc"].map((proj) => (
            <Button 
              key={proj} 
              variant="outline" 
              size="sm" 
              onClick={() => setActiveFilter(proj)}
              className={cn(
                "shrink-0 border-border font-bold px-5 h-9 rounded-xl transition-all",
                activeFilter === proj ? "bg-primary text-primary-foreground border-primary" : "bg-white text-zinc-600 hover:bg-zinc-50 hover:text-foreground"
              )}
            >
              {proj}
            </Button>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-foreground font-bold px-4 h-9 rounded-xl transition-all">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </div>

      {view === 'calendar' ? (
        <CalendarView 
          events={filteredEvents} 
          onAddEvent={(date) => openCreateModal(date)} 
        />
      ) : (
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border bg-zinc-50/50">
            <h3 className="text-xl font-black text-foreground tracking-tight">Upcoming Agenda</h3>
          </div>
          <div className="divide-y divide-border">
            {filteredEvents.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs">
                No upcoming events for the selected project.
              </div>
            ) : (
              filteredEvents
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map(event => (
                  <div key={event.id} className="p-6 flex items-center justify-between hover:bg-zinc-50/50 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center justify-center h-14 w-14 rounded-2xl bg-zinc-100 border border-border">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">
                          {event.date.toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-xl font-black text-foreground leading-none">
                          {event.date.getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="text-base font-black text-foreground">{event.title}</p>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            event.type === 'task' ? "bg-blue-400" :
                            event.type === 'milestone' ? "bg-emerald-400" : "bg-amber-400"
                          )} />
                          {event.type} • {event.project}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-foreground font-bold rounded-xl h-10 px-6">
                      View Details
                    </Button>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddEvent}
        initialDate={selectedDate}
      />
    </div>
  );
}
