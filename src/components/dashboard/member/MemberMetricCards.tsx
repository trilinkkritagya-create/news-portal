"use client";

import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Heart,
  MessageSquare,
  Flame,
} from "lucide-react";

interface MemberMetricCardsProps {
  stats: {
    bookmarkedCount: number;
    likedCount: number;
    commentsPosted: number;
    readingStreakDays: number;
  };
}

export default function MemberMetricCards({ stats }: MemberMetricCardsProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.firstElementChild
        ? (sliderRef.current.firstElementChild as HTMLElement).offsetWidth + 16
        : 300;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16
      : 300;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(3, Math.max(0, index)));
  };

  const scrollToCard = (index: number) => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.firstElementChild
        ? (sliderRef.current.firstElementChild as HTMLElement).offsetWidth + 16
        : 300;
      sliderRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  return (
    <section className="w-full">
      {/* Header with Title and Mobile Slider Controls */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Reader Telemetry &amp; Activity
          </h2>
          <span className="text-[11px] font-mono text-muted-foreground lg:hidden">
            ({activeIndex + 1}/4)
          </span>
        </div>

        {/* Slider Controls for Mobile & Tablet */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
            aria-label="Previous metric card"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
            aria-label="Next metric card"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Slider on Mobile/Tablet · 4-Column Grid on Desktop */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-4 pb-2 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:pb-0"
      >
        {/* Card 1: Saved Articles */}
        <a
          href="#saved-articles"
          className="group relative flex w-[82vw] max-w-[310px] sm:w-[320px] lg:w-auto shrink-0 lg:shrink snap-start flex-col justify-between border border-border bg-card p-5 rounded-lg transition-all hover:border-foreground/30 hover:shadow-sm"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mb-2">
              <span className="text-xs">Saved Manuscripts</span>
              <span className="rounded-md border border-border bg-secondary p-1.5 text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                <Bookmark className="h-4 w-4" />
              </span>
            </div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {stats.bookmarkedCount}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <span>Saved for in-depth reading &amp; research</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <span>Reading Shelf:</span>
            <span className="font-semibold text-primary">Active Library</span>
          </div>
        </a>

        {/* Card 2: Liked Articles */}
        <div className="relative flex w-[82vw] max-w-[310px] sm:w-[320px] lg:w-auto shrink-0 lg:shrink snap-start flex-col justify-between border border-border bg-card p-5 rounded-lg">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mb-2">
              <span className="text-xs">Stories Appreciated</span>
              <span className="rounded-md border border-border bg-secondary p-1.5 text-foreground">
                <Heart className="h-4 w-4 text-red-500" />
              </span>
            </div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {stats.likedCount}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <span>Articles supported and liked</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <span>Feedback Rate:</span>
            <span className="font-semibold text-live">High Engagement</span>
          </div>
        </div>

        {/* Card 3: Comments Posted */}
        <a
          href="#community-comments"
          className="group relative flex w-[82vw] max-w-[310px] sm:w-[320px] lg:w-auto shrink-0 lg:shrink snap-start flex-col justify-between border border-border bg-card p-5 rounded-lg transition-all hover:border-foreground/30 hover:shadow-sm"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mb-2">
              <span className="text-xs">Discussions Posted</span>
              <span className="rounded-md border border-border bg-secondary p-1.5 text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                <MessageSquare className="h-4 w-4" />
              </span>
            </div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {stats.commentsPosted}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <span>Community thoughts and discussions</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <span>Status:</span>
            <span className="font-semibold text-foreground">Verified Member</span>
          </div>
        </a>

        {/* Card 4: Reading Streak */}
        <div className="relative flex w-[82vw] max-w-[310px] sm:w-[320px] lg:w-auto shrink-0 lg:shrink snap-start flex-col justify-between border border-border bg-card p-5 rounded-lg">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mb-2">
              <span className="text-xs">Reading Streak</span>
              <span className="rounded-md border border-border bg-amber-500/10 p-1.5 text-amber-600 dark:text-amber-400">
                <Flame className="h-4 w-4 fill-amber-500" />
              </span>
            </div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {stats.readingStreakDays} Days
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <span>Consecutive daily newsroom reading</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <span>Patron Rank:</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              Gold Reader
            </span>
          </div>
        </div>
      </div>

      {/* Pagination Dot Indicators for Mobile */}
      <div className="flex items-center justify-center gap-1.5 mt-2 lg:hidden">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToCard(i)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${activeIndex === i
                ? "w-5 bg-foreground"
                : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
