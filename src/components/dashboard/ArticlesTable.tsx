"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Download,
  Edit,
  ExternalLink,
  PenTool,
} from "lucide-react";
import { DashboardArticleItem } from "@/lib/dashboard/get-dashboard-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const INITIAL_PAGE_SIZE = 8;

interface ArticlesTableProps {
  articles: DashboardArticleItem[];
}

export default function ArticlesTable({ articles }: ArticlesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);

  // Extract unique categories for dropdown filter
  const categoryOptions = useMemo(() => {
    const map = new Map<string, string>();
    articles.forEach((a) => {
      if (a.categoryName) {
        map.set(a.categoryName, a.categoryName);
      }
    });
    return Array.from(map.values());
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || article.status === statusFilter;

      const matchesCategory =
        categoryFilter === "ALL" || article.categoryName === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [articles, searchQuery, statusFilter, categoryFilter]);

  const displayedArticles = useMemo(() => {
    return filteredArticles.slice(0, visibleCount);
  }, [filteredArticles, visibleCount]);

  const renderStatusBadge = (status: string) => {
    if (status === "PUBLISHED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
          Published
        </span>
      );
    }
    if (status === "DRAFT") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/70 dark:border-amber-800">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400"></span>
          Draft
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/70 dark:border-blue-800">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
        In Review
      </span>
    );
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-2xs overflow-hidden h-full flex flex-col justify-between flex-1">
      {/* Table Header Toolbar */}
      <div className="p-4 sm:p-5 border-b border-border flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-card shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-base text-foreground">
              Recent Articles
            </h3>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-muted-foreground border border-border">
              {filteredArticles.length} records
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Dispatches published and staged across all regional desks
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Desks / Categories Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none bg-slate-50 dark:bg-slate-900 border border-border text-xs font-medium text-foreground py-1.5 pl-2.5 pr-7 rounded focus:outline-none focus:border-primary cursor-pointer font-sans"
            >
              <option value="ALL">All Desks</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} Desk
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-slate-50 dark:bg-slate-900 border border-border text-xs font-medium text-foreground py-1.5 pl-2.5 pr-7 rounded focus:outline-none focus:border-primary cursor-pointer font-sans"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Search box for table */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter list..."
              className="w-32 sm:w-40 pl-7 pr-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
            <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
          </div>

          {/* Export button */}
          <button
            type="button"
            className="p-1.5 border border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
            title="Export CSV"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DESKTOP & TABLET VIEW: Crisp Editorial Data Table (sm:block)          */}
      {/* ========================================================================= */}
      <div className="hidden sm:block overflow-x-auto no-scrollbar flex-1">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-slate-50/75 dark:bg-slate-900/50 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="py-2.5 pl-4 pr-2" scope="col">
                Status
              </th>
              <th className="py-2.5 px-3" scope="col">
                Headline / Story
              </th>
              <th className="py-2.5 px-3" scope="col">
                Category
              </th>
              <th className="py-2.5 px-3" scope="col">
                Author
              </th>
              <th className="py-2.5 px-3" scope="col">
                Filed At
              </th>
              <th className="py-2.5 pl-2 pr-4 text-right" scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayedArticles.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-muted-foreground font-mono"
                >
                  No dispatches found matching the current filters.
                </td>
              </tr>
            ) : (
              displayedArticles.map((article) => {
                const formattedDate = article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : new Date(article.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    });

                const authorInitial = (
                  article.authorName?.[0] || "A"
                ).toUpperCase();

                return (
                  <tr
                    key={article.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors group"
                  >
                    {/* Status */}
                    <td className="py-3 pl-4 pr-2 whitespace-nowrap">
                      {renderStatusBadge(article.status)}
                    </td>

                    {/* Headline / Story */}
                    <td className="py-3 px-3 max-w-sm">
                      <Link
                        href={`/dashboard/articles/edit/${article.id}`}
                        className="font-serif font-bold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-snug block"
                      >
                        {article.title}
                      </Link>
                      {article.excerpt ? (
                        <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {article.excerpt}
                        </div>
                      ) : (
                        <div className="text-[10px] font-mono text-muted-foreground/60 mt-0.5">
                          ID #{article.id.slice(-6).toUpperCase()}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium border"
                        style={{
                          borderColor: `${article.categoryColor || "#1e3a8a"}40`,
                          backgroundColor: `${article.categoryColor || "#1e3a8a"}15`,
                          color: article.categoryColor || "#1e3a8a",
                        }}
                      >
                        {article.categoryName}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-5 h-5 border border-border">
                          <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-[10px] font-bold">
                            {authorInitial}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground text-xs">
                          {article.authorName}
                        </span>
                      </div>
                    </td>

                    {/* Filed At */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-[10px] text-muted-foreground">
                      {formattedDate}
                    </td>

                    {/* Actions */}
                    <td className="py-3 pl-2 pr-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/dashboard/articles/edit/${article.id}`}
                          className="p-1 text-muted-foreground hover:text-primary transition-colors rounded hover:bg-muted"
                          title="Edit Article"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          href={`/articles/${article.slug}`}
                          target="_blank"
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-muted"
                          title="Preview Live"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
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

      {/* ========================================================================= */}
      {/* 2. MOBILE VIEW: Mobile Editorial Card Feed (sm:hidden)                    */}
      {/* ========================================================================= */}
      <div className="sm:hidden divide-y divide-border p-3 flex-1">
        {displayedArticles.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground font-mono">
            No dispatches matching filter criteria.
          </div>
        ) : (
          displayedArticles.map((article) => {
            const formattedDate = article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })
              : new Date(article.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                });

            return (
              <article key={article.id} className="py-3 first:pt-1 last:pb-1">
                {/* Meta Row: Status + Category + Time */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {renderStatusBadge(article.status)}
                    <span
                      className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded border"
                      style={{
                        borderColor: `${article.categoryColor || "#1e3a8a"}40`,
                        backgroundColor: `${article.categoryColor || "#1e3a8a"}15`,
                        color: article.categoryColor || "#1e3a8a",
                      }}
                    >
                      {article.categoryName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {formattedDate}
                  </span>
                </div>

                {/* Headline */}
                <Link
                  href={`/dashboard/articles/edit/${article.id}`}
                  className="block font-serif text-sm font-bold text-foreground hover:text-primary transition-colors leading-snug"
                >
                  {article.title}
                </Link>

                {/* Author + Quick Action */}
                <div className="flex items-center justify-between mt-2 pt-1 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground text-[11px]">
                    {article.authorName}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/dashboard/articles/edit/${article.id}`}
                      className="flex items-center gap-1 text-[11px] text-primary hover:underline font-semibold"
                    >
                      <PenTool className="h-3 w-3" /> Edit
                    </Link>
                    <Link
                      href={`/articles/${article.slug}`}
                      target="_blank"
                      className="flex items-center gap-0.5 text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Table & Feed Footer Pagination (docked at the bottom of the card) */}
      <div className="mt-auto px-4 py-2.5 border-t border-border bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-2 font-mono shrink-0">
        <div>
          Showing{" "}
          <span className="font-semibold text-foreground">
            {displayedArticles.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">
            {filteredArticles.length}
          </span>{" "}
          manuscripts
        </div>

        <div className="flex items-center gap-1.5">
          {visibleCount < filteredArticles.length && (
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 5)}
              className="inline-flex items-center gap-1 px-3 py-1 border border-border rounded bg-card hover:bg-muted text-foreground text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <span>Show More</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          )}
          {visibleCount >= filteredArticles.length && filteredArticles.length > INITIAL_PAGE_SIZE && (
            <button
              type="button"
              onClick={() => setVisibleCount(INITIAL_PAGE_SIZE)}
              className="inline-flex items-center gap-1 px-3 py-1 border border-border rounded bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-xs transition-colors cursor-pointer"
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
