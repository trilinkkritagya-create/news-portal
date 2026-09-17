"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserPlus,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  ChevronDown,
  X,
  Loader2,
  BookOpen,
  Sparkles,
  Mail,
  Shield,
  Edit,
  Power,
  Menu,
  Bell,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import {
  DashboardUserItem,
  UsersDashboardStats,
} from "@/lib/dashboard/get-users-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "./SidebarContext";

interface UsersManagementViewProps {
  initialData: {
    stats: UsersDashboardStats;
    users: DashboardUserItem[];
  };
}

function formatUserDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function UsersManagementView({
  initialData,
}: UsersManagementViewProps) {
  const { toggle, setCustomSidebarContent } = useSidebar();
  const [users, setUsers] = useState<DashboardUserItem[]>(initialData.users);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "name" | "articles">("newest");

  // Invite Modal state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"AUTHOR" | "ADMIN" | "MEMBER">("AUTHOR");
  const [inviteBio, setInviteBio] = useState("");
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);

  // Edit / Role Modal state
  const [editingUser, setEditingUser] = useState<DashboardUserItem | null>(null);
  const [editRole, setEditRole] = useState<string>("AUTHOR");

  // Deletion Modal state
  const [deleteTarget, setDeleteTarget] = useState<DashboardUserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast feedback state
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const showToast = (message: string) => {
    setActionFeedback(message);
    setTimeout(() => {
      setActionFeedback(null);
    }, 3500);
  };

  // Filtered and sorted users
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
        if (statusFilter !== "ALL" && u.status !== statusFilter) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = u.name.toLowerCase().includes(q);
          const matchEmail = u.email.toLowerCase().includes(q);
          const matchBio = (u.bio || "").toLowerCase().includes(q);
          if (!matchName && !matchEmail && !matchBio) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "articles") {
          return b.articlesCount - a.articlesCount;
        }
        return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
      });
  }, [users, roleFilter, statusFilter, searchQuery, sortBy]);

  // Counts for pills
  const counts = useMemo(() => {
    return {
      all: users.length,
      admins: users.filter((u) => u.role === "ADMIN").length,
      authors: users.filter((u) => u.role === "AUTHOR").length,
      members: users.filter((u) => u.role === "MEMBER").length,
    };
  }, [users]);

  // Handle Invite
  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    setIsSubmittingInvite(true);
    setTimeout(() => {
      const newUser: DashboardUserItem = {
        id: `usr-${Date.now()}`,
        name: inviteName.trim(),
        email: inviteEmail.trim().toLowerCase(),
        image: null,
        role: inviteRole,
        bio: inviteBio.trim() || `${inviteRole} staff member at The Chronicle`,
        articlesCount: 0,
        status: "ACTIVE",
        joinedAt: new Date().toISOString(),
        lastActiveAt: "Just now",
      };

      setUsers((prev) => [newUser, ...prev]);
      setIsSubmittingInvite(false);
      setIsInviteOpen(false);
      setInviteName("");
      setInviteEmail("");
      setInviteBio("");
      showToast(`Invitation dispatched to ${newUser.email}`);
    }, 600);
  };

  // Handle Role Change
  const handleSaveRole = () => {
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? { ...u, role: editRole } : u))
    );
    showToast(`Role updated to ${editRole} for ${editingUser.name}.`);
    setEditingUser(null);
  };

  // Handle Status Toggle (Active vs Suspended)
  const handleToggleStatus = (user: DashboardUserItem) => {
    const nextStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );
    showToast(
      nextStatus === "SUSPENDED"
        ? `Account for ${user.name} suspended.`
        : `Account for ${user.name} reinstated.`
    );
  };

  // Handle Delete Confirmed
  const handleDeleteConfirmed = () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setTimeout(() => {
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      showToast(`User ${deleteTarget.name} removed from roster.`);
      setDeleteTarget(null);
      setIsDeleting(false);
    }, 400);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredUsers.length === 0) return;
    const headers = ["ID", "Name", "Email", "Role", "Status", "Articles Count", "Joined Date"];
    const rows = filteredUsers.map((u) => [
      `"${u.id}"`,
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.status}"`,
      `"${u.articlesCount}"`,
      `"${u.joinedAt}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `chronicle-users-roster-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
    setSortBy("newest");
  };

  // Sync mobile/tablet drawer filter content
  useEffect(() => {
    setCustomSidebarContent(
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 text-slate-300">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-rose-300">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>User Filters</span>
          </div>
          {(roleFilter !== "ALL" || statusFilter !== "ALL" || searchQuery) && (
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

        {/* Role Segmented Buttons */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-slate-400">
            Role Tier
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setRoleFilter("ALL")}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                roleFilter === "ALL"
                  ? "bg-[#881337] text-white font-semibold"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span>All</span>
              <span className="text-[10px] font-mono opacity-80">{counts.all}</span>
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("ADMIN")}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                roleFilter === "ADMIN"
                  ? "bg-purple-600 text-white font-semibold"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span>Admins</span>
              <span className="text-[10px] font-mono opacity-80">{counts.admins}</span>
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("AUTHOR")}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                roleFilter === "AUTHOR"
                  ? "bg-blue-600 text-white font-semibold"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span>Authors</span>
              <span className="text-[10px] font-mono opacity-80">{counts.authors}</span>
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("MEMBER")}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                roleFilter === "MEMBER"
                  ? "bg-emerald-600 text-white font-semibold"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span>Members</span>
              <span className="text-[10px] font-mono opacity-80">{counts.members}</span>
            </button>
          </div>
        </div>

        {/* Status Select */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-slate-400">
            Account Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 font-sans cursor-pointer"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="ACTIVE">Active Nominal</option>
            <option value="SUSPENDED">Suspended Only</option>
          </select>
        </div>

        {/* Sort Select */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-slate-400">
            Order By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "name" | "articles")}
            className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 font-sans cursor-pointer"
          >
            <option value="newest">Newest Joined First</option>
            <option value="name">User Name (A-Z)</option>
            <option value="articles">Most Articles Published</option>
          </select>
        </div>

        {/* Search inside drawer */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-slate-400">
            Search Users
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name, email, or bio..."
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
          <span>Export Roster (.CSV)</span>
        </button>
      </div>
    );

    return () => {
      setCustomSidebarContent(null);
    };
  }, [
    setCustomSidebarContent,
    roleFilter,
    statusFilter,
    sortBy,
    searchQuery,
    counts,
    filteredUsers,
  ]);

  return (
    <div className="flex flex-1 flex-col min-h-screen">
      {/* Toast Feedback */}
      {actionFeedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-lg shadow-xl border border-slate-700 text-xs font-mono animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* ==================== STICKY TOP EDITORIAL NAV BAR ==================== */}
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-[#CBD5E1] dark:border-slate-700 bg-[#E2E8F0] dark:bg-[#1E293B] px-4 sm:px-6 lg:px-8 shadow-xs gap-2">
        {/* Mobile & Tablet Left Area: Hamburger + Section Title + Role Pill */}
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
              Users
            </h1>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border shadow-2xs ${
                roleFilter === "ADMIN"
                  ? "bg-purple-50 text-purple-700 dark:text-purple-300 border-purple-300/80 dark:border-purple-700"
                  : roleFilter === "AUTHOR"
                  ? "bg-blue-50 text-blue-700 dark:text-blue-300 border-blue-300/80 dark:border-blue-700"
                  : roleFilter === "MEMBER"
                  ? "bg-emerald-50 text-emerald-700 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-700"
                  : "bg-white text-[#881337] dark:text-rose-400 border-slate-200 dark:border-slate-700 dark:bg-slate-800"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  roleFilter === "ADMIN"
                    ? "bg-purple-500 animate-pulse"
                    : roleFilter === "AUTHOR"
                    ? "bg-blue-500"
                    : roleFilter === "MEMBER"
                    ? "bg-emerald-500"
                    : "bg-[#881337] animate-pulse"
                }`}
              />
              <span className="capitalize truncate">
                {roleFilter === "ALL" ? "All Roles" : roleFilter.toLowerCase()} (
                {roleFilter === "ALL"
                  ? counts.all
                  : roleFilter === "ADMIN"
                  ? counts.admins
                  : roleFilter === "AUTHOR"
                  ? counts.authors
                  : counts.members}
                )
              </span>
            </span>
          </div>
        </div>

        {/* Desktop Left / Center Area: Filters in Navbar */}
        <div className="hidden xl:flex items-center gap-2.5 2xl:gap-3 flex-1 min-w-0 mr-2">
          {/* Segmented Role Filter Pills */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200/90 dark:border-slate-700 shadow-2xs shrink-0">
            {/* All Roles */}
            <button
              type="button"
              onClick={() => setRoleFilter("ALL")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                roleFilter === "ALL"
                  ? "bg-[#881337] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`}
            >
              <span>All Roles</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  roleFilter === "ALL"
                    ? "bg-white/25 text-white"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {counts.all}
              </span>
            </button>

            {/* Admins */}
            <button
              type="button"
              onClick={() => setRoleFilter("ADMIN")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                roleFilter === "ADMIN"
                  ? "bg-purple-600 text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`}
            >
              <span>Admins</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  roleFilter === "ADMIN"
                    ? "bg-white/25 text-white"
                    : "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300"
                }`}
              >
                {counts.admins}
              </span>
            </button>

            {/* Authors */}
            <button
              type="button"
              onClick={() => setRoleFilter("AUTHOR")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                roleFilter === "AUTHOR"
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`}
            >
              <span>Authors</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  roleFilter === "AUTHOR"
                    ? "bg-white/25 text-white"
                    : "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300"
                }`}
              >
                {counts.authors}
              </span>
            </button>

            {/* Members */}
            <button
              type="button"
              onClick={() => setRoleFilter("MEMBER")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                roleFilter === "MEMBER"
                  ? "bg-emerald-600 text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`}
            >
              <span>Members</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  roleFilter === "MEMBER"
                    ? "bg-white/25 text-white"
                    : "bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] dark:bg-emerald-950/40 dark:text-emerald-300"
                }`}
              >
                {counts.members}
              </span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 shrink-0" />

          {/* Status Dropdown */}
          <div className="relative shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter users by status"
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans cursor-pointer transition-colors shadow-2xs"
            >
              <option value="ALL">Status: All Statuses</option>
              <option value="ACTIVE">Active Nominal</option>
              <option value="SUSPENDED">Suspended Only</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "newest" | "name" | "articles")
              }
              aria-label="Sort users"
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans cursor-pointer transition-colors shadow-2xs"
            >
              <option value="newest">Sort: Joined Date</option>
              <option value="name">Name (A-Z)</option>
              <option value="articles">Most Articles</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs min-w-[180px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500 dark:text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, or bio..."
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

        {/* Right Controls: Export + Invite Staff + Bell */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Export CSV (desktop) */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="hidden sm:inline-flex items-center gap-1.5 h-8.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-mono transition-colors shadow-2xs cursor-pointer"
            title="Export CSV"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Export</span>
          </button>

          {/* Invite Staff Button */}
          <button
            type="button"
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 h-8.5 px-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-medium transition-all duration-150 shadow-xs hover:shadow active:scale-98 shrink-0 cursor-pointer"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Invite Staff</span>
            <span className="sm:hidden">Invite</span>
          </button>

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
        {/* ==================== 1. TOP STATS CARDS (4-Column Grid) ==================== */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {/* Card 1: Total Platform Users */}
          <div
            onClick={() => setRoleFilter("ALL")}
            className={`cursor-pointer bg-card border rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-xs transition-all ${
              roleFilter === "ALL"
                ? "border-[#881337] ring-1 ring-[#881337]/30"
                : "border-[#E2E8F0] dark:border-slate-800 hover:border-slate-400"
            }`}
          >
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
                Total Roster
              </span>
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground/80" />
            </div>
            <div className="mt-1 sm:mt-2 mb-0.5 flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {counts.all.toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-xs text-[#047857] font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-1 py-0.2 rounded">
                +24/wk
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground font-sans">
              active directory accounts
            </div>
          </div>

          {/* Card 2: Bureau Journalists (Authors) */}
          <div
            onClick={() => setRoleFilter("AUTHOR")}
            className={`cursor-pointer bg-card border rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-xs transition-all ${
              roleFilter === "AUTHOR"
                ? "border-blue-500 ring-1 ring-blue-500/30"
                : "border-[#E2E8F0] dark:border-slate-800 hover:border-blue-400"
            }`}
          >
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
                Bureau Authors
              </span>
              <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
            </div>
            <div className="mt-1 sm:mt-2 mb-0.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {counts.authors.toLocaleString()}
              </span>
              <span className="bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[11px] font-semibold tracking-wide">
                Staff
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground font-sans">
              journalists &amp; correspondents
            </div>
          </div>

          {/* Card 3: Platform Admins */}
          <div
            onClick={() => setRoleFilter("ADMIN")}
            className={`cursor-pointer bg-card border rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-xs transition-all ${
              roleFilter === "ADMIN"
                ? "border-purple-500 ring-1 ring-purple-500/30"
                : "border-[#E2E8F0] dark:border-slate-800 hover:border-purple-400"
            }`}
          >
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
                Administrators
              </span>
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
            </div>
            <div className="mt-1 sm:mt-2 mb-0.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {counts.admins.toLocaleString()}
              </span>
              <span className="bg-purple-50 border border-purple-200 text-purple-700 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[11px] font-semibold">
                Superuser
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground font-sans">
              full governance oversight
            </div>
          </div>

          {/* Card 4: Subscribed Readers */}
          <div
            onClick={() => setRoleFilter("MEMBER")}
            className={`cursor-pointer bg-card border rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-xs transition-all ${
              roleFilter === "MEMBER"
                ? "border-emerald-500 ring-1 ring-emerald-500/30"
                : "border-[#E2E8F0] dark:border-slate-800 hover:border-emerald-400"
            }`}
          >
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
                Subscribed Readers
              </span>
              <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
            </div>
            <div className="mt-1 sm:mt-2 mb-0.5 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {counts.members.toLocaleString()}
              </span>
              <span className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[11px] font-semibold font-mono">
                Patrons
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground font-sans">
              community member tier
            </div>
          </div>
        </section>

        {/* ==================== 2. MAIN USERS WORKBENCH TABLE ==================== */}
        <section className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-lg sm:rounded-xl shadow-xs overflow-hidden flex flex-col">
          {/* Table Header Strip */}
          <div className="p-3.5 sm:p-4 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-base text-foreground">
                Newsroom Directory
              </h2>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-muted-foreground border border-slate-200 dark:border-slate-700 shadow-2xs">
                {filteredUsers.length} matching
              </span>
            </div>

            {(roleFilter !== "ALL" || statusFilter !== "ALL" || searchQuery) && (
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

          {/* Desktop & Tablet Table */}
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 pl-4 pr-2 font-medium">User Profile</th>
                  <th className="py-2.5 px-3 font-medium">Role &amp; Permissions</th>
                  <th className="py-2.5 px-3 font-medium">Filed Dispatches</th>
                  <th className="py-2.5 px-3 font-medium">Status</th>
                  <th className="py-2.5 px-3 font-medium">Joined Date</th>
                  <th className="py-2.5 pl-2 pr-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-slate-800">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-muted-foreground font-mono"
                    >
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-2">
                        <Users className="h-5 w-5" />
                      </div>
                      No user accounts found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-900/50 transition-colors group"
                      >
                        {/* User Avatar + Name + Email */}
                        <td className="py-3 pl-4 pr-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8.5 w-8.5 border border-slate-200 dark:border-slate-700 shrink-0">
                              {user.image && <AvatarImage src={user.image} alt={user.name} />}
                              <AvatarFallback className="text-xs font-mono font-bold bg-muted text-foreground">
                                {user.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="font-serif font-bold text-xs text-foreground truncate max-w-xs">
                                {user.name}
                              </div>
                              <div className="text-[11px] font-mono text-muted-foreground truncate max-w-xs">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {user.role === "ADMIN" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                              <Shield className="h-3 w-3" />
                              ADMINISTRATOR
                            </span>
                          )}
                          {user.role === "AUTHOR" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                              <BookOpen className="h-3 w-3" />
                              STAFF AUTHOR
                            </span>
                          )}
                          {user.role === "MEMBER" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              <UserCheck className="h-3 w-3" />
                              MEMBER READER
                            </span>
                          )}
                        </td>

                        {/* Articles Count */}
                        <td className="py-3 px-3 whitespace-nowrap font-mono text-xs text-foreground">
                          {user.articlesCount}{" "}
                          <span className="text-muted-foreground font-normal">
                            {user.articlesCount === 1 ? "article" : "articles"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {user.status === "ACTIVE" ? (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-rose-600 dark:text-rose-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                              Suspended
                            </span>
                          )}
                        </td>

                        {/* Joined Date */}
                        <td
                          suppressHydrationWarning
                          className="py-3 px-3 whitespace-nowrap font-mono text-[10px] text-muted-foreground"
                        >
                          {formatUserDate(user.joinedAt)}
                        </td>

                        {/* Actions */}
                        <td className="py-3 pl-2 pr-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1 opacity-90 group-hover:opacity-100">
                            {/* Edit Role Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingUser(user);
                                setEditRole(user.role);
                              }}
                              className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors cursor-pointer"
                              title="Modify role permissions"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>

                            {/* Toggle Status (Suspend / Activate) */}
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(user)}
                              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                user.status === "ACTIVE"
                                  ? "text-muted-foreground hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                                  : "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100"
                              }`}
                              title={user.status === "ACTIVE" ? "Suspend user account" : "Reactivate account"}
                            >
                              <Power className="h-3.5 w-3.5" />
                            </button>

                            {/* Delete User */}
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(user)}
                              className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer"
                              title="Delete user account"
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
        </section>
      </main>

      {/* ==================== INVITE STAFF MODAL ==================== */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-foreground">
                    Invite Staff Member
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-sans">
                    Issue portal credentials to a new writer or editor.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono uppercase text-[10px] text-muted-foreground mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Gabriel Montgomery"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[10px] text-muted-foreground mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. g.montgomery@chronicle.org"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[10px] text-muted-foreground mb-1">
                  Newsroom Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) =>
                    setInviteRole(e.target.value as "AUTHOR" | "ADMIN" | "MEMBER")
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans cursor-pointer"
                >
                  <option value="AUTHOR">Author / Journalist (Publishing Access)</option>
                  <option value="ADMIN">Bureau Administrator (Full Oversight)</option>
                  <option value="MEMBER">Member Reader (Subscription Tier)</option>
                </select>
              </div>

              <div>
                <label className="block font-mono uppercase text-[10px] text-muted-foreground mb-1">
                  Editorial Bio / Department (Optional)
                </label>
                <textarea
                  rows={2}
                  value={inviteBio}
                  onChange={(e) => setInviteBio(e.target.value)}
                  placeholder="e.g. Investigative technology correspondent covering international affairs"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E2E8F0] dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingInvite}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingInvite ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending Invite...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>Dispatch Invitation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== EDIT ROLE MODAL ==================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-foreground">
                    Modify Role Permissions
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-sans">
                    Adjust access credentials for {editingUser.name}.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 text-muted-foreground hover:text-foreground rounded cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block font-mono uppercase text-[10px] text-muted-foreground">
                Select New Role Tier
              </label>
              <div className="space-y-2">
                {["AUTHOR", "ADMIN", "MEMBER"].map((r) => (
                  <label
                    key={r}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      editRole === r
                        ? "border-[#881337] bg-rose-50/50 dark:bg-rose-950/20"
                        : "border-slate-200 dark:border-slate-700 hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="role"
                        value={r}
                        checked={editRole === r}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="text-[#881337] focus:ring-[#881337]"
                      />
                      <div>
                        <div className="font-semibold text-foreground">
                          {r === "ADMIN"
                            ? "Bureau Administrator"
                            : r === "AUTHOR"
                            ? "Staff Author"
                            : "Subscribed Member"}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {r === "ADMIN"
                            ? "Full newsroom moderation, settings, and user governance."
                            : r === "AUTHOR"
                            ? "Can write, draft, and publish news dispatches."
                            : "Standard read, bookmark, and reader discourse privileges."}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E2E8F0] dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-muted text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRole}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 transition-colors cursor-pointer"
              >
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== DELETE USER MODAL ==================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-foreground">
                  Remove Account
                </h3>
                <p className="text-xs text-muted-foreground font-sans">
                  Revoke credentials and purge profile for {deleteTarget.name}.
                </p>
              </div>
            </div>

            <div className="p-3 bg-muted/40 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
              <div className="font-serif font-bold text-foreground">
                {deleteTarget.name}
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                {deleteTarget.email} · {deleteTarget.role}
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
                onClick={handleDeleteConfirmed}
                disabled={isDeleting}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Confirm Removal</span>
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
