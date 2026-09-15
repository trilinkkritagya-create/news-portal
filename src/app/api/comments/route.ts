import { NextRequest, NextResponse } from "next/server";

import { ErrorResource } from "@/lib/errors/errors-resource";
import { handleError } from "@/lib/errors/handleError";
import { normalizeError } from "@/lib/errors/normalizeError";
import { requireAuth } from "@/lib/auth/authLib";
import { createCommentSchema } from "@/lib/validation/article-schema";
import { articleService } from "@/lib/services/article/article.service";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();

    const result = createCommentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION",
            message: result.error.issues[0]?.message ?? "Invalid comment data.",
            resource: ErrorResource.COMMENT,
          },
        },
        { status: 400 },
      );
    }

    const comment = await articleService.createComment(result.data, user);

    return NextResponse.json(
      {
        success: true,
        message: "Comment added successfully.",
        data: {
          comment,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const appError = normalizeError(error, ErrorResource.COMMENT);

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
