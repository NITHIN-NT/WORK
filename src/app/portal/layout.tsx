"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { PortalSidebar } from "@/components/layout/portal-sidebar";
import { PortalTopbar } from "@/components/layout/portal-topbar";
import { ToastProvider } from "@/components/ui/toast";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <ToastProvider>
        <div className="relative min-h-screen bg-[#FAFAFA]">
          <PortalSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <div className="md:pl-64 flex flex-col min-h-screen">
            <PortalTopbar onMenuClick={() => setIsSidebarOpen(true)} />
            <main className="flex-1 px-4 sm:px-8 py-10 pt-24">
              <div className="mx-auto max-w-7xl h-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </ToastProvider>
    </AuthGuard>
  );
}
