"use client";

import Link from "next/link";
import { History, CheckCircle2, Clock3 } from "lucide-react";
import { MockArticle } from "@/lib/mock-data";
import { MemberReadingHistoryItem } from "@/lib/types/dashboard.types";

interface MemberReadingHistoryProps {
  history: MemberReadingHistoryItem[];
}

export default function MemberReadingHistory({
  history,
}: MemberReadingHistoryProps) {
  return (
    <div
      id="reading-history"
      className="border border-border bg-card rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/30 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <History className="h-4.5 w-4.5 text-muted-foreground" />
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            Reading History &amp; Progress
          </h2>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {history.length} Sessions
        </span>
      </div>

      {/* History Items */}
      <div className="divide-y divide-border">
        {history.map((item, idx) => {
          const isComplete = item.progress === "100%";
          const progressPercent =
            parseInt(item.progress.replace("%", ""), 10) || 0;

          return (
            <div
              key={idx}
              className="p-4 sm:p-5 hover:bg-secondary/15 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {item.article.category && (
                    <span
                      className="border px-1.5 py-0.5 font-mono text-[9px] uppercase font-bold tracking-wider rounded-xs"
                      style={{
                        borderColor: `${item.article.category.color}40`,
                        backgroundColor: `${item.article.category.color}15`,
                        color: item.article.category.color,
                      }}
                    >
                      {item.article.category.name}
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                    <Clock3 className="h-3 w-3" />
                    {item.readAt}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                  <Link href={`/articles/${item.article.slug}`}>
                    {item.article.title}
                  </Link>
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  By {item.article.author.name} · {item.article.readTime}
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="w-full sm:w-36 shrink-0 flex items-center sm:flex-col sm:items-end gap-2 sm:gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  {isComplete ? (
                    <span className="inline-flex items-center gap-1 text-live font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Completed
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      {item.progress} Read
                    </span>
                  )}
                </div>
                <div className="flex-1 sm:w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isComplete ? "bg-live" : "bg-primary"
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
