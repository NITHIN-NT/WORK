"use client";

import { useState } from "react";
import { Bell, Check, Info, AlertTriangle, AlertCircle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

import { useNotificationHistory } from "@/hooks/use-notification-history";

const typeIcons = {
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
        className="relative text-zinc-400 hover:text-foreground hover:bg-zinc-100 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-white animate-pulse" />
        )}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-border rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between px-6 py-5 bg-zinc-50/50 border-b border-border">
              <h3 className="text-xs font-black text-foreground uppercase tracking-widest">Notifications</h3>
              <button 
                onClick={() => markAllAsRead()} 
                className="text-[10px] font-black text-primary hover:text-primary/80 uppercase tracking-widest transition-colors"
              >
                Mark all read
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto no-scrollbar">
              {loading ? (
                <div className="py-12 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-zinc-400">
                  <Inbox className="h-10 w-10 mb-2 opacity-20" />
                  <p className="text-sm font-bold uppercase tracking-widest text-[10px]">Inbox Empty</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={() => markAsRead(notif.id)}
                      className={cn(
                        "p-5 flex gap-4 transition-colors hover:bg-zinc-50 cursor-pointer text-left",
                        !notif.read && "bg-primary/[0.03]"
                      )}
                    >
                      <div className="shrink-0 mt-1">
                        {typeIcons[notif.type]}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <p className={cn("text-xs font-black leading-tight tracking-tight", notif.read ? "text-zinc-500" : "text-foreground")}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest whitespace-nowrap">
                             {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                          {notif.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-zinc-50/50 border-t border-border">
              <Button variant="ghost" className="w-full text-[10px] text-zinc-400 hover:text-foreground font-black uppercase tracking-widest h-auto py-1 hover:bg-zinc-100 transition-colors">
                View all notifications
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
