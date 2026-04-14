"use client";

import { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Event {
  id: string;
  title: string;
  date: Date;
  type: 'task' | 'milestone' | 'meeting';
}

interface CalendarViewProps {
  events?: Event[];
  onAddEvent?: (date: Date) => void;
}

export function CalendarView({ events = [], onAddEvent }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  return (
    <div 
      className="bg-card backdrop-blur-xl border border-border rounded-sm overflow-hidden shadow-sm transition-all"
      style={{ WebkitBackdropFilter: 'blur(24px)' }}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-zinc-50/50">
        <div>
          <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-3">
            <span className="h-8 w-8 rounded-sm bg-primary/10 flex items-center justify-center">
              <CalendarIcon className="h-4 w-4 text-primary" />
            </span>
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="text-zinc-400 hover:text-foreground hover:bg-zinc-100 rounded-lg h-9 w-9">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="text-zinc-400 hover:text-foreground hover:bg-zinc-100 rounded-lg h-9 w-9">
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="sm" className="ml-2 border-border bg-white text-zinc-600 font-bold hover:bg-zinc-50 h-9 rounded-sm px-4" onClick={() => setCurrentMonth(new Date())}>
            Today
          </Button>
        </div>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 border-b border-border bg-zinc-50/30">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="px-4 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center border-r last:border-0 border-border">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, idx) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div 
              key={idx} 
              className={cn(
                "min-h-[100px] p-2 border-r border-b border-border transition-all group hover:bg-zinc-50/50 relative cursor-pointer",
                !isCurrentMonth ? "bg-zinc-50/30 text-zinc-300" : "text-foreground",
                idx % 7 === 6 && "border-r-0"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "text-xs font-black h-6 w-6 flex items-center justify-center rounded-lg transition-all",
                  isToday ? "bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20" : "group-hover:text-primary"
                )}>
                  {format(day, 'd')}
                </span>
                {isCurrentMonth && (
                  <button 
                    onClick={() => onAddEvent?.(day)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-primary/20 transition-all"
                  >
                    <Plus className="h-3 w-3 text-primary" />
                  </button>
                )}
              </div>
              
              <div className="space-y-1 max-h-[84px] overflow-y-auto no-scrollbar">
                {dayEvents.map(event => (
                  <div 
                    key={event.id}
                    className={cn(
                      "text-[10px] px-1.5 py-1 rounded border truncate font-medium",
                      event.type === 'task' ? "bg-secondary/10 text-blue-400 border-secondary/20" :
                      event.type === 'milestone' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    )}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
