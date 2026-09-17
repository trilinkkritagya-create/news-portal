"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Sun,
  LayoutDashboard,
  LogIn,
  ArrowRight,
  BookOpen,
  Headphones,
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

  // Lock body scroll when mobile drawer is open
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

  const shortDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const compactDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      {/* Complete Header: Fixed/Sticky at top so it never shifts or scrolls away */}
      <header className="sticky top-0 z-30 w-full bg-card/98 backdrop-blur-md select-none border-b border-border shadow-xs">
        {/* ========================================================
            1. TOP STRIP:
            Left: Dateline (Date | Edition | Weather)
            Right: Financial Markets (Positioned beautifully above the search bar space)
            ======================================================== */}
        <div className="w-full pt-2.5 pb-1 text-xs text-muted-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 text-[11px] font-medium tracking-wide min-w-0">
            {/* Left: Dateline Info (Short Form) */}
            <div className="flex items-center space-x-2 sm:space-x-2.5 text-muted-foreground font-medium shrink-0">
              <span className="text-foreground font-semibold" suppressHydrationWarning>
                <span className="hidden sm:inline" suppressHydrationWarning>{shortDate}</span>
                <span className="sm:hidden" suppressHydrationWarning>{compactDate}</span>
              </span>

              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
              <span className="hidden sm:flex items-center gap-1">
                <Sun className="h-3 w-3 text-amber-500 shrink-0" />
                <span>19°C London</span>
              </span>
            </div>

            {/* Right: Financial Markets Ticker (Placed at top right above search bar) */}
            <div className="hidden md:flex items-center space-x-2.5 lg:space-x-4 font-mono text-[10px] lg:text-[11px] tracking-tight min-w-0 overflow-x-auto no-scrollbar py-0.5">
              <span className="font-sans font-bold uppercase tracking-wider text-[10px] text-foreground flex items-center gap-1.5 shrink-0">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                MARKETS:
              </span>
              <span className="flex items-center gap-1 shrink-0">
                <strong className="text-foreground font-semibold">S&amp;P 500</strong>
                <span>5,632.40</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+0.48%</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700 shrink-0">·</span>
              <span className="flex items-center gap-1 shrink-0">
                <strong className="text-foreground font-semibold">NASDAQ</strong>
                <span>17,910.12</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+0.82%</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden xl:inline">·</span>
              <span className="hidden xl:flex items-center gap-1 shrink-0">
                <strong className="text-foreground font-semibold">FTSE 100</strong>
                <span>8,245.90</span>
                <span className="text-red-600 dark:text-red-400 font-semibold">-0.15%</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden xl:inline">·</span>
              <span className="hidden xl:flex items-center gap-1 shrink-0">
                <strong className="text-foreground font-semibold">10Y Yield</strong>
                <span>4.12%</span>
                <span className="text-red-600 dark:text-red-400 font-semibold">-2 bps</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden xl:inline">·</span>
              <span className="hidden xl:flex items-center gap-1 shrink-0">
                <strong className="text-foreground font-semibold">Brent</strong>
                <span>$78.45</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+1.1%</span>
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            2. THE REFINED MASTHEAD
            (Chronicle on LEFT, Search Bar on RIGHT)
            ======================================================== */}
        <div className="w-full">
          {/* MOBILE MASTHEAD (<md) */}
          <div className="md:hidden px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
            {/* Left: Hamburger & Brand */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1 -ml-1 text-foreground hover:text-primary transition-colors focus:outline-none cursor-pointer shrink-0"
                aria-label="Open navigation menu and search"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <Link href="/" className="inline-block">
                  <h1 className="font-serif text-xl font-extrabold tracking-tight text-foreground uppercase leading-none truncate">
                    The Chronicle
                  </h1>
                </Link>
                <p className="font-serif italic text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5 truncate">
                  Veritas et Scientia · Since 1894
                </p>
              </div>
            </div>

            {/* Right: Clean Subscribe Button */}
            <div className="shrink-0 -mr-1">
              <Link
                href="#newsletter"
                className="bg-primary hover:bg-primary-hover text-white text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-md shadow-2xs transition-colors inline-block"
              >
                Subscribe
              </Link>
            </div>
          </div>

          {/* DESKTOP MASTHEAD (>=md) */}
          <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 lg:py-3.5">
            <div className="flex items-center justify-between gap-4 lg:gap-6 min-w-0">
              {/* Left Column: The Chronicle Title & Motto */}
              <div className="flex flex-col items-start justify-center min-w-0 shrink">
                <Link href="/" className="inline-block group">
                  <h1 className="font-serif text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground uppercase hover:opacity-90 transition-opacity leading-none">
                    The Chronicle
                  </h1>
                </Link>
                <p className="font-serif italic text-[11px] tracking-wide text-muted-foreground mt-1 font-medium truncate max-w-full">
                  Veritas et Scientia <span className="hidden xl:inline">· Independent Journalism Since 1894</span>
                </p>
              </div>

              {/* Right Column: Search Bar & User Actions */}
              <div className="flex items-center justify-end space-x-2.5 sm:space-x-3.5 flex-1 max-w-2xl min-w-0">
                {/* Search Bar on Right */}
                <div className="w-40 sm:w-48 lg:w-72 min-w-0">
                  <HeaderSearch isFullWidth />
                </div>

                {user ? (
                  <Link
                    href="/dashboard"
                    className="text-xs font-semibold text-foreground hover:text-primary transition-colors py-2 px-3 rounded-md border border-border inline-flex items-center gap-1.5 shrink-0"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span>Admin Desk</span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="text-xs font-semibold text-foreground hover:text-primary transition-colors py-2 px-3 shrink-0"
                  >
                    Sign In
                  </Link>
                )}

                <Link
                  href="#newsletter"
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-3.5 sm:px-4 py-2 rounded-md shadow-2xs transition-all inline-flex items-center gap-1 shrink-0"
                >
                  <span>Subscribe</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE MARKETS STRIP (<md only) */}
        <div className="md:hidden w-full py-1 text-xs text-muted-foreground border-t border-border/40">
          <div className="px-4 flex items-center space-x-4 text-[10px] font-mono tracking-tight whitespace-nowrap overflow-x-auto no-scrollbar">
            <span className="font-sans font-bold uppercase tracking-wider text-[9px] text-foreground flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              MARKETS:
            </span>
            <span className="flex items-center gap-1">
              <strong className="text-foreground font-semibold">S&amp;P 500</strong>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+0.48%</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1">
              <strong className="text-foreground font-semibold">NASDAQ</strong>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+0.82%</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1">
              <strong className="text-foreground font-semibold">FTSE 100</strong>
              <span className="text-red-600 dark:text-red-400 font-semibold">-0.15%</span>
            </span>
          </div>
        </div>

        {/* ========================================================
            3. CATEGORY NAVIGATION BAR
            ======================================================== */}
        <nav className="border-t border-border py-1.5 flex items-center justify-between overflow-x-auto no-scrollbar w-full max-w-full">
          <ul className="flex items-center space-x-5 sm:space-x-8 text-xs sm:text-sm font-medium tracking-normal min-w-max mx-auto px-4">
            <li>
              <Link
                href="/"
                className="border-b-2 border-primary text-primary font-bold py-1 inline-block"
              >
                Top Stories
              </Link>
            </li>
            {MOCK_CATEGORIES.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/?category=${category.slug}`}
                  className="text-foreground hover:text-primary transition-colors py-1 font-medium inline-block"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="#opinion"
                className="text-foreground hover:text-primary transition-colors py-1 font-medium inline-block"
              >
                Opinion
              </Link>
            </li>
            <li>
              <Link
                href="#video"
                className="text-foreground hover:text-primary transition-colors py-1 font-medium inline-flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                Video
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* ========================================================
          MOBILE / TABLET NAVIGATION DRAWER (SIDEBAR)
          ======================================================== */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex h-full w-84 max-w-[88vw] flex-col border-r border-border bg-card shadow-2xl select-none animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border p-4 sm:p-5">
              <div>
                <h3 className="font-serif font-bold text-lg text-foreground">
                  The Chronicle
                </h3>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5">
                  Navigation &amp; Search
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Search Box inside Sidebar */}
            <div className="p-4 border-b border-border bg-slate-50/60 dark:bg-slate-900/40">
              <HeaderSearch
                isFullWidth
                onSelectArticle={() => setIsMobileMenuOpen(false)}
              />
            </div>

            {/* Drawer Categories */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2 px-2">
                  Sections
                </span>
                <div className="space-y-1">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/10 text-primary font-semibold text-xs"
                  >
                    <span>Top Stories</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  {MOCK_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/?category=${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-foreground hover:bg-muted font-medium text-xs transition-colors"
                    >
                      <span>{cat.name}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </Link>
                  ))}
                  <Link
                    href="#opinion"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-foreground hover:bg-muted font-medium text-xs transition-colors"
                  >
                    <span>Opinion &amp; Columnists</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </Link>
                </div>
              </div>

              {/* Quick Links in Drawer */}
              <div className="pt-3 border-t border-border">
                <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2 px-2">
                  Reader Services
                </span>
                <div className="space-y-1 text-xs">
                  <Link
                    href="#epaper"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>e-Paper Edition</span>
                  </Link>
                  <Link
                    href="#audio"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <Headphones className="h-3.5 w-3.5" />
                    <span>Audio Dispatches</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-border p-4 bg-muted/40 space-y-2">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-white text-xs font-semibold shadow-xs"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Go to Admin Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border bg-card text-foreground text-xs font-semibold shadow-2xs hover:bg-muted transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In / Staff Desk</span>
                </Link>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
