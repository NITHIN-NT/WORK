"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home, Terminal } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error Boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-150">
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-x-0 inset-y-0 bg-rose-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="relative z-10 h-20 w-20 bg-white shadow-2xl shadow-rose-500/10 rounded-sm border border-rose-100 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-rose-500" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-black text-foreground tracking-tight leading-none">System Disruption</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 max-w-xs mx-auto">
            We encountered an unexpected exception while rendering this workspace environment.
          </p>
        </div>

        {error.digest && (
          <div className="p-4 bg-zinc-50 border border-border rounded-sm font-mono text-[10px] text-zinc-500 flex items-center gap-3">
            <Terminal className="h-3 w-3 text-primary" />
            <span className="font-black">DIAGNOSTIC ID: {error.digest}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            onClick={reset}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-black px-10 h-11 rounded-sm shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Restart Interface
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="ghost" className="w-full text-zinc-500 hover:text-foreground hover:bg-zinc-100 font-black uppercase tracking-widest text-[10px] h-11 px-8 rounded-sm transition-all">
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
