import React from "react";
import { getCurrentUser } from "@/lib/auth/authLib";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ArticlesTable from "@/components/dashboard/ArticlesTable";

export default async function ArticlesPage() {
  const user = await getCurrentUser();
  const data = await getDashboardData(user?.role, user?.id);

  return (
    <div className="flex flex-1 flex-col min-h-full bg-background text-foreground">
      {/* Top Header */}
      <DashboardHeader userName={user?.name} role={user?.role} />

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">

        {/* Full Interactive Articles Queue Table */}
        <ArticlesTable articles={data.recentArticles} />
      </main>
    </div>
  );
}
