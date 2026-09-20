import { formatDate } from "@/lib/utils/date.utils";
import ArticleStatusBadge from "./AritcleStatusBadge";
import FeatureButton from "./FeatureButton";
import { MessageCircle, Share2, ThumbsUp, Trash2 } from "lucide-react";
import { ArticleTypes } from "@/lib/types/articles.types";

type ArticleRowProps = {
  article: ArticleTypes;
  currentUserId: string;
  isAdmin: boolean;
};

export default function ArticleNewMobileCard({
  article,
  currentUserId,
  isAdmin,
}: ArticleRowProps) {
  const canDelete = isAdmin || article.author?.id === currentUserId;

  return (
    <article className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
            {article.title}
          </h3>

          <p className="mt-1 text-[10px] text-muted-foreground">
            {article.author?.name ?? "Unknown"}
          </p>
        </div>

        <ArticleStatusBadge status={article.status} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Published
          </p>

          <p className="mt-0.5 text-xs text-foreground">
            {article.publishedAt
              ? formatDate(article.publishedAt)
              : "Not published"}
          </p>
        </div>

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

          {canDelete && (
            <button
              type="button"
              className="ml-1 inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 text-muted-foreground hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:hover:bg-red-950/30"
              aria-label={`Delete ${article.title}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
