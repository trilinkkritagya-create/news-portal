import { UserRole } from "@/generated/prisma/enums";

import prisma from "@/lib/prisma";
import { Errors } from "@/lib/errors/errors";
import { ErrorResource } from "@/lib/errors/errors-resource";
import { generateSlug } from "@/lib/utils/slug";
import { normalizeError } from "@/lib/errors/normalizeError";

interface CreateArticleInput {
  title: string;
  content: string;
  excerpt?: string;
  //   image?: string | undefined;
}

interface AuthenticatedUser {
  id: string;
  role: UserRole;
}
export interface UpdateArticleInput {
  title?: string;
  content?: string;
  excerpt?: string;
}

class ArticleService {
  async createArticle(data: CreateArticleInput, user: AuthenticatedUser) {
    try {
      if (user.role !== UserRole.ADMIN && user.role !== UserRole.AUTHOR) {
        throw Errors.forbidden(
          "You do not have permission to create an article.",
          ErrorResource.ARTICLE,
        );
      }
      const baseSlug = generateSlug(data.title);
      let slug = baseSlug;
      let counter = 1;
      while (
        await prisma.article.findUnique({
          where: { slug },
          select: { id: true },
        })
      ) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      const article = await prisma.article.create({
        data: {
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          authorId: user.id,
          slug,
        },
      });
      return article;
    } catch (error) {
      throw normalizeError(error, ErrorResource.ARTICLE);
    }
  }
  async updateArticle(
    articleId: string,
    data: UpdateArticleInput,
    user: AuthenticatedUser,
  ) {
    try {
      const article = await prisma.article.findUnique({
        where: {
          id: articleId,
        },
      });
      if (!article) {
        throw Errors.notFound("Article not found.", ErrorResource.ARTICLE);
      }
      if (user.role === UserRole.AUTHOR && article.authorId !== user.id) {
        throw Errors.forbidden(
          "You can only edit your own articles.",
          ErrorResource.ARTICLE,
        );
      }
      if (user.role === UserRole.MEMBER) {
        throw Errors.forbidden(
          "You do not have permission to edit this article.",
          ErrorResource.ARTICLE,
        );
      }
      const baseSlug = generateSlug(data?.title);

      let slug = baseSlug;
      let counter = 1;

      while (
        await prisma.article.findFirst({
          where: {
            slug,
            NOT: {
              id: articleId,
            },
          },
          select: {
            id: true,
          },
        })
      ) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const updatedArticle = await prisma.article.update({
        where: {
          id: articleId,
        },
        data: {
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          slug,
        },
      });

      return updatedArticle;
    } catch (error) {
      console.error("Update article error:", error);
      throw error;
    }
  }
  async deleteArticle(articleId: string, user: AuthenticatedUser) {
    try {
      const article = await prisma.article.findUnique({
        where: {
          id: articleId,
        },
        select: {
          id: true,
          authorId: true,
        },
      });
      if (!article) {
        throw Errors.notFound("Article not found.", ErrorResource.ARTICLE);
      }
      if (user.role === UserRole.AUTHOR && article.authorId !== user.id) {
        throw Errors.forbidden(
          "You can only delete your own articles.",
          ErrorResource.ARTICLE,
        );
      }

      if (user.role === UserRole.MEMBER) {
        throw Errors.forbidden(
          "You do not have permission to delete this article.",
          ErrorResource.ARTICLE,
        );
      }
      await prisma.article.delete({
        where: {
          id: articleId,
        },
      });
      return {
        id: article.id,
      };
    } catch (error) {
      console.error("Delete article error:", error);
      throw error;
    }
  }
  async getAllArticle() {
    try {
      return await prisma.article.findMany();
    } catch (error) {
      console.log(error, "Error getting articles");
      throw error;
    }
  }
}

export const articleService = new ArticleService();
