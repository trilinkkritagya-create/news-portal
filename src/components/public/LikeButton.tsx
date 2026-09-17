"use client";

import React, { useState } from "react";
import { Heart, Loader2 } from "lucide-react";

interface LikeButtonProps {
  articleId: string;
  allowLikes: boolean;
  initialLikeCount?: number;
  initialLiked?: boolean;
}

export default function LikeButton({
  articleId,
  allowLikes,
  initialLikeCount = 0,
  initialLiked = false,
}: LikeButtonProps) {
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleLike = async () => {
    if (!allowLikes) {
      setError("Likes are disabled for this article.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/articles/${articleId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
          throw new Error("Please sign in to like this article.");
        }
        throw new Error(
          json.error?.message || "Failed to process like action."
        );
      }

      setLiked(json.data.liked);
      setLikeCount(json.data.likeCount);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to process like.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleToggleLike}
        disabled={loading || !allowLikes}
        title={!allowLikes ? "Likes are disabled" : liked ? "Unlike" : "Like"}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-base font-mono transition-all cursor-pointer ${
          liked
            ? "border-red-500/40 bg-red-500/10 text-red-500 font-semibold"
            : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80"
        } ${!allowLikes ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        ) : (
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              liked ? "fill-red-500 text-red-500" : ""
            }`}
          />
        )}
        <span>
          {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </span>
      </button>

      {error && (
        <span className="text-base font-mono text-destructive tracking-tight">
          {error}
        </span>
      )}
    </div>
  );
}
