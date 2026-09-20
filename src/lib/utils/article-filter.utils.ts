export interface ArticleFilterUpdates {
  search?: string;
  status?: string;
  category?: string;
  page?: number;
}

export interface ArticleFilterValues {
  search: string;
  status: string;
  category: string;
  page: number;
}

export function buildArticleFilterQuery(
  currentParams: URLSearchParams,
  currentFilters: ArticleFilterValues,
  updates: ArticleFilterUpdates = {},
): string {
  const params = new URLSearchParams(currentParams.toString());

  const nextSearch =
    updates.search !== undefined ? updates.search : currentFilters.search;

  const nextStatus =
    updates.status !== undefined ? updates.status : currentFilters.status;

  const nextCategory =
    updates.category !== undefined ? updates.category : currentFilters.category;

  const nextPage = updates.page !== undefined ? updates.page : 1;

  if (nextSearch.trim()) {
    params.set("search", nextSearch.trim());
  } else {
    params.delete("search");
  }

  if (nextStatus !== "ALL") {
    params.set("status", nextStatus);
  } else {
    params.delete("status");
  }

  if (nextCategory !== "ALL") {
    params.set("category", nextCategory);
  } else {
    params.delete("category");
  }

  if (nextPage > 1) {
    params.set("page", String(nextPage));
  } else {
    params.delete("page");
  }

  return params.toString();
}
