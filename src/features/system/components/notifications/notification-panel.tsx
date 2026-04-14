"use client";

import { useState } from "react";
import { Bell, Check, Info, AlertTriangle, AlertCircle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useNotificationHistory } from "@/hooks/use-notification-history";

const notificationTypeMap = {
  info: <Info className="h-4 w-4 text-blue-500" />,
  success: <Check className="h-4 w-4 text-emerald-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  error: <AlertCircle className="h-4 w-4 text-rose-500" />,
};

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, loading, markAllAsRead, markAsRead } = useNotificationHistory();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-zinc-400 hover:text-foreground transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-primary ring-1 ring-white" />
        )}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-white border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
              <h3 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">Notifications</h3>
              <button 
                onClick={() => markAllAsRead()} 
                className="text-[10px] font-black text-primary hover:text-primary/80 uppercase tracking-widest transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="max-h-[440px] overflow-y-auto no-scrollbar">
              {loading ? (
                <div className="py-16 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-zinc-400">
                  <Inbox className="h-12 w-12 mb-4 opacity-10" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {notifications.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => markAsRead(item.id)}
                      className={cn(
                        "p-5 flex gap-4 transition-colors hover:bg-zinc-50/50 cursor-pointer text-left",
                        !item.read && "bg-primary/[0.02]"
                      )}
                    >
                      <div className="shrink-0 mt-0.5">
                        {notificationTypeMap[item.type]}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start gap-3">
                          <p className={cn("text-[12px] font-bold leading-tight tracking-tight", item.read ? "text-zinc-500" : "text-foreground")}>
                            {item.title}
                          </p>
                          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest whitespace-nowrap mt-0.5">
                             {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-border/50">
              <Button variant="ghost" className="w-full text-[10px] text-zinc-500 hover:text-foreground font-black uppercase tracking-widest h-auto py-2 transition-colors">
                View Archive
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

