"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { MOCK_USERS } from "@/lib/mock-data";

export default function OpinionColumns() {
  const columnists = [
    {
      author: MOCK_USERS[0], // Alexander Vance
      title: "The Editorial Thesis: The Imperative of Open Research in the Quantum Century",
      excerpt: "Why foundational neural models must not be locked behind proprietary walls.",
      topic: "Editorial Column",
    },
    {
      author: MOCK_USERS[1], // Sophia Chen
      title: "Generative Systems and the Fragility of Digital Truth",
      excerpt: "As synthetic media surpasses human discrimination, provenance is our only defense.",
      topic: "Frontier Tech",
    },
    {
      author: MOCK_USERS[2], // Marcus Sterling
      title: "The Death of Settlement Delay: What Instant Liquidity Means for Markets",
      excerpt: "When central banks eliminate the clearing window, commercial banking will transform.",
      topic: "Macro Markets",
    },
  ];

  return (
    <section id="opinion" className="py-10 border-b border-border/80 space-y-6">
      <div className="flex items-center justify-between border-b border-border/80 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            Editorial Perspectives
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Original viewpoints and commentary from resident writers and guest analysts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columnists.map((col, idx) => (
          <article
            key={idx}
            className="group rounded-2xl border border-border bg-card p-6 flex flex-col justify-between hover:border-foreground/30 hover:shadow-md transition-all duration-300"
          >
            <div className="space-y-4">
              {/* Author Header */}
              <div className="flex items-center gap-3">
                <Image
                  src={col.author.image}
                  alt={col.author.name}
                  width={44}
                  height={44}
                  unoptimized
                  className="h-11 w-11 rounded-full object-cover border-2 border-border"
                />
                <div>
                  <h4 className="font-bold text-foreground text-sm">
                    {col.author.name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {col.author.bio?.split(".")[0]}
                  </p>
                </div>
              </div>

              {/* Column Headline */}
              <div>
                <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground/80 mb-2">
                  {col.topic}
                </span>
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  &ldquo;{col.title}&rdquo;
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {col.excerpt}
                </p>
              </div>
            </div>

            {/* Read Column Link */}
            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
              <span>Read Perspective</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
