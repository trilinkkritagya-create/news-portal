"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Edit3, Loader2 } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing article by ID
  useEffect(() => {
    if (!id) return;

    async function fetchArticle() {
      try {
        setFetching(true);
        const res = await fetch(`/api/articles/${id}`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error?.message || "Failed to load article.");
        }
        const article = json.data.article;
        setTitle(article.title || "");
        setExcerpt(article.excerpt || "");
        setContentHtml(article.content || "");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch article.");
        }
      } finally {
        setFetching(false);
      }
    }

    fetchArticle();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: contentHtml,
          excerpt: excerpt || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to update article.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while updating article.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-background text-muted-foreground font-mono text-xs">
        <Loader2 className="w-5 h-5 animate-spin mr-2 text-primary" />
        Loading article data...
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <header className="border-b border-border bg-card px-4 py-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <span className="text-border">|</span>
          <h1 className="text-base font-bold text-foreground flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-primary" />
            Edit Article
          </h1>
        </div>

        <button
          type="button"
          onClick={handleUpdate}
          disabled={saving || !title.trim() || !contentHtml.trim()}
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary-hover px-4 py-2 rounded-md text-xs font-semibold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
        {error && (
          <div className="p-4 rounded-md border border-destructive/30 bg-destructive/10 text-destructive text-xs font-mono">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Article Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Article Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg font-serif font-bold p-3 rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Article Excerpt */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Short Excerpt / Summary
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full text-xs font-sans p-3 rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* Article Body Editor */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Article Body Content <span className="text-destructive">*</span>
            </label>
            <RichTextEditor
              initialValue={contentHtml}
              onChange={(html: string) => setContentHtml(html)}
            />
          </div>
        </form>
      </main>
    </div>
  );
}
