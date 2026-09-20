import { ArticleStatus } from "@/generated/prisma/enums";

export default function parseDashboardQuery(searchParams: {
  page?: string;
  search?: string;
  status?: string;
  category?: string;
}) {
  const rawPage = Number(searchParams.page ?? "1");

  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const search = searchParams.search?.trim() || undefined;

  const status =
    searchParams.status && searchParams.status !== "ALL"
      ? (searchParams.status as ArticleStatus)
      : undefined;

  const category =
    searchParams.category && searchParams.category !== "ALL"
      ? searchParams.category
      : undefined;

  return {
    page,
    search,
    status,
    category,
  };
}
