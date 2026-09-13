"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { MOCK_ARTICLES } from "@/lib/mock-data";

export default function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K listener to focus input directly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter matching articles
  const filteredArticles = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return MOCK_ARTICLES.filter(
      (article) =>
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.category.name.toLowerCase().includes(q) ||
        article.author.name.toLowerCase().includes(q) ||
        article.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  const quickTopics = [
    "Quantum",
    "Central Banks",
    "Deep Ocean",
    "Sustainable Architecture",
    "Motorsports",
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Inline Search Input */}
      <div
        className={`flex items-center rounded-full border px-3 py-1.5 text-xs transition-all w-44 lg:w-56 xl:w-68 ${isOpen
          ? "border-foreground/40 bg-card shadow-xs"
          : "border-border/80 bg-secondary/60 hover:bg-secondary hover:border-foreground/20"
          }`}
      >
        <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0 mr-2" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search articles..."
          className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none w-full min-w-0"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer shrink-0"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        ) : (
          <kbd className="hidden xl:inline-block rounded border border-border bg-card px-1.5 py-0.5 text-[9px] font-mono font-medium text-muted-foreground shrink-0">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Lightweight Non-Blocking Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 sm:w-96 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          {query.trim() ? (
            filteredArticles.length > 0 ? (
              <div className="max-h-80 overflow-y-auto divide-y divide-border/60 py-1">
                {filteredArticles.slice(0, 5).map((article) => (
                  <Link
                    key={article.id}
                    href={`/dashboard/articles?id=${article.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-3 p-3 hover:bg-secondary/60 transition-colors group"
                  >
                    <div className="relative h-10 w-12 rounded-md overflow-hidden bg-secondary shrink-0 border border-border/60">
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider block"
                        style={{ color: article.category.color }}
                      >
                        {article.category.name}
                      </span>
                      <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                        {article.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                        {article.author.name} · {article.readTime}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-muted-foreground">
                No articles found matching &ldquo;{query}&rdquo;
              </div>
            )
          ) : (
            <div className="p-3.5 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Quick Topics
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      setQuery(topic);
                      inputRef.current?.focus();
                    }}
                    className="px-2.5 py-1 rounded-md bg-secondary text-[11px] font-medium text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
