import { getCurrentUser } from "@/lib/auth/authLib";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MemberDashboardView from "@/components/dashboard/member/MemberDashboardView";
import { dashboardService } from "@/lib/services/dashboard/dashboard.service";
import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";
import AuthorDashboard from "@/components/dashboard/author/AuthorDashbaord";
import parseDashboardQuery from "@/lib/utils/parseDashboardQuery";

interface DashboardPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    category?: string;
  }>;
}

export default async function DashboardPage(props: DashboardPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }
  const rawSearchParams = await props.searchParams;
  const { page, search, status, category } =
    parseDashboardQuery(rawSearchParams);
  const dashboard = await dashboardService.getDashboardStats(user.id);
  const authorId = dashboard.role === "AUTHOR" ? user.id : undefined;
  if (dashboard.role === "MEMBER") {
    return (
      <div className="flex flex-1 flex-col min-h-screen bg-background">
        <DashboardHeader userName={user.name} role={user.role} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl w-full mx-auto flex flex-col">
          <MemberDashboardView data={dashboard} />
        </main>
      </div>
    );
  }
  const articlesData = await dashboardService.getFilteredArticles({
    page,
    limit: 4,
    search,
    status,
    category,
    authorId,
  });

  const categories = "categories" in dashboard ? dashboard.categories : [];
  if (dashboard.role === "AUTHOR") {
    return (
      <>
        <AuthorDashboard
          dashboard={dashboard}
          articles={articlesData}
          categories={categories}
          user={user}
        />
      </>
    );
  }
  return (
    <AdminDashboard
      user={user}
      stats={dashboard.stats}
      articles={articlesData.articles}
      pagination={articlesData.pagination}
      categories={categories}
    />
  );
}
