"use client";

import Link from "next/link";
import { Menu, Plus, Compass } from "lucide-react";
import { useSidebar } from "./SidebarContext";

interface DashboardHeaderProps {
  userName?: string | null;
  role?: string | null;
}

export default function DashboardHeader({
  userName,
  role,
}: DashboardHeaderProps) {
  const { toggle } = useSidebar();

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const isMember = role === "MEMBER";

  return (
    <header className="sticky top-0 z-20 flex shrink-0 items-center justify-between border-b border-border bg-card/95 backdrop-blur-xs px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Mobile / Tablet Drawer Toggle Button */}
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center justify-center rounded-lg border border-border bg-background p-2 text-foreground/80 hover:bg-secondary hover:text-foreground lg:hidden focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shrink-0"
          aria-label="Toggle sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground truncate">
            {role === "ADMIN"
              ? "Administrator Overview"
              : role === "AUTHOR"
                ? "Author Overview"
                : "Reader Desk & Library"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground truncate hidden xs:block sm:block">
            {userName
              ? `Welcome back, ${userName}.`
              : isMember
                ? "Your personal reading shelf and curated stories."
                : "Newsroom operations and analytics overview."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        <div className="hidden border-r border-border pr-4 text-right md:block font-mono text-xs text-muted-foreground">
          {currentDate}
        </div>

        {isMember ? (
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg bg-[#0d1527] px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-primary dark:bg-white dark:text-[#0d1527] dark:hover:bg-gray-100 shrink-0"
          >
            <Compass className="h-4 w-4" />
            <span className="hidden sm:inline">Explore Stories</span>
            <span className="sm:hidden">Explore</span>
          </Link>
        ) : (
          <Link
            href="/dashboard/articles/create"
            className="flex items-center gap-2 rounded-lg bg-[#0d1527] px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-primary dark:bg-white dark:text-[#0d1527] dark:hover:bg-gray-100 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Article</span>
            <span className="sm:hidden">Create</span>
          </Link>
        )}
      </div>
    </header>
  );
}
