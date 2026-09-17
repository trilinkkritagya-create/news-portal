import { getCurrentUser, requireAuth } from "@/lib/auth/authLib";
import { getMemberDashboardData } from "@/lib/dashboard/get-dashboard-data";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MemberDashboardView from "@/components/dashboard/member/MemberDashboardView";
import type { Metadata } from "next";
import { Suspense } from "react";
import MemberDashboardContent from "@/components/dashboard/member/MemberDashboardContent";
import MemberDashboardSkeleton from "@/components/skeletons/MemberDashboardSkeleton";

export const metadata: Metadata = {
  title: "Reader Desk & Library · News Portal",
  description:
    "Member personal reading library, saved manuscripts, and community history.",
};

export default async function MemberPage() {
  const user = await requireAuth();
  // const memberData = await getMemberDashboardData(user?.id);

  return (
    <div className="flex flex-1 flex-col min-h-full bg-background">
      {/* Top Header configured for Member view */}
      <DashboardHeader userName={user?.name || "Member"} role="MEMBER" />
      {/* Member Content Workspace */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl w-full mx-auto">
        <Suspense fallback={<MemberDashboardSkeleton />}>
          <MemberDashboardContent userId={user.id} />
        </Suspense>
        {/* <MemberDashboardView data={memberData} /> */}
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
