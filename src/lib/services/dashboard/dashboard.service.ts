import { ArticleStatus, UserRole } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { Errors } from "@/lib/errors/errors";
import { ErrorResource } from "@/lib/errors/errors-resource";
import { normalizeError } from "@/lib/errors/normalizeError";
import {
  MemberDashboardArticle,
  MemberDashboardData,
} from "@/lib/types/dashboard.types";

class DashboardService {
  async getAuthorDashboard(userId: string) {
    try {
      const articleWhere = {
        authorId: userId,
      };

      const [
        totalArticles,
        publishedArticles,
        draftArticles,
        totalLikes,
        totalComments,
        totalShares,
        recentArticles,
      ] = await Promise.all([
        prisma.article.count({
          where: articleWhere,
        }),

        prisma.article.count({
          where: {
            ...articleWhere,
            status: ArticleStatus.PUBLISHED,
          },
        }),

        prisma.article.count({
          where: {
            ...articleWhere,
            status: ArticleStatus.DRAFT,
          },
        }),

        prisma.articleLike.count({
          where: {
            article: articleWhere,
          },
        }),

        prisma.comment.count({
          where: {
            article: articleWhere,
          },
        }),

        prisma.articleShare.count({
          where: {
            article: articleWhere,
          },
        }),

        prisma.article.findMany({
          where: articleWhere,
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            createdAt: true,
            publishedAt: true,
            allowLikes: true,
            allowComments: true,

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
      ]);

      return {
        role: UserRole.AUTHOR,

        stats: {
          totalArticles,
          publishedArticles,
          draftArticles,
          totalLikes,
          totalComments,
          totalShares,
        },

        recentArticles,
      };
    } catch (error) {
      throw normalizeError(error, ErrorResource.STATS);
    }
  }

  async getAdminDashboard() {
    try {
      const [
        totalUsers,
        totalAuthors,
        totalMembers,
        totalArticles,
        publishedArticles,
        draftArticles,
        totalLikes,
        totalComments,
        totalShares,
        recentArticles,
        categories,
      ] = await Promise.all([
        prisma.user.count(),

        prisma.user.count({
          where: {
            role: UserRole.AUTHOR,
          },
        }),

        prisma.user.count({
          where: {
            role: UserRole.MEMBER,
          },
        }),

        prisma.article.count(),

        prisma.article.count({
          where: {
            status: ArticleStatus.PUBLISHED,
          },
        }),

        prisma.article.count({
          where: {
            status: ArticleStatus.DRAFT,
          },
        }),

        prisma.articleLike.count(),

        prisma.comment.count(),

        prisma.articleShare.count(),

        prisma.article.findMany({
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            createdAt: true,
            publishedAt: true,

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

            allowLikes: true,
            allowComments: true,

            _count: {
              select: {
                likes: true,
                comments: true,
                shares: true,
              },
            },
          },
        }),

        prisma.category.findMany({
          select: {
            id: true,
            name: true,
            slug: true,

            _count: {
              select: {
                articles: true,
              },
            },
          },
        }),
      ]);

      return {
        role: UserRole.ADMIN,

        stats: {
          totalUsers,
          totalAuthors,
          totalMembers,
          totalArticles,
          publishedArticles,
          draftArticles,
          totalLikes,
          totalComments,
          totalShares,
        },
        recentArticles,

        categories,
      };
    } catch (error) {
      throw normalizeError(error, ErrorResource.STATS);
    }
  }
  async getMemberDashboard(userId: string): Promise<MemberDashboardData> {
    try {
      const [likedArticlesCount, commentsPosted, likedArticles] =
        await Promise.all([
          prisma.articleLike.count({
            where: {
              userId,
            },
          }),

          prisma.comment.count({
            where: {
              userId,
            },
          }),

          prisma.article.findMany({
            where: {
              likes: {
                some: {
                  userId,
                },
              },
            },
            orderBy: {
              publishedAt: "desc",
            },
            take: 10,
            select: {
              id: true,
              title: true,
              slug: true,
              excerpt: true,
              featuredImage: true,
              status: true,
              publishedAt: true,
              createdAt: true,

              author: {
                select: {
                  id: true,
                  name: true,
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
            },
          }),
        ]);

      const formattedLikedArticles: MemberDashboardArticle[] =
        likedArticles.map((article) => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          featuredImage: article.featuredImage,
          status: article.status,
          publishedAt: article.publishedAt?.toISOString() ?? null,
          createdAt: article.createdAt.toISOString(),

          author: article.author,

          category: article.category,
        }));

      return {
        role: UserRole.MEMBER,

        stats: {
          likedArticles: likedArticlesCount,
          commentsPosted,

          bookmarkedArticles: 0,
          readingStreakDays: 0,
        },

        likedArticles: formattedLikedArticles,

        savedArticles: [],
        readingHistory: [],
        recommendedArticles: [],
      };
    } catch (error) {
      throw normalizeError(error, ErrorResource.STATS);
    }
  }
  async getDashboardStats(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          role: true,
        },
      });

      if (!user) {
        throw Errors.notFound("User not found.", ErrorResource.AUTH);
      }
      switch (user.role) {
        case UserRole.ADMIN:
          return await this.getAdminDashboard();

        case UserRole.AUTHOR:
          return await this.getAuthorDashboard(user.id);

        case UserRole.MEMBER:
          return await this.getMemberDashboard(user.id);

        default:
          throw Errors.forbidden(
            "You do not have permission to access the dashboard.",
            ErrorResource.STATS,
          );
      }
    } catch (error) {
      throw normalizeError(error, ErrorResource.STATS);
    }
  }
}

export const dashboardService = new DashboardService();
