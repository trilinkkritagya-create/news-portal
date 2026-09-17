"use client";

import React, { useState, useEffect, useCallback, useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import RichTextEditor, { EditorStats } from "@/components/ui/RichTextEditor";
import {
  createArticleAction,
  CreateArticleState,
} from "@/lib/actions/article/article.action";

const initialState: CreateArticleState = {
  success: false,
};

export default function CreateArticlePage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createArticleAction,
    initialState
  );
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [dismissedError, setDismissedError] = useState<string | null>(null);
  const [spellCheck, setSpellCheck] = useState(true);
  const [showPublishMenu, setShowPublishMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [activeTab, setActiveTab] = useState<"draft" | "seo" | "preview">(
    "draft",
  );
  const [editorStats, setEditorStats] = useState<EditorStats>({
    words: 0,
    chars: 0,
    readTimeMinutes: 1,
  });

  // Handle redirect upon successful article creation
  useEffect(() => {
    if (state.success) {
      router.push("/dashboard");
      router.refresh();
    }
  }, [state.success, router]);

  const actionError = state.error?.message;
  const activeError =
    (actionError && actionError !== dismissedError ? actionError : null) ||
    draftError;

  // Quick-save / Save Draft handler
  const handleSaveDraft = useCallback(() => {
    if (!title.trim()) {
      setDraftError("Please add at least a title before saving a draft.");
      return;
    }
    setDraftError(null);
    setDraftSaved(true);
    // Persist draft to localStorage for recovery
    try {
      localStorage.setItem(
        "draft_article",
        JSON.stringify({
          title,
          excerpt,
          content: contentHtml,
          savedAt: new Date().toISOString(),
        }),
      );
    } catch {
      // ignore storage quota issues
    }
    setTimeout(() => {
      setDraftSaved(false);
    }, 3000);
  }, [title, excerpt, contentHtml]);

  // Global keyboard shortcut: Cmd+S / Ctrl+S
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSaveDraft();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSaveDraft]);

  return (
    <div className="flex flex-1 flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 sm:pb-6">
      {/* ── BEGIN: Top Header ── */}
      <header
        className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex-shrink-0"
        data-purpose="article-editor-header"
      >
        {/* Mobile Header (< sm) */}
        <div className="flex sm:hidden h-14 px-3.5 items-center justify-between gap-2 w-full">
          {/* Left: Back circular button & Title / CMS Editor */}
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/dashboard"
              aria-label="Go back to articles list"
              className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 flex items-center justify-center text-slate-700 dark:text-slate-300 transition shrink-0 border border-slate-200 dark:border-slate-700"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 19l-7-7 7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                ></path>
              </svg>
            </Link>
            <div className="flex flex-col truncate">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 leading-none">
                CMS Editor
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug truncate">
                News Portal
              </span>
            </div>
          </div>

          {/* Right: Autosaved pill + Compact Publish + Overflow Menu */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{draftSaved ? "Saved" : "Autosaved"}</span>
            </span>

            <button
              type="submit"
              form="create-article-form"
              disabled={isPending || !title.trim() || !contentHtml.trim()}
              className="inline-flex items-center justify-center gap-1 bg-indigo-900 hover:bg-indigo-950 active:scale-95 text-white font-semibold text-xs px-2.5 py-1.5 rounded-md shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              <svg
                className="w-3 h-3 fill-current text-white/90"
                viewBox="0 0 24 24"
              >
                <path d="M5.5 3.5l14 8.5-14 8.5v-17z"></path>
              </svg>
              <span>{isPending ? "..." : "Publish"}</span>
            </button>

            <div className="relative">
              <button
                type="button"
                aria-label="More options"
                onClick={() => setShowPublishMenu(!showPublishMenu)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                </svg>
              </button>

              {showPublishMenu && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50 text-xs text-slate-800 dark:text-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPublishMenu(false);
                      setShowPreview(true);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>Preview Article</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPublishMenu(false);
                      handleSaveDraft();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>Save Draft</span>
                    <span className="text-[10px] text-slate-400">⌘S</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPublishMenu(false);
                      setShowInspector(true);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>Article Inspector</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tablet & Desktop Header (>= sm) */}
        <div className="hidden sm:flex h-14 px-4 sm:px-6 md:px-8 items-center justify-between w-full">
          {/* Left actions: back button & title status */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700 shadow-2xs"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
              </svg>
              <span>Back</span>
            </Link>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                Article Editor
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{draftSaved ? "Draft Saved" : "Draft Autosaved"}</span>
              </span>
            </div>
          </div>

          {/* Right actions: Preview, Publish, Inspector Toggle */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition cursor-pointer"
            >
              Preview
            </button>

            {/* Split Publish Button Group */}
            <div className="relative inline-flex rounded-md shadow-2xs">
              <button
                type="submit"
                form="create-article-form"
                disabled={isPending || !title.trim() || !contentHtml.trim()}
                className="inline-flex items-center gap-1.5 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-medium tracking-wide uppercase px-3.5 py-1.5 rounded-l-md transition cursor-pointer disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
                <span>{isPending ? "Publishing..." : "Publish"}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPublishMenu(!showPublishMenu)}
                className="bg-indigo-900 hover:bg-indigo-950 text-white px-2 py-1.5 rounded-r-md border-l border-indigo-800 transition cursor-pointer"
                title="Publish options"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 9l-7 7-7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </button>

              {/* Split Menu Dropdown */}
              {showPublishMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs text-slate-700 dark:text-slate-200">
                  <button
                    type="submit"
                    form="create-article-form"
                    disabled={isPending || !title.trim() || !contentHtml.trim()}
                    onClick={() => {
                      setShowPublishMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between cursor-pointer disabled:opacity-50"
                  >
                    <span>Publish Immediately</span>
                    <span className="text-[10px] text-slate-400">{isPending ? "..." : "Now"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPublishMenu(false);
                      handleSaveDraft();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>Save as Draft</span>
                    <span className="text-[10px] text-slate-400">⌘S</span>
                  </button>
                </div>
              )}
            </div>

            {/* Toggle Metadata Inspector Drawer for Tablet / Desktop */}
            <button
              type="button"
              onClick={() => setShowInspector(!showInspector)}
              className={`p-1.5 rounded-md border transition ml-1 cursor-pointer ${
                showInspector
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700"
              }`}
              title="Toggle Article Inspector"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </header>
      {/* ── END: Top Header ── */}

      {/* ── BEGIN: Segmented Tabs (Mobile Only < sm) ── */}
      <nav
        aria-label="Editor sections"
        className="sm:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-1.5 sticky top-14 z-20"
        data-purpose="editor-navigation-tabs"
      >
        <div className="flex space-x-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("draft")}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 tracking-tight transition cursor-pointer ${
              activeTab === "draft"
                ? "border-indigo-900 dark:border-indigo-400 text-indigo-900 dark:text-indigo-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span>Edit Draft</span>
            {activeTab === "draft" && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-900 dark:bg-indigo-400"></span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("seo")}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 tracking-tight transition cursor-pointer ${
              activeTab === "seo"
                ? "border-indigo-900 dark:border-indigo-400 text-indigo-900 dark:text-indigo-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span>Metadata & SEO</span>
            {activeTab === "seo" && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-900 dark:bg-indigo-400"></span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="pb-2.5 border-b-2 border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
          >
            Preview
          </button>
        </div>
      </nav>
      {/* ── END: Segmented Tabs ── */}

      {/* ── BEGIN: Main Workspace with Optional Inspector Drawer ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Central Article Writing Canvas */}
        <main
          className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-12 lg:px-16 py-8 space-y-7"
          data-purpose="article-editor"
        >
          <div className="max-w-4xl mx-auto space-y-7">
            {/* Error Alert */}
            {activeError && (
              <div className="p-3.5 rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{activeError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (actionError) setDismissedError(actionError);
                    setDraftError(null);
                  }}
                  className="text-rose-700 dark:text-rose-300 hover:underline text-[11px] cursor-pointer font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}

            <form id="create-article-form" action={formAction} className="space-y-7">
              {/* Hidden input for rich text content */}
              <input type="hidden" name="content" value={contentHtml} />

              {/* Headline Section */}
              <div className="space-y-2" data-purpose="headline-input-group">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="article-title" className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Article Title <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-sans">
                    Headline • <span className="font-medium text-slate-600 dark:text-slate-300">{title.length} chars</span>
                  </span>
                </div>
                <div className="relative bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 shadow-2xs hover:border-slate-400 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 transition-all">
                  <input
                    id="article-title"
                    name="title"
                    className="w-full px-4 py-3 sm:py-3.5 bg-transparent border-0 rounded-lg text-slate-900 dark:text-slate-100 font-serif text-xl sm:text-2xl font-normal outline-none focus:outline-none focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-serif placeholder:font-normal tracking-tight transition"
                    placeholder="e.g. The Renaissance of Modern Typography in Journalism..."
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              {/* Short Excerpt / Summary Section */}
              <div className="space-y-2" data-purpose="summary-excerpt-section">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="article-excerpt" className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Short Excerpt / Summary
                  </label>
                  <span className={cn("font-mono text-[11px]", excerpt.length > 500 ? "text-rose-500 font-bold" : "text-slate-400")}>
                    <span className="font-medium text-slate-600 dark:text-slate-300">{excerpt.length}</span> / 500
                  </span>
                </div>
                <textarea
                  id="article-excerpt"
                  name="excerpt"
                  className="w-full text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3.5 outline-none focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 resize-none leading-relaxed placeholder:text-slate-400 shadow-2xs transition"
                  placeholder="Brief summary for social preview cards, syndicated feeds, and news digests..."
                  rows={2}
                  maxLength={500}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </div>

              {/* Article Body Section */}
              <div className="space-y-2" data-purpose="article-body-editor">
                <div className="flex items-center justify-between text-xs mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Article Body <span className="text-rose-500">*</span>
                  </label>
                  {/* Spellcheck toggle */}
                  <label className="inline-flex items-center cursor-pointer gap-2 select-none">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Spellcheck</span>
                    <button
                      aria-checked={spellCheck}
                      className={`w-8 h-4 rounded-full relative transition-colors focus:outline-none cursor-pointer ${
                        spellCheck ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                      role="switch"
                      type="button"
                      onClick={() => setSpellCheck(!spellCheck)}
                      title={spellCheck ? "Disable spellcheck" : "Enable spellcheck"}
                    >
                      <span
                        className={`block w-3.5 h-3.5 bg-white rounded-full shadow-xs transform transition-transform ${
                          spellCheck ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      ></span>
                    </button>
                  </label>
                </div>

                {/* Rich Editor Canvas with Ribbon Toolbar & Live Stats */}
                <RichTextEditor
                  initialValue={contentHtml}
                  spellCheckEnabled={spellCheck}
                  onToggleSpellCheck={() => setSpellCheck(!spellCheck)}
                  onChange={setContentHtml}
                  onStatsChange={setEditorStats}
                  onQuickSave={handleSaveDraft}
                  placeholder="Start drafting your editorial piece here. Format with headings, quotes, and styling using the ribbon toolbar above..."
                />
              </div>
            </form>
          </div>
        </main>

        {/* ── BEGIN: Tablet & Desktop Inspector Slide-over Sheet ── */}
        {showInspector && (
          <aside
            id="inspector-panel"
            className="hidden sm:block w-72 lg:w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-5 shrink-0 overflow-y-auto space-y-6 shadow-lg z-20"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Article Inspector
              </span>
              <button
                type="button"
                onClick={() => setShowInspector(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs font-medium cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Readout Metrics */}
            <div className="space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Content Metrics
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-700">
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {editorStats.words}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    Total Words
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-700">
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {editorStats.chars}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    Characters
                  </span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    ~{editorStats.readTimeMinutes} min read
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    Estimated reading time
                  </span>
                </div>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
            </div>

            {/* Publishing Readiness Checklist */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Publishing Checklist
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${title.trim() ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}
                  >
                    {title.trim() ? "✓" : "○"}
                  </span>
                  <span
                    className={
                      title.trim()
                        ? "text-slate-700 dark:text-slate-300"
                        : "text-slate-400"
                    }
                  >
                    Headline entered ({title.length} chars)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${excerpt.trim() ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}
                  >
                    {excerpt.trim() ? "✓" : "○"}
                  </span>
                  <span
                    className={
                      excerpt.trim()
                        ? "text-slate-700 dark:text-slate-300"
                        : "text-slate-400"
                    }
                  >
                    Excerpt summary provided
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${editorStats.words >= 50 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}
                  >
                    {editorStats.words >= 50 ? "✓" : "○"}
                  </span>
                  <span
                    className={
                      editorStats.words >= 50
                        ? "text-slate-700 dark:text-slate-300"
                        : "text-slate-400"
                    }
                  >
                    Minimum 50 words recommended
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="w-full py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition cursor-pointer"
              >
                {draftSaved ? "Saved to Workspace!" : "Save Draft"}
              </button>
            </div>
          </aside>
        )}
        {/* ── END: Tablet & Desktop Inspector Sheet ── */}
      </div>
      {/* ── END: Main Workspace ── */}

      {/* ── BEGIN: Mobile Bottom Status Bar Dock (< sm) ── */}
      <footer
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 px-3.5 py-2 flex items-center justify-between shadow-floating-bar"
        data-purpose="mobile-editor-bottom-dock"
      >
        {/* Metrics & Sync Status */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {editorStats.words} words
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>~{editorStats.readTimeMinutes} min read</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
            <svg
              className="w-3.5 h-3.5 stroke-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <span className="hidden xs:inline">Synced</span>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 rounded border border-slate-200/80 dark:border-slate-700 transition cursor-pointer"
          >
            {draftSaved ? "Saved!" : "Save Draft"}
          </button>
          <button
            type="button"
            aria-label="Open article inspector settings"
            onClick={() => setShowInspector(!showInspector)}
            className={`p-1.5 rounded border transition cursor-pointer ${
              showInspector
                ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700"
            }`}
            title="Article Inspector"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
          </button>
        </div>
      </footer>
      {/* ── END: Mobile Bottom Status Bar Dock ── */}

      {/* ── BEGIN: Mobile Inspector Drawer (< sm) ── */}
      {showInspector && (
        <div className="sm:hidden fixed inset-x-0 bottom-[49px] z-30 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Article Inspector
            </span>
            <button
              type="button"
              onClick={() => setShowInspector(false)}
              className="text-xs text-slate-400 hover:text-slate-700"
            >
              ✕ Close
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
              <span className="block font-bold text-slate-900 dark:text-slate-100">
                {editorStats.words}
              </span>
              <span className="text-[10px] text-slate-400">Total Words</span>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
              <span className="block font-bold text-slate-900 dark:text-slate-100">
                {editorStats.chars}
              </span>
              <span className="text-[10px] text-slate-400">Characters</span>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
              <span className="block font-bold text-slate-900 dark:text-slate-100">
                ~{editorStats.readTimeMinutes}m
              </span>
              <span className="text-[10px] text-slate-400">Reading Time</span>
            </div>
          </div>
        </div>
      )}
      {/* ── END: Mobile Inspector Drawer ── */}

      {/* ── BEGIN: Preview Modal ── */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Article Preview
              </span>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-medium cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-5 sm:p-8 overflow-y-auto space-y-5 sm:space-y-6">
              <h1 className="font-serif text-2xl sm:text-4xl font-normal text-slate-900 dark:text-slate-100 tracking-tight">
                {title || "Untitled Article"}
              </h1>
              {excerpt && (
                <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg italic border-l-2 border-indigo-900 pl-3 sm:pl-4">
                  {excerpt}
                </p>
              )}
              <div
                className="font-editorial-body text-slate-800 dark:text-slate-200 leading-relaxed font-serif text-base"
                dangerouslySetInnerHTML={{
                  __html:
                    contentHtml ||
                    "<p class='text-slate-400 italic'>No content drafted yet.</p>",
                }}
              />
            </div>
          </div>
        </div>
      )}
      {/* ── END: Preview Modal ── */}
    </div>
  );
}
// import CreateArticlePage from "@/lib/criticalMethods/CreateArticleAction";
// import React from "react";

// const CreateArticle = () => {
//   return <CreateArticlePage />;
// };

// export default CreateArticle;
