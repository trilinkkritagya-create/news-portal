import { NextRequest, NextResponse } from "next/server";
import { ErrorResource } from "@/lib/errors/errors-resource";
import { handleError } from "@/lib/errors/handleError";
import { normalizeError } from "@/lib/errors/normalizeError";
import { updateArticleFeatureSchema } from "@/lib/validation/article-schema";
import { articleService } from "@/lib/services/article/article.service";
import { requireAuth } from "@/lib/auth/authLib";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const body = await request.json();
    console.log(body, "is boady");

    const result = updateArticleFeatureSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION",
            message:
              result.error.issues[0]?.message ??
              "Invalid article feature data.",
            resource: ErrorResource.ARTICLE,
          },
        },
        { status: 400 },
      );
    }

    const article = await articleService.updateArticlesFeatures(
      id,
      result.data,
      user,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Article features updated successfully.",
        data: {
          article,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update article freatue error", error);
    const appError = normalizeError(error, ErrorResource.ARTICLE);

    const handledError = handleError(appError);

    return NextResponse.json(
      {
        success: false,
        error: handledError,
      },
      {
        status: getStatusCode(appError),
      },
    );
  }
}

function getStatusCode(error: { code?: string }) {
  switch (error.code) {
    case "UNAUTHORIZED":
      return 401;

    case "FORBIDDEN":
      return 403;

    case "NOT_FOUND":
      return 404;

    case "VALIDATION":
      return 400;

    default:
      return 500;
  }
}
