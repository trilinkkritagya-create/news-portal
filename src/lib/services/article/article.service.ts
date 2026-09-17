import { UserRole } from "@/generated/prisma/enums";

import prisma from "@/lib/prisma";
import { Errors } from "@/lib/errors/errors";
import { ErrorResource } from "@/lib/errors/errors-resource";
import { generateSlug } from "@/lib/utils/slug";
import sanitizeHtml from "sanitize-html";

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

export interface updateArticleFeatureInput {
  allowLikes?: boolean;
  allowComments?: boolean;
  allowShares?: boolean;
}

export interface CreateCommentInput {
  articleId: string;
  content: string;
}

class ArticleService {
  async createArticle(data: CreateArticleInput, user: AuthenticatedUser) {
    try {
      const author = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });
      if (author?.role !== UserRole.ADMIN && author?.role !== UserRole.AUTHOR) {
        throw Errors.forbidden(
          "You do not have permission to create an article.",
          ErrorResource.ARTICLE,
        );
      }
      const sanitizedContent = sanitizeHtml(data.content);

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
          content: sanitizedContent,
          excerpt: data.excerpt,
          authorId: user.id,
          slug,
        },
      });
      return article;
    } catch (error) {
      throw error;
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
  async getArticleById(id: string) {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!article) {
      throw Errors.notFound("Article not found.", ErrorResource.ARTICLE);
    }

    return article;
  }

  async getArticleBySlug(slug: string) {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!article) {
      throw Errors.notFound("Article not found.", ErrorResource.ARTICLE);
    }

    return article;
  }
  async updateArticlesFeatures(
    articleId: string,
    data: updateArticleFeatureInput,
    user: AuthenticatedUser,
  ) {
    try {
      if (user.role !== UserRole.ADMIN) {
        throw Errors.forbidden(
          "Only admin can manage article features",
          ErrorResource.ARTICLE,
        );
      }
      console.log(data.allowLikes, "Is allow likes");
      const article = await prisma.article.findUnique({
        where: {
          id: articleId,
        },
        select: {
          id: true,
        },
      });
      console.log(article, "article obtained");
      if (!article) {
        throw Errors.notFound("Article not found", ErrorResource.ARTICLE);
      }
      const updatedArticle = await prisma.article.update({
        where: {
          id: articleId,
        },
        data: {
          ...(data.allowLikes !== undefined && {
            allowLikes: data.allowLikes,
          }),
          ...(data.allowComments !== undefined && {
            allowComments: data.allowComments,
          }),
        },
        select: {
          id: true,
          title: true,
          allowLikes: true,
          allowComments: true,
        },
      });
      console.log(updatedArticle, "updated article");
      return updatedArticle;
    } catch (error) {
      throw error;
    }
  }
  async toggleLike(articleId: string, user: AuthenticatedUser) {
    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
      select: {
        id: true,
        allowLikes: true,
      },
    });

    if (!article) {
      throw Errors.notFound("Article not found.", ErrorResource.ARTICLE);
    }

    if (!article.allowLikes) {
      throw Errors.forbidden(
        "Likes are disabled for this article.",
        ErrorResource.ARTICLE,
      );
    }

    const existingLike = await prisma.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId: user.id,
          articleId,
        },
      },
    });

    let liked: boolean;

    if (existingLike) {
      await prisma.articleLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      liked = false;
    } else {
      await prisma.articleLike.create({
        data: {
          userId: user.id,
          articleId,
        },
      });

      liked = true;
    }

    const likeCount = await prisma.articleLike.count({
      where: {
        articleId,
      },
    });

    return {
      liked,
      likeCount,
    };
  }
  async createComment(data: CreateCommentInput, user: AuthenticatedUser) {
    try {
      const article = await prisma.article.findUnique({
        where: {
          id: data.articleId,
        },
        select: {
          id: true,
          allowComments: true,
        },
      });

      if (!article) {
        throw Errors.notFound("Article not found.", ErrorResource.ARTICLE);
      }

      if (!article.allowComments) {
        throw Errors.forbidden(
          "Comments are disabled for this article.",
          ErrorResource.ARTICLE,
        );
      }

      const comment = await prisma.comment.create({
        data: {
          content: data.content,
          articleId: article.id,
          userId: user.id,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return comment;
    } catch (error) {
      console.error("Create comment error:", error);
      throw error;
    }
  }
}

export const articleService = new ArticleService();



