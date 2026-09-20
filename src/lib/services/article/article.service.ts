import { ArticleStatus, UserRole } from "@/generated/prisma/enums";

import prisma from "@/lib/prisma";
import { Errors } from "@/lib/errors/errors";
import { ErrorResource } from "@/lib/errors/errors-resource";
import { normalizeError } from "@/lib/errors/normalizeError";
import { generateSlug } from "@/lib/utils/slug";
import sanitizeHtml from "sanitize-html";
import { GetArticlesInput } from "@/lib/types/articles.types";

interface CreateArticleInput {
  title: string;
  content: string;
  excerpt?: string;
}

interface AuthenticatedUser {
  id: string;
  role: UserRole;
}
export interface UpdateArticleInput {
  title?: string;
  content?: string;
  excerpt?: string;
  allowLikes?: boolean;
  allowComments?: boolean;
  // allowShares?: boolean;
}
export interface UpdateArticleFeaturesInput {
  allowLikes?: boolean;
  allowComments?: boolean;
  allowShares?: boolean;
}
// export interface updateArticleFeatureInput {
//   allowLikes?: boolean;
//   allowComments?: boolean;
//   allowShares?: boolean;
// }

export interface CreateCommentInput {
  articleId: string;
  content: string;
}
interface UpdateArticleStatusInput {
  articleId: string;
  status: ArticleStatus;
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
  async updateArticleStatus(
    data: UpdateArticleStatusInput,
    user: AuthenticatedUser,
  ) {
    try {
      if (user.role !== "ADMIN") {
        throw Errors.forbidden(
          "Only administrators can change article status.",
          ErrorResource.ARTICLE,
        );
      }

      const article = await prisma.article.findUnique({
        where: {
          id: data.articleId,
        },
        select: {
          id: true,
          status: true,
        },
      });

      if (!article) {
        throw Errors.notFound("Article not found.", ErrorResource.ARTICLE);
      }

      if (article.status === data.status) {
        return article;
      }

      const updatedArticle = await prisma.article.update({
        where: {
          id: data.articleId,
        },
        data: {
          status: data.status,

          publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        },

        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          authorId: true,
          categoryId: true,
          allowLikes: true,
          allowComments: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedArticle;
    } catch (error) {
      throw error;
    }
  }
  async publishArticle(articleId: string, user: AuthenticatedUser) {
    return this.updateArticleStatus(
      {
        articleId,
        status: "PUBLISHED",
      },
      user,
    );
  }
  async unpublishArticle(articleId: string, user: AuthenticatedUser) {
    return this.updateArticleStatus(
      {
        articleId,
        status: "DRAFT",
      },
      user,
    );
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
          ...(data.allowLikes !== undefined && {
            allowLikes: data.allowLikes,
          }),

          ...(data.allowComments !== undefined && {
            allowComments: data.allowComments,
          }),
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
    data: UpdateArticleFeaturesInput,
    user: AuthenticatedUser,
  ) {
    try {
      if (user.role !== UserRole.ADMIN) {
        throw Errors.forbidden(
          "Only administrators can manage article features.",
          ErrorResource.ARTICLE,
        );
      }

      const article = await prisma.article.findUnique({
        where: {
          id: articleId,
        },
        select: {
          id: true,
        },
      });

      if (!article) {
        throw Errors.notFound("Article not found.", ErrorResource.ARTICLE);
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

      return updatedArticle;
    } catch (error) {
      console.error("updateArticlesFeatures error:", error);

      if (error instanceof Error) {
        console.error("message:", error.message);
        console.error("name:", error.name);
        // console.error("stack:", error.stack);
      }
      throw normalizeError(error, ErrorResource.ARTICLE);
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

  async getFilteredArticles(input: GetArticlesInput) {
    try {
      const {
        page = 1,
        limit = 4,
        search,
        status,
        category,
        authorId,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = input;

      const safePage = Math.max(1, page);
      const safeLimit = Math.max(1, limit);

      const skip = (safePage - 1) * safeLimit;

      const where = {
        ...(status &&
          status !== "ALL" && {
            status,
          }),

        ...(category &&
          category !== "ALL" && {
            category: {
              slug: category,
            },
          }),

        ...(authorId && {
          authorId,
        }),

        ...(search &&
          search.trim() !== "" && {
            OR: [
              {
                title: {
                  contains: search.trim(),
                  mode: "insensitive" as const,
                },
              },
              {
                excerpt: {
                  contains: search.trim(),
                  mode: "insensitive" as const,
                },
              },
              {
                author: {
                  name: {
                    contains: search.trim(),
                    mode: "insensitive" as const,
                  },
                },
              },
              {
                category: {
                  name: {
                    contains: search.trim(),
                    mode: "insensitive" as const,
                  },
                },
              },
            ],
          }),
      };

      const [articles, total] = await Promise.all([
        prisma.article.findMany({
          where,
          skip,
          take: safeLimit,

          orderBy: {
            [sortBy]: sortOrder,
          },

          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            createdAt: true,
            publishedAt: true,

            allowLikes: true,
            allowComments: true,

            author: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },

            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },

            _count: {
              select: {
                likes: true,
                comments: true,
                shares: true,
              },
            },
          },
        }),

        prisma.article.count({
          where,
        }),
      ]);

      const totalPages = Math.ceil(total / safeLimit) || 1;

      return {
        articles,

        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          totalPages,
          hasNextPage: safePage < totalPages,
          hasPreviousPage: safePage > 1,
        },
      };
    } catch (error) {
      throw normalizeError(error, ErrorResource.ARTICLE);
    }
  }
}

export const articleService = new ArticleService();
