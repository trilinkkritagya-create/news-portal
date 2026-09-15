"use client";

import Link from "next/link";
import {
  Menu,
  Plus,
  Compass,
  Search,
  Bell,
  PenSquare,
} from "lucide-react";
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

  const isMember = role === "MEMBER";

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/95 backdrop-blur-xs px-4 sm:px-6 shadow-2xs">
      {/* Left: Hamburger menu toggle + Editorial Dashboard Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shrink-0 transition-colors"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="h-4 w-px bg-border hidden lg:block" />

        <div className="min-w-0 flex items-center gap-2">
          <h1 className="font-serif font-bold text-sm sm:text-base text-foreground tracking-tight truncate">
            {isMember ? "Reader Desk & Library" : "Editorial Dashboard"}
          </h1>
          <span className="hidden xl:inline-block font-mono text-[10px] text-muted-foreground tracking-wide">
            · The Chronicle
          </span>
        </div>
      </div>

      {/* Right: Search, Actions, Notifications & Bureau Status */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Search Input (Tablet and Desktop) */}
        {!isMember && (
          <div className="relative hidden md:block w-48 lg:w-60">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search stories, topics, tags..."
              className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 dark:bg-slate-900 border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-card transition-all font-sans"
            />
          </div>
        )}

        {/* Action Button */}
        {isMember ? (
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-hover shadow-xs shrink-0"
          >
            <Compass className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Explore Stories</span>
            <span className="sm:hidden">Explore</span>
          </Link>
        ) : (
          <Link
            href="/dashboard/articles/create"
            className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-hover shadow-xs shrink-0"
          >
            <PenSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Create Article</span>
            <span className="sm:hidden">Create</span>
          </Link>
        )}

        <div className="h-4 w-px bg-border hidden sm:block" />

        {/* Notification Bell with Red Dot */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600 ring-2 ring-card"></span>
        </button>

        {/* Bureau Status Live Pill (Tablet/Desktop) */}
        <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-border font-mono text-[11px]">
          <span className="text-muted-foreground font-sans hidden lg:inline">
            Bureau Desk #1
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            </span>
            LIVE
          </span>
        </div>
      </div>
    </header>
  );
}
