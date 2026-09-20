import DashboardHeader from "../DashboardHeader";
import MetricCards from "../MetricCards";
import ArticlesTable from "../ArticlesTable";

import {
  AuthorDashboardStats,
  DashboardArticleItem,
} from "@/lib/types/dashboard.types";
import type {
  CategoryOption,
  PaginationMetadata,
} from "@/lib/types/articles.types";
import { UserRole } from "@/generated/prisma/enums";

interface AuthorDashboardProps {
  dashboard: {
    stats: AuthorDashboardStats;
  };
  articles: {
    articles: DashboardArticleItem[];
    pagination: PaginationMetadata;
  };
  categories: CategoryOption[];
  user: {
    id: string;
    name: string | null;
    email: string;
    role: UserRole;
  };
}

export default function AuthorDashboard({
  dashboard,
  articles,
  categories,
  user,
}: AuthorDashboardProps) {
  return (
    <div className="flex flex-1 flex-col min-h-screen bg-background">
      <DashboardHeader userName={user.name} role={user.role} />
      <main className="flex-1 p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-7xl w-full mx-auto flex flex-col">
        <MetricCards stats={dashboard.stats} />

        <div className="w-full flex-1 min-w-0">
          <ArticlesTable
            articles={articles.articles}
            pagination={articles.pagination}
            categories={categories}
            currentUserId={user.id}
            userRole={user.role}
          />
        </div>
      </main>

      {/* <main className="flex-1 p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-7xl w-full mx-auto flex flex-col">
        <MetricCards stats={dashboard.stats} />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 sm:gap-6 items-stretch flex-1">
          <div className="xl:col-span-3 min-w-0 flex flex-col">
            <ArticlesTable
              articles={articles.articles}
              pagination={articles.pagination}
              categories={categories}
              currentUserId={user.id}
              userRole={user.role}
            />
          </div>
        </div>
      </main> */}
    </div>
  );
}
