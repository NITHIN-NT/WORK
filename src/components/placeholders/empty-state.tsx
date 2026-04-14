import { LucideIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionText, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border-2 border-dashed border-border bg-zinc-50/50 animate-in fade-in zoom-in-95 duration-200">
      <div className="h-20 w-20 rounded-2xl bg-zinc-100 flex items-center justify-center border border-border mb-6 relative">
        <div className="absolute inset-0 bg-primary/5 rounded-2xl animate-pulse" />
        <Icon className="h-10 w-10 text-primary relative z-10" />
      </div>
      <h3 className="text-xl font-black text-foreground mb-2 tracking-tight">{title}</h3>
      <p className="text-sm font-bold text-zinc-400 max-w-[280px] leading-relaxed uppercase tracking-widest text-[10px]">
        {description}
      </p>
      
      {actionText && onAction && (
        <Button 
          onClick={onAction}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8"
        >
          <Plus className="h-4 w-4 mr-2" />
          {actionText}
        </Button>
      )}
    </div>
  );
}
