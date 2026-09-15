"use client";

import Link from "next/link";
import { MockArticle } from "@/lib/mock-data";

interface BreakingTickerProps {
  article: MockArticle;
}

export default function BreakingTicker({ article }: BreakingTickerProps) {
  return (
    <section aria-label="Breaking News" className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3">
        {/* Crimson Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-red-600 text-white text-[11px] font-bold tracking-wider uppercase shrink-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white"></span>
          </span>
          BREAKING
        </div>

        {/* Headline & Live Tag */}
        <div className="overflow-hidden whitespace-nowrap text-xs sm:text-sm font-medium text-foreground flex items-center gap-3 min-w-0">
          <Link
            href={`/articles/${article.slug}`}
            className="hover:text-primary transition-colors truncate block"
          >
            {article.title}
          </Link>
          <span className="text-muted-foreground text-xs shrink-0 hidden sm:flex items-center gap-1 font-mono">
            <span className="inline-block w-1 h-1 rounded-full bg-slate-400"></span>
            Live Updates
          </span>
        </div>
      </div>
    </section>
  );
}
