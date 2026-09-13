import { NextRequest, NextResponse } from "next/server";

import { normalizeError } from "@/lib/errors/normalizeError";
import { handleError } from "@/lib/errors/handleError";
import { ErrorResource } from "@/lib/errors/errors-resource";
import { authService } from "@/lib/services/auth/login.service";
import { loginSchema } from "@/lib/validation/auth-schema";
import { createSession } from "@/lib/auth/authLib";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION",
            message: result.error.issues[0]?.message ?? "Invalid input.",
            resource: ErrorResource.AUTH,
          },
        },
        { status: 400 },
      );
    }

    const user = await authService.login(result.data);

    await createSession({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        data: {
          user,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    const appError = normalizeError(error, ErrorResource.AUTH);

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

function getStatusCode(error: { statusCode?: number }) {
  return error.statusCode ?? 500;
}
