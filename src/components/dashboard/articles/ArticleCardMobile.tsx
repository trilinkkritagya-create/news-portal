"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { UserRole } from "@/generated/prisma/enums";
import type { DashboardArticleItem } from "@/lib/types/dashboard.types";
import ArticleStatusBadge from "./AritcleStatusBadge";

interface ArticleCardMobileProps {
  article: DashboardArticleItem;

  currentUserId: string;
  userRole: UserRole;

  onDelete: (articleId: string) => void;

  isDeleting: boolean;
}

export default function ArticleCardMobile({
  article,
  currentUserId,
  userRole,
  onDelete,
  isDeleting,
}: ArticleCardMobileProps) {
  const canManage =
    userRole === UserRole.ADMIN ||
    (userRole === UserRole.AUTHOR && article.author?.id === currentUserId);

  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
            {article.title}
          </h3>

          {/* {article.excerpt && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>
          )} */}
        </div>

        <ArticleStatusBadge status={article.status} />
      </div>

      {/* Metadata */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-muted-foreground">Category</p>

          <p className="mt-0.5 font-medium text-foreground">
            {article.category?.name ?? "Uncategorized"}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground">Author</p>

          <p className="mt-0.5 truncate font-medium text-foreground">
            {article.author?.name ?? "Unknown"}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground">Created</p>

          <p className="mt-0.5 font-medium text-foreground">
            {formatDate(article.createdAt)}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground">Published</p>

          <p className="mt-0.5 font-medium text-foreground">
            {article.publishedAt
              ? formatDate(article.publishedAt)
              : "Not published"}
          </p>
        </div>
      </div>

      {/* Engagement */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
        <span>
          {article._count.likes} {article._count.likes === 1 ? "like" : "likes"}
        </span>

        <span>
          {article._count.comments}{" "}
          {article._count.comments === 1 ? "comment" : "comments"}
        </span>

        <span>
          {article._count.shares}{" "}
          {article._count.shares === 1 ? "share" : "shares"}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-3">
        <Button
          //   asChild
          variant="outline"
          size="sm"
        >
          <Link href={`/articles/${article.slug}`}>
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            View
          </Link>
        </Button>

        {canManage && (
          <>
            <Button
              //   asChild
              variant="outline"
              size="sm"
            >
              <Link href={`/dashboard/articles/${article.id}/edit`}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                Edit
              </Link>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => onDelete(article.id)}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5 text-destructive" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        )}
      </div>
    </article>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
