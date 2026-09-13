import { getCurrentUser } from "@/lib/auth/authLib";
import {
  getDashboardData,
  getMemberDashboardData,
} from "@/lib/dashboard/get-dashboard-data";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricCards from "@/components/dashboard/MetricCards";
import ArticlesTable from "@/components/dashboard/ArticlesTable";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import BureauDirectives from "@/components/dashboard/BureauDirectives";
import MemberDashboardView from "@/components/dashboard/member/MemberDashboardView";
import { UserRole } from "@/generated/prisma/enums";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const isMember = user?.role === UserRole.MEMBER;

  // Render role-specific Member Reading Hub for Member role
  if (isMember) {
    const memberData = await getMemberDashboardData(user?.id);

    return (
      <div className="flex flex-1 flex-col min-h-full bg-background">
        {/* Top Header */}
        <DashboardHeader userName={user?.name} role={user?.role} />

        {/* Member Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl w-full mx-auto">
          <MemberDashboardView data={memberData} />
        </main>

        {/* Member Footer */}
        <footer className="mt-auto border-t border-border bg-card px-4 py-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between font-mono text-xs text-muted-foreground gap-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-2.5">
            <span className="font-bold text-foreground">THE CHRONICLE</span>
            <span>·</span>
            <span>Reader Library &amp; Patron Desk</span>
            <span className="hidden sm:inline">·</span>
            <span className="text-live flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-live inline-block"></span>
              Patron Access Nominal
            </span>
          </div>
          <div>
            <span>© 2026 The Chronicle Publishing Syndicate.</span>
          </div>
        </footer>
      </div>
    );
  }

  // Otherwise render Admin / Author Editorial Dashboard
  const data = await getDashboardData(user?.role, user?.id);

  return (
    <div className="flex flex-1 flex-col min-h-full bg-background">
      {/* Top Header */}
      <DashboardHeader userName={user?.name} role={user?.role} />

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl w-full mx-auto">
        {/* 4 High-Density Key Performance Metrics with Horizontal Slider on Mobile */}
        <MetricCards stats={data.stats} />

        {/* Operational 2-Column Grid: Queue Table & Category Distribution */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          {/* Main Editorial Articles Queue (3 Cols) with Show More */}
          <div className="xl:col-span-3 min-w-0">
            <ArticlesTable articles={data.recentArticles} />
          </div>

          {/* Right Telemetry & Directive Column (1 Col) */}
          <div className="xl:col-span-1 space-y-6 min-w-0">
            <CategoryBreakdown categories={data.categories} />
            <BureauDirectives />
          </div>
        </div>
      </main>

      {/* Broadsheet Admin Footer */}
      <footer className="mt-auto border-t border-border bg-card px-4 py-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between font-mono text-xs text-muted-foreground gap-2 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-2.5">
          <span className="font-bold text-foreground">THE CHRONICLE</span>
          <span>·</span>
          <span>Editorial Operations Terminal v2.4</span>
          <span className="hidden sm:inline">·</span>
          <span className="text-live flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-live inline-block"></span>
            System Nominal
          </span>
        </div>
        <div>
          <span>© 2026 The Chronicle Publishing Syndicate.</span>
        </div>
      </footer>
    </div>
  );
}
