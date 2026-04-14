"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ToastProvider } from "@/components/ui/toast";
import { useAuthStore } from "@/store/user";
import { WorkspaceLockdown } from "@/components/auth/workspace-lockdown";
import { AccessRequested } from "@/components/auth/access-requested";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isRevoked, isAuthorized, user } = useAuthStore();

  // Determine if we should show the Pending Terminal
  // This happens if the user is authenticated but not yet 'Active' or 'Revoked'
  const isPending = user && !isAuthorized && !isRevoked;

  return (
    <AuthGuard>
      <ToastProvider>
        <div className="relative min-h-screen bg-background">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <div className="md:pl-64 flex flex-col min-h-screen">
            <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
            <main className="flex-1 px-8 py-10 pt-24">
              <div className="mx-auto max-w-7xl h-full">
                {isRevoked ? (
                  <WorkspaceLockdown />
                ) : isPending ? (
                  <AccessRequested />
                ) : (
                  children
                )}
              </div>
            </main>
          </div>
        </div>
      </ToastProvider>
    </AuthGuard>
  );
}


