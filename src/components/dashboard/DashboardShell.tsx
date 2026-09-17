"use client";

import React from "react";
import { SidebarProvider } from "./SidebarContext";
import SideBar from "./SideBar";
import { UserRole } from "@/generated/prisma/enums";

interface DashboardShellProps {
  role?: UserRole;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  children: React.ReactNode;
}

export default function DashboardShell({
  role,
  user,
  children,
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground antialiased">
        {/* Static, pinned sidebar that never scrolls away */}
        <SideBar role={role} user={user} />
        {/* Independent scrollable main viewport */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
