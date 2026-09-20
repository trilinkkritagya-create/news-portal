import { ArticleStatus } from "@/generated/prisma/browser";
import { z } from "zod";

export const createArticleSchema = z.object({
  title: z
    .string("Title is required.")
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must not exceed 200 characters."),

  content: z
    .string("Content is required.")
    .trim()
    .min(1, "Content is required."),

  excerpt: z
    .string()
    .trim()
    .max(500, "Excerpt must not exceed 500 characters.")
    .optional(),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;

export const updateArticleSchema = z
  .object({
    title: z
      .string("Title is required.")
      .trim()
      .min(1, "Title is required.")
      .max(200, "Title must not exceed 200 characters.")
      .optional(),

    content: z
      .string("Content is required.")
      .trim()
      .min(1, "Content is required.")
      .optional(),

    excerpt: z
      .string()
      .trim()
      .max(500, "Excerpt must not exceed 500 characters.")
      .optional(),
    allowLikes: z.boolean().optional(),
    allowComments: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.content !== undefined ||
      data.excerpt !== undefined || {
        message: "At least one field is required to update the article.",
      },
  );

export const updateArticleFeatureSchema = z
  .object({
    allowLikes: z.boolean().optional(),
    allowComments: z.boolean().optional(),
  })
  .refine(
    (data) => data.allowComments !== undefined || data.allowLikes !== undefined,
    { message: "At least one article feature must be provided" },
  );

export const createCommentSchema = z.object({
  articleId: z.string().trim().min(1, "Article ID is required."),
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty.")
    .max(2000, "Comment must not exceed 2000 characters."),
});

export const updateArticleStatusSchema = z.object({
  articleId: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export const getArticlesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),

  search: z.string().trim().optional(),

  status: z.enum(ArticleStatus).optional(),

  category: z.string().trim().optional(),

  sortBy: z.enum(["createdAt", "publishedAt", "title"]).default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
