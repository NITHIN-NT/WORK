"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-6 text-center border-2 border-dashed border-border rounded-[2.5rem] bg-zinc-50/50 animate-in fade-in duration-150",
      className
    )}>
      <div className="h-16 w-16 rounded-3xl bg-white flex items-center justify-center border border-border shadow-sm mb-6">
        <Icon className="h-8 w-8 text-zinc-400" />
      </div>
      <h3 className="text-xl font-black text-foreground tracking-tight mb-2 uppercase">
        {title}
      </h3>
      <p className="text-sm font-medium text-zinc-500 max-w-[280px] mb-8">
        {description}
      </p>
      {action && (
        <Button 
          onClick={action.onClick}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-black h-11 px-8 rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
