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
      return `${(views / 1000000).toFixed(2)}M`;
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
    <section className="w-full">
      {/* Mobile Swipe Hint */}
      <div className="flex items-center justify-between mb-2 lg:hidden">
        <span className="font-mono text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Operational Metrics
        </span>
        <span className="text-[11px] text-primary font-medium">
          Swipe cards →
        </span>
      </div>

      {/* Responsive Container:
          - Mobile (default): horizontal snap-scrollable strip with no-scrollbar
          - Tablet (sm/md): 2x2 grid (grid-cols-2)
          - Desktop (lg): 4 columns in 1 row (grid-cols-4)
      */}
      <div className="flex overflow-x-auto no-scrollbar gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 pb-2 sm:pb-0 snap-x snap-mandatory">
        {/* Card 1: Total Articles */}
        <Link
          href="/dashboard/articles"
          className="min-w-[200px] flex-1 bg-card border border-border rounded-xl p-4 sm:p-5 shadow-2xs snap-start relative overflow-hidden flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors group"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary sm:hidden" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Total Articles
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900">
              <Newspaper className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
              {stats.totalArticles.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px]">
              <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold gap-0.5">
                <TrendingUp className="h-3.5 w-3.5" /> +12%
              </span>
              <span className="text-muted-foreground">from last week</span>
            </div>
          </div>
        </Link>

        {/* Card 2: Published */}
        <Link
          href="/dashboard/articles"
          className="min-w-[200px] flex-1 bg-card border border-border rounded-xl p-4 sm:p-5 shadow-2xs snap-start relative overflow-hidden flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors group"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600 sm:hidden" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Published
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
              {stats.publishedArticles.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px]">
              <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold gap-0.5">
                <TrendingUp className="h-3.5 w-3.5" /> +{publishedRate}%
              </span>
              <span className="text-muted-foreground">vs target pace</span>
            </div>
          </div>
        </Link>

        {/* Card 3: In Review & Draft */}
        <Link
          href="/dashboard/articles"
          className="min-w-[200px] flex-1 bg-card border border-border rounded-xl p-4 sm:p-5 shadow-2xs snap-start relative overflow-hidden flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors group"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-600 sm:hidden" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              In Review &amp; Draft
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
              {stats.draftArticles.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px]">
              <span className="inline-flex items-center text-amber-700 dark:text-amber-400 font-medium gap-0.5">
                <AlertCircle className="h-3.5 w-3.5" /> 18 urgent
              </span>
              <span className="text-muted-foreground">queued proofing</span>
            </div>
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
              {formatViews(stats.totalViews)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px]">
              <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold gap-0.5">
                <TrendingUp className="h-3.5 w-3.5" /> +24.1%
              </span>
              <span className="text-muted-foreground">unique readers today</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
