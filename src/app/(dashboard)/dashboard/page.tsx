// import { getCurrentUser } from "@/lib/auth/authLib";
// // import { dashboardService } from "@/lib/services/dashboard/dashboard-service";

// import DashboardHeader from "@/components/dashboard/DashboardHeader";
// import MetricCards from "@/components/dashboard/MetricCards";
// import ArticlesTable from "@/components/dashboard/ArticlesTable";
// import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
// import BureauDirectives from "@/components/dashboard/BureauDirectives";
// import MemberDashboardView from "@/components/dashboard/member/MemberDashboardView";

// import { UserRole } from "@/generated/prisma/enums";
// import { dashboardService } from "@/lib/services/dashboard/dashboard.service";

// export default async function DashboardPage() {
//   const user = await getCurrentUser();

//   if (!user) {
//     return null;
//   }

//   const dashboard = await dashboardService.getDashboardStats(user.id);
//   console.log(dashboard, "is dashboard Data");

//   if (dashboard.role === UserRole.MEMBER) {
//     return (
//       <div className="flex flex-1 flex-col min-h-screen bg-background">
//         <DashboardHeader userName={user.name} role={user.role} />

//         <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl w-full mx-auto flex flex-col">
//           <MemberDashboardView data={dashboard} />
//         </main>

//         <footer className="mt-auto border-t border-border bg-card px-4 py-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between font-mono text-[11px] text-muted-foreground gap-2 text-center sm:text-left select-none">
//           <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
//             <span className="font-bold text-foreground">THE CHRONICLE</span>

//             <span>·</span>

//             <span>Reader Library &amp; Patron Desk</span>

//             <span className="hidden sm:inline">·</span>

//             <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
//               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
//               Patron Access Nominal
//             </span>
//           </div>

//           <div>
//             <span>© 2026 The Chronicle Publishing Syndicate.</span>
//           </div>
//         </footer>
//       </div>
//     );
//   }
//   return (
//     <div className="flex flex-1 flex-col min-h-screen bg-background">
//       <DashboardHeader userName={user.name} role={user.role} />
//       <main className="flex-1 p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-7xl w-full mx-auto flex flex-col">
//         <MetricCards stats={dashboard.stats} />
//         <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 sm:gap-6 items-stretch flex-1">
//           <div className="xl:col-span-3 min-w-0 flex flex-col">
//             <ArticlesTable articles={dashboard.recentArticles} />
//           </div>
//           <div className="xl:col-span-1 space-y-5 sm:space-y-6 min-w-0 flex flex-col justify-between">
//             <CategoryBreakdown categories={dashboard?.categories} />
//             <BureauDirectives />
//           </div>
//         </div>
//       </main>

//       <footer className="mt-auto h-auto sm:h-9 py-2.5 sm:py-0 border-t border-border bg-card px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted-foreground font-mono select-none gap-2">
//         <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
//           <span className="flex items-center gap-1.5 text-foreground font-medium">
//             <span className="relative flex h-2 w-2">
//               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
//               <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
//             </span>
//             THE CHRONICLE · Operations Terminal v2.4
//           </span>

//           <span className="text-border hidden sm:inline">|</span>

//           <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800">
//             Nominal
//           </span>
//         </div>

//         <div className="flex items-center gap-3 text-[10px]">
//           <span className="text-muted-foreground">Bureau: Operational</span>

//           <span>•</span>
//           <span>•</span>
//           <span>•</span>

//           <span className="text-red-600 dark:text-red-400 hover:underline cursor-pointer">
//             Override
//           </span>
//         </div>
//       </footer>
//     </div>
//   );
// }
import { getCurrentUser } from "@/lib/auth/authLib";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricCards from "@/components/dashboard/MetricCards";
import ArticlesTable from "@/components/dashboard/ArticlesTable";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import BureauDirectives from "@/components/dashboard/BureauDirectives";
import MemberDashboardView from "@/components/dashboard/member/MemberDashboardView";

import { dashboardService } from "@/lib/services/dashboard/dashboard.service";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const dashboard = await dashboardService.getDashboardStats(user.id);

  console.log(dashboard, "is dashboard Data");

  if (dashboard.role === "MEMBER") {
    return (
      <div className="flex flex-1 flex-col min-h-screen bg-background">
        <DashboardHeader userName={user.name} role={user.role} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl w-full mx-auto flex flex-col">
          <MemberDashboardView data={dashboard} />
        </main>
        {/* member footer */}
      </div>
    );
  }

  if (dashboard.role === "AUTHOR") {
    return (
      <div className="flex flex-1 flex-col min-h-screen bg-background">
        <DashboardHeader userName={user.name} role={user.role} />

        <main className="flex-1 p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-7xl w-full mx-auto flex flex-col">
          <MetricCards stats={dashboard.stats} />

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 sm:gap-6 items-stretch flex-1">
            <div className="xl:col-span-3 min-w-0 flex flex-col">
              <ArticlesTable articles={dashboard.recentArticles} />
            </div>

            <div className="xl:col-span-1 space-y-5 sm:space-y-6 min-w-0 flex flex-col justify-between">
              <BureauDirectives />
            </div>
          </div>
        </main>

        {/* author footer */}
      </div>
    );
  }

  // Here TypeScript knows dashboard is ADMIN
  return (
    <div className="flex flex-1 flex-col min-h-screen bg-background">
      <DashboardHeader userName={user.name} role={user.role} />
      <main className="flex-1 p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-7xl w-full mx-auto flex flex-col">
        <MetricCards stats={dashboard.stats} />
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 sm:gap-6 items-stretch flex-1">
          <div className="xl:col-span-3 min-w-0 flex flex-col">
            <ArticlesTable articles={dashboard.recentArticles} />
          </div>
          <div className="xl:col-span-1 space-y-5 sm:space-y-6 min-w-0 flex flex-col justify-between">
            <CategoryBreakdown categories={dashboard?.categories} />
            <BureauDirectives />
          </div>
        </div>
      </main>

      {/* admin footer */}
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
}
