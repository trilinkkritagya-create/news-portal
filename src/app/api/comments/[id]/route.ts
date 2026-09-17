import { NextRequest, NextResponse } from "next/server";
import { ErrorResource } from "@/lib/errors/errors-resource";
import { handleError } from "@/lib/errors/handleError";
import { normalizeError } from "@/lib/errors/normalizeError";
import { requireAuth } from "@/lib/auth/authLib";
import prisma from "@/lib/prisma";
import { UserRole } from "@/generated/prisma/enums";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
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
            message: "Comment ID is required.",
            resource: ErrorResource.COMMENT,
          },
        },
        { status: 400 },
      );
    }

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        article: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Comment not found.",
            resource: ErrorResource.COMMENT,
          },
        },
        { status: 404 },
      );
    }

    // Only Admin, the article's author, or the comment owner can delete
    const isOwner = comment.userId === user.id;
    const isArticleAuthor = comment.article.authorId === user.id;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isArticleAuthor && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "You do not have permission to delete this comment.",
            resource: ErrorResource.COMMENT,
          },
        },
        { status: 403 },
      );
    }

    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Comment deleted successfully.",
        data: { id },
      },
      { status: 200 },
    );
  } catch (error) {
    const appError = normalizeError(error, ErrorResource.COMMENT);

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
