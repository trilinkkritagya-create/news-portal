"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";

export default function PublicFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t border-border bg-card dark:bg-card text-foreground mt-auto antialiased">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Top Footer Masthead & Information Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-border">
          {/* Brand & Editorial Mission Column (2 cols) */}
          <div className="col-span-2 md:col-span-2 space-y-3">
            <Link href="/" className="inline-block group">
              <span className="font-headline text-xl font-bold tracking-tight text-foreground uppercase group-hover:text-primary transition-colors">
                The Chronicle
              </span>
            </Link>
            <p className="text-xs text-muted-foreground font-serif leading-relaxed max-w-sm">
              Independent global journalism delivering authoritative investigations, market telemetry, and cultural critique since 1894.
            </p>
            <div className="pt-2 text-muted-foreground">
              <span className="text-[11px] font-mono block">
                Bureaus: London · New York · Tokyo · Brussels · Singapore
              </span>
            </div>
          </div>

          {/* Sections Column */}
          <div className="space-y-2">
            <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-foreground">
              Sections
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/#dispatches"
                  className="hover:text-foreground transition-colors"
                >
                  World News
                </Link>
              </li>
              <li>
                <Link
                  href="/#dispatches"
                  className="hover:text-foreground transition-colors"
                >
                  Markets &amp; Economy
                </Link>
              </li>
              <li>
                <Link
                  href="/#dispatches"
                  className="hover:text-foreground transition-colors"
                >
                  Tech &amp; AI Frontier
                </Link>
              </li>
              <li>
                <Link
                  href="/#dispatches"
                  className="hover:text-foreground transition-colors"
                >
                  Politics &amp; Law
                </Link>
              </li>
              <li>
                <Link
                  href="#opinion"
                  className="hover:text-foreground transition-colors"
                >
                  Editorial Voices
                </Link>
              </li>
            </ul>
          </div>

          {/* Company / Governance Column */}
          <div className="space-y-2">
            <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-foreground">
              Company
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>
                <Link
                  href="#dispatches"
                  className="hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#dispatches"
                  className="hover:text-foreground transition-colors"
                >
                  Newsroom Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="#dispatches"
                  className="hover:text-foreground transition-colors"
                >
                  Ethics Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#dispatches"
                  className="hover:text-foreground transition-colors"
                >
                  Masthead
                </Link>
              </li>
              <li>
                <Link
                  href="#dispatches"
                  className="hover:text-foreground transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="space-y-2">
            <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-foreground">
              Services
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-primary font-medium text-foreground transition-colors flex items-center gap-1"
                >
                  <span>Admin Console</span>
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">
                    Staff
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-foreground transition-colors"
                >
                  Subscriber Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="#newsletter"
                  className="hover:text-foreground transition-colors"
                >
                  Daily Dispatches
                </Link>
              </li>
              <li>
                <Link
                  href="#newsletter"
                  className="hover:text-foreground transition-colors"
                >
                  e-Paper Archive
                </Link>
              </li>
              <li>
                <Link
                  href="#dispatches"
                  className="hover:text-foreground transition-colors"
                >
                  Syndication &amp; Feeds
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Live Status Row */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 The Chronicle Publishing Company. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span>Secure TLS 1.3 Certified</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-foreground font-sans font-medium transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
