"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface WelcomeScreenProps {
  onAnimationComplete?: () => void;
  isDataReady?: boolean;
}

export function WelcomeScreen({ onAnimationComplete, isDataReady = true }: WelcomeScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    // Minimum time to show the animation for premium feel
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1800);

    // Safety fallback: if data isn't ready in 4.5s, proceed anyway
    const fallbackTimer = setTimeout(() => {
      setIsExiting(true);
      const exitTimer = setTimeout(() => {
        onAnimationComplete?.();
      }, 800);
      return () => clearTimeout(exitTimer);
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [onAnimationComplete]);

  useEffect(() => {
    // Only exit if both requirements are met
    if (minTimeElapsed && isDataReady) {
      queueMicrotask(() => setIsExiting(true));
      const exitTimer = setTimeout(() => {
        onAnimationComplete?.();
      }, 800);
      return () => clearTimeout(exitTimer);
    }
  }, [minTimeElapsed, isDataReady, onAnimationComplete]);



  return (
    <div 
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-[#09090b] overflow-hidden transition-all duration-1000",
        isExiting && "opacity-0 scale-105 blur-3xl pointer-events-none"
      )}
    >
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full animate-float" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-600/5 blur-[100px] rounded-full animate-float" style={{ animationDelay: '-2s' }} />

      <div className="relative flex flex-col items-center gap-10">
        {/* Logo Container */}
        <div className="relative group">
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-white/5 select-none transition-transform duration-700 group-hover:scale-110 italic">
            WORK
          </h1>
          
          {/* Animated Overlay Text */}
          <h1 className="absolute inset-0 text-8xl md:text-9xl font-black tracking-tighter text-white animate-reveal-up select-none italic">
            WORK
            <span className="text-primary drop-shadow-[0_0_20px_rgba(var(--primary),0.5)]">.</span>
            
            {/* Shimmer Effect */}
            <span className="absolute inset-0 animate-shimmer pointer-events-none bg-clip-text text-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent" 
                  style={{ WebkitBackgroundClip: 'text', backgroundSize: '200% 100%' }}>
              WORK.
            </span>
          </h1>
        </div>

        {/* Tagline & Progress Container */}
        <div className="flex flex-col items-center gap-6">
          <div className="overflow-hidden">
            <p className="text-[11px] font-black uppercase tracking-[0.6em] text-zinc-500 animate-[reveal-up_1.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
              Unified Digital Operating System
            </p>
          </div>

          {/* Premium Loading bar */}
          <div className="w-64 h-[2px] bg-white/5 rounded-full overflow-hidden relative border border-white/5">
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-indigo-500 w-full origin-left transition-transform duration-[1800ms] ease-[cubic-bezier(0.65,0,0.35,1)]" 
                 style={{ transform: minTimeElapsed ? 'translateX(0%)' : 'translateX(-100%)' }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
