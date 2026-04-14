"use client";

import { useEffect, useRef } from 'react';

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-zinc-900/20 backdrop-blur-xl animate-in fade-in duration-150" 
        style={{ WebkitBackdropFilter: 'blur(24px)' }}
        onClick={onClose} 
      />
      <div 
        ref={modalRef}
        className="relative w-full max-w-xl bg-white border border-border rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] animate-in zoom-in-95 duration-150 overflow-hidden"
      >
        <div className="flex flex-col p-8 border-b border-border bg-zinc-50/30">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-foreground tracking-tight">{title}</h3>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onClose}
              className="h-10 w-10 border-border bg-white text-zinc-400 hover:text-foreground hover:bg-zinc-50 rounded-xl transition-all shadow-sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-2 pl-0.5">Details</p>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
