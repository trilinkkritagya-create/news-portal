import { NextRequest, NextResponse } from "next/server";
import { ErrorResource } from "@/lib/errors/errors-resource";
import { handleError } from "@/lib/errors/handleError";
import { normalizeError } from "@/lib/errors/normalizeError";
import { createArticleSchema } from "@/lib/validation/article-schema";
import { requireAuth } from "@/lib/auth/authLib";
import { articleService } from "@/lib/services/article/article.service";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const result = createArticleSchema.safeParse(body);
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
    const article = await articleService.createArticle(result.data, user);
    return NextResponse.json(
      {
        success: true,
        message: "Article created successfully.",
        data: {
          article,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
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
export async function GET() {
  try {
    const articles = await articleService.getAllArticle();
    return NextResponse.json(
      {
        success: true,
        data: {
          articles,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
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
