import { notFound } from "next/navigation";
import { articleService } from "@/lib/services/article/article.service";
import EditArticleForm from "@/components/dashboard/EditArticleForm";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { id } = await params;

  let article;
  try {
    article = await articleService.getArticleById(id);
  } catch {
    notFound();
  }

  if (!article) {
    notFound();
  }

  return <EditArticleForm article={article} />;
}
