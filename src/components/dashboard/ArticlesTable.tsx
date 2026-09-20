"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { toast } from "sonner";

import { ArticleStatus, UserRole } from "@/generated/prisma/enums";

import {
  deleteArticleAction,
  updateArticleStatusAction,
} from "@/lib/actions/article/article.action";
import type { DashboardArticleItem } from "@/lib/types/dashboard.types";
import type {
  CategoryOption,
  PaginationMetadata,
} from "@/lib/types/articles.types";

import ArticleFilters from "./articles/ArticlesFilters";
import ArticleTableDesktop from "./articles/ArticleTableDesktop";
import ArticleCardMobile from "./articles/ArticleCardMobile";
import ArticlePagination from "./articles/ArticlePagination";
import {
  ArticleFilterUpdates,
  buildArticleFilterQuery,
} from "@/lib/utils/article-filter.utils";

interface ArticlesTableProps {
  articles: DashboardArticleItem[];
  pagination: PaginationMetadata;
  categories: CategoryOption[];
  currentUserId: string;
  userRole: UserRole;
}

export default function ArticlesTable({
  articles,
  pagination,
  categories = [],
  currentUserId,
  userRole,
}: ArticlesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "ALL";
  const currentCategory = searchParams.get("category") ?? "ALL";

  const [searchQuery, setSearchQuery] = useState(() => currentSearch);
  const debouncedSearchQuery = useDebounce(searchQuery, 550);

  const [isPending, startTransition] = useTransition();
  const [isPublishing, startPublishing] = useTransition();

  const [changingStatusArticleId, setChangingStatusArticleId] = useState<
    string | null
  >(null);

  const [deletingArticleId, setDeletingArticleId] = useState<string | null>(
    null,
  );
  const updateFilters = (updates: ArticleFilterUpdates) => {
    const queryString = buildArticleFilterQuery(
      searchParams,
      {
        search: currentSearch,
        status: currentStatus,
        category: currentCategory,
        page: pagination.page,
      },
      updates,
    );
    startTransition(() => {
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    });
  };

  const handleStatusFilterChange = (status: string) => {
    updateFilters({
      status,
      page: 1,
    });
  };

  const handleCategoryFilterChange = (category: string) => {
    updateFilters({
      category,
      page: 1,
    });
  };

  const resetFilters = () => {
    setSearchQuery("");

    startTransition(() => {
      router.push(pathname);
    });
  };

  const handleStatusChange = (articleId: string, status: ArticleStatus) => {
    setChangingStatusArticleId(articleId);

    startPublishing(async () => {
      try {
        const result = await updateArticleStatusAction(articleId, status);
        if (!result.success) {
          toast.error(result.message ?? "Failed to update article status.");

          return;
        }

        if (status === ArticleStatus.PUBLISHED) {
          toast.success("Article published successfully.");
        } else if (status === ArticleStatus.DRAFT) {
          toast.success("Article unpublished successfully.");
        }

        router.refresh();
      } catch {
        toast.error("Something went wrong while updating the article.");
      } finally {
        setChangingStatusArticleId(null);
      }
    });
  };

  const handleDelete = async (articleId: string) => {
    setDeletingArticleId(articleId);

    try {
      const result = await deleteArticleAction(articleId);

      if (!result.success) {
        toast.error(result.message ?? "Failed to delete article.");
        return;
      }

      toast.success("Article deleted successfully.");
      router.refresh();

      console.log("Delete article:", articleId);
    } catch {
      toast.error("Something went wrong while deleting the article.");
    } finally {
      setDeletingArticleId(null);
    }
  };
  const updatePage = (page: number) => {
    if (page < 1 || page > pagination.totalPages || isPending) {
      return;
    }

    updateFilters({ page });
  };
  const hasActiveFilters =
    currentSearch.trim() !== "" ||
    currentStatus !== "ALL" ||
    currentCategory !== "ALL";

  const startRecord =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endRecord = Math.min(
    pagination.page * pagination.limit,
    pagination.total,
  );
  useEffect(() => {
    const normalizedSearch = debouncedSearchQuery.trim();

    if (normalizedSearch === currentSearch.trim()) {
      return;
    }

    updateFilters({
      search: normalizedSearch,
      page: 1,
    });
  }, [debouncedSearchQuery, currentSearch]);

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-visible rounded-xl border border-border bg-card shadow-2xs">
      {isPending && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-[1px]">
          <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-4 py-2 text-xs font-mono text-foreground shadow-md">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />

            <span>Fetching articles...</span>
          </div>
        </div>
      )}
      <div className="shrink-0 border-b border-border bg-muted/30 p-3.5 sm:p-4">
        <ArticleFilters
          search={searchQuery}
          status={currentStatus}
          category={currentCategory}
          categories={categories}
          total={pagination.total}
          onSearchChange={setSearchQuery}
          onStatusChange={handleStatusFilterChange}
          onCategoryChange={handleCategoryFilterChange}
          onReset={resetFilters}
          isPending={isPending}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
      <ArticleTableDesktop
        articles={articles}
        currentUserId={currentUserId}
        userRole={userRole}
        // onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        changingStatusArticleId={changingStatusArticleId}
        isPublishing={isPublishing}
        isDeletingArticleId={deletingArticleId}
      />
      <div className="sm:hidden flex-1">
        {articles.length === 0 ? (
          <div className="px-4 py-10 text-center text-xs text-muted-foreground">
            No dispatches matching filter criteria.
          </div>
        ) : (
          <div className="space-y-3 p-3.5">
            {articles.map((article) => (
              <ArticleCardMobile
                key={article.id}
                article={article}
                currentUserId={currentUserId}
                userRole={userRole}
                onDelete={handleDelete}
                isDeleting={deletingArticleId === article.id}
              />
            ))}
          </div>
        )}
      </div>
      <div className="mt-auto shrink-0 border-t border-border bg-muted/30">
        <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {startRecord}–{endRecord}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {pagination.total}
            </span>{" "}
            manuscripts
          </div>
          <div className="shrink-0">
            <ArticlePagination
              pagination={pagination}
              isPending={isPending}
              onPageChange={updatePage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
