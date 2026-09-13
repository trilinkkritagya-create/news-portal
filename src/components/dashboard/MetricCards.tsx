"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Users,
  MessageSquare,
  Eye,
  TrendingUp,
} from "lucide-react";
import { DashboardStats } from "@/lib/dashboard/get-dashboard-data";

interface MetricCardsProps {
  stats: DashboardStats;
}

export default function MetricCards({ stats }: MetricCardsProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const publishedRate =
    stats.totalArticles > 0
      ? Math.round((stats.publishedArticles / stats.totalArticles) * 100)
      : 100;

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
            Platform Summary
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
        {/* Card 1: Total Articles */}
        <Link
          href="/dashboard/articles"
          className="group relative flex w-[82vw] max-w-[310px] sm:w-[320px] lg:w-auto shrink-0 lg:shrink snap-start flex-col justify-between border border-border bg-card p-5 rounded-lg transition-all hover:border-foreground/30 hover:shadow-sm"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mb-2">
              <span className="text-xs">Total Articles</span>
              <span className="rounded-md border border-border bg-secondary p-1.5 text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                <FileText className="h-4 w-4" />
              </span>
            </div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {stats.totalArticles}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <span>
                {stats.publishedArticles} published ·{" "}
                <strong className="text-foreground">
                  {stats.draftArticles} drafts
                </strong>
              </span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <span>Status:</span>
            <span className="font-semibold text-live">
              {publishedRate}% Published
            </span>
          </div>
        </Link>

        {/* Card 2: Total Users */}
        <Link
          href="/dashboard/users"
          className="group relative flex w-[82vw] max-w-[310px] sm:w-[320px] lg:w-auto shrink-0 lg:shrink snap-start flex-col justify-between border border-border bg-card p-5 rounded-lg transition-all hover:border-foreground/30 hover:shadow-sm"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mb-2">
              <span className="text-xs">Total Users</span>
              <span className="rounded-md border border-border bg-secondary p-1.5 text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                <Users className="h-4 w-4" />
              </span>
            </div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <span>{stats.activeAuthors} authors &amp; staff writers</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <span>Access Control:</span>
            <span className="font-semibold text-primary">Active</span>
          </div>
        </Link>

        {/* Card 3: Total Comments */}
        <Link
          href="/dashboard/comments"
          className="group relative flex w-[82vw] max-w-[310px] sm:w-[320px] lg:w-auto shrink-0 lg:shrink snap-start flex-col justify-between border border-border bg-card p-5 rounded-lg transition-all hover:border-foreground/30 hover:shadow-sm"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mb-2">
              <span className="text-xs">Comments &amp; Feedback</span>
              <span className="rounded-md border border-border bg-secondary p-1.5 text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                <MessageSquare className="h-4 w-4" />
              </span>
            </div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {stats.totalComments.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <span>{stats.totalLikes.toLocaleString()} total article likes</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <span>Moderation:</span>
            <span className="font-semibold text-foreground">Active</span>
          </div>
        </Link>

        {/* Card 4: Total Readership */}
        <div className="relative flex w-[82vw] max-w-[310px] sm:w-[320px] lg:w-auto shrink-0 lg:shrink snap-start flex-col justify-between border border-border bg-card p-5 rounded-lg">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mb-2">
              <span className="text-xs">Total Views</span>
              <span className="rounded-md border border-border bg-secondary p-1.5 text-foreground">
                <Eye className="h-4 w-4" />
              </span>
            </div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {stats.totalViews >= 1000
                ? `${(stats.totalViews / 1000).toFixed(1)}K`
                : stats.totalViews}
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-live font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{stats.engagementRate} this week</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <span>Coverage:</span>
            <span>{stats.totalCategories} Categories</span>
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
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              activeIndex === i
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
