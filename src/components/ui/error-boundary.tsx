"use client";

import React, { ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "./button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-6 animate-in fade-in duration-150">
          <div className="max-w-xl w-full space-y-8 text-center">
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 bg-red-500/10 rounded-[2.5rem] animate-ping" />
              <div className="relative flex items-center justify-center w-full h-full bg-white border-2 border-red-500/20 rounded-[2.5rem] shadow-xl">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">System Relay Error</h1>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] leading-relaxed">
                We encountered an unauthorized exception in the workspace relay logic.
              </p>
            </div>

            <div className="p-8 bg-white border border-border shadow-sm rounded-3xl text-left overflow-x-auto">
               <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <AlertCircle className="w-3.5 h-3.5" /> Exception Trace
               </p>
               <pre className="text-xs font-mono text-zinc-500 whitespace-pre-wrap break-all leading-relaxed">
                 {this.state.error?.message || "Internal Relay Dysfunction"}
               </pre>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-black px-12 h-14 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105"
              >
                <RotateCcw className="w-4 h-4 mr-3" />
                Retry Relay
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="w-full sm:w-auto h-14 px-8 border-border bg-white text-zinc-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:text-foreground transition-all"
              >
                <Home className="w-4 h-4 mr-3" />
                Back to Dashboard
              </Button>
            </div>
            
            <p className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.4em]">Error Reference: 500_RELAY_CRASH</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
