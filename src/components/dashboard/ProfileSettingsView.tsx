"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Shield,
  KeyRound,
  Bell,
  Save,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Lock,
  Globe,
  Loader2,
  FileText,
  Heart,
  MessageSquare,
  Menu,
  SlidersHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "./SidebarContext";

interface UserProfileData {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

interface ProfileSettingsViewProps {
  user: UserProfileData | null;
}

export default function ProfileSettingsView({ user }: ProfileSettingsViewProps) {
  const { toggle, setCustomSidebarContent } = useSidebar();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "activity">("profile");

  // Profile Form state
  const [name, setName] = useState(user?.name || "Editorial Staff");
  const [email, setEmail] = useState(user?.email || "staff@chronicle.org");
  const [headline, setHeadline] = useState(
    user?.role === "ADMIN"
      ? "Lead Editor & Bureau Director"
      : user?.role === "AUTHOR"
      ? "Senior Technology & Science Journalist"
      : "Subscribed Reader & Contributor"
  );
  const [bio, setBio] = useState(
    user?.role === "ADMIN"
      ? "Directing global newsroom dispatches, investigative integrity, and digital publishing pipelines."
      : user?.role === "AUTHOR"
      ? "Covering quantum computation, machine intelligence, and energy infrastructure breakthroughs."
      : "Avid daily reader of international diplomacy, technology breakthroughs, and architectural design."
  );
  const [website, setWebsite] = useState("https://chronicle.org");
  const [avatarUrl, setAvatarUrl] = useState(user?.image || "");

  // Password / Security Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Notification Preferences state
  const [notifyDispatches, setNotifyDispatches] = useState(true);
  const [notifyComments, setNotifyComments] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(true);
  const [notifySecurityAlerts, setNotifySecurityAlerts] = useState(true);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showToast = (message: string) => {
    setFeedback(message);
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Profile credentials & identity saved successfully.");
    }, 500);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Security credentials updated successfully.");
    }, 600);
  };

  const handleSavePreferences = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Notification and dispatch preferences saved.");
    }, 400);
  };

  // Sync mobile/tablet drawer navigation
  useEffect(() => {
    setCustomSidebarContent(
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 text-slate-300">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-rose-300">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Profile Sections</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
              activeTab === "profile"
                ? "bg-[#881337] text-white font-semibold shadow-xs"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Editorial Identity</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
              activeTab === "security"
                ? "bg-[#881337] text-white font-semibold shadow-xs"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>Security &amp; Passphrase</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
              activeTab === "notifications"
                ? "bg-[#881337] text-white font-semibold shadow-xs"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            <span>Notification Prefs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
              activeTab === "activity"
                ? "bg-[#881337] text-white font-semibold shadow-xs"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Performance Overview</span>
          </button>
        </div>
      </div>
    );

    return () => {
      setCustomSidebarContent(null);
    };
  }, [setCustomSidebarContent, activeTab]);

  const userInitial = (name || "U").charAt(0).toUpperCase();

  const getActiveTabTitle = () => {
    if (activeTab === "profile") return "Editorial Identity";
    if (activeTab === "security") return "Security & Auth";
    if (activeTab === "notifications") return "Notifications";
    return "Performance";
  };

  return (
    <div className="flex flex-1 flex-col min-h-screen">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-lg shadow-xl border border-slate-700 text-xs font-mono animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ==================== STICKY TOP EDITORIAL NAV BAR ==================== */}
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-[#CBD5E1] dark:border-slate-700 bg-[#E2E8F0] dark:bg-[#1E293B] px-4 sm:px-6 lg:px-8 shadow-xs gap-2">
        {/* Mobile & Tablet Left Area: Hamburger + Section Title + Active Tab Badge */}
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
              Profile
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border bg-white dark:bg-slate-800 text-[#881337] dark:text-rose-400 border-slate-200 dark:border-slate-700 shadow-2xs shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#881337] animate-pulse shrink-0" />
              <span className="truncate">{getActiveTabTitle()}</span>
            </span>
          </div>
        </div>

        {/* Desktop Left / Center Area: Tab Pills in Navbar */}
        <div className="hidden xl:flex items-center gap-2.5 2xl:gap-3 flex-1 min-w-0 mr-2">
          {/* Segmented Tab Filter Pills */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200/90 dark:border-slate-700 shadow-2xs shrink-0">
            {/* Tab: Identity */}
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#881337] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Editorial Identity</span>
            </button>

            {/* Tab: Security */}
            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "security"
                  ? "bg-[#881337] text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Security &amp; Passphrase</span>
            </button>

            {/* Tab: Notifications */}
            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "notifications"
                  ? "bg-[#881337] text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`}
            >
              <Bell className="h-3.5 w-3.5" />
              <span>Notification Prefs</span>
            </button>

            {/* Tab: Performance */}
            <button
              type="button"
              onClick={() => setActiveTab("activity")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "activity"
                  ? "bg-[#881337] text-white font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Performance</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 shrink-0" />

          {/* Standing status pill */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium border bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border-slate-300 dark:border-slate-600 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Account Verified &amp; Standing Nominal</span>
          </span>
        </div>

        {/* Right Controls: Bell */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
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
        {/* ==================== 1. HERO PROFILE OVERVIEW CARD ==================== */}
        <section className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <Avatar className="h-14 w-14 sm:h-18 sm:w-18 border-2 border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
                <AvatarFallback className="text-lg sm:text-xl font-mono font-bold bg-[#881337]/10 text-[#881337] dark:text-rose-400">
                  {userInitial}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-foreground truncate">
                    {name}
                  </h2>
                  {user?.role === "ADMIN" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                      <Shield className="h-3 w-3" />
                      ADMINISTRATOR
                    </span>
                  )}
                  {user?.role === "AUTHOR" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                      <BookOpen className="h-3 w-3" />
                      STAFF JOURNALIST
                    </span>
                  )}
                  {user?.role === "MEMBER" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      <User className="h-3 w-3" />
                      SUBSCRIBED MEMBER
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-muted-foreground truncate">{email}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{headline}</p>
              </div>
            </div>

            {/* Quick Metrics Summary */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-6 shrink-0 font-mono text-xs">
              <div className="text-center sm:text-left">
                <span className="text-[10px] uppercase text-muted-foreground block">
                  {user?.role === "MEMBER" ? "Saved Stories" : "Dispatches"}
                </span>
                <span className="font-serif font-bold text-base sm:text-lg text-foreground">
                  {user?.role === "ADMIN" ? "48" : user?.role === "AUTHOR" ? "32" : "8"}
                </span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-[10px] uppercase text-muted-foreground block">
                  {user?.role === "MEMBER" ? "Streak" : "Discourse"}
                </span>
                <span className="font-serif font-bold text-base sm:text-lg text-foreground">
                  {user?.role === "MEMBER" ? "12 Days" : "1.1k"}
                </span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-[10px] uppercase text-muted-foreground block">Standing</span>
                <span className="font-serif font-bold text-base sm:text-lg text-emerald-600 dark:text-emerald-400">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 2. TAB CONTENT PANELS ==================== */}
        {/* Tab 1: Editorial Identity */}
        {activeTab === "profile" && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-foreground">
                  Editorial Identity &amp; Bio
                </h3>
                <p className="text-xs text-muted-foreground">
                  Public journalist byline and newsroom contact coordinates.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-mono uppercase text-[10px] text-muted-foreground mb-1">
                  Display Name / Byline
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[10px] text-muted-foreground mb-1">
                  Primary Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[10px] text-muted-foreground mb-1">
                  Editorial Beat / Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Senior Markets & Economy Analyst"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[10px] text-muted-foreground mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-mono uppercase text-[10px] text-muted-foreground mb-1">
                  Journalistic Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans resize-y"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-mono uppercase text-[10px] text-muted-foreground mb-1">
                  Portfolio / Personal Dispatch Link
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Profile Credentials</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Security & Password */}
        {activeTab === "security" && (
          <form
            onSubmit={handleSavePassword}
            className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xs space-y-4 max-w-2xl"
          >
            <div className="flex items-center gap-2 text-sm font-serif font-bold text-foreground">
              <Lock className="h-4 w-4 text-primary" />
              <span>Update Secret Passphrase</span>
            </div>

            {passwordError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-mono">
                {passwordError}
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono uppercase text-[10px] text-muted-foreground mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[10px] text-muted-foreground mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[10px] text-muted-foreground mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Newsroom Notifications */}
        {activeTab === "notifications" && (
          <div className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xs space-y-5 max-w-2xl">
            <div className="flex items-center gap-2 text-sm font-serif font-bold text-foreground">
              <Bell className="h-4 w-4 text-primary" />
              <span>Dispatch &amp; Newsroom Subscriptions</span>
            </div>

            <div className="divide-y divide-[#E2E8F0] dark:divide-slate-800 text-xs space-y-4">
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="font-semibold text-foreground font-serif">Breaking News Dispatches</p>
                  <p className="text-muted-foreground text-[11px]">Instant flash alerts when red-wire bulletins break.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyDispatches}
                  onChange={(e) => setNotifyDispatches(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#881337] focus:ring-[#881337] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-semibold text-foreground font-serif">Reader Discourse &amp; Comments</p>
                  <p className="text-muted-foreground text-[11px]">Notify when readers comment or reply on authored pieces.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyComments}
                  onChange={(e) => setNotifyComments(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#881337] focus:ring-[#881337] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-semibold text-foreground font-serif">Weekly Chronicle Digest</p>
                  <p className="text-muted-foreground text-[11px]">Curated analysis of the top worldwide stories every Sunday.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyWeeklyDigest}
                  onChange={(e) => setNotifyWeeklyDigest(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#881337] focus:ring-[#881337] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-semibold text-foreground font-serif">Platform Security Notices</p>
                  <p className="text-muted-foreground text-[11px]">Alerts on new logins, session tokens, or privilege shifts.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifySecurityAlerts}
                  onChange={(e) => setNotifySecurityAlerts(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#881337] focus:ring-[#881337] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#E2E8F0] dark:border-slate-800">
              <button
                type="button"
                onClick={handleSavePreferences}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Preferences</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Performance Overview */}
        {activeTab === "activity" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold">Total Dispatches</span>
                <FileText className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-serif font-bold text-foreground">
                {user?.role === "ADMIN" ? "48 Stories" : user?.role === "AUTHOR" ? "32 Stories" : "0 Published"}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {user?.role === "MEMBER" ? "Reader tier account" : "100% editorial verification rate"}
              </p>
            </div>

            <div className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold">Reader Engagement</span>
                <Heart className="h-4 w-4 text-rose-500" />
              </div>
              <div className="text-2xl font-serif font-bold text-foreground">
                {user?.role === "MEMBER" ? "23 Liked" : "8,920 Likes"}
              </div>
              <p className="text-[11px] text-muted-foreground">Across all newsroom desks</p>
            </div>

            <div className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold">Discourse Remarks</span>
                <MessageSquare className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-serif font-bold text-foreground">
                {user?.role === "MEMBER" ? "14 Posted" : "1,140 Replies"}
              </div>
              <p className="text-[11px] text-muted-foreground">Community discourse participant</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
