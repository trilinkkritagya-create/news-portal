"use client";

import { loginAction, LoginState } from "@/lib/actions/auth/login-action";
import { useActionState } from "react";

const initialState: LoginState = {
  success: false,
};

const LoginPage = () => {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <main className="flex min-h-screen items-center justify-center text-black bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">News Portal</h1>

          <p className="mt-2 text-sm text-gray-500">Sign in to continue</p>
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
              className="w-full text-black! rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />

            {/* Email error */}
            {state.error?.resource === "AUTH" &&
              state.error.code === "VALIDATION" && (
                <p className="mt-2 text-sm text-red-600">
                  {state.error.message}
                </p>
              )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />

            {/* Password / login error */}
            {state.error && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                {state.error.message}
              </p>
            )}
          </div>

          {/* Success */}
          {state.success && state.message && (
            <p role="status" className="text-sm text-green-600">
              {state.message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Development credentials */}
        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-600">Development login</p>

          <p className="mt-1 text-xs text-gray-500">
            Use one of your seeded users to test authentication.
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
