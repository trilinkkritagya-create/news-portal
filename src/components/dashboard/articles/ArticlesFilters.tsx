"use client";

import { ChevronDown, Loader2, RotateCcw, Search, X } from "lucide-react";

import type { CategoryOption } from "@/lib/types/articles.types";

interface ArticleFiltersProps {
  search: string;
  status: string;
  category: string;

  categories: CategoryOption[];
  total: number;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onReset: () => void;

  isPending: boolean;
  hasActiveFilters: boolean;
}

export default function ArticleFilters({
  search,
  status,
  category,
  categories,
  total,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onReset,
  isPending,
  hasActiveFilters,
}: ArticleFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-base font-bold text-foreground">
              Recent Articles
            </h3>

            <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] text-muted-foreground shadow-2xs dark:border-slate-700 dark:bg-slate-800">
              {total} records
            </span>
          </div>

          <p className="mt-0.5 font-sans text-[11px] text-muted-foreground">
            Dispatches published and staged across all regional desks
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search title, author, category..."
            disabled={isPending}
            className="w-full rounded-lg border border-slate-300 bg-white py-1.5 pl-8 pr-7 font-sans text-xs text-foreground shadow-2xs placeholder:text-muted-foreground/70 hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-slate-500"
          />

          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              disabled={isPending}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Filters */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-between">
        <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
          {/* Category */}
          <div className="relative w-full sm:w-40">
            <select
              value={category}
              onChange={(event) => onCategoryChange(event.target.value)}
              disabled={isPending}
              className="w-full cursor-pointer appearance-none truncate rounded-lg border border-slate-300 bg-white py-2 pl-2.5 pr-7 font-sans text-xs font-medium text-foreground shadow-2xs hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 sm:py-1.5 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-slate-500"
            >
              <option value="ALL">All Desks</option>

              {categories.map((categoryOption) => (
                <option key={categoryOption.slug} value={categoryOption.slug}>
                  {categoryOption.name} Desk
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
          </div>

          {/* Status */}
          <div className="relative w-full sm:w-36">
            <select
              value={status}
              onChange={(event) => onStatusChange(event.target.value)}
              disabled={isPending}
              className="w-full cursor-pointer appearance-none truncate rounded-lg border border-slate-300 bg-white py-2 pl-2.5 pr-7 font-sans text-xs font-medium text-foreground shadow-2xs hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 sm:py-1.5 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-slate-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
          </div>
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            disabled={isPending}
            className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RotateCcw className="h-3 w-3" />
            )}
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
