"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import type { PaginationMetadata } from "@/lib/types/articles.types";

interface ArticlePaginationProps {
  pagination: PaginationMetadata;
  isPending?: boolean;
  onPageChange: (page: number) => void;
}

export default function ArticlePagination({
  pagination,
  isPending = false,
  onPageChange,
}: ArticlePaginationProps) {
  const { page, totalPages, hasNextPage, hasPreviousPage } = pagination;

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (page >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [page - 2, page - 1, page, page + 1, page + 2];
  };

  const handlePageChange = (nextPage: number) => {
    if (
      nextPage < 1 ||
      nextPage > totalPages ||
      nextPage === page ||
      isPending
    ) {
      return;
    }

    onPageChange(nextPage);
  };

  return (
    <div className="flex items-center gap-1">
      {isPending && (
        <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin text-primary" />
      )}
      {/* Previous */}
      <button
        type="button"
        onClick={() => handlePageChange(page - 1)}
        disabled={!hasPreviousPage || isPending}
        aria-label="Previous page"
        className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground shadow-2xs transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-3.5 w-3.5" />

        <span className="hidden sm:inline">Previous</span>
      </button>
      {/* Page numbers */}
      <div className="flex items-center gap-1 px-1">
        {getPageNumbers().map((pageNumber) => {
          const isActive = pageNumber === page;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => handlePageChange(pageNumber)}
              disabled={isPending}
              aria-current={isActive ? "page" : undefined}
              className={[
                "min-w-7 h-7 rounded-md px-2 text-xs font-semibold transition-colors",
                "disabled:cursor-not-allowed disabled:opacity-50",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
      {/* Next */}
      <button
        type="button"
        onClick={() => handlePageChange(page + 1)}
        disabled={!hasNextPage || isPending}
        aria-label="Next page"
        className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground shadow-2xs transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="hidden sm:inline">Next</span>

        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
