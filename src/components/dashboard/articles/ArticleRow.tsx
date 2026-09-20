"use client";

import { MessageCircle, ThumbsUp, Trash2 } from "lucide-react";

import FeatureButton from "./FeatureButton";
import ArticleStatusBadge from "./AritcleStatusBadge";

import { formatDate } from "@/lib/utils/date.utils";
import { ArticleTypes } from "@/lib/types/articles.types";
import useDeleteModalStore from "@/store/useDeleteModal";
import ArticleActionsMenu from "./ArticleActionMenu";
import { UserRole } from "@/generated/prisma/enums";

interface ArticleRowProps {
  article: ArticleTypes;
  currentUserId: string;
  isAdmin: boolean;
  userRole?: UserRole;
}

export default function ArticleRow({
  article,
  currentUserId,
  isAdmin,
  userRole,
}: ArticleRowProps) {
  const { openDeleteModal } = useDeleteModalStore();

  const canDelete = isAdmin || article.author?.id === currentUserId;
  const isAuthor = userRole === UserRole.AUTHOR;
  const canEdit = isAdmin || isAuthor;

  const handleDeleteClick = () => {
    openDeleteModal({
      articleId: article.id,
      articleTitle: article.title,
    });
  };

  return (
    <tr className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
      <td className="max-w-[360px] px-6 py-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {article.title}
          </p>
          <p className="mt-1 truncate text-[11px] text-muted-foreground">
            /{article.slug}
          </p>
        </div>
      </td>
      {/* Author */}
      <td className="px-4 py-4">
        <div className="max-w-[180px]">
          <p className="truncate text-xs font-medium text-foreground">
            {article.author?.name ?? "Unknown"}
          </p>

          <p className="truncate text-[10px] text-muted-foreground">
            {article.author?.email ?? "—"}
          </p>
        </div>
      </td>
      {/* Status */}
      <td className="px-4 py-4">
        <ArticleStatusBadge status={article.status} />
      </td>
      {/* Published */}
      <td className="px-4 py-4">
        <span className="whitespace-nowrap text-xs text-muted-foreground">
          {article.publishedAt
            ? formatDate(article.publishedAt)
            : "Not published"}
        </span>
      </td>
      {/* Features */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <FeatureButton
            articleId={article.id}
            feature="allowLikes"
            label="Likes"
            icon={<ThumbsUp className="h-3.5 w-3.5" />}
            enabled={article.allowLikes}
            disabled={!isAdmin}
          />

          <FeatureButton
            articleId={article.id}
            feature="allowComments"
            label="Comments"
            icon={<MessageCircle className="h-3.5 w-3.5" />}
            enabled={article.allowComments}
            disabled={!isAdmin}
          />
        </div>
      </td>
      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1.5">
          {canDelete && (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 text-muted-foreground transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              aria-label={`Delete ${article.title}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          <ArticleActionsMenu
            articleId={article.id}
            articleSlug={article.slug}
            articleTitle={article.title}
            canEdit={canEdit}
          />
        </div>
      </td>
    </tr>
  );
}
