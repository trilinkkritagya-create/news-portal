"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Download,
  Edit,
  ExternalLink,
  X,
  RotateCcw,
  Trash2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
// import { DashboardArticleItem } from "@/lib/dashboard/get-dashboard-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DashboardArticleItem } from "@/lib/types/dashboard.types";
import { CATEGORY_COLORS } from "@/lib/constants/extra";
import { updateArticleStatusAction } from "@/lib/actions/article/article.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { ArticleStatus } from "@/generated/prisma/enums";
import Tooltip from "../ui/tooltip";

// import { DashboardArticleItem } from "@/lib/dashboard/get-dashboard-data";

const INITIAL_PAGE_SIZE = 8;

interface ArticlesTableProps {
  articles: DashboardArticleItem[];
}
export default function ArticlesTable({ articles }: ArticlesTableProps) {
  const router = useRouter();
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);
  const [changingStatusArticleId, setChangingStatusArticleId] = useState<
    string | null
  >(null);
  const [isPublishing, startPublishing] = useTransition();
  const router = useRouter();

  const categoryOptions = useMemo(() => {
    const map = new Map<string, string>();

    articles.forEach((article) => {
      if (article.category) {
        map.set(article.category.slug, article.category.name);
      }
    });

    return Array.from(map.entries());
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return articles.filter((article) => {
      if (deletedIds.includes(article.id)) return false;

      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.author?.name ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (article.category?.name ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || article.status === statusFilter;

      const matchesCategory =
        categoryFilter === "ALL" || article.category?.slug === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [articles, deletedIds, searchQuery, statusFilter, categoryFilter]);

  const displayedArticles = useMemo(() => {
    return filteredArticles.slice(0, visibleCount);
  }, [filteredArticles, visibleCount]);

  const handleStatusChange = (
    articleId: string,
    status: "DRAFT" | "PUBLISHED",
  ) => {
    setChangingStatusArticleId(articleId);

    startPublishing(async () => {
      try {
        const result = await updateArticleStatusAction(articleId, status);
        if (!result.success) {
          toast.error(result.message);
          return;
        }
        if (status === ArticleStatus.PUBLISHED) {
          toast.success("Article published successfully.");
        } else {
          toast.success("Article unpublished successfully.");
        }

        router.refresh();
      } finally {
        setChangingStatusArticleId(null);
      }
    });
  };

  const getCategoryColor = (slug?: string | null) => {
    return CATEGORY_COLORS[slug ?? ""] ?? "#64748b";
  };
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
    <div className="bg-card border border-border overflow-visible rounded-xl shadow-2xs  h-full flex flex-col justify-between flex-1">
      {/* Table Header Toolbar */}
      <div className="p-3.5 sm:p-4 border-b border-[#E2E8F0] dark:border-slate-800 flex flex-col gap-3 bg-slate-50/50 dark:bg-slate-900/30 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-foreground">
                Recent Articles
              </h3>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-muted-foreground border border-slate-200 dark:border-slate-700 shadow-2xs">
                {filteredArticles.length} records
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 font-sans">
              Dispatches published and staged across all regional desks
            </p>
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
              {categoryOptions.map(([slug, name]) => (
                <option key={slug} value={slug}>
                  {name} Desk
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

            {/* Export button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="h-9 sm:h-auto py-2 sm:py-1.5 px-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 shrink-0 text-xs shadow-2xs"
              title="Export CSV"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden md:inline text-xs font-mono">Export</span>
            </button>
          </div>

          {/* Dropdown Filters in Mobile Row 2 (2 equal columns on mobile) */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            {/* Desks / Categories Filter */}
            <div className="relative w-full sm:w-36">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-xs font-medium text-foreground py-2 sm:py-1.5 pl-2.5 pr-7 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-sans truncate shadow-2xs"
              >
                <option value="ALL">All Desks</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} Desk
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 dark:text-slate-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative w-full sm:w-32">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-xs font-medium text-foreground py-2 sm:py-1.5 pl-2.5 pr-7 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-sans truncate shadow-2xs"
              >
                <option value="ALL">All Statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 dark:text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Mobile Filter Reset Bar (if active) */}
        {(categoryFilter !== "ALL" || statusFilter !== "ALL" || searchQuery) && (
          <div className="flex sm:hidden items-center justify-between pt-1 border-t border-border/60 text-xs font-mono text-muted-foreground">
            <span>Filtered ({filteredArticles.length} results)</span>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
            >
              <RotateCcw className="h-3 w-3" />
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. DESKTOP & TABLET VIEW: Crisp Editorial Data Table (sm:block)          */}
      {/* ========================================================================= */}
      <div className="hidden sm:block overflow-x-auto overflow-y-visible no-scrollbar flex-1">
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
                const isThisArticlePublishing =
                  changingStatusArticleId === article.id;

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
                  article.author?.name?.[0] || "A"
                ).toUpperCase();

                return (
                  <tr
                    key={article.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors "
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
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {article.category ? (
                        <span
                          className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium border"
                          style={{
                            borderColor: `${getCategoryColor(article.category.slug)}40`,
                            backgroundColor: `${getCategoryColor(article.category.slug)}15`,
                            color: getCategoryColor(article.category.slug),
                          }}
                        >
                          {article.category.name}
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">
                          Uncategorized
                        </span>
                      )}
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
                          {article.author?.name}
                        </span>
                      </div>
                    </td>

                    {/* Filed At */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-[10px] text-muted-foreground">
                      {formattedDate}
                    </td>

                    <td className="py-3 pl-2 pr-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Tooltip content="Edit Article" position="top">
                          <Link
                            href={`/dashboard/articles/edit/${article.id}`}
                            className="p-1 text-muted-foreground hover:text-primary transition-colors rounded hover:bg-muted"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Link>
                        </Tooltip>

                        {/* Publish - ADMIN only */}
                        {article.status === ArticleStatus.DRAFT ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(
                                article.id,
                                ArticleStatus.PUBLISHED,
                              )
                            }
                            disabled={isPublishing}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 transition-colors text-[10px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Publish Article"
                          >
                            <Send className="h-3 w-3" />

                            {isThisArticlePublishing
                              ? "Publishing..."
                              : "Publish"}
                          </button>
                        ) : article.status === ArticleStatus.PUBLISHED ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(
                                article.id,
                                ArticleStatus.DRAFT,
                              )
                            }
                            disabled={isPublishing}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/70 transition-colors text-[10px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Unpublish Article"
                          >
                            <Send className="h-3 w-3 rotate-180" />

                            {isThisArticlePublishing
                              ? "Unpublishing..."
                              : "Unpublish"}
                          </button>
                        ) : null}

                        {/* Preview */}
                        <Tooltip content="Preview Live" position="top">
                          <Link
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-muted"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </Tooltip>
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
      <div className="sm:hidden divide-y divide-border/80 px-3.5 flex-1">
        {displayedArticles.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground font-mono">
            No dispatches matching filter criteria.
          </div>
        ) : (
          displayedArticles.map((article) => {
            const formattedDate = article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : new Date(article.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });

            const authorInitial = (
              article.authorName?.[0] || "A"
            ).toUpperCase();

            return (
              <article key={article.id} className="py-3 first:pt-1 last:pb-1">
                {/* Meta Row: Status + Category + Time */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {renderStatusBadge(article.status)}
                    {article.category ? (
                      <span
                        className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded border"
                        style={{
                          borderColor: `${getCategoryColor(article.category.slug)}40`,
                          backgroundColor: `${getCategoryColor(article.category.slug)}15`,
                          color: getCategoryColor(article.category.slug),
                        }}
                      >
                        {article.category.name}
                      </span>
                    ) : (
                      <span className="text-[9px] text-muted-foreground">
                        Uncategorized
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                    {formattedDate}
                  </span>
                </div>

                {/* Headline */}
                <Link
                  href={`/dashboard/articles/edit/${article.id}`}
                  className="block font-serif text-sm font-bold text-foreground hover:text-primary transition-colors leading-snug line-clamp-2"
                >
                  {article.title}
                </Link>

                {/* Author + Quick Action */}
                <div className="flex items-center justify-between mt-2 pt-1 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground text-[11px]">
                    {article.author?.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/dashboard/articles/edit/${article.id}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground text-[11px] font-semibold transition-colors shadow-2xs"
                    >
                      <Edit className="h-3 w-3 text-primary" />
                      <span>Edit</span>
                    </Link>
                    <Link
                      href={`/articles/${article.slug}`}
                      target="_blank"
                      className="p-1 rounded border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Preview dispatch"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteTarget(article);
                        setDeleteError(null);
                      }}
                      className="p-1 rounded border border-red-200 dark:border-red-900/40 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Delete dispatch"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
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
          {visibleCount >= filteredArticles.length &&
            filteredArticles.length > INITIAL_PAGE_SIZE && (
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="font-serif font-bold text-lg text-foreground">
                  Delete Article
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Are you sure you want to permanently delete{" "}
                  <strong className="text-foreground font-semibold line-clamp-1">
                    &ldquo;{deleteTarget.title}&rdquo;
                  </strong>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={deletingId !== null}
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteError(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingId !== null}
                onClick={handleDeleteArticle}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
