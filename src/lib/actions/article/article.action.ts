"use server";

import { requireAuth } from "@/lib/auth/authLib";
import { ErrorResource } from "@/lib/errors/errors-resource";
import { handleError } from "@/lib/errors/handleError";
import { normalizeError } from "@/lib/errors/normalizeError";
import { articleService } from "@/lib/services/article/article.service";
import {
  createArticleSchema,
  createCommentSchema,
  updateArticleFeatureSchema,
  updateArticleSchema,
  updateArticleStatusSchema,
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
export type UpdateArticleFeaturesState = {
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
      allowLikes: boolean;
      allowComments: boolean;
      // allowShares: boolean;
    };
  };
};
export type PublishArticleActionState = {
  success: boolean;
  message?: string;
};

export type LikeArticleState = {
  success: boolean;
  message?: string;

  error?: {
    code: string;
    message: string;
    resource: string;
  };

  data?: {
    liked: boolean;
    likeCount: number;
  };
};
export type CreateCommentState = {
  success: boolean;
  message?: string;

  error?: {
    code: string;
    message: string;
    resource: string;
  };

  data?: {
    comment: {
      id: string;
      content: string;
      createdAt: Date;
      updatedAt: Date;
      user: {
        id: string;
        name: string | null;
        image: string | null;
      };
    };
  };
};

export async function createArticleAction(
  _previousState: CreateArticleState,
  formData: FormData,
): Promise<CreateArticleState> {
  try {
    const user = await requireAuth();
    console.log("User in createArticleAction:", user);
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

export async function publishArticleAction(
  articleId: string,
): Promise<PublishArticleActionState> {
  try {
    const user = await requireAuth();

    if (user.role !== "ADMIN") {
      return {
        success: false,
        message: "Only administrators can publish articles.",
      };
    }

    await articleService.publishArticle(articleId, {
      id: user.id,
      role: user.role,
    });

    return {
      success: true,
      message: "Article published successfully.",
    };
  } catch (error) {
    const normalizedError = normalizeError(error, ErrorResource.ARTICLE);

    return {
      success: false,
      message: normalizedError.message,
    };
  }
}
export async function updateArticleStatusAction(
  articleId: string,
  status: "DRAFT" | "PUBLISHED",
) {
  try {
    const user = await requireAuth();
    const parsed = updateArticleStatusSchema.safeParse({
      articleId,
      status,
    });

    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid article status.",
      };
    }

    const article = await articleService.updateArticleStatus(
      {
        articleId: parsed.data.articleId,
        status: parsed.data.status,
      },
      {
        id: user.id,
        role: user.role,
      },
    );

    return {
      success: true,
      message:
        status === "PUBLISHED"
          ? "Article published successfully."
          : "Article moved back to draft.",
      article,
    };
  } catch (error) {
    const normalizedError = normalizeError(error, ErrorResource.ARTICLE);
    return {
      success: false,
      message: normalizedError.message,
    };
  }
}
export async function unpublishArticleAction(articleId: string) {
  try {
    const user = await requireAuth();

    if (user.role !== "ADMIN") {
      return {
        success: false,
        message: "Only administrators can unpublish articles.",
      };
    }

    await articleService.unpublishArticle(articleId, {
      id: user.id,
      role: user.role,
    });

    return {
      success: true,
      message: "Article moved back to draft.",
    };
  } catch (error) {
    const normalizedError = normalizeError(error, ErrorResource.ARTICLE);

    return {
      success: false,
      message: normalizedError.message,
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

export async function updateArticleFeaturesAction(
  _previousState: UpdateArticleFeaturesState,
  formData: FormData,
): Promise<UpdateArticleFeaturesState> {
  try {
    const user = await requireAuth();
    const articleId = formData.get("articleId");
    const result = updateArticleFeatureSchema.safeParse({
      allowLikes:
        formData.get("allowLikes") !== null
          ? formData.get("allowLikes") === "true"
          : undefined,

      allowComments:
        formData.get("allowComments") !== null
          ? formData.get("allowComments") === "true"
          : undefined,

      allowShares:
        formData.get("allowShares") !== null
          ? formData.get("allowShares") === "true"
          : undefined,
    });

    if (!articleId || typeof articleId !== "string") {
      return {
        success: false,
        error: {
          code: "VALIDATION",
          message: "Article ID is required.",
          resource: ErrorResource.ARTICLE,
        },
      };
    }

    if (!result.success) {
      return {
        success: false,
        error: {
          code: "VALIDATION",
          message:
            result.error.issues[0]?.message ?? "Invalid article feature data.",
          resource: ErrorResource.ARTICLE,
        },
      };
    }

    const article = await articleService.updateArticlesFeatures(
      articleId,
      result.data,
      user,
    );
    return {
      success: true,
      message: "Article features updated successfully.",
      data: {
        article,
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
export async function toggleArticleLikeAction(
  _previousState: LikeArticleState,
  formData: FormData,
): Promise<LikeArticleState> {
  try {
    const articleId = formData.get("articleId");

    if (typeof articleId !== "string" || !articleId.trim()) {
      return {
        success: false,
        error: {
          code: "VALIDATION",
          message: "Article ID is required.",
          resource: ErrorResource.ARTICLE,
        },
      };
    }
    const user = await requireAuth();
    const result = await articleService.toggleLike(articleId, user);

    return {
      success: true,
      message: result.liked ? "Article liked." : "Article unliked.",
      data: {
        liked: result.liked,
        likeCount: result.likeCount,
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
export async function createCommentAction(
  _previousState: CreateCommentState,
  formData: FormData,
): Promise<CreateCommentState> {
  try {
    const user = await requireAuth();

    const result = createCommentSchema.safeParse({
      articleId: formData.get("articleId"),
      content: formData.get("content"),
    });

    if (!result.success) {
      return {
        success: false,
        error: {
          code: "VALIDATION",
          message: result.error.issues[0]?.message ?? "Invalid comment data.",
          resource: ErrorResource.COMMENT,
        },
      };
    }
    const comment = await articleService.createComment(result.data, user);
    return {
      success: true,
      message: "Comment added successfully.",
      data: {
        comment,
      },
    };
  } catch (error) {
    const appError = normalizeError(error, ErrorResource.COMMENT);

    return {
      success: false,
      error: handleError(appError),
    };
  }
}
