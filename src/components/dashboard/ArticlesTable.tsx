"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DashboardArticleItem } from "@/lib/dashboard/get-dashboard-data";

const INITIAL_PAGE_SIZE = 4;

interface ArticlesTableProps {
  articles: DashboardArticleItem[];
}

export default function ArticlesTable({ articles }: ArticlesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setVisibleCount(INITIAL_PAGE_SIZE);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(INITIAL_PAGE_SIZE);
  };

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || article.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [articles, searchQuery, statusFilter]);

  const displayedArticles = useMemo(() => {
    return filteredArticles.slice(0, visibleCount);
  }, [filteredArticles, visibleCount]);

  return (
    <div className="border border-border bg-card rounded-lg overflow-hidden">
      {/* Table Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border bg-secondary/30 p-4 sm:p-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Recent Articles
            </h2>
            <span className="rounded border border-border bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
              {filteredArticles.length} Active
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Latest articles across all categories and authors.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Status Filter Buttons */}
          <div className="flex items-center border border-border bg-card p-0.5 text-xs rounded-md overflow-x-auto max-w-full">
            {["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilterChange(status)}
                className={`px-2.5 py-1 text-[11px] whitespace-nowrap transition-colors rounded-sm cursor-pointer ${statusFilter === status
                    ? "bg-foreground text-background font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search articles..."
              className="w-full sm:w-56 rounded-md border border-border bg-card py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
            />
            <svg
              className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* The Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-secondary/50 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="py-3 px-4 font-semibold">Article Title &amp; Category</th>
              <th className="py-3 px-4 font-semibold">Author</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">
                Engagement (Views / Likes / Comments)
              </th>
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayedArticles.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground font-mono">
                  No manuscripts found matching the current criteria.
                </td>
              </tr>
            ) : (
              displayedArticles.map((article) => {
                const formattedDate = article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                  : new Date(article.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                return (
                  <tr
                    key={article.id}
                    className="hover:bg-secondary/20 transition-colors group"
                  >
                    {/* Title & Category */}
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="border px-1.5 py-0.5 font-mono text-[9px] uppercase font-bold tracking-wider"
                          style={{
                            borderColor: `${article.categoryColor || "#1e3a8a"}40`,
                            backgroundColor: `${article.categoryColor || "#1e3a8a"}15`,
                            color: article.categoryColor || "#1e3a8a",
                          }}
                        >
                          {article.categoryName}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          ID #{article.id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <Link
                        href={`/dashboard/articles/edit/${article.id}`}
                        className="block font-serif font-bold text-sm text-foreground hover:text-primary transition-colors leading-snug line-clamp-2"
                      >
                        {article.title}
                      </Link>
                      {article.excerpt && (
                        <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">
                          {article.excerpt}
                        </p>
                      )}
                    </td>

                    {/* Author */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-foreground">
                        {article.authorName}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground">
                        {article.authorEmail || "Staff Reporter"}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {article.status === "PUBLISHED" ? (
                        <span className="inline-flex items-center gap-1.5 border border-live/30 bg-live/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-live">
                          <span className="h-1.5 w-1.5 bg-live"></span>
                          PUBLISHED
                        </span>
                      ) : article.status === "DRAFT" ? (
                        <span className="inline-flex items-center gap-1.5 border border-opinion/30 bg-opinion/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-opinion">
                          <span className="h-1.5 w-1.5 bg-opinion"></span>
                          DRAFT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 border border-border bg-muted px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          <span className="h-1.5 w-1.5 bg-muted-foreground"></span>
                          ARCHIVED
                        </span>
                      )}
                    </td>

                    {/* Engagement */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono">
                      <div className="font-medium text-foreground">
                        {article.views.toLocaleString()} views
                      </div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground">
                        {article.likesCount.toLocaleString()} likes ·{" "}
                        {article.commentsCount.toLocaleString()} comments
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                      <div>{formattedDate}</div>
                      <div className="text-[10px] text-muted-foreground/70">
                        {article.status === "DRAFT" ? "Drafted" : "Published"}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center border border-border bg-card divide-x divide-border font-mono text-[11px]">
                        <Link
                          href={`/dashboard/articles/edit/${article.id}`}
                          className="px-2.5 py-1 text-foreground hover:bg-secondary transition-colors font-medium"
                          title="Edit Article"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/articles/${article.slug}`}
                          className="px-2.5 py-1 text-primary hover:bg-secondary transition-colors"
                          title="Preview Live Article"
                        >
                          Preview
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
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
          manuscripts
        </div>

        <div className="flex items-center gap-2">
          {visibleCount < filteredArticles.length && (
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-2xs hover:bg-secondary transition-colors cursor-pointer"
            >
              <span>Show More</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}

          {visibleCount >= filteredArticles.length && filteredArticles.length > INITIAL_PAGE_SIZE && (
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
