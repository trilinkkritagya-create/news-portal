import { NextRequest, NextResponse } from "next/server";
import { ErrorResource } from "@/lib/errors/errors-resource";
import { handleError } from "@/lib/errors/handleError";
import { normalizeError } from "@/lib/errors/normalizeError";
import { updateArticleSchema } from "@/lib/validation/article-schema";
import { requireAuth } from "@/lib/auth/authLib";
import { articleService } from "@/lib/services/article/article.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION",
            message: "Article ID is required.",
            resource: ErrorResource.ARTICLE,
          },
        },
        { status: 400 },
      );
    }

    const article = await articleService.getArticleById(id);

    return NextResponse.json(
      {
        success: true,
        data: {
          article,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    const appError = normalizeError(error, ErrorResource.ARTICLE);

    return NextResponse.json(
      {
        success: false,
        error: handleError(appError),
      },
      {
        status: appError.statusCode ?? 500,
      },
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION",
            message: "Article ID is required.",
            resource: ErrorResource.ARTICLE,
          },
        },
        { status: 400 },
      );
    }
    const body = await request.json();
    const result = updateArticleSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION",
            message: result.error.issues[0]?.message ?? "Invalid article data.",
            resource: ErrorResource.ARTICLE,
          },
        },
        { status: 400 },
      );
    }

    const article = await articleService.updateArticle(id, result.data, user);

    return NextResponse.json(
      {
        success: true,
        message: "Article updated successfully.",
        data: {
          article: {
            id: article.id,
            title: article.title,
            content: article.content,
            excerpt: article.excerpt,
            slug: article.slug,
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    const appError = normalizeError(error, ErrorResource.ARTICLE);

    return NextResponse.json(
      {
        success: false,
        error: handleError(appError),
      },
      {
        status: appError.statusCode ?? 500,
      },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION",
            message: "Article ID is required.",
            resource: ErrorResource.ARTICLE,
          },
        },
        { status: 400 },
      );
    }

    const result = await articleService.deleteArticle(id, user);

    return NextResponse.json(
      {
        success: true,
        message: "Article deleted successfully.",
        data: {
          article: result,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    const appError = normalizeError(error, ErrorResource.ARTICLE);

    return NextResponse.json(
      {
        success: false,
        error: handleError(appError),
      },
      {
        status: appError.statusCode ?? 500,
      },
    );
  }
}
