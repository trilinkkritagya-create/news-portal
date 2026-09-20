import { ArticleStatus } from "@/generated/prisma/enums";

export interface GetArticlesInput {
  page?: number;
  limit?: number;
  search?: string;
  status?: ArticleStatus | "ALL";
  category?: string;
  authorId?: string;
  sortBy?: "createdAt" | "publishedAt" | "title";
  sortOrder?: "asc" | "desc";
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}
export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
export interface ArticleTypes {
  id: string;
  title: string;
  status: ArticleStatus;
  slug: string;
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
