"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OpinionColumns() {
  const columnists = [
    {
      initials: "MS",
      name: "Marcus Sterling",
      role: "Lead Political Essayist",
      quote:
        "“The Fragile Consensus: Why Institutional Trust Demands Radically Transparent Governance.”",
      body: "Democratic resilience cannot rely on opaque executive prerogatives when civic cohesion is tested by asynchronous communication shifts.",
      color: "bg-slate-800",
      href: "/dashboard/articles",
    },
    {
      initials: "ER",
      name: "Dr. Elena Rostova",
      role: "Digital Ethics & Frontier Tech",
      quote:
        "“We Are Engineering Cognitive Engines Faster Than Our Legal Frameworks Can Comprehend.”",
      body: "When models simulate synthetic intentions, constitutional doctrines around responsibility and agency must be rewritten from first principles.",
      color: "bg-primary",
      href: "/dashboard/articles",
    },
    {
      initials: "DT",
      name: "David Thorne",
      role: "Global Economics & Capital",
      quote:
        "“The Re-Shoring Paradox: How Subsidies Risk Fracturing the Multilateral Trading System.”",
      body: "Industrial policy guarantees short-term domestic self-reliance while quietly inflating global consumer costs and sparking retaliatory tariffs.",
      color: "bg-slate-700",
      href: "/dashboard/articles",
    },
  ];

  return (
    <section id="opinion" className="border-t border-border pt-8 space-y-6 scroll-mt-20">
      {/* Section Header with Rule */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="flex items-center space-x-4 flex-1">
          <h2 className="font-headline text-xl font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 shrink-0">
            Opinion &amp; Editorial Voices
          </h2>
          <div className="hidden sm:block flex-grow border-t border-border" />
        </div>
        <span className="text-xs text-muted-foreground font-serif italic shrink-0">
          Perspectives on Governance &amp; Progress
        </span>
      </div>

      {/* 3 Columnists Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {columnists.map((col, idx) => (
          <div
            key={idx}
            className="bg-amber-50/40 dark:bg-amber-950/20 p-6 rounded-lg border border-amber-200/60 dark:border-amber-800/40 flex flex-col justify-between hover:border-amber-400/80 transition-colors shadow-2xs"
          >
            <div className="space-y-3">
              {/* Author Info */}
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded-full ${col.color} text-white font-headline text-sm font-bold flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-xs shrink-0`}
                >
                  {col.initials}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">
                    {col.name}
                  </h3>
                  <p className="text-[11px] text-amber-800 dark:text-amber-400 font-medium">
                    {col.role}
                  </p>
                </div>
              </div>

              {/* Quote Headline */}
              <blockquote className="font-headline italic text-sm text-slate-800 dark:text-slate-200 leading-relaxed pt-2">
                {col.quote}
              </blockquote>

              {/* Summary Text */}
              <p className="text-xs text-slate-600 dark:text-slate-400 font-serif leading-relaxed">
                {col.body}
              </p>
            </div>

            {/* Read Column Link */}
            <Link
              href={col.href}
              className="inline-flex items-center gap-1.5 mt-5 text-xs font-bold text-amber-800 dark:text-amber-400 hover:underline pt-2 border-t border-amber-200/50 dark:border-amber-800/30"
            >
              <span>Read Column</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
