"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MockArticle } from "@/lib/mock-data";

interface BreakingTickerProps {
  article: MockArticle;
}

export default function BreakingTicker({ article }: BreakingTickerProps) {
  return (
    <div className="border-b border-red-500/20 bg-red-500/5 dark:bg-red-950/30">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shrink-0 shadow-2xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
            </span>
            Breaking News
          </span>

          <span className="text-red-500/40 hidden sm:inline shrink-0 font-bold">•</span>

          <Link
            href={`/dashboard/articles?id=${article.id}`}
            className="font-medium text-foreground hover:text-red-600 dark:hover:text-red-400 truncate transition-colors"
          >
            {article.title}
          </Link>
        </div>

        <Link
          href={`/dashboard/articles?id=${article.id}`}
          className="hidden sm:inline-flex items-center gap-1 font-semibold text-[11px] text-red-600 dark:text-red-400 hover:underline shrink-0"
        >
          <span>Read bulletin</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
