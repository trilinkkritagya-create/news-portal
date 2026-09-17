"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
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
  role,
}: DashboardHeaderProps) {
  const { toggle } = useSidebar();
  const pathname = usePathname();

  const isOverview = pathname === "/dashboard" || pathname === "/dashboard/member";
  const isArticles =
    pathname.startsWith("/dashboard/articles") ||
    pathname.startsWith("/dashboard/my-articles");
  const isUsers = pathname.startsWith("/dashboard/users");
  const isProfile = pathname.startsWith("/dashboard/profile");

  // Determine section title based on route
  const getHeaderTitle = () => {
    if (role === "MEMBER") return "Reader Library";
    if (isOverview) return "Overviews";
    if (isArticles) return "Article";
    if (pathname.startsWith("/dashboard/comments")) return "Comments";
    if (isUsers) return "Users";
    if (isProfile) return "Profile";
    return "Editorial Operations";
  };

  const getHeaderBadge = () => {
    if (role === "MEMBER") return "Patron Reading Desk";
    if (isOverview) return "Overview Desk";
    if (isArticles) return "Newsroom Dispatches";
    if (isUsers) return "Directory & Access";
    if (isProfile) return "Account Preferences";
    return "Live Desk";
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-[#CBD5E1] dark:border-slate-700 bg-[#E2E8F0] dark:bg-[#1E293B] px-4 sm:px-6 lg:px-8 shadow-xs gap-2">
      {/* Left: Hamburger menu toggle (xl:hidden) + Section Title + Subtitle Badge */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={toggle}
          className="inline-flex size-8.5 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground xl:hidden focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shrink-0 transition-colors shadow-2xs"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 hidden xl:block shrink-0" />

        <div className="min-w-0 flex items-center gap-2.5">
          <h1 className="font-serif font-bold text-base text-foreground tracking-tight truncate">
            {getHeaderTitle()}
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border bg-white dark:bg-slate-800 text-[#881337] dark:text-rose-400 border-slate-200 dark:border-slate-700 shadow-2xs shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#881337] animate-pulse shrink-0" />
            <span className="truncate">{getHeaderBadge()}</span>
          </span>
        </div>
      </div>

      {/* Right: Search, Actions, and Notifications based on route */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Search Article input (for Overview and Article only) */}
        {(isOverview || isArticles) && (
          <div className="relative hidden md:block w-48 lg:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500 dark:text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search dispatches..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 rounded-lg text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary font-sans transition-colors shadow-2xs"
            />
          </div>
        )}

        {/* Create Article Button (for Overview and Article) */}
        {(isArticles || (isOverview && role !== "MEMBER")) && (
          <Link
            href="/dashboard/articles/create"
            className="inline-flex items-center justify-center gap-1.5 h-8.5 px-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-medium transition-all duration-150 shadow-xs hover:shadow active:scale-98 shrink-0"
          >
            <PenSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Create Article</span>
            <span className="sm:hidden">Create</span>
          </Link>
        )}

        {/* Notification Bell with indicator */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex items-center justify-center size-8.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shadow-2xs"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-600 ring-2 ring-card animate-pulse"></span>
        </button>
      </div>
    </header>
  );
}
