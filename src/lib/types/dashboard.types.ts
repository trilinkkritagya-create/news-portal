import { ArticleStatus, UserRole } from "@/generated/prisma/enums";

/* =========================================================
   Shared
========================================================= */

export interface DashboardArticleItem {
  id: string;
  title: string;
  slug: string;

  status: ArticleStatus;

  createdAt: Date;
  publishedAt: Date | null;

  allowLikes: boolean;
  allowComments: boolean;

  author?: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };

  category: {
    id: string;
    name: string;
    slug: string;
  } | null;

  _count: {
    likes: number;
    comments: number;
    shares: number;
  };
}

/* =========================================================
   Author
========================================================= */

export interface AuthorDashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;

  totalLikes: number;
  totalComments: number;
  totalShares: number;
}

export interface AuthorDashboardData {
  role: Extract<UserRole, "AUTHOR">;

  stats: AuthorDashboardStats;

  recentArticles: DashboardArticleItem[];
}

/* =========================================================
   Admin
========================================================= */

export interface AdminDashboardStats {
  totalUsers: number;
  totalAuthors: number;
  totalMembers: number;

  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;

  totalLikes: number;
  totalComments: number;
  totalShares: number;
}

export interface CategoryDistributionItem {
  id: string;
  name: string;
  slug: string;
  // color: string | null;
  _count: {
    articles: number;
  };
  // percentage: number;
}

export interface AdminDashboardData {
  role: Extract<UserRole, "ADMIN">;

  stats: AdminDashboardStats;

  recentArticles: DashboardArticleItem[];

  categories: CategoryDistributionItem[];
}

/* =========================================================
   Member
========================================================= */

export interface MemberDashboardStats {
  likedArticles: number;
  commentsPosted: number;
  bookmarkedArticles: number;
  readingStreakDays: number;
}

export interface MemberDashboardArticle {
  id: string;
  title: string;
  slug: string;

  excerpt: string | null;
  featuredImage: string | null;

  status: ArticleStatus;

  publishedAt: string | null;
  createdAt: string;

  author: {
    id: string;
    name: string | null;
    image: string | null;
  };

  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface MemberReadingHistoryItem {
  article: MemberDashboardArticle;
  readAt: string;
  progress: number;
}

export interface MemberDashboardData {
  role: Extract<UserRole, "MEMBER">;

  stats: MemberDashboardStats;

  likedArticles: MemberDashboardArticle[];

  savedArticles: MemberDashboardArticle[];

  readingHistory: MemberReadingHistoryItem[];

  recommendedArticles: MemberDashboardArticle[];
}

/* =========================================================
   Dashboard Union
========================================================= */

export type DashboardData =
  | AdminDashboardData
  | AuthorDashboardData
  | MemberDashboardData;
