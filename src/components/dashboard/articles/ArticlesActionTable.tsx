"use client";

import { UserRole } from "@/generated/prisma/enums";

import ArticleRow from "./ArticleRow";
import ArticleNewMobileCard from "./ArticleNewMobileCard";
import { DashboardArticleItem } from "@/lib/types/dashboard.types";

import { PaginationMetadata } from "@/lib/types/articles.types";

interface ArticleProps {
  articles: DashboardArticleItem[];
  pagination: PaginationMetadata;
  currentUserId: string;
  userRole?: UserRole;
}
export default function ArticlesActionTable({
  articles = [],
  currentUserId,
  userRole,
}: ArticleProps) {
  const isAdmin = userRole === UserRole.ADMIN;
  // const isAuthor = userRole === UserRole.AUTHOR;
  return (
    <section className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-6 dark:border-slate-800">
        <div>
          <h2 className="font-serif text-lg font-bold text-foreground">
            All Articles
          </h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Manage articles and their interaction features
          </p>
        </div>

        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] font-medium text-muted-foreground dark:border-slate-700 dark:bg-slate-800">
          {articles.length} articles
        </span>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40">
              <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Article
              </th>

              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Author
              </th>

              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>

              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Published At
              </th>

              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Features
              </th>

              <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {articles.length === 0 ? (
              <EmptyState />
            ) : (
              articles.map((article) => (
                <ArticleRow
                  key={article.id}
                  userRole={userRole}
                  article={article}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
        {articles.length === 0 ? (
          <EmptyState />
        ) : (
          articles.map((article) => (
            <ArticleNewMobileCard
              key={article.id}
              article={article}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))
        )}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <tr>
      <td
        colSpan={6}
        className="px-6 py-16 text-center text-sm text-muted-foreground"
      >
        No articles found.
      </td>
    </tr>
  );
}
