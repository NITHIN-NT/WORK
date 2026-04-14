"use client";

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TaskPriority, TaskStatus } from '@/types/task';

interface FilterState {
  priority: TaskPriority[];
  status: TaskStatus[];
  assignee: string[];
}

interface TaskFilterBarProps {
  onFilterChange: (filters: FilterState) => void;
}

export function TaskFilterBar({ onFilterChange }: TaskFilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    priority: [],
    status: [],
    assignee: [],
  });

  const togglePriority = (p: TaskPriority) => {
    const newPriority = filters.priority.includes(p)
      ? filters.priority.filter(v => v !== p)
      : [...filters.priority, p];
    const newFilters = { ...filters, priority: newPriority };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const cleared = { priority: [], status: [], assignee: [] };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const hasActiveFilters = filters.priority.length > 0 || filters.status.length > 0 || filters.assignee.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 border border-border text-[10px] font-black text-zinc-400 uppercase tracking-widest shadow-sm">
        <Filter className="h-3 w-3" />
        Filter By:
      </div>

      <div className="flex gap-2">
        {['Low', 'Medium', 'High', 'Urgent'].map((p) => (
          <button
            key={p}
            onClick={() => togglePriority(p as TaskPriority)}
            className={cn(
              "px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all shadow-sm",
              filters.priority.includes(p as TaskPriority)
                ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                : "bg-white border-border text-zinc-500 hover:border-zinc-300 hover:text-foreground"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilters}
          className="h-8 text-[10px] font-black text-rose-500 hover:text-rose-600 hover:bg-rose-50 uppercase tracking-widest"
        >
          <X className="h-3 w-3 mr-1" />
          Clear Total
        </Button>
      )}
    </div>
  );
}
