"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/user";
import { useRouter, usePathname } from "next/navigation";
import { WelcomeScreen } from "@/components/ui/welcome-screen";
import { useAppStore } from "@/store/app";
import { cn } from "@/lib/utils";





interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading, isRevoked } = useAuthStore();

  const { isDataReady } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Check if we are on a public route
  const PUBLIC_ROUTES = ['/login', '/register', '/share'];
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

  // Access is explicitly denied ONLY if the user has no profile or is in 'Pending' status.
  // If they are 'Revoked', we actually allow them to see the dashboard background (isAccessDenied = false)
  // but we overlay the Lockdown UI.

  useEffect(() => {
    if (!isLoading) {
      if (!user && !isPublicRoute) {
        router.replace(`/login?from=${pathname}`);
      } else if (user && (pathname === '/login' || pathname === '/register')) {
        router.replace("/");
      } else {
        queueMicrotask(() => setIsReady(true));
      }
    }
  }, [user, isLoading, pathname, router, isPublicRoute]);

  // Handle welcome screen completion
  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  // 1. Loading Phase
  if (isLoading) {
    return <WelcomeScreen onAnimationComplete={handleWelcomeComplete} isDataReady={false} />;
  }

  // 2. Auth Success: Show Dashboard shell
  // Note: Specific access states (Pending, Revoked) are handled inside DashboardLayout
  // to ensure the sidebar and navigation shell remain visible.
  return (
    <>
      {(showWelcome && !isRevoked) && (
        <WelcomeScreen 
          onAnimationComplete={handleWelcomeComplete} 
          isDataReady={(isDataReady || isPublicRoute)} 
        />
      )}

      
      <div className={cn(
        isReady ? "contents" : "hidden",
        isRevoked && "pointer-events-none select-none"
      )}>
        {children}
      </div>
    </>
  );
}







