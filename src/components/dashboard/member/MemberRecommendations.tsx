"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { MockArticle } from "@/lib/mock-data";

interface MemberRecommendationsProps {
  recommended: MockArticle[];
}

export default function MemberRecommendations({
  recommended,
}: MemberRecommendationsProps) {
  return (
    <div className="space-y-6">
      {/* Recommended Editorial Picks */}
      <div className="border border-border bg-card rounded-lg overflow-hidden">
        <div className="border-b border-border bg-secondary/30 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-bold text-foreground">
              Recommended For You
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Curated by the editors based on your reading topics.
          </p>
        </div>

        <div className="divide-y divide-border p-3 space-y-3 divide-y-0">
          {recommended.map((article) => (
            <div
              key={article.id}
              className="p-3 rounded-md border border-border/70 hover:border-border hover:bg-secondary/20 transition-all group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[9px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-xs"
                  style={{
                    backgroundColor: `${article.category.color}15`,
                    color: article.category.color,
                  }}
                >
                  {article.category.name}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {article.readTime}
                </span>
              </div>

              <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                <Link href={`/articles/${article.slug}`}>
                  {article.title}
                </Link>
              </h4>

              <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{article.author.name}</span>
                <Link
                  href={`/articles/${article.slug}`}
                  className="inline-flex items-center gap-1 text-primary font-medium hover:underline text-[11px]"
                >
                  <span>Read Story</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Member Patron Pass Card */}
      <div className="border border-border bg-card rounded-lg p-5 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Reader Patron Pass
            </h4>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-live font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-live inline-block" />
              Verified Active Tier
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          Full unlimited archival access to all broadsheet dispatches, investigative briefs, and verified community commenting.
        </p>

        <div className="space-y-2 border-t border-border/60 pt-3 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              Ad-Free Broadsheet Experience
            </span>
            <span className="text-foreground font-semibold">Enabled</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Archival Deep Search</span>
            <span className="text-foreground font-semibold">Unlimited</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Next Renewal</span>
            <span className="font-mono text-[11px]">Jan 15, 2027</span>
          </div>
        </div>
      </div>
    </div>
  );
}
