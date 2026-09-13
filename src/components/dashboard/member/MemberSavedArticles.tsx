"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Search,
  Trash2,
} from "lucide-react";
import { MockArticle } from "@/lib/mock-data";

const INITIAL_PAGE_SIZE = 3;

interface MemberSavedArticlesProps {
  savedArticles: MockArticle[];
}

export default function MemberSavedArticles({
  savedArticles: initialArticles,
}: MemberSavedArticlesProps) {
  const [articles, setArticles] = useState<MockArticle[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);

  // Extract unique categories from articles
  const categories = useMemo(() => {
    const set = new Set(articles.map((a) => a.category.name));
    return ["ALL", ...Array.from(set)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "ALL" ||
        article.category.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(INITIAL_PAGE_SIZE);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(INITIAL_PAGE_SIZE);
  };

  const displayedArticles = useMemo(() => {
    return filteredArticles.slice(0, visibleCount);
  }, [filteredArticles, visibleCount]);

  const handleRemove = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div
      id="saved-articles"
      className="border border-border bg-card rounded-lg overflow-hidden"
    >
      {/* Table Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border bg-secondary/30 p-4 sm:p-5">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Saved Manuscripts
            </h2>
            <span className="rounded border border-border bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
              {filteredArticles.length} Saved
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your personal reading shelf and research bookmarks.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Category Filter Buttons */}
          <div className="flex items-center border border-border bg-card p-0.5 text-xs rounded-md overflow-x-auto max-w-full no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`px-2.5 py-1 text-[11px] whitespace-nowrap transition-colors rounded-sm cursor-pointer ${selectedCategory === category
                    ? "bg-foreground text-background font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search saved..."
              className="w-full sm:w-48 rounded-md border border-border bg-card py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
            />
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* The Articles List */}
      <div className="divide-y divide-border">
        {displayedArticles.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground font-mono text-xs">
            No saved manuscripts found matching your search.
          </div>
        ) : (
          displayedArticles.map((article) => {
            const formattedDate = new Date(
              article.publishedAt || article.createdAt
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <article
                key={article.id}
                className="p-4 sm:p-5 hover:bg-secondary/15 transition-colors group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  {/* Category & Read Time */}
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span
                      className="border px-1.5 py-0.5 font-mono text-[9px] uppercase font-bold tracking-wider rounded-xs"
                      style={{
                        borderColor: `${article.category.color}40`,
                        backgroundColor: `${article.category.color}15`,
                        color: article.category.color,
                      }}
                    >
                      {article.category.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                    <span className="text-muted-foreground/50 text-[10px]">·</span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {formattedDate}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    <Link href={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                    {article.excerpt}
                  </p>

                  {/* Author */}
                  <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <Image
                      src={article.author.image}
                      alt={article.author.name}
                      width={18}
                      height={18}
                      unoptimized
                      className="h-4.5 w-4.5 rounded-full object-cover border border-border"
                    />
                    <span className="font-medium text-foreground">
                      {article.author.name}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                  >
                    <span>Read</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(article.id)}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-border bg-card text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    title="Remove from saved"
                    aria-label="Remove bookmark"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Table Footer with Show More */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border bg-secondary/30 p-4 font-mono text-xs text-muted-foreground">
        <div>
          Showing{" "}
          <span className="font-bold text-foreground">
            {displayedArticles.length}
          </span>{" "}
          of{" "}
          <span className="font-bold text-foreground">
            {filteredArticles.length}
          </span>{" "}
          saved manuscripts
        </div>

        <div className="flex items-center gap-2">
          {visibleCount < filteredArticles.length && (
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 3)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-2xs hover:bg-secondary transition-colors cursor-pointer"
            >
              <span>Show More</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}

          {visibleCount >= filteredArticles.length &&
            filteredArticles.length > INITIAL_PAGE_SIZE && (
              <button
                type="button"
                onClick={() => setVisibleCount(INITIAL_PAGE_SIZE)}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <span>Show Less</span>
                <ChevronUp className="h-3 w-3" />
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
