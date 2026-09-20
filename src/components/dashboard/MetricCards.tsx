"use client";

import Link from "next/link";
import { Newspaper, CheckCircle2, Clock, Eye, TrendingUp } from "lucide-react";
import { AuthorDashboardStats } from "@/lib/types/dashboard.types";

interface MetricCardsProps {
  stats: AuthorDashboardStats;
}

export default function MetricCards({ stats }: MetricCardsProps) {
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toLocaleString();
  };

  const publishedRate =
    stats.totalArticles > 0
      ? Math.round((stats.publishedArticles / stats.totalArticles) * 100)
      : 100;

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
      {/* Card 1: Total Articles */}
      <Link
        href="/dashboard/articles"
        className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-xs hover:border-[#881337] transition-all group"
      >
        <div className="flex items-center justify-between text-muted-foreground mb-1">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
            Total Articles
          </span>
          <Newspaper className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground/80" />
        </div>
        <div className="mt-1 sm:mt-2 mb-0.5 flex items-baseline gap-1.5 sm:gap-2">
          <span className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            {stats.totalArticles.toLocaleString()}
          </span>
          <span className="text-[10px] sm:text-xs text-[#047857] font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-1 py-0.2 rounded">
            +12%
          </span>
        </div>
        <div className="text-[10px] sm:text-xs text-muted-foreground font-sans">
          dispatches filed to date
        </div>
      </Link>

      {/* Card 2: Published */}
      <Link
        href="/dashboard/articles"
        className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-xs hover:border-emerald-500 transition-all group"
      >
        <div className="flex items-center justify-between text-muted-foreground mb-1">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
            Published Live
          </span>
          <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
        </div>
        <div className="mt-1 sm:mt-2 mb-0.5 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            {stats.publishedArticles.toLocaleString()}
          </span>
          <span className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[11px] font-semibold tracking-wide">
            {publishedRate}% Rate
          </span>
        </div>
        <div className="text-[10px] sm:text-xs text-muted-foreground font-sans">
          public reader accessible
        </div>
      </Link>

      {/* Card 3: In Review & Draft */}
      <Link
        href="/dashboard/articles"
        className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-xs hover:border-amber-500 transition-all group"
      >
        <div className="flex items-center justify-between text-muted-foreground mb-1">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
            Review &amp; Draft
          </span>
          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
        </div>
        <div className="mt-1 sm:mt-2 mb-0.5 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            {stats.draftArticles.toLocaleString()}
          </span>
          <span className="bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[11px] font-semibold">
            In Queue
          </span>
        </div>
        <div className="text-[10px] sm:text-xs text-muted-foreground font-sans">
          active drafting workbench
        </div>
      </Link>

      {/* Card 4: Reader Impressions / Views */}
      <div className="min-w-[200px] flex-1 bg-card border border-border rounded-xl p-4 sm:p-5 shadow-2xs snap-start relative overflow-hidden flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
        <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600 sm:hidden" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            Reader Impressions
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900">
            <Eye className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-1">
          <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
            {/* {formatViews(stats.)} */}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px]">
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold gap-0.5">
              <TrendingUp className="h-3.5 w-3.5" /> +24.1%
            </span>
            <span className="text-muted-foreground">unique readers today</span>
          </div>
        </div>
      </div>
    </section>
  );
}
