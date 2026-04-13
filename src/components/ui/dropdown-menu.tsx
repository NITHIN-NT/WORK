"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function DropdownMenu({ 
  trigger, 
  children, 
  align = "right",
  className 
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, isBottom: false });

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const isBottom = rect.bottom > windowHeight - 200;
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      setPosition({
        top: isBottom ? rect.top + scrollY - 8 : rect.bottom + scrollY + 8,
        left: align === "right" ? rect.right + scrollX : rect.left + scrollX,
        isBottom
      });
    }
  }, [align]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      updatePosition();
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  if (!mounted) return null;

  return (
    <div className={cn("inline-block", className)} ref={triggerRef}>
      <div 
        className="cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        {trigger}
      </div>

      {isOpen && createPortal(
        <div 
          ref={menuRef}
          style={{ 
            top: `${position.top}px`, 
            left: `${position.left}px`,
            transform: align === 'right' ? 'translateX(-100%)' : 'none'
          }}
          className={cn(
            "fixed z-[200] mt-2 w-48 rounded-2xl bg-white/80 backdrop-blur-xl border border-border shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)] p-2",
            "style={{ WebkitBackdropFilter: 'blur(16px)' }}"
          )}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "destructive";
}

export function DropdownMenuItem({ 
  children, 
  onClick, 
  className,
  variant = "default" 
}: DropdownMenuItemProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest",
        variant === "default" 
          ? "text-zinc-600 hover:bg-primary/5 hover:text-primary" 
          : "text-rose-500 hover:bg-rose-500/5 hover:text-rose-600",
        className
      )}
    >
      {children}
    </button>
  );
}
