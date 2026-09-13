"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LayoutDashboard,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { MOCK_CATEGORIES } from "@/lib/mock-data";
import HeaderSearch from "./HeaderSearch";

interface PublicHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
    image?: string | null;
  } | null;
}

export default function PublicHeader({ user }: PublicHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll and handle Escape key when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsMobileMenuOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3 lg:gap-4">
            {/* Left: Mobile Menu Hamburger + Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Mobile Menu Hamburger (Left Side!) */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-border text-foreground lg:hidden hover:bg-secondary cursor-pointer shrink-0"
                aria-label="Open navigation sidebar"
              >
                <Menu className="h-4 w-4" />
              </button>

              {/* Brand Logo */}
              <Link
                href="/"
                className="flex items-center gap-2.5 shrink-0 group whitespace-nowrap"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm font-bold text-sm">
                  NP
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors leading-none">
                    News Portal
                  </span>
                  <span className="text-[9px] font-semibold tracking-wider text-muted-foreground uppercase mt-0.5">
                    The Daily Dispatch
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Category Navigation Links (Same line on Desktop) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 overflow-x-auto no-scrollbar text-xs font-medium shrink-0">
              <Link
                href="/#dispatches"
                className="rounded-full bg-foreground text-background px-3 py-1 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors shadow-2xs"
              >
                All Stories
              </Link>
              {MOCK_CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  href={`/?category=${category.slug}#dispatches`}
                  className="rounded-full px-2.5 py-1 text-muted-foreground hover:bg-secondary hover:text-foreground whitespace-nowrap shrink-0 transition-colors text-xs font-medium"
                >
                  {category.name}
                </Link>
              ))}
              <Link
                href="#opinion"
                className="rounded-full px-2.5 py-1 text-muted-foreground hover:bg-secondary hover:text-foreground whitespace-nowrap shrink-0 transition-colors text-xs font-medium"
              >
                Opinions
              </Link>
            </nav>

            {/* Right: Inline Search Bar + Auth Actions */}
            <div className="flex items-center gap-2.5 xl:gap-3 shrink-0">
              {/* Inline Header Search with Non-blocking Dropdown (Desktop & Tablet) */}
              <div className="hidden md:block">
                <HeaderSearch />
              </div>

              {/* User Session CTA */}
              {user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-primary transition-colors dark:bg-white dark:text-slate-950 shadow-sm whitespace-nowrap shrink-0"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="rounded bg-white/20 dark:bg-black/20 px-1.5 py-0.5 text-[10px] uppercase font-bold">
                    {user.role}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
                  <Link
                    href="/login"
                    className="hidden sm:inline-flex items-center px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-primary transition-colors dark:bg-white dark:text-slate-950 shadow-sm"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================
          Mobile Off-Canvas Side Drawer (Slides in from the Left)
          ======================================================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Blur Overlay */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
            aria-hidden="true"
          />

          {/* Slide-out Sidebar Panel */}
          <aside
            className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-card text-card-foreground shadow-2xl border-r border-border z-50 flex flex-col justify-between animate-in slide-in-from-left duration-300 ease-out"
            aria-label="Mobile Navigation Sidebar"
          >
            {/* Top Bar: Brand & Close Button */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm font-bold text-sm">
                  NP
                </div>
                <div>
                  <span className="text-base font-extrabold tracking-tight text-foreground block leading-tight">
                    News Portal
                  </span>
                  <span className="text-[9px] font-semibold tracking-wider text-muted-foreground uppercase block">
                    The Daily Dispatch
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Input in Sidebar */}
            <div className="p-4 pb-2 border-b border-border/60">
              <HeaderSearch />
            </div>

            {/* Middle: ALL VERTICAL Navigation Links */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Editorial Desks
              </div>

              {/* All Stories link */}
              <Link
                href="/#dispatches"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-foreground bg-secondary/70 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-slate-950 dark:bg-white" />
                  <span>All Stories</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>

              {/* Vertical list of categories */}
              {MOCK_CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  href={`/?category=${category.slug}#dispatches`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                </Link>
              ))}

              <div className="pt-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Opinion &amp; Columnists
              </div>

              <Link
                href="#opinion"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                  <span>Opinions &amp; Perspectives</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
              </Link>
            </div>

            {/* Bottom: Auth Actions & Console */}
            <div className="p-4 border-t border-border bg-secondary/30 space-y-2.5">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between w-full rounded-xl bg-slate-950 p-3 text-xs font-semibold text-white dark:bg-white dark:text-slate-950 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Go to Dashboard</span>
                  </div>
                  <span className="rounded bg-white/20 dark:bg-black/20 px-1.5 py-0.5 text-[10px] uppercase font-bold">
                    {user.role}
                  </span>
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full rounded-xl bg-slate-950 py-2.5 text-xs font-bold text-white hover:bg-primary transition-colors dark:bg-white dark:text-slate-950 shadow-sm"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full rounded-xl border border-border py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
