"use client";

import { useEffect, useRef } from 'react';

import { X } from "lucide-react";

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
        className="absolute inset-0 bg-black/60 backdrop-blur-2xl animate-in fade-in duration-500" 
        onClick={onClose} 
      />
      <div 
        ref={modalRef}
        className="relative w-full max-w-xl glass rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.6)] animate-in zoom-in-95 slide-in-from-bottom-12 duration-500 overflow-hidden border-white/5"
      >
        {/* Minimalist Header */}
        <div className="px-10 pt-12 pb-6 flex items-start justify-between relative bg-white/5 border-b border-white/5">
          <div className="space-y-4">
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none italic">{title}</h3>
            <div className="h-1 w-12 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
          </div>
          <button 
            onClick={onClose}
            className="absolute top-10 right-10 h-10 w-10 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content Section with balanced padding */}
        <div className="px-10 pb-12 pt-8 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
