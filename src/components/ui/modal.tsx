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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 mt-[-10vh]">
      <div 
        className="absolute inset-0 bg-white/40 backdrop-blur-[2px] animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div 
        ref={modalRef}
        className="relative w-full max-w-lg bg-white border border-zinc-100 rounded-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 overflow-hidden"
      >
        {/* Minimalist Header */}
        <div className="px-8 pt-10 pb-6 flex items-start justify-between relative">
          <div className="space-y-3">
            <div className="h-0.5 w-8 bg-primary" />
            <h3 className="text-2xl font-black text-zinc-950 tracking-tight uppercase leading-none">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 h-8 w-8 flex items-center justify-center text-zinc-300 hover:text-zinc-950 transition-all rounded-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Section with balanced padding */}
        <div className="px-8 pb-10 pt-2">
          {children}
        </div>
      </div>
    </div>
  );
}
