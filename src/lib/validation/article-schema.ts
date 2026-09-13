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
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.content !== undefined ||
      data.excerpt !== undefined,
    {
      message: "At least one field is required to update the article.",
    },
  );
