"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bookmark,
  Share2,
  Clock,
  Terminal,
  Check,
} from "lucide-react";
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
  const [bookmarked, setBookmarked] = useState(false);
  const [shared, setShared] = useState(false);

  // Fallback stories if secondaryStories has fewer than 2
  const storyOne = secondaryStories[0] || leadStory;
  const storyTwo = secondaryStories[1] || trendingStories[0] || leadStory;

  // The Wire ranking: 5 ranked items
  const wireStories = [
    {
      rank: 1,
      category: "Politics",
      color: "text-red-600 dark:text-red-400",
      title: "Senate Enacts Landmark Clean Grid Modernization Accord",
      reads: "84.2k reads",
      time: "24m ago",
      id: trendingStories[0]?.id || leadStory.id,
    },
    {
      rank: 2,
      category: "Culture",
      color: "text-purple-600 dark:text-purple-400",
      title: "Venice Biennale Pavilion Explores Submerged Kinetic Architecture",
      reads: "62.1k reads",
      time: "1h ago",
      id: trendingStories[1]?.id || storyOne.id,
    },
    {
      rank: 3,
      category: "Tech",
      color: "text-blue-600 dark:text-blue-400",
      title: "Solid-State Battery Production Clears Commercial Gigafactory Milestone",
      reads: "48.9k reads",
      time: "2h ago",
      id: storyTwo.id,
    },
    {
      rank: 4,
      category: "Policy",
      color: "text-amber-600 dark:text-amber-400",
      title: "European Union Adopts Stricter AI Attribution Mandates for Financial Media",
      reads: "39.5k reads",
      time: "3h ago",
      id: storyOne.id,
    },
    {
      rank: 5,
      category: "Markets",
      color: "text-emerald-600 dark:text-emerald-400",
      title: "Bipartisan Antitrust Probe Subpoenas Cloud Infrastructure Duopoly",
      reads: "31.0k reads",
      time: "4h ago",
      id: leadStory.id,
    },
  ];

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const getAuthorInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <section className="space-y-6">
      {/* 3-COLUMN EDITORIAL BROADSHEET GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================
            1. DOMINANT LEAD STORY (~60% / 7 COLS)
            ======================================================== */}
        <article className="lg:col-span-7 space-y-4 lg:pr-6 lg:border-r lg:border-border">
          {/* Top Eyebrow & Live Timestamp */}
          <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-primary text-white">
                {leadStory.category.name}
              </span>
              <span className="text-xs text-muted-foreground font-serif">
                Frontier Science &amp; Intelligence
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              Dispatched 18 mins ago
            </span>
          </div>

          {/* Lead Headline */}
          <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-foreground hover:text-primary transition-colors cursor-pointer">
            <Link href={`/dashboard/articles?id=${leadStory.id}`}>
              {leadStory.title}
            </Link>
          </h1>

          {/* Lead Excerpt */}
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
            {leadStory.excerpt}
          </p>

          {/* Lead Visual Image with Photojournalism Figcaption */}
          <figure className="group relative overflow-hidden rounded-lg bg-slate-900 aspect-[16/9] border border-border shadow-sm">
            <Image
              src={leadStory.featuredImage}
              alt={leadStory.title}
              fill
              priority
              unoptimized
              className="object-cover group-hover:scale-[1.015] transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
            <figcaption className="absolute bottom-2.5 left-3.5 right-3.5 text-[11px] text-slate-200 flex flex-col md:flex-row md:justify-between md:items-center gap-1 drop-shadow-md min-w-0">
              <span className="truncate max-w-md">
                Cryogenic benchmark calibration during high-throughput deployment test.
              </span>
              <span className="font-mono text-[10px] text-slate-300 shrink-0">
                Dr. K. Arisawa / Quantum Optics Institute
              </span>
            </figcaption>
          </figure>

          {/* Reporter Byline & Interactive Metadata Controls */}
          <div className="flex flex-wrap items-center justify-between pt-3 border-t border-border/80 gap-3 text-xs">
            <div className="flex items-center space-x-3">
              {leadStory.author.image ? (
                <Image
                  src={leadStory.author.image}
                  alt={leadStory.author.name}
                  width={36}
                  height={36}
                  unoptimized
                  className="h-9 w-9 rounded-full object-cover border border-primary/20 shadow-xs shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center font-headline text-xs border border-primary/20 shrink-0">
                  {getAuthorInitials(leadStory.author.name)}
                </div>
              )}
              <div>
                <p className="font-semibold text-foreground">
                  {leadStory.author.name}
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Senior Technology Correspondent
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-muted-foreground">
              <span className="flex items-center gap-1 text-[11px]">
                <Clock className="h-3.5 w-3.5" />
                {leadStory.readTime || "6 min read"}
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <button
                type="button"
                onClick={() => setBookmarked(!bookmarked)}
                className={`transition-colors p-1 rounded-md flex items-center gap-1 ${bookmarked
                  ? "text-primary font-semibold"
                  : "hover:text-primary"
                  }`}
                title={bookmarked ? "Bookmarked" : "Bookmark article"}
              >
                <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="hover:text-primary transition-colors p-1 rounded-md flex items-center gap-1"
                title="Share article link"
              >
                {shared ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </article>

        {/* ========================================================
            2. MIDDLE COLUMN: SECONDARY STORIES (~25% / 3 COLS)
            ======================================================== */}
        <div className="lg:col-span-3 space-y-6 lg:border-r lg:border-border lg:pr-6">
          {/* Story 1: Markets */}
          <article className="space-y-2.5 pb-6 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase">
                {storyOne.category.name}
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                45 mins ago
              </span>
            </div>
            <Link
              href={`/dashboard/articles?id=${storyOne.id}`}
              className="block group"
            >
              <div className="relative overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 aspect-[16/9] border border-border">
                <Image
                  src={storyOne.featuredImage}
                  alt={storyOne.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-headline text-base sm:text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors cursor-pointer mt-2.5">
                {storyOne.title}
              </h3>
            </Link>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans line-clamp-3">
              {storyOne.excerpt}
            </p>
            <p className="text-[11px] text-muted-foreground font-medium pt-1">
              By <span className="text-foreground">{storyOne.author.name}</span> · Markets Desk
            </p>
          </article>

          {/* Story 2: World Affairs */}
          <article className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 tracking-wider uppercase">
                {storyTwo.category.name}
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                1 hr ago
              </span>
            </div>
            <Link
              href={`/dashboard/articles?id=${storyTwo.id}`}
              className="block group"
            >
              <div className="relative overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 aspect-[16/9] border border-border">
                <Image
                  src={storyTwo.featuredImage}
                  alt={storyTwo.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-headline text-base sm:text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors cursor-pointer mt-2.5">
                {storyTwo.title}
              </h3>
            </Link>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans line-clamp-3">
              {storyTwo.excerpt}
            </p>
            <p className="text-[11px] text-muted-foreground font-medium pt-1">
              By <span className="text-foreground">{storyTwo.author.name}</span> · Brussels Bureau
            </p>
          </article>
        </div>

        {/* ========================================================
            3. RIGHT COLUMN: THE WIRE · MOST READ (~15-20% / 2 COLS)
            ======================================================== */}
        <aside className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-foreground pb-2">
            <h3 className="font-headline text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <span>The Wire</span>
              <span className="text-muted-foreground font-normal">·</span>
              <span>Most Read</span>
            </h3>
            <span
              className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
              title="Live data feed active"
            />
          </div>

          <ol className="divide-y divide-border/80">
            {wireStories.map((item) => (
              <li key={item.rank} className="py-3 group cursor-pointer">
                <Link
                  href={`/dashboard/articles?id=${item.id}`}
                  className="flex items-start gap-3"
                >
                  <span className="font-headline text-2xl font-black text-slate-300 dark:text-slate-700 group-hover:text-primary transition-colors leading-none pt-0.5">
                    {item.rank}
                  </span>
                  <div className="min-w-0">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wide block ${item.color}`}
                    >
                      {item.category}
                    </span>
                    <h4 className="font-headline text-xs font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2 mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                      {item.reads} • {item.time}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>

          {/* Chronicle FastWire Institutional Terminal Card */}
          <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-md border border-border text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
            <p className="font-bold text-foreground flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              <span>Chronicle FastWire</span>
            </p>
            <p className="text-[10px] leading-tight text-muted-foreground">
              Delivering real-time institutional feeds to 14,000+ financial terminals daily.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
