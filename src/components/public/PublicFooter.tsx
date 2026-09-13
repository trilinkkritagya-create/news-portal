"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  Globe,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Send,
} from "lucide-react";
import { MOCK_CATEGORIES } from "@/lib/mock-data";

export default function PublicFooter() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-slate-800 bg-[#090d16] text-slate-300 mt-16 antialiased">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* ========================================================
            Top Tier: Masthead Identity & Quick Briefing Subscription
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80 items-start">
          {/* Brand & Editorial Mission (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950 font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                NP
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white block leading-none">
                  NEWS PORTAL
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mt-0.5 block">
                  The Daily Dispatch · Global Bureau
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
              Delivering independent global reporting, investigative intelligence, and deep-dive analysis across sovereign markets, AI frontiers, deep space science, and contemporary culture.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 text-emerald-400 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                24/7 Global Wire Active
              </span>

              <span className="inline-flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="h-4 w-4 text-slate-400" />
                Verified &amp; Fact-Checked
              </span>

              <span className="inline-flex items-center gap-1.5 text-slate-400">
                <Globe className="h-4 w-4 text-slate-400" />
                London · New York · Tokyo
              </span>
            </div>
          </div>

          {/* Quick Dispatch Newsletter Box (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Morning Intelligence Dispatch
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive our executive editor&apos;s daily brief of the top global stories, delivered before the market opens at 6:00 AM UTC.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 px-3.5 py-2.5 text-xs text-emerald-300 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>You&apos;re subscribed to the morning dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-white focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-950 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
                >
                  <span>Join</span>
                  <Send className="h-3 w-3" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ========================================================
            Middle Tier: Structured Editorial Columns (4 Columns)
            ======================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-slate-800/80">
          {/* Column 1: News Desks */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Editorial Desks
            </h4>
            <ul className="space-y-2 text-xs">
              {MOCK_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/?category=${cat.slug}#dispatches`}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#dispatches"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  All Dispatches Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Commentary & Columnists */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Perspectives &amp; Ideas
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="#opinion" className="hover:text-white transition-colors">
                  Resident Columnists
                </Link>
              </li>
              <li>
                <Link href="#opinion" className="hover:text-white transition-colors">
                  The Editorial Board
                </Link>
              </li>
              <li>
                <Link href="#opinion" className="hover:text-white transition-colors">
                  Guest Essays &amp; Analysis
                </Link>
              </li>
              <li>
                <Link href="#opinion" className="hover:text-white transition-colors">
                  Letters to the Editor
                </Link>
              </li>
              <li>
                <Link href="#newsletter" className="hover:text-white transition-colors">
                  Weekly Culture Review
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Reader Hub
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In / Create Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Member Reading Hub
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Saved Bookmarks
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Reading History
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-white font-semibold hover:underline">
                  Staff Newsroom Console →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Standards & Syndicate */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              Trust &amp; Syndicate
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/#dispatches" className="hover:text-white transition-colors">
                  Editorial Charter
                </Link>
              </li>
              <li>
                <Link href="/#dispatches" className="hover:text-white transition-colors">
                  Fact-Checking Guidelines
                </Link>
              </li>
              <li>
                <Link href="/#dispatches" className="hover:text-white transition-colors">
                  Corrections &amp; Clarifications
                </Link>
              </li>
              <li>
                <Link href="/#dispatches" className="hover:text-white transition-colors">
                  Syndication &amp; Licensing
                </Link>
              </li>
              <li>
                <Link href="/#dispatches" className="hover:text-white transition-colors">
                  Careers &amp; Fellowships
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ========================================================
            Bottom Tier: Copyright, Legal & Back to Top
            ======================================================== */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© 2026 News Portal Media Syndicate.</span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="hover:text-white transition-colors cursor-pointer">
                Terms of Service
              </span>
              <span>·</span>
              <span className="hover:text-white transition-colors cursor-pointer">
                Privacy Policy
              </span>
              <span>·</span>
              <span className="hover:text-white transition-colors cursor-pointer">
                Editorial Ethics
              </span>
            </div>
          </div>

          {/* Sleek Back to Top Button */}
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 hover:border-slate-500 transition-all cursor-pointer shadow-xs"
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
