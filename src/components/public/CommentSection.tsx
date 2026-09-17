"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Lock, Loader2, User as UserIcon } from "lucide-react";

export interface CommentUser {
  id: string;
  name: string | null;
  image: string | null;
}

export interface CommentItem {
  id: string;
  content: string;
  createdAt: string | Date;
  user: CommentUser;
}

interface CommentSectionProps {
  articleId: string;
  allowComments: boolean;
  initialComments?: CommentItem[];
}

export default function CommentSection({
  articleId,
  allowComments,
  initialComments = [],
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          articleId,
          content: content.trim(),
        }),
      });

      const text = await res.text();
      let json;
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        json = {};
      }

      if (!res.ok || !json.success) {
        if (res.status === 401) {
          throw new Error("Please sign in to post a comment.");
        }
        throw new Error(
          json.error?.message || "Failed to post comment."
        );
      }

      setComments((prev) => [json.data.comment, ...prev]);
      setContent("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-6 pt-8 border-t border-border">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold font-serif flex items-center gap-2 text-foreground">
          <MessageSquare className="w-5 h-5 text-primary" />
          Comments ({comments.length})
        </h3>
      </div>

      {/* Disabled Comments Notice */}
      {!allowComments ? (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card/60 text-muted-foreground font-mono text-base">
          <Lock className="w-4 h-4 text-destructive flex-shrink-0" />
          <span>Comments are disabled for this article.</span>
        </div>
      ) : (
        /* Comment Input Form */
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="p-3 rounded border border-destructive/30 bg-destructive/10 text-destructive text-base font-mono">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-2">
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts on this article..."
              className="w-full text-base font-sans p-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-base font-semibold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Post Comment
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* List of Comments */}
      <div className="space-y-4 pt-2">
        {comments.length === 0 ? (
          <p className="text-base font-mono text-muted-foreground italic text-center py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => {
            const formattedTime = new Date(comment.createdAt).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            );

            return (
              <div
                key={comment.id}
                className="p-4 rounded-lg border border-border bg-card/40 space-y-2 text-foreground"
              >
                <div className="flex items-center justify-between text-base font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-base font-bold text-foreground overflow-hidden">
                      {comment.user.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={comment.user.image}
                          alt={comment.user.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <span className="font-semibold text-foreground">
                      {comment.user.name || "Anonymous Reader"}
                    </span>
                  </div>
                  <span className="text-base text-muted-foreground">
                    {formattedTime}
                  </span>
                </div>

                <p className="text-base font-sans text-foreground/90 leading-relaxed whitespace-pre-line pl-8">
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
