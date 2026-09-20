import { articleService } from "@/lib/services/article/article.service";
import { notFound } from "next/navigation";

interface ViewArticlesProps {
  params: Promise<{
    id: string;
  }>;
}

const ViewArticles = async ({ params }: ViewArticlesProps) => {
  const { id } = await params;
  console.log(id, "is params");
  const article = await articleService.getArticleById(id);
  console.log("articles data gained from id", article);
  if (!article) {
    notFound();
  }
  return (
    <main>
      <h1>{article.title}</h1>

      {article.excerpt && <p>{article.excerpt}</p>}

      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </main>
  );
};

export default ViewArticles;
