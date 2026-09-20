import { getCurrentUser } from "@/lib/auth/authLib";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ArticlesActionTable from "@/components/dashboard/articles/ArticlesActionTable";
import { articleService } from "@/lib/services/article/article.service";

export default async function ArticlesPage() {
  const user = await getCurrentUser();
  const articleData = await articleService.getFilteredArticles({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  console.log(articleData, "is article data");

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[#F8FAFC] text-foreground dark:bg-[#090e17]">
      <DashboardHeader />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <ArticlesActionTable
          articles={articleData.articles}
          currentUserId={user?.id ?? ""}
          userRole={user?.role}
          pagination={articleData.pagination}
        />
      </main>
    </div>
  );
}
