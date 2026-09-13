"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, TrendingUp } from "lucide-react";
import { MockArticle } from "@/lib/mock-data";

interface HeroLeadSectionProps {
  leadStory: MockArticle;
  secondaryStories: MockArticle[];
  trendingStories: MockArticle[];
}

export default function HeroLeadSection({
  leadStory,
  secondaryStories,
  trendingStories,
}: HeroLeadSectionProps) {
  const formattedLeadDate = new Date(
    leadStory.publishedAt || leadStory.createdAt
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Ensure unique stories for the right column
  const combinedRightColumnStories = [
    ...secondaryStories,
    ...trendingStories,
  ].filter(
    (item, index, self) =>
      item.id !== leadStory.id &&
      index === self.findIndex((t) => t.id === item.id)
  );

  return (
    <section className="pt-1 pb-8 border-b border-border/70">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =======================================================
            Main Lead Story Card (7 Cols)
            ======================================================= */}
        <article className="lg:col-span-7 group flex flex-col space-y-4">
          {/* Lead Image */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/80 bg-secondary shadow-sm">
            <Image
              src={leadStory.featuredImage}
              alt={leadStory.title}
              fill
              priority
              unoptimized
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span
                className="rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: leadStory.category.color }}
              >
                {leadStory.category.name}
              </span>
              <span className="rounded-full bg-slate-950/70 backdrop-blur-xs px-2.5 py-1 text-[11px] font-semibold text-white">
                Featured Dispatch
              </span>
            </div>
          </div>

          {/* Headline & Excerpt */}
          <div className="space-y-2.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors leading-[1.2]">
              <Link href={`/dashboard/articles?id=${leadStory.id}`}>
                {leadStory.title}
              </Link>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {leadStory.excerpt}
            </p>
          </div>

          {/* Clean Unified Author Byline */}
          <div className="flex items-center gap-3 pt-1 text-xs">
            <Image
              src={leadStory.author.image}
              alt={leadStory.author.name}
              width={32}
              height={32}
              unoptimized
              className="h-8 w-8 rounded-full object-cover border border-border/80 shadow-2xs shrink-0"
            />
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
              <span className="font-semibold text-foreground">
                {leadStory.author.name}
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-muted-foreground">{formattedLeadDate}</span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-muted-foreground font-medium">{leadStory.readTime}</span>
              <span className="text-muted-foreground/40">•</span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                <Eye className="h-3 w-3 text-muted-foreground/70" />
                {leadStory.views.toLocaleString()} views
              </span>
            </div>
          </div>
        </article>

        {/* =======================================================
            Trending & Essential Dispatches Column (5 Cols)
            ======================================================= */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <h2 className="text-xs font-bold tracking-wider text-foreground uppercase flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Trending Intelligence</span>
            </h2>
            <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
              Updated Hourly
            </span>
          </div>

          <div className="space-y-3">
            {combinedRightColumnStories.slice(0, 4).map((story, idx) => (
              <article
                key={story.id}
                className="group flex gap-4 p-3 rounded-xl border border-border/70 hover:border-border hover:bg-secondary/40 transition-all bg-card/60"
              >
                {/* Ranking Index & Thumbnail */}
                <div className="relative h-20 w-24 sm:h-22 sm:w-28 shrink-0 overflow-hidden rounded-lg border border-border/80 bg-secondary">
                  <Image
                    src={story.featuredImage}
                    alt={story.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-1.5 left-1.5 flex h-5 w-5 items-center justify-center rounded-md bg-slate-950/80 text-[10px] font-mono font-bold text-white backdrop-blur-xs">
                    0{idx + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between min-w-0 flex-1">
                  <div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider block mb-1"
                      style={{ color: story.category.color }}
                    >
                      {story.category.name}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      <Link href={`/dashboard/articles?id=${story.id}`}>
                        {story.title}
                      </Link>
                    </h3>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="truncate max-w-[120px]">{story.author.name}</span>
                    <span className="font-mono text-[10px] shrink-0">{story.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
