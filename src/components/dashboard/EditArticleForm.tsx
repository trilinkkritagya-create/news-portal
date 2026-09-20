"use client";

import React, { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Edit3,
  ThumbsUp,
  MessageSquare,
  Settings,
} from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import {
  updateArticleAction,
  UpdateArticleState,
} from "@/lib/actions/article/article.action";

export interface EditArticleFormProps {
  article: {
    id: string;
    title: string;
    excerpt?: string | null;
    content: string;
    allowLikes?: boolean;
    allowComments?: boolean;
  };
}

const initialState: UpdateArticleState = {
  success: false,
};

export default function EditArticleForm({ article }: EditArticleFormProps) {
  const router = useRouter();

  const updateArticleActionWithId = updateArticleAction.bind(null, article.id);
  const [state, formAction, isPending] = useActionState(
    updateArticleActionWithId,
    initialState,
  );

  const [title, setTitle] = useState(article.title || "");
  const [excerpt, setExcerpt] = useState(article.excerpt || "");
  const [contentHtml, setContentHtml] = useState(article.content || "");
  const [allowLikes, setAllowLikes] = useState(article.allowLikes ?? true);
  const [allowComments, setAllowComments] = useState(
    article.allowComments ?? true,
  );

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard");
      router.refresh();
    }
  }, [state.success, router]);

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
          <h1 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-primary" />
            Edit Article
          </h1>
        </div>
        <button
          type="submit"
          form="edit-article-form"
          disabled={isPending || !title.trim() || !contentHtml.trim()}
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary-hover px-4 py-2 rounded-md text-xs font-semibold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Saving Changes..." : "Save Changes"}
        </button>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
        {state.error?.message && (
          <div className="p-4 rounded-md border border-destructive/30 bg-destructive/10 text-destructive text-xs font-mono">
            ⚠️ {state.error.message}
          </div>
        )}

        <form id="edit-article-form" action={formAction} className="space-y-6">
          <input type="hidden" name="id" value={article.id} />
          <input type="hidden" name="content" value={contentHtml} />

          {/* Article Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Article Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              name="title"
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
              name="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full text-xs font-sans p-3 rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* Engagement Features Control */}
          <div className="p-4 rounded-md border border-border bg-card space-y-3">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              Engagement Settings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center justify-between p-3 rounded-md border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-foreground">
                      Allow Likes
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Enable like button for readers
                    </span>
                  </div>
                </div>
                <input
                  type="hidden"
                  name="allowLikes"
                  value={String(allowLikes)}
                />
                <input
                  type="checkbox"
                  checked={allowLikes}
                  onChange={(e) => setAllowLikes(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-md border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-foreground">
                      Allow Comments
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Enable comment section for readers
                    </span>
                  </div>
                </div>
                <input
                  type="hidden"
                  name="allowComments"
                  value={String(allowComments)}
                />
                <input
                  type="checkbox"
                  checked={allowComments}
                  onChange={(e) => setAllowComments(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                />
              </label>
            </div>
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
