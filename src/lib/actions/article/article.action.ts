"use server";

import { requireAuth } from "@/lib/auth/authLib";
import { ErrorResource } from "@/lib/errors/errors-resource";
import { handleError } from "@/lib/errors/handleError";
import { normalizeError } from "@/lib/errors/normalizeError";
import { articleService } from "@/lib/services/article/article.service";
import {
  createArticleSchema,
  updateArticleSchema,
} from "@/lib/validation/article-schema";

export type CreateArticleState = {
  success: boolean;
  message?: string;
  error?: {
    code: string;
    message: string;
    resource: string;
  };
  data?: {
    article: {
      id: string;
      title: string;
    };
  };
};
export type UpdateArticleState = {
  success: boolean;
  message?: string;
  error?: {
    code: string;
    message: string;
    resource: string;
  };
  data?: {
    article: {
      id: string;
      title: string;
    };
  };
};
export type DeleteArticleState = {
  success: boolean;
  message?: string;
  error?: {
    code: string;
    message: string;
    resource: string;
  };
};

export async function createArticleAction(
  _previousState: CreateArticleState,
  formData: FormData,
): Promise<CreateArticleState> {
  try {
    const user = await requireAuth();

    const result = createArticleSchema.safeParse({
      title: formData.get("title"),
      content: formData.get("content"),
      excerpt: formData.get("excerpt") || undefined,
      image: formData.get("image") || undefined,
    });

    if (!result.success) {
      return {
        success: false,
        error: {
          code: "VALIDATION",
          message: result.error.issues[0]?.message ?? "Invalid article data.",
          resource: ErrorResource.ARTICLE,
        },
      };
    }
    const article = await articleService.createArticle(result.data, user);
    return {
      success: true,
      message: "Article created successfully.",
      data: {
        article: {
          id: article.id,
          title: article.title,
        },
      },
    };
  } catch (error) {
    const appError = normalizeError(error, ErrorResource.ARTICLE);

    return {
      success: false,
      error: handleError(appError),
    };
  }
}

export async function updateArticleAction(
  articleId: string,
  _previousState: UpdateArticleState,
  formData: FormData,
): Promise<UpdateArticleState> {
  try {
    const user = await requireAuth();

    const result = updateArticleSchema.safeParse({
      title: formData.get("title"),
      content: formData.get("content"),
      excerpt: formData.get("excerpt") || undefined,
    });

    if (!result.success) {
      return {
        success: false,
        error: {
          code: "VALIDATION",
          message: result.error.issues[0]?.message ?? "Invalid article data.",
          resource: ErrorResource.ARTICLE,
        },
      };
    }

    const article = await articleService.updateArticle(
      articleId,
      result.data,
      user,
    );

    return {
      success: true,
      message: "Article updated successfully.",
      data: {
        article: {
          id: article.id,
          title: article.title,
        },
      },
    };
  } catch (error) {
    const appError = normalizeError(error, ErrorResource.ARTICLE);

    return {
      success: false,
      error: handleError(appError),
    };
  }
}

export async function deleteArticleAction(
  articleId: string,
): Promise<DeleteArticleState> {
  try {
    const user = await requireAuth();
    await articleService.deleteArticle(articleId, user);
    return {
      success: true,
      message: "Article deleted successfully.",
    };
  } catch (error) {
    const appError = normalizeError(error, ErrorResource.ARTICLE);

    return {
      success: false,
      error: handleError(appError),
    };
  }
}
