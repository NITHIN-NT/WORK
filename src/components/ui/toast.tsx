"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-[1.5rem] border shadow-[0_20px_40px_-5px_rgba(0,0,0,0.15)] animate-in slide-in-from-right duration-150 min-w-[340px] bg-white border-border group",
            )}
          >
            <div className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110",
              t.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-500 shadow-sm" :
              t.type === 'error' ? "bg-rose-50 border-rose-100 text-rose-500 shadow-sm" :
              "bg-primary/5 border-primary/10 text-primary shadow-sm"
            )}>
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              {t.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
            </div>
            
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-0.5 leading-none">System Message</p>
              <p className="text-sm font-black text-foreground tracking-tight">{t.message}</p>
            </div>
            
            <button 
              onClick={() => removeToast(t.id)}
              className="p-1 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400 hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
