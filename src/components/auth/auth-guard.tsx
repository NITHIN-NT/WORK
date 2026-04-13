"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/user";
import { useRouter, usePathname } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if we are on a public route
    const PUBLIC_ROUTES = ['/login', '/register', '/share'];
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

    if (!isLoading) {
      if (!user && !isPublicRoute) {
        // Redundant check with middleware for client-side snappiness
        router.replace(`/login?from=${pathname}`);
      } else if (user && (pathname === '/login' || pathname === '/register')) {
        router.replace("/");
      } else {
        queueMicrotask(() => setIsReady(true));
      }
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading || !isReady) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 animate-pulse">Syncing Relay...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
