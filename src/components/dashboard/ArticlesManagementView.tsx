"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  Download,
  Trash2,
  ExternalLink,
  X,
  Loader2,
  PenSquare,
  Newspaper,
  CheckCircle2,
  Clock,
  RotateCcw,
  Edit,
  AlertTriangle,
  SlidersHorizontal,
  FileText,
} from "lucide-react";
import {
  DashboardArticleItem,
  DashboardStats,
} from "@/lib/dashboard/get-dashboard-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "./SidebarContext";
import ArticleStatusBadge from "../ui/ArticleStatusBadge";
import DashboardHeader from "./DashboardHeader";

interface ArticlesManagementViewProps {
  initialArticles: DashboardArticleItem[];
  stats?: DashboardStats;
}
const PAGE_SIZE = 10;
export default function ArticlesManagementView({
  initialArticles,
}: ArticlesManagementViewProps) {
  const router = useRouter();
  const { toggle, setCustomSidebarContent } = useSidebar();

  const [articles, setArticles] =
    useState<DashboardArticleItem[]>(initialArticles);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "title" | "category">(
    "newest",
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState<DashboardArticleItem | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const showToast = (message: string) => {
    setActionFeedback(message);
    setTimeout(() => {
      setActionFeedback(null);
    }, 3500);
  };

  // Extract unique category options
  const categoryOptions = useMemo(() => {
    const cats = new Set<string>();
    articles.forEach((a) => {
      if (a.categoryName) cats.add(a.categoryName);
    });
    return Array.from(cats);
  }, [articles]);

  const counts = useMemo(() => {
    const active = articles.filter((a) => !deletedIds.includes(a.id));
    return {
      all: active.length,
      published: active.filter((a) => a.status === "PUBLISHED").length,
      draft: active.filter((a) => a.status === "DRAFT").length,
      review: active.filter(
        (a) =>
          (a.status as string) === "ARCHIVED" ||
          (a.status as string) === "IN_REVIEW",
      ).length,
    };
  }, [articles, deletedIds]);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return articles
      .filter((article) => {
        if (deletedIds.includes(article.id)) return false;

        // Status filter
        if (statusFilter !== "ALL") {
          if (statusFilter === "REVIEW") {
            if (
              (article.status as string) !== "ARCHIVED" &&
              (article.status as string) !== "IN_REVIEW"
            ) {
              return false;
            }
          } else if (article.status !== statusFilter) {
            return false;
          }
        }

        // Category filter
        if (
          categoryFilter !== "ALL" &&
          article.categoryName !== categoryFilter
        ) {
          return false;
        }

        // Search query
        if (q) {
          const matchTitle = (article.title || "").toLowerCase().includes(q);
          const matchAuthor = (article.authorName || "")
            .toLowerCase()
            .includes(q);
          const matchCategory = (article.categoryName || "")
            .toLowerCase()
            .includes(q);
          const matchExcerpt = (article.excerpt || "")
            .toLowerCase()
            .includes(q);
          if (!matchTitle && !matchAuthor && !matchCategory && !matchExcerpt) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === "category") {
          return a.categoryName.localeCompare(b.categoryName);
        }
        const dateA = new Date(a.publishedAt || a.createdAt).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt).getTime();
        return dateB - dateA;
      });
  }, [articles, deletedIds, searchQuery, statusFilter, categoryFilter, sortBy]);

  const displayedArticles = useMemo(() => {
    return filteredArticles.slice(0, visibleCount);
  }, [filteredArticles, visibleCount]);

  // Handle Delete Confirmation
  const handleDeleteArticle = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/articles/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to delete article.");
      }

      setDeletedIds((prev) => [...prev, deleteTarget.id]);
      showToast(`Article "${deleteTarget.title.slice(0, 30)}..." deleted.`);
      setDeleteTarget(null);
      router.refresh();
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : "Failed to delete article.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredArticles.length === 0) return;
    const headers = ["Title", "Category", "Status", "Author", "Date", "Slug"];
    const rows = filteredArticles.map((a) => [
      `"${(a.title || "").replace(/"/g, '""')}"`,
      `"${a.categoryName || ""}"`,
      `"${a.status || ""}"`,
      `"${(a.authorName || "").replace(/"/g, '""')}"`,
      `"${a.publishedAt || a.createdAt}"`,
      `"${a.slug || ""}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `chronicle-dispatches-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
    setSortBy("newest");
  };

  // Sync mobile/tablet drawer filter content
  useEffect(() => {
    setCustomSidebarContent(
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 text-slate-300">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-rose-300">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Article Filters</span>
          </div>
          {(statusFilter !== "ALL" ||
            categoryFilter !== "ALL" ||
            searchQuery) && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>

        {/* Status Segmented Buttons */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-slate-400">
            Status Triage
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-[#881337] text-white font-semibold"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span>All</span>
              <span className="text-[10px] font-mono opacity-80">
                {counts.all}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("PUBLISHED")}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === "PUBLISHED"
                  ? "bg-[#047857] text-white font-semibold"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span>Published</span>
              <span className="text-[10px] font-mono opacity-80">
                {counts.published}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("DRAFT")}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === "DRAFT"
                  ? "bg-amber-600 text-white font-semibold"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span>Draft</span>
              <span className="text-[10px] font-mono opacity-80">
                {counts.draft}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("REVIEW")}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === "REVIEW"
                  ? "bg-blue-600 text-white font-semibold"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span>In Review</span>
              <span className="text-[10px] font-mono opacity-80">
                {counts.review}
              </span>
            </button>
          </div>
        </div>

        {/* Desk/Category Select */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-slate-400">
            Desk / Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 font-sans cursor-pointer"
          >
            <option value="ALL">All Regional Desks</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat} Desk
              </option>
            ))}
          </select>
        </div>

        {/* Sort Select */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-slate-400">
            Order By
          </label>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "newest" | "title" | "category")
            }
            className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 font-sans cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="title">Headline (A-Z)</option>
            <option value="category">Category Desk</option>
          </select>
        </div>

        {/* Search inside drawer */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-slate-400">
            Search Dispatches
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Headline, author, keyword..."
              className="w-full pl-8 pr-7 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2 p-0.5 text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Export Button */}
        <button
          type="button"
          onClick={handleExportCSV}
          className="w-full py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="h-3.5 w-3.5 text-slate-400" />
          <span>Export Dispatches (.CSV)</span>
        </button>
      </div>,
    );

    return () => {
      setCustomSidebarContent(null);
    };
  }, [
    setCustomSidebarContent,
    statusFilter,
    categoryFilter,
    sortBy,
    searchQuery,
    categoryOptions,
    counts,
    filteredArticles,
  ]);

  // const renderStatusBadge = (status: string) => {
  //   if (status === "PUBLISHED") {
  //     return (
  //       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800">
  //         <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
  //         Published
  //       </span>
  //     );
  //   }
  //   if (status === "DRAFT") {
  //     return (
  //       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/70 dark:border-amber-800">
  //         <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
  //         Draft
  //       </span>
  //     );
  //   }
  //   return (
  //     <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/70 dark:border-blue-800">
  //       <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
  //       In Review
  //     </span>
  //   );
  // };

  return (
    <div className="flex flex-1 flex-col min-h-screen">
      {/* Toast Feedback */}
      {/* {actionFeedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-lg shadow-xl border border-slate-700 text-xs font-mono animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )} */}
      <DashboardHeader />

      {/* ==================== STICKY TOP EDITORIAL NAV BAR ==================== */}
      <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-[#CBD5E1] dark:border-slate-700 bg-[#E2E8F0] dark:bg-[#1E293B] px-4 sm:px-6 lg:px-8 shadow-xs gap-2">
        <div className="flex items-center gap-2.5 xl:hidden min-w-0">
          {/* <button
            type="button"
            onClick={toggle}
            className="inline-flex size-8.5 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shrink-0 transition-colors shadow-2xs"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="h-4.5 w-4.5" />
          </button> */}

          {/* <div className="flex items-center gap-2 min-w-0">
            <h1 className="font-serif font-bold text-base text-foreground tracking-tight truncate">
              Article
            </h1>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border shadow-2xs ${
                statusFilter === "DRAFT"
                  ? "bg-amber-50 text-amber-700 dark:text-amber-300 border-amber-300/80 dark:border-amber-700"
                  : statusFilter === "PUBLISHED"
                    ? "bg-emerald-50 text-emerald-700 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-700"
                    : statusFilter === "REVIEW"
                      ? "bg-blue-50 text-blue-700 dark:text-blue-300 border-blue-300/80 dark:border-blue-700"
                      : "bg-white text-[#881337] dark:text-rose-400 border-slate-200 dark:border-slate-700 dark:bg-slate-800"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  statusFilter === "DRAFT"
                    ? "bg-amber-500 animate-pulse"
                    : statusFilter === "PUBLISHED"
                      ? "bg-emerald-500"
                      : statusFilter === "REVIEW"
                        ? "bg-blue-500"
                        : "bg-[#881337] animate-pulse"
                }`}
              />
              <span className="capitalize truncate">
                {statusFilter === "ALL" ? "All" : statusFilter.toLowerCase()} (
                {statusFilter === "ALL"
                  ? counts.all
                  : statusFilter === "PUBLISHED"
                    ? counts.published
                    : statusFilter === "DRAFT"
                      ? counts.draft
                      : counts.review}
                )
              </span>
            </span>
          </div> */}
        </div>

        {/* Desktop Left / Center Area: Filters in Navbar */}

        {/* <div className="hidden xl:flex items-center gap-2.5 2xl:gap-3 flex-1 min-w-0 mr-2">

          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200/90 dark:border-slate-700 shadow-2xs shrink-0">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-[#881337] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`}
            >
              <span>All Dispatches</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  statusFilter === "ALL"
                    ? "bg-white/25 text-white"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {counts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("PUBLISHED")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === "PUBLISHED"
                  ? "bg-[#047857] text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`}
            >
              <span>Published</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  statusFilter === "PUBLISHED"
                    ? "bg-white/25 text-white"
                    : "bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] dark:bg-emerald-950/40 dark:text-emerald-300"
                }`}
              >
                {counts.published}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("DRAFT")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === "DRAFT"
                  ? "bg-amber-600 text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`}
            >
              <span>Draft</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  statusFilter === "DRAFT"
                    ? "bg-white/25 text-white"
                    : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
                }`}
              >
                {counts.draft}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("REVIEW")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === "REVIEW"
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`}
            >
              <span>In Review</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  statusFilter === "REVIEW"
                    ? "bg-white/25 text-white"
                    : "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300"
                }`}
              >
                {counts.review}
              </span>
            </button>
          </div>


          <div className="relative shrink-0">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter articles by desk"
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans cursor-pointer transition-colors shadow-2xs"
            >
              <option value="ALL">Desk: All Desks</option>
              {categoryOptions.map((desk) => (
                <option key={desk} value={desk}>
                  {desk} Desk
                </option>
              ))}
            </select>
          </div>


          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "newest" | "title" | "category")
              }
              aria-label="Sort articles"
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans cursor-pointer transition-colors shadow-2xs"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="title">Headline (A-Z)</option>
              <option value="category">Category Desk</option>
            </select>
          </div>


          <div className="relative flex-1 max-w-xs min-w-[180px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500 dark:text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dispatches, authors..."
              className="w-full pl-8 pr-7 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 rounded-lg text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary font-sans transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2 p-0.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div> */}

        {/* Right Controls: Export + Create Article + Bell */}
        {/* <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="hidden sm:inline-flex items-center gap-1.5 h-8.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-mono transition-colors shadow-2xs cursor-pointer"
            title="Export CSV"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Export</span>
          </button>

          <Link
            href="/dashboard/articles/create"
            className="inline-flex items-center justify-center gap-1.5 h-8.5 px-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-medium transition-all duration-150 shadow-xs hover:shadow active:scale-98 shrink-0"
          >
            <PenSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Create Article</span>
            <span className="sm:hidden">Create</span>
          </Link>

          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex items-center justify-center size-8.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shadow-2xs"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-600 ring-2 ring-card animate-pulse"></span>
          </button>
        </div> */}
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-[1550px] w-full mx-auto">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <div
            onClick={() => setStatusFilter("ALL")}
            className={`cursor-pointer bg-card border rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-xs transition-all ${
              statusFilter === "ALL"
                ? "border-[#881337] ring-1 ring-[#881337]/30"
                : "border-[#E2E8F0] dark:border-slate-800 hover:border-slate-400"
            }`}
          >
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
                Total Dispatches
              </span>
              <Newspaper className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground/80" />
            </div>
            <div className="mt-1 sm:mt-2 mb-0.5 flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {counts.all.toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-xs text-[#047857] font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-1 py-0.2 rounded">
                +12%
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground font-sans">
              filed across regional desks
            </div>
          </div>

          <div
            onClick={() => setStatusFilter("PUBLISHED")}
            className={`cursor-pointer bg-card border rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-xs transition-all ${
              statusFilter === "PUBLISHED"
                ? "border-emerald-500 ring-1 ring-emerald-500/30"
                : "border-[#E2E8F0] dark:border-slate-800 hover:border-emerald-400"
            }`}
          >
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
                Published Live
              </span>
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
            </div>
            <div className="mt-1 sm:mt-2 mb-0.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {counts.published.toLocaleString()}
              </span>
              <span className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[11px] font-semibold tracking-wide">
                Active
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground font-sans">
              public readers accessible
            </div>
          </div>

          <div
            onClick={() => setStatusFilter("DRAFT")}
            className={`cursor-pointer bg-card border rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-xs transition-all ${
              statusFilter === "DRAFT"
                ? "border-amber-500 ring-1 ring-amber-500/30"
                : "border-[#E2E8F0] dark:border-slate-800 hover:border-amber-400"
            }`}
          >
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
                Draft Staging
              </span>
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
            </div>
            <div className="mt-1 sm:mt-2 mb-0.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {counts.draft.toLocaleString()}
              </span>
              <span className="bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[11px] font-semibold">
                In Progress
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground font-sans">
              author workbenches
            </div>
          </div>

          <div
            onClick={() => setStatusFilter("REVIEW")}
            className={`cursor-pointer bg-card border rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-xs transition-all ${
              statusFilter === "REVIEW"
                ? "border-blue-500 ring-1 ring-blue-500/30"
                : "border-[#E2E8F0] dark:border-slate-800 hover:border-blue-400"
            }`}
          >
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
                In Review
              </span>
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
            </div>
            <div className="mt-1 sm:mt-2 mb-0.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {counts.review.toLocaleString()}
              </span>
              <span className="bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[11px] font-semibold font-mono">
                Bureau Queue
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground font-sans">
              pending desk sign-off
            </div>
          </div>
        </section>

        <section className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-lg sm:rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-3.5 sm:p-4 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-base text-foreground">
                Dispatches Roster
              </h2>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-muted-foreground border border-slate-200 dark:border-slate-700 shadow-2xs">
                {filteredArticles.length} matching
              </span>
            </div>

            {(categoryFilter !== "ALL" ||
              statusFilter !== "ALL" ||
              searchQuery) && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                Reset filters
              </button>
            )}
          </div>

          <div className="hidden sm:block overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 pl-4 pr-2" scope="col">
                    Status
                  </th>
                  <th className="py-2.5 px-3" scope="col">
                    Headline / Story
                  </th>
                  <th className="py-2.5 px-3" scope="col">
                    Desk
                  </th>
                  <th className="py-2.5 px-3" scope="col">
                    Author
                  </th>
                  <th className="py-2.5 px-3" scope="col">
                    Filed Date
                  </th>
                  <th className="py-2.5 pl-2 pr-4 text-right" scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-slate-800">
                {displayedArticles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-muted-foreground font-mono"
                    >
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-2">
                        <Newspaper className="h-5 w-5" />
                      </div>
                      No dispatches found matching the current criteria.
                    </td>
                  </tr>
                ) : (
                  displayedArticles.map((article) => {
                    const formattedDate = article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )
                      : new Date(article.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        );

                    const authorInitial = (
                      article.authorName?.[0] || "A"
                    ).toUpperCase();

                    return (
                      <tr
                        key={article.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-900/50 transition-colors group"
                      >
                        {/* Status */}
                        <td className="py-3 pl-4 pr-2 whitespace-nowrap">
                          {/* {renderStatusBadge(article.status)} */}
                          <ArticleStatusBadge status={article.status} />
                        </td>

                        {/* Headline */}
                        <td className="py-3 px-3 max-w-sm">
                          <Link
                            href={`/dashboard/articles/edit/${article.id}`}
                            className="font-serif font-bold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-snug block"
                          >
                            {article.title}
                          </Link>
                          {article.excerpt ? (
                            <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 font-sans">
                              {article.excerpt}
                            </div>
                          ) : (
                            <div className="text-[10px] font-mono text-muted-foreground/60 mt-0.5">
                              ID #{article.id.slice(-6).toUpperCase()}
                            </div>
                          )}
                        </td>

                        {/* Desk */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className="inline-block px-2 py-0.5 rounded text-[10px] font-medium border"
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
                            <Avatar className="w-5 h-5 border border-slate-200 dark:border-slate-700">
                              <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-[10px] font-bold">
                                {authorInitial}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground text-xs font-sans">
                              {article.authorName}
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-3 px-3 whitespace-nowrap font-mono text-[10px] text-muted-foreground">
                          {formattedDate}
                        </td>

                        {/* Actions */}
                        <td className="py-3 pl-2 pr-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1 opacity-90 group-hover:opacity-100">
                            {article.status === "PUBLISHED" && article.slug && (
                              <Link
                                href={`/articles/${article.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                                title="Preview Live Article"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                            )}

                            <Link
                              href={`/dashboard/articles/edit/${article.id}`}
                              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                              title="Edit Article"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(article)}
                              className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors cursor-pointer"
                              title="Delete Dispatch"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="sm:hidden divide-y divide-[#E2E8F0] dark:divide-slate-800">
            {displayedArticles.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground font-mono text-xs">
                No dispatches found matching filters.
              </div>
            ) : (
              displayedArticles.map((article) => (
                <div key={article.id} className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium border"
                      style={{
                        borderColor: `${article.categoryColor || "#1e3a8a"}40`,
                        backgroundColor: `${article.categoryColor || "#1e3a8a"}15`,
                        color: article.categoryColor || "#1e3a8a",
                      }}
                    >
                      {article.categoryName}
                    </span>
                    <ArticleStatusBadge status={article.status} />
                  </div>

                  <Link
                    href={`/dashboard/articles/edit/${article.id}`}
                    className="font-serif font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-2 block leading-snug"
                  >
                    {article.title}
                  </Link>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground font-mono">
                    <span>{article.authorName}</span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/articles/edit/${article.id}`}
                        className="text-primary hover:underline font-sans font-medium"
                      >
                        Edit
                      </Link>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(article)}
                        className="text-red-600 hover:underline font-sans font-medium cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Table Footer / Pagination Controls */}
          {filteredArticles.length > visibleCount && (
            <div className="p-3 border-t border-[#E2E8F0] dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="px-4 py-1.5 text-xs font-mono font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-foreground transition-colors shadow-2xs cursor-pointer"
              >
                Load More Dispatches ({filteredArticles.length - visibleCount}{" "}
                remaining)
              </button>
            </div>
          )}
        </section>
      </main>
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-foreground">
                  Confirm Dispatch Deletion
                </h3>
                <p className="text-xs text-muted-foreground font-sans">
                  This action is permanent and will purge the story from
                  publishing archives.
                </p>
              </div>
            </div>

            <div className="p-3 bg-muted/40 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
              <div className="font-serif font-bold text-foreground line-clamp-1">
                {deleteTarget.title}
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-1">
                Desk: {deleteTarget.categoryName} · Author:{" "}
                {deleteTarget.authorName}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-muted text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteArticle}
                disabled={isDeleting}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Confirm Delete</span>
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
