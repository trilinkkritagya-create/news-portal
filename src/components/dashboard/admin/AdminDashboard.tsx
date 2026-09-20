import React from "react";

import DashboardHeader from "../DashboardHeader";
import MetricCards from "../MetricCards";
import ArticlesTable from "../ArticlesTable";

import { UserRole } from "@/generated/prisma/enums";
import {
  AdminDashboardStats,
  DashboardArticleItem,
} from "@/lib/types/dashboard.types";

interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface AdminDashboardProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: UserRole;
  };
  stats: AdminDashboardStats;

  articles: DashboardArticleItem[];

  pagination: PaginationMetadata;

  categories: CategoryOption[];
}

const AdminDashboard = ({
  user,
  stats,
  articles,
  pagination,
  categories,
}: AdminDashboardProps) => {
  return (
    <div className="flex flex-1 flex-col min-h-screen bg-background">
      <DashboardHeader userName={user.name} role={user.role} />
      <main className="flex-1 p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-7xl w-full mx-auto flex flex-col">
        <MetricCards stats={stats} />
        <div className="w-full flex-1 min-w-0">
          <ArticlesTable
            articles={articles}
            pagination={pagination}
            categories={categories}
            currentUserId={user.id}
            userRole={user.role}
          />
        </div>
      </main>
      <footer className="mt-auto h-auto sm:h-9 py-2.5 sm:py-0 border-t border-border bg-card px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted-foreground font-mono select-none gap-2">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span className="flex items-center gap-1.5 text-foreground font-medium">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            THE CHRONICLE · Operations Terminal v2.4
          </span>

          <span className="text-border hidden sm:inline">|</span>

          <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800">
            Nominal
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-muted-foreground">Bureau: Operational</span>

          <span>•</span>
          <span>•</span>
          <span>•</span>

          <span className="text-red-600 dark:text-red-400 hover:underline cursor-pointer">
            Override
          </span>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
