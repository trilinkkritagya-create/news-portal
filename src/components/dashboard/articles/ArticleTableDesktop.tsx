"use client";

import Link from "next/link";
import { ExternalLink, Pencil, Send, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ArticleStatus, UserRole } from "@/generated/prisma/enums";

import type { DashboardArticleItem } from "@/lib/types/dashboard.types";

import ArticleStatusBadge from "./AritcleStatusBadge";
import useDeleteModalStore from "@/store/useDeleteModal";

interface ArticleTableDesktopProps {
  articles: DashboardArticleItem[];

  currentUserId: string;
  userRole: UserRole;

  // onDelete?: (articleId: string) => void;

  onStatusChange?: (articleId: string, status: ArticleStatus) => void;

  changingStatusArticleId?: string | null;
  isPublishing?: boolean;

  isDeletingArticleId?: string | null;
}

export default function ArticleTableDesktop({
  articles,
  currentUserId,
  userRole,
  // onDelete,
  onStatusChange,
  changingStatusArticleId,
  isPublishing = false,
  isDeletingArticleId,
}: ArticleTableDesktopProps) {
  const { openDeleteModal } = useDeleteModalStore();
  return (
    <div className="hidden flex-1 overflow-x-auto sm:block">
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            <th className="px-4 py-3" scope="col">
              Status
            </th>

            <th className="px-4 py-3" scope="col">
              Headline / Story
            </th>

            <th className="px-4 py-3" scope="col">
              Category
            </th>

            <th className="px-4 py-3" scope="col">
              Author
            </th>

            <th className="px-4 py-3" scope="col">
              Engagement
            </th>

            <th className="px-4 py-3" scope="col">
              Filed At
            </th>

            <th className="px-4 py-3 text-right" scope="col">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {articles.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-12 text-center font-mono text-xs text-muted-foreground"
              >
                No dispatches found matching the current filters.
              </td>
            </tr>
          ) : (
            articles.map((article) => {
              const isOwner = article.author?.id === currentUserId;
              const canManage = userRole === UserRole.ADMIN;

              const canEdit = userRole !== UserRole.MEMBER;
              const canDelete = userRole !== UserRole.MEMBER;

              const isThisArticlePublishing =
                changingStatusArticleId === article.id;

              // const isThisArticleDeleting = isDeletingArticleId === article.id;

              const formattedDate = article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : new Date(article.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

              return (
                <tr
                  key={article.id}
                  className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                >
                  {/* ==================================================
                      STATUS
                      ================================================== */}

                  <td className="whitespace-nowrap px-4 py-3">
                    <ArticleStatusBadge status={article.status} />
                  </td>

                  {/* ==================================================
                      HEADLINE
                      ================================================== */}

                  <td className="max-w-sm px-4 py-3">
                    <Link
                      href={`/dashboard/articles/${article.id}/edit`}
                      className="block line-clamp-1 font-serif text-xs font-bold leading-snug text-foreground transition-colors hover:text-primary"
                    >
                      {article.title}
                    </Link>

                    {/* {article.excerpt && (
                      <p className="mt-1 line-clamp-1 text-[10px] text-muted-foreground">
                        {article.excerpt}
                      </p>
                    )} */}
                  </td>

                  {/* ==================================================
                      CATEGORY
                      ================================================== */}

                  <td className="whitespace-nowrap px-4 py-3">
                    {article.category ? (
                      <span className="inline-flex items-center rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                        {article.category.name}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">
                        Uncategorized
                      </span>
                    )}
                  </td>

                  {/* ==================================================
                      AUTHOR
                      ================================================== */}

                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex min-w-0 max-w-[180px] flex-col">
                      <span className="truncate text-xs font-medium text-foreground">
                        {article.author?.name ?? "Unknown"}
                      </span>

                      {article.author?.email && (
                        <span className="truncate text-[10px] text-muted-foreground">
                          {article.author.email}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* ==================================================
                      ENGAGEMENT
                      ================================================== */}

                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span>
                        {article._count.likes}{" "}
                        {article._count.likes === 1 ? "like" : "likes"}
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
                  </td>

                  {/* ==================================================
                      DATE
                      ================================================== */}

                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[10px] text-muted-foreground">
                    {formattedDate}
                  </td>

                  {/* ==================================================
                      ACTIONS
                      ================================================== */}

                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* =================================================
                          EDIT
                          ================================================= */}

                      {canEdit && (
                        <Button
                          //   asChild
                          variant="ghost"
                          size="icon"
                          title="Edit article"
                        >
                          <Link href={`/dashboard/articles/${article.id}/edit`}>
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="sr-only">Edit article</span>
                          </Link>
                        </Button>
                      )}

                      {/* =================================================
                          PUBLISH
                          ================================================= */}

                      {canManage &&
                        article.status === ArticleStatus.DRAFT &&
                        onStatusChange && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isPublishing || isThisArticlePublishing}
                            onClick={() =>
                              onStatusChange(
                                article.id,
                                ArticleStatus.PUBLISHED,
                              )
                            }
                            title="Publish article"
                            className="h-7 gap-1 border-emerald-200 bg-emerald-50 px-2 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-950/70"
                          >
                            <Send className="h-3 w-3" />

                            {isThisArticlePublishing
                              ? "Publishing..."
                              : "Publish"}
                          </Button>
                        )}

                      {/* =================================================
                          UNPUBLISH
                          ================================================= */}

                      {canManage &&
                        article.status === ArticleStatus.PUBLISHED &&
                        onStatusChange && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isPublishing || isThisArticlePublishing}
                            onClick={() =>
                              onStatusChange(article.id, ArticleStatus.DRAFT)
                            }
                            title="Unpublish article"
                            className="h-7 gap-1 border-amber-200 bg-amber-50 px-2 text-[10px] font-semibold text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-950/70"
                          >
                            <Send className="h-3 w-3 rotate-180" />

                            {isThisArticlePublishing
                              ? "Unpublishing..."
                              : "Unpublish"}
                          </Button>
                        )}

                      <Button
                        // asChild
                        variant="ghost"
                        size="icon"
                        title="Preview live article"
                      >
                        <Link
                          href={`/articles/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />

                          <span className="sr-only">Preview article</span>
                        </Link>
                      </Button>

                      {/* =================================================
                          DELETE
                          ================================================= */}
                      {canDelete && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          title="Delete article"
                          onClick={() =>
                            openDeleteModal({
                              articleId: article.id,
                              articleTitle: article.title,
                            })
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          <span className="sr-only">Delete article</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
