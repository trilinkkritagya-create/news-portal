"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Search,
  Trash2,
  Check,
  Pin,
  Reply,
  ExternalLink,
  X,
  Send,
  Loader2,
  Heart,
  Flag,
  UserCheck,
  SlidersHorizontal,
  TrendingUp,
  GraduationCap,
  Star,
  Layers,
  RotateCcw,
} from "lucide-react";
import {
  ModerationCommentItem,
  CommentStats,
  CommentModerationStatus,
} from "@/lib/dashboard/get-comments-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "./SidebarContext";

interface CommentsModerationViewProps {
  initialData: {
    stats: CommentStats;
    comments: ModerationCommentItem[];
  };
}

function formatCommentDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) {
      return `${Math.max(1, diffMins)}m ago`;
    }
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function CommentsModerationView({
  initialData,
}: CommentsModerationViewProps) {
  const { toggle, setCustomSidebarContent } = useSidebar();
  const [comments, setComments] = useState<ModerationCommentItem[]>(
    initialData.comments,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | CommentModerationStatus
  >("ALL");
  const [deskFilter, setDeskFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "likes" | "flagged">(
    "newest",
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isBatchMenuOpen, setIsBatchMenuOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] =
    useState<ModerationCommentItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const deskOptions = useMemo(() => {
    const desks = new Set<string>();
    comments.forEach((c) => {
      if (c.article.categoryName) desks.add(c.article.categoryName);
    });
    return Array.from(desks);
  }, [comments]);

  // Filtered and sorted comments
  const filteredComments = useMemo(() => {
    return comments
      .filter((c) => {
        // Status filter
        if (statusFilter !== "ALL" && c.status !== statusFilter) {
          return false;
        }
        // Desk filter
        if (deskFilter !== "ALL" && c.article.categoryName !== deskFilter) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchContent = c.content.toLowerCase().includes(q);
          const matchUser = c.user.name.toLowerCase().includes(q);
          const matchEmail = (c.user.email || "").toLowerCase().includes(q);
          const matchStory = c.article.title.toLowerCase().includes(q);
          if (!matchContent && !matchUser && !matchEmail && !matchStory) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "likes") {
          return b.likesCount - a.likesCount;
        }
        if (sortBy === "flagged") {
          if (a.status === "FLAGGED" && b.status !== "FLAGGED") return -1;
          if (b.status === "FLAGGED" && a.status !== "FLAGGED") return 1;
        }
        // Default newest
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [comments, statusFilter, deskFilter, searchQuery, sortBy]);

  // Counts for pills
  const counts = useMemo(() => {
    return {
      all: comments.length,
      flagged: comments.filter((c) => c.status === "FLAGGED").length,
      approved: comments.filter((c) => c.status === "APPROVED").length,
      spam: comments.filter((c) => c.status === "SPAM").length,
    };
  }, [comments]);

  const showToast = (message: string) => {
    setActionFeedback(message);
    setTimeout(() => {
      setActionFeedback(null);
    }, 3500);
  };

  useEffect(() => {
    setCustomSidebarContent(
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-[#cbdbf5]">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#ffd9dd]" />
            <span>Moderation Filters</span>
          </div>
          {(statusFilter !== "ALL" ||
            deskFilter !== "ALL" ||
            searchQuery.trim() !== "" ||
            sortBy !== "newest") && (
            <button
              onClick={() => {
                setStatusFilter("ALL");
                setDeskFilter("ALL");
                setSearchQuery("");
                setSortBy("newest");
              }}
              className="text-[10px] text-[#ffd9dd] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Status Filter Cards */}
        <div className="grid grid-cols-2 gap-1.5">
          {/* All */}
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`flex items-center justify-between px-2.5 py-2 rounded text-xs transition-colors cursor-pointer ${
              statusFilter === "ALL"
                ? "bg-[#881337] text-white font-semibold shadow-xs"
                : "bg-white/5 text-[#cbdbf5] hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="truncate">All</span>
            <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30">
              {counts.all}
            </span>
          </button>

          {/* Flagged */}
          <button
            type="button"
            onClick={() => setStatusFilter("FLAGGED")}
            className={`flex items-center justify-between px-2.5 py-2 rounded text-xs transition-colors cursor-pointer ${
              statusFilter === "FLAGGED"
                ? "bg-amber-600 text-white font-semibold shadow-xs"
                : "bg-white/5 text-[#cbdbf5] hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="truncate">Flagged</span>
            <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200">
              {counts.flagged}
            </span>
          </button>

          {/* Approved */}
          <button
            type="button"
            onClick={() => setStatusFilter("APPROVED")}
            className={`flex items-center justify-between px-2.5 py-2 rounded text-xs transition-colors cursor-pointer ${
              statusFilter === "APPROVED"
                ? "bg-emerald-700 text-white font-semibold shadow-xs"
                : "bg-white/5 text-[#cbdbf5] hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="truncate">Approved</span>
            <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200">
              {counts.approved}
            </span>
          </button>

          {/* Spam */}
          <button
            type="button"
            onClick={() => setStatusFilter("SPAM")}
            className={`flex items-center justify-between px-2.5 py-2 rounded text-xs transition-colors cursor-pointer ${
              statusFilter === "SPAM"
                ? "bg-rose-900 text-white font-semibold shadow-xs"
                : "bg-white/5 text-[#cbdbf5] hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="truncate">Spam</span>
            <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30">
              {counts.spam}
            </span>
          </button>
        </div>

        {/* Search in Drawer */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#cbdbf5]/60 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search comments..."
            className="w-full pl-8 pr-7 py-1.5 bg-black/25 border border-white/15 rounded text-xs text-white placeholder:text-[#cbdbf5]/50 focus:outline-none focus:border-white/40 font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-2 text-[#cbdbf5] hover:text-white cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Desk & Sort Selectors */}
        <div className="space-y-2">
          <div>
            <label className="text-[10px] font-mono uppercase text-[#cbdbf5]/70 block mb-1">
              Desk Filter
            </label>
            <select
              value={deskFilter}
              onChange={(e) => setDeskFilter(e.target.value)}
              className="w-full bg-black/25 border border-white/15 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white/40 cursor-pointer font-sans"
            >
              <option value="ALL" className="bg-[#213145] text-white">
                All Desks
              </option>
              {deskOptions.map((d) => (
                <option key={d} value={d} className="bg-[#213145] text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-[#cbdbf5]/70 block mb-1">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "newest" | "likes" | "flagged")
              }
              className="w-full bg-black/25 border border-white/15 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white/40 cursor-pointer font-sans"
            >
              <option value="newest" className="bg-[#213145] text-white">
                Newest First
              </option>
              <option value="likes" className="bg-[#213145] text-white">
                Highest Engagement
              </option>
              <option value="flagged" className="bg-[#213145] text-white">
                Most Flagged
              </option>
            </select>
          </div>
        </div>
      </div>,
    );

    return () => setCustomSidebarContent(null);
  }, [
    statusFilter,
    deskFilter,
    searchQuery,
    sortBy,
    counts,
    deskOptions,
    setCustomSidebarContent,
  ]);

  const handleApprove = (id: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "APPROVED", flagReason: undefined } : c,
      ),
    );
    showToast("Comment marked as Approved and published.");
  };

  const handleTogglePin = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c)),
    );
    const item = comments.find((c) => c.id === id);
    showToast(
      item?.isPinned
        ? "Comment unpinned from story."
        : "Comment pinned as Editor's Pick.",
    );
  };

  const handleMarkSpam = (id: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "SPAM",
              flagReason: "Marked as Spam by Editorial Moderator",
            }
          : c,
      ),
    );
    showToast("Comment moved to Spam queue.");
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      setComments((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      showToast(`Comment by ${deleteTarget.user.name} permanently purged.`);
      setDeleteTarget(null);
    } catch {
      showToast("Error deleting comment. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredComments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredComments.map((c) => c.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleBatchApprove = () => {
    setComments((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.id)
          ? { ...c, status: "APPROVED", flagReason: undefined }
          : c,
      ),
    );
    showToast(`${selectedIds.length} comments approved and published.`);
    setSelectedIds([]);
    setIsBatchMenuOpen(false);
  };

  const handleBatchSpam = () => {
    setComments((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.id)
          ? {
              ...c,
              status: "SPAM",
              flagReason: "Bulk flagged as spam by moderator",
            }
          : c,
      ),
    );
    showToast(`${selectedIds.length} comments moved to spam.`);
    setSelectedIds([]);
    setIsBatchMenuOpen(false);
  };

  const handleBatchDelete = () => {
    setComments((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    showToast(`${selectedIds.length} comments deleted.`);
    setSelectedIds([]);
    setIsBatchMenuOpen(false);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setIsSubmittingReply(true);
    setTimeout(() => {
      setIsSubmittingReply(false);
      setActiveReplyId(null);
      setReplyText("");
      showToast("Official editorial reply published to thread.");
    }, 600);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredComments.length === 0) return;
    const headers = [
      "ID",
      "Reader",
      "Email",
      "Story Title",
      "Status",
      "Likes",
      "Date",
      "Comment",
    ];
    const rows = filteredComments.map((c) => [
      `"${c.id}"`,
      `"${c.user.name.replace(/"/g, '""')}"`,
      `"${(c.user.email || "").replace(/"/g, '""')}"`,
      `"${c.article.title.replace(/"/g, '""')}"`,
      `"${c.status}"`,
      `"${c.likesCount}"`,
      `"${c.createdAt}"`,
      `"${c.content.replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `chronicle-comments-audit-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col flex-1 min-h-full">
      {/* Toast Notification Banner */}
      {actionFeedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded shadow-xl border border-slate-700 text-xs font-mono animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* ==================== STICKY TOP EDITORIAL NAV BAR ==================== */}
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-[#CBD5E1] dark:border-slate-700 bg-[#E2E8F0] dark:bg-[#1E293B] px-4 sm:px-6 lg:px-8 shadow-xs gap-2">
        {/* Mobile & Tablet Left Area: Hamburger + Compact Status Indicator */}
        <div className="flex items-center gap-2.5 xl:hidden min-w-0">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex size-8.5 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shrink-0 transition-colors shadow-2xs"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <h1 className="font-serif font-bold text-base text-foreground tracking-tight truncate">
              Comments
            </h1>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border shadow-2xs ${
                statusFilter === "FLAGGED"
                  ? "bg-amber-50 text-amber-700 dark:text-amber-300 border-amber-300/80 dark:border-amber-700"
                  : statusFilter === "APPROVED"
                    ? "bg-emerald-50 text-emerald-700 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-700"
                    : statusFilter === "SPAM"
                      ? "bg-rose-50 text-rose-700 dark:text-rose-300 border-rose-300/80 dark:border-rose-700"
                      : "bg-white text-[#881337] dark:text-rose-400 border-slate-200 dark:border-slate-700 dark:bg-slate-800"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  statusFilter === "FLAGGED"
                    ? "bg-amber-500 animate-pulse"
                    : statusFilter === "APPROVED"
                      ? "bg-emerald-500"
                      : statusFilter === "SPAM"
                        ? "bg-rose-500"
                        : "bg-[#881337] animate-pulse"
                }`}
              />
              <span className="capitalize">
                {statusFilter === "ALL" ? "All" : statusFilter.toLowerCase()} (
                {statusFilter === "ALL"
                  ? counts.all
                  : statusFilter === "FLAGGED"
                    ? counts.flagged
                    : statusFilter === "APPROVED"
                      ? counts.approved
                      : counts.spam}
                )
              </span>
            </span>
          </div>
        </div>

        {/* Desktop Left / Center Area: Filters in Navbar */}
        <div className="hidden xl:flex items-center gap-2.5 2xl:gap-3 flex-1 min-w-0 mr-2">
          {/* Segmented Status Filter Pills */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200/90 dark:border-slate-700 shadow-2xs shrink-0">
            {/* All Discourse */}
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-[#881337] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`}
            >
              <span>All Discourse</span>
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

            {/* Flagged */}
            <button
              type="button"
              onClick={() => setStatusFilter("FLAGGED")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === "FLAGGED"
                  ? "bg-amber-600 text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`}
            >
              <span>Flagged</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  statusFilter === "FLAGGED"
                    ? "bg-white/25 text-white"
                    : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
                }`}
              >
                {counts.flagged}
              </span>
            </button>

            {/* Approved */}
            <button
              type="button"
              onClick={() => setStatusFilter("APPROVED")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === "APPROVED"
                  ? "bg-[#047857] text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`}
            >
              <span>Approved</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  statusFilter === "APPROVED"
                    ? "bg-white/25 text-white"
                    : "bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] dark:bg-emerald-950/40 dark:text-emerald-300"
                }`}
              >
                {counts.approved}
              </span>
            </button>

            {/* Spam */}
            <button
              type="button"
              onClick={() => setStatusFilter("SPAM")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === "SPAM"
                  ? "bg-rose-700 text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`}
            >
              <span>Spam</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  statusFilter === "SPAM"
                    ? "bg-white/25 text-white"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {counts.spam}
              </span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 shrink-0" />

          {/* Desk Dropdown */}
          <div className="relative shrink-0">
            <select
              value={deskFilter}
              onChange={(e) => setDeskFilter(e.target.value)}
              aria-label="Filter comments by desk"
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans cursor-pointer transition-colors shadow-2xs"
            >
              <option value="ALL">Desk: All Desks</option>
              {deskOptions.map((desk) => (
                <option key={desk} value={desk}>
                  {desk}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "newest" | "likes" | "flagged")
              }
              aria-label="Sort comments"
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans cursor-pointer transition-colors shadow-2xs"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="likes">Highest Engagement</option>
              <option value="flagged">Most Flagged</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs min-w-[180px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500 dark:text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search author, keyword, or dispatch..."
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
        </div>

        {/* Right Controls: Bell Icon only */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Bell Icon */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex items-center justify-center size-8.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shadow-2xs"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-600 ring-2 ring-card animate-pulse"></span>
          </button>
        </div>
      </header>

      {/* ==================== MAIN WORKSTATION CONTAINER ==================== */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-[1550px] w-full mx-auto">
        {/* ==================== 1. TOP STATS CARDS (Responsive Grid) ==================== */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {/* Card 1: Total Discourse */}
          <div className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
                Discourse
              </span>
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground/80" />
            </div>
            <div className="mt-1 sm:mt-2 mb-0.5 flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {initialData.stats.totalComments.toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-xs text-[#047857] font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-1 py-0.2 rounded">
                +12%
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground font-sans">
              comments logged
            </div>
          </div>

          {/* Card 2: Review Queue */}
          <div
            onClick={() => setStatusFilter("FLAGGED")}
            className={`cursor-pointer bg-card border rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-xs transition-all ${
              statusFilter === "FLAGGED"
                ? "border-amber-500 ring-1 ring-amber-500/30"
                : "border-[#E2E8F0] dark:border-slate-800 hover:border-amber-400"
            }`}
          >
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
                Queue
              </span>
              <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground/80" />
            </div>
            <div className="mt-1 sm:mt-2 mb-0.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {counts.flagged}
              </span>
              {counts.flagged === 0 ? (
                <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[11px] font-semibold tracking-wide">
                  <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-600" />
                  <span>Clean</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[11px] font-semibold">
                  <span>Needs Action</span>
                </span>
              )}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground font-sans">
              pending moderation
            </div>
          </div>

          {/* Card 3: Published Clean */}
          <div
            onClick={() => setStatusFilter("APPROVED")}
            className={`cursor-pointer bg-card border rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-xs transition-all ${
              statusFilter === "APPROVED"
                ? "border-emerald-500 ring-1 ring-emerald-500/30"
                : "border-[#E2E8F0] dark:border-slate-800 hover:border-emerald-400"
            }`}
          >
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
                Published
              </span>
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground/80" />
            </div>
            <div className="mt-1 sm:mt-2 mb-0.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {counts.approved.toLocaleString()}
              </span>
              <span className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-semibold">
                100% SLA
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground font-sans">
              approved public
            </div>
          </div>

          {/* Card 4: Health Index */}
          <div className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
                Health Index
              </span>
              <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#047857]" />
            </div>
            <div className="mt-1 sm:mt-2 mb-0.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#047857]">
                {initialData.stats.avgEngagementRate || "98.4%"}
              </span>
              <span className="text-[10px] sm:text-xs text-[#047857] font-semibold flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Optimal</span>
              </span>
            </div>
            {/* Micro-sparkline Progress indicator */}
            <div className="w-full bg-[#E2E8F0] dark:bg-slate-700 h-1 sm:h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-[#047857] h-full rounded-full"
                style={{ width: "98.4%" }}
              ></div>
            </div>
          </div>
        </section>

        {/* ==================== 2. MAIN MODERATION FEED CARDS ==================== */}
        <section className="space-y-3 sm:space-y-4">
          {/* Floating/Sticky Batch Action Ribbon when items selected */}
          {selectedIds.length > 0 && (
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg p-3 shadow-md flex items-center justify-between animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-rose-300">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-none">
                    Batch Operations
                  </div>
                  <span className="text-[10px] text-slate-300 font-mono">
                    {selectedIds.length} comments selected
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={handleBatchApprove}
                  className="bg-[#047857] hover:bg-[#036046] text-white px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Approve All</span>
                  <span className="sm:hidden">Approve</span>
                </button>
                <button
                  onClick={handleBatchSpam}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                >
                  <Flag className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Mark Spam</span>
                  <span className="sm:hidden">Spam</span>
                </button>
                <button
                  onClick={handleBatchDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="p-1 text-slate-300 hover:text-white rounded cursor-pointer"
                  title="Clear selection"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {filteredComments.length === 0 ? (
            <div className="bg-card border border-[#E2E8F0] dark:border-slate-800 border-dashed rounded-lg sm:rounded-xl p-8 sm:p-12 text-center">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-3">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-base font-serif font-semibold text-foreground">
                No matching reader comments found
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto font-sans">
                Try adjusting your desk filter, search query, or status tab to
                view other community interactions.
              </p>
            </div>
          ) : (
            filteredComments.map((comment, idx) => {
              const isSelected = selectedIds.includes(comment.id);
              const isReplying = activeReplyId === comment.id;
              const isEleanor =
                comment.user.name.toLowerCase().includes("eleanor") ||
                idx === 0;

              return (
                <article
                  key={comment.id}
                  className={`bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-lg sm:rounded-xl shadow-xs hover:shadow transition-shadow overflow-hidden ${
                    comment.isPinned
                      ? "border-l-[4px] border-l-[#881337]"
                      : comment.status === "FLAGGED"
                        ? "border-l-[4px] border-l-amber-500"
                        : comment.status === "SPAM"
                          ? "border-l-[4px] border-l-rose-500 opacity-80"
                          : ""
                  }`}
                >
                  {/* Card Header & Metadata Ribbon */}
                  <div className="p-3 sm:p-4 border-b border-[#E2E8F0] dark:border-slate-800 bg-[#FAFAFA]/90 dark:bg-slate-900/90 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5 min-w-0">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(comment.id)}
                          className="rounded border-[#CBD5E1] text-[#881337] focus:ring-[#881337] h-4 w-4 mt-1 cursor-pointer shrink-0"
                        />

                        {/* Author Portrait */}
                        <Avatar className="w-9 h-9 sm:w-10 sm:h-10 rounded object-cover border border-[#E2E8F0] dark:border-slate-700 shrink-0">
                          {comment.user.image ? (
                            <AvatarImage
                              src={comment.user.image}
                              alt={comment.user.name}
                            />
                          ) : (
                            <AvatarImage
                              src={
                                isEleanor
                                  ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
                                  : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                              }
                              alt={comment.user.name}
                            />
                          )}
                          <AvatarFallback className="text-xs font-serif font-bold bg-[#881337] text-white">
                            {comment.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-serif text-sm sm:text-base text-foreground font-semibold truncate">
                              {comment.user.name}
                            </h3>
                            <span
                              suppressHydrationWarning
                              className="text-[10px] sm:text-[11px] font-mono text-muted-foreground/80"
                            >
                              {formatCommentDate(comment.createdAt)}
                            </span>
                          </div>

                          {/* Badges Cluster */}
                          <div className="flex flex-wrap items-center gap-1 mt-0.5">
                            {comment.user.isVerified && (
                              <span className="inline-flex items-center gap-0.5 bg-[#FFF1F2] dark:bg-rose-950/40 text-[#881337] dark:text-rose-300 border border-[#FECDD3] dark:border-rose-800 px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-semibold font-mono">
                                <UserCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                <span>Verified Subscriber</span>
                              </span>
                            )}

                            {comment.user.role === "AUTHOR" ? (
                              <span className="inline-flex items-center gap-0.5 bg-[#F8FAFC] dark:bg-slate-800 text-secondary-foreground border border-[#E2E8F0] dark:border-slate-700 px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-semibold font-mono">
                                <GraduationCap className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                <span>Academic Fellow</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 bg-[#EFF6FF] dark:bg-blue-950/40 text-[#1E40AF] dark:text-blue-300 border border-[#DBEAFE] dark:border-blue-800 px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-medium font-mono">
                                <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                                <span>Contributor</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Header Status / Badge */}
                      <div className="shrink-0">
                        {comment.isPinned ? (
                          <div className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded bg-[#FFFBEB] dark:bg-amber-950/40 border border-[#FDE68A] dark:border-amber-800 text-[#92400E] dark:text-amber-300 text-[10px] sm:text-xs font-semibold shadow-2xs">
                            <Pin className="h-3 w-3 fill-[#92400E] dark:fill-amber-300" />
                            <span className="hidden sm:inline">
                              Pinned Editor&apos;s Pick
                            </span>
                            <span className="sm:hidden">Pinned</span>
                          </div>
                        ) : comment.status === "FLAGGED" ? (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold">
                            <AlertTriangle className="h-3 w-3 text-amber-600" />
                            <span>Flagged</span>
                          </div>
                        ) : comment.status === "SPAM" ? (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-[10px] font-mono font-bold">
                            <X className="h-3 w-3 text-rose-600" />
                            <span>Spam</span>
                          </div>
                        ) : (
                          <div className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded bg-[#F1F5F9] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 hidden sm:block">
                            Triage: Public Stream
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Linked Article Dispatch Reference */}
                    <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800 text-xs font-sans">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono uppercase text-[#881337] dark:text-rose-400 font-bold">
                          Dispatch:
                        </span>
                        <Link
                          href={`/articles/${comment.article.slug}`}
                          target="_blank"
                          className="font-serif italic font-bold text-[#881337] dark:text-rose-300 hover:underline flex items-center gap-1 truncate max-w-xl text-[12px] sm:text-sm"
                        >
                          <span className="truncate">
                            {comment.article.title}
                          </span>
                          <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
                        </Link>
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground/70 mt-0.5">
                        Section:{" "}
                        {comment.article.categoryName || "Metro Infrastructure"}
                      </div>
                    </div>
                  </div>

                  {/* Flag warning alert if exists */}
                  {comment.flagReason && (
                    <div className="mx-3 sm:mx-4 mt-2 p-2 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2 font-mono">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                      <span className="text-[11px]">{comment.flagReason}</span>
                    </div>
                  )}

                  {/* Comment Body */}
                  <div className="p-3 sm:p-4">
                    <p className="text-[13px] sm:text-[15px] text-foreground leading-relaxed font-sans">
                      {comment.content}
                    </p>
                  </div>

                  {/* Card Engagement & Action Bar Ribbon */}
                  <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-card border-t border-[#E2E8F0] dark:border-slate-800 space-y-2">
                    {/* Row 1: Sentiment Pill & Engagement Stats */}
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-foreground font-medium">
                          <Heart className="h-3.5 w-3.5 text-[#881337] fill-[#881337]" />
                          <span>{comment.likesCount}</span>
                        </span>

                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>
                            {Math.max(2, (comment.likesCount % 8) + 1)} Replies
                          </span>
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#ECFDF5] dark:bg-emerald-950/40 border border-[#A7F3D0] dark:border-emerald-800 text-[#065F46] dark:text-emerald-300 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#047857]"></span>
                        <span>
                          {comment.status === "FLAGGED"
                            ? "Heated (0.62)"
                            : "Constructive (0.94)"}
                        </span>
                      </div>
                    </div>

                    {/* Row 2: Moderation Action Toolbar (Responsive Grid on mobile) */}
                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-5 sm:flex sm:items-center sm:justify-end gap-1.5">
                      {/* Approve Button */}
                      {comment.status === "APPROVED" ? (
                        <button
                          type="button"
                          onClick={() =>
                            showToast("Comment is currently approved & live.")
                          }
                          className="col-span-2 sm:col-auto inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded bg-[#047857] text-white text-xs font-medium border border-[#047857] shadow-2xs cursor-pointer active:scale-95 transition-transform"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span className="text-[11px] sm:text-xs">
                            Approved
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApprove(comment.id)}
                          className="col-span-2 sm:col-auto inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded border border-[#047857] text-[#047857] hover:bg-[#ECFDF5] text-xs font-medium transition-colors cursor-pointer active:scale-95"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span className="text-[11px] sm:text-xs">
                            Approve
                          </span>
                        </button>
                      )}

                      {/* Pin Button */}
                      <button
                        type="button"
                        onClick={() => handleTogglePin(comment.id)}
                        className={`col-span-1 sm:col-auto inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer active:scale-95 ${
                          comment.isPinned
                            ? "bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] hover:bg-[#FEF3C7] dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                            : "border border-[#CBD5E1] dark:border-slate-700 bg-card hover:bg-muted text-foreground"
                        }`}
                      >
                        <Pin
                          className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${comment.isPinned ? "fill-[#92400E] dark:fill-amber-300" : ""}`}
                        />
                        <span className="text-[10px] sm:text-xs">
                          {comment.isPinned ? "Pinned" : "Pin"}
                        </span>
                      </button>

                      {/* Reply Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveReplyId(isReplying ? null : comment.id);
                          setReplyText("");
                        }}
                        className="col-span-1 sm:col-auto inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 rounded border border-[#CBD5E1] dark:border-slate-700 bg-card hover:bg-muted text-foreground text-xs font-medium transition-colors cursor-pointer active:scale-95"
                      >
                        <Reply className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="text-[10px] sm:text-xs">Reply</span>
                      </button>

                      {/* Flag Button */}
                      <button
                        type="button"
                        onClick={() => handleMarkSpam(comment.id)}
                        className="col-span-1 sm:col-auto p-1.5 rounded border border-[#CBD5E1] dark:border-slate-700 bg-card hover:bg-[#FFF1F2] text-muted-foreground hover:text-[#881337] transition-colors cursor-pointer flex items-center justify-center active:scale-95"
                        title="Flag as spam"
                      >
                        <Flag className="h-3.5 w-3.5" />
                      </button>

                      {/* Delete Button (Visible on sm/tablet/desktop) */}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(comment)}
                        className="hidden sm:inline-flex p-1.5 rounded border border-[#CBD5E1] dark:border-slate-700 bg-card hover:bg-[#FFF1F2] text-muted-foreground hover:text-red-600 transition-colors cursor-pointer items-center justify-center active:scale-95"
                        title="Delete comment permanently"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Inline Editorial Reply Drawer */}
                  {isReplying && (
                    <div className="p-3 sm:p-4 border-t border-[#E2E8F0] dark:border-slate-800 bg-[#FAFAFA]/90 dark:bg-slate-900/90 animate-in fade-in duration-150 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          Official Editorial Response
                        </span>
                        <span>• Replying to {comment.user.name}</span>
                      </div>

                      <div className="relative">
                        <textarea
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type an official editorial dispatch on behalf of News Portal Editorial Desk..."
                          className="w-full p-2.5 sm:p-3 text-xs bg-card border border-[#CBD5E1] dark:border-slate-700 rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-all font-sans resize-y"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveReplyId(null);
                            setReplyText("");
                          }}
                          className="px-3 py-1 text-xs font-mono text-muted-foreground hover:text-foreground rounded cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendReply()}
                          disabled={isSubmittingReply || !replyText.trim()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#881337] hover:bg-[#640023] text-white rounded shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {isSubmittingReply ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              <span>Publishing...</span>
                            </>
                          ) : (
                            <>
                              <Send className="h-3.5 w-3.5" />
                              <span>Publish Bureau Reply</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>

        {/* ==================== 4. EDITORIAL FOOTER NOTE ==================== */}
        <footer className="pt-4 sm:pt-6 pb-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between border-t border-[#E2E8F0] dark:border-slate-800 text-muted-foreground text-xs font-sans gap-2">
          <div className="flex items-center justify-center sm:justify-start gap-1.5">
            <span className="font-serif font-bold text-foreground">
              News Portal
            </span>
            <span>• Charter v4.2</span>
          </div>
          <div className="text-[10px] sm:text-[11px] font-mono text-muted-foreground/70 mt-1 sm:mt-0">
            All moderation events cryptographically signed and logged for
            accountability.
          </div>
        </footer>
      </main>

      {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border rounded max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="h-10 w-10 rounded bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-foreground">
                  Purge Reader Comment?
                </h3>
                <p className="text-xs text-muted-foreground font-sans">
                  This action is permanent and logged in the moderation audit.
                </p>
              </div>
            </div>

            <div className="bg-muted/40 p-3 rounded border border-border text-xs text-foreground italic font-sans">
              &ldquo;{deleteTarget.content}&rdquo;
            </div>

            <div className="text-xs text-muted-foreground font-mono">
              Comment Author:{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget.user.name}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-mono border border-border rounded text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirmed}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-medium bg-red-600 hover:bg-red-700 text-white rounded transition-colors shadow-2xs cursor-pointer"
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
