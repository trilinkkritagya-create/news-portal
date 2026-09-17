"use client";

import Link from "next/link";
import {
  Newspaper,
  CheckCircle2,
  Clock,
  Eye,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { DashboardStats } from "@/lib/dashboard/get-dashboard-data";

interface MetricCardsProps {
  stats: DashboardStats;
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
      <div className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-muted-foreground mb-1">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
            Impressions
          </span>
          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-500" />
        </div>
        <div className="mt-1 sm:mt-2 mb-0.5 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            {formatViews(stats.totalViews)}
          </span>
          <span className="text-[10px] sm:text-xs text-[#047857] font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-1 py-0.2 rounded">
            +24%
          </span>
        </div>
        <div className="text-[10px] sm:text-xs text-muted-foreground font-sans">
          total reader impressions
        </div>
      </div>
    </section>
  );
}
