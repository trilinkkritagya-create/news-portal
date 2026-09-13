"use server";

import { redirect } from "next/navigation";

import { ErrorResource } from "@/lib/errors/errors-resource";
import { handleError } from "@/lib/errors/handleError";
import { normalizeError } from "@/lib/errors/normalizeError";
import { authService } from "@/lib/services/auth/login-services";
import { loginSchema } from "@/lib/validation/auth-schema";
import { createSession, logout } from "@/lib/auth/authLib";

export type LoginState = {
  success: boolean;
  message?: string;
  error?: {
    code: string;
    message: string;
    resource: string;
  };
  data?: {
    user: {
      id: string;
      name: string | null;
      email: string;
      role: string;
    };
  };
};
export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  let user;

  try {
    const result = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result.success) {
      return {
        success: false,
        error: {
          code: "VALIDATION",
          message: result.error.issues[0]?.message ?? "Invalid input.",
          resource: ErrorResource.AUTH,
        },
      };
    }

    user = await authService.login(result.data);

    await createSession({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("LOGIN ACTION ERROR:", error);

    const appError = normalizeError(error, ErrorResource.AUTH);

    return {
      success: false,
      error: handleError(appError),
    };
  }

  if (user.role === "ADMIN" || user.role === "AUTHOR") {
    redirect("/dashboard");
  }

  redirect("/");
}
export async function logoutAction() {
  await logout();
  redirect("/login");
}
