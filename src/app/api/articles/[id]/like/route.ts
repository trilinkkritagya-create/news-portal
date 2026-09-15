import { requireAuth } from "@/lib/auth/authLib";
import { ErrorResource } from "@/lib/errors/errors-resource";
import { handleError } from "@/lib/errors/handleError";
import { normalizeError } from "@/lib/errors/normalizeError";
import { articleService } from "@/lib/services/article/article.service";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();

    const { id: articleId } = await params;

    const result = await articleService.toggleLike(articleId, user);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const appError = normalizeError(error, ErrorResource.ARTICLE);

    return NextResponse.json(
      {
        success: false,
        error: handleError(appError),
      },
      {
        status: appError.statusCode,
      },
    );
  }
}
