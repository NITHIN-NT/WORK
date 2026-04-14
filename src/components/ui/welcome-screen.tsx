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
        "fixed inset-0 z-[9999] flex items-center justify-center bg-background overflow-hidden",
        isExiting && "animate-welcome-exit"
      )}
    >
      {/* Background radial glow - using primary color with low opacity */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.08)_0%,transparent_70%)] animate-slow-zoom" />


      <div className="relative flex flex-col items-center gap-6">
        {/* Logo Container */}
        <div className="relative">
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-foreground/5 select-none">
            WORK
            <span className="text-primary/30">.</span>
          </h1>
          
          {/* Animated Overlay Text */}
          <h1 className="absolute inset-0 text-7xl md:text-8xl font-black tracking-tighter text-foreground animate-reveal-up select-none">
            WORK
            <span className="text-primary">.</span>
            
            {/* Shimmer Effect - subtle adjustment for theme awareness */}
            <span className="absolute inset-0 animate-shimmer pointer-events-none bg-clip-text text-transparent bg-gradient-to-r from-transparent via-foreground/10 to-transparent" 
                  style={{ WebkitBackgroundClip: 'text', backgroundSize: '200% 100%' }}>
              WORK.
            </span>
          </h1>
        </div>

        {/* Tagline */}
        <div className="overflow-hidden">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-[reveal-up_1.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            The Unified Workspace OS
          </p>
        </div>

        {/* Loading bar */}
        <div className="mt-4 w-48 h-[2px] bg-muted rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-primary w-full origin-left animate-[shimmer_2s_infinite_linear]" 
               style={{ transform: 'translateX(-100%)', animation: 'loading-progress 1.5s cubic-bezier(0.65, 0, 0.35, 1) forwards' }} 
          />
        </div>
      </div>


      <style jsx global>{`
        @keyframes loading-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
}
