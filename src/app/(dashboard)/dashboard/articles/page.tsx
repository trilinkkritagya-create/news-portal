import React from "react";
import { getCurrentUser } from "@/lib/auth/authLib";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";
import ArticlesManagementView from "@/components/dashboard/ArticlesManagementView";

export default async function ArticlesPage() {
  const user = await getCurrentUser();
  const data = await getDashboardData(user?.role, user?.id);

  return (
    <div className="flex flex-1 flex-col min-h-screen bg-[#F8FAFC] dark:bg-[#090e17] text-foreground">
      {/* Interactive Articles Management View with Integrated Sticky Top Nav */}
      <ArticlesManagementView
        initialArticles={data.recentArticles}
        stats={data.stats}
      />
    </div>
  );
}
