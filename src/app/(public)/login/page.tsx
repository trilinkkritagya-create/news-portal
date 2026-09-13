"use client";

import { loginAction, LoginState } from "@/lib/actions/auth/login-action";
import { useActionState, useState } from "react";
import Link from "next/link";

const initialState: LoginState = {
  success: false,
};

const LoginPage = () => {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleQuickLogin = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#fbfbfb] px-4 py-12 text-[#0f172a] font-sans antialiased">
      {/* Editorial Header Masthead */}
      <div className="mb-8 text-center">
        <div className="inline-block border-y border-[#0f172a] py-1 px-4 mb-3">
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#64748b]">
            Editorial Authentication • Vol. CXLII
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#0f172a]">
          The Chronicle
        </h1>
        <p className="mt-1 text-xs text-[#64748b]">
          Publishing Portal & Role-Based Newsroom Access
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md border border-[#e2e8f0] bg-white p-8 shadow-sm">
        <h2 className="font-serif text-xl font-semibold text-[#0f172a] mb-1">
          Sign In
        </h2>
        <p className="text-xs text-[#64748b] mb-6">
          Access your news desk, editorial reviews, or reader library.
        </p>

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-semibold tracking-wider uppercase text-[#0f172a]"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@gmail.com"
              autoComplete="email"
              required
              className="w-full rounded-sm border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none transition focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]"
            />
            {state.error?.resource === "AUTH" &&
              state.error.code === "VALIDATION" && (
                <p className="mt-1 text-xs text-red-600">
                  {state.error.message}
                </p>
              )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold tracking-wider uppercase text-[#0f172a]"
              >
                Password
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full rounded-sm border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none transition focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]"
            />
            {state.error && (
              <p role="alert" className="mt-2 text-xs font-medium text-red-600">
                {state.error.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-sm bg-[#1e3a8a] hover:bg-[#1e40af] px-4 py-2.5 text-sm font-semibold tracking-wide text-white transition disabled:opacity-60 cursor-pointer"
          >
            {isPending ? "Authenticating..." : "Sign In to Portal"}
          </button>
        </form>

        {/* Quick Mock Role Switcher / 1-Click Fill */}
        <div className="mt-6 border-t border-[#e2e8f0] pt-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] mb-3">
            ⚡ Quick Mock Login (1-Click Fill)
          </p>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@gmail.com", "admin123")}
              className="flex flex-col items-center justify-center p-2.5 rounded-sm border border-[#e2e8f0] bg-[#f8fafc] hover:border-[#1e3a8a] hover:bg-white transition text-center group cursor-pointer"
            >
              <span className="text-xs font-bold text-[#0f172a] group-hover:text-[#1e3a8a]">
                Admin
              </span>
              <span className="text-[10px] text-[#64748b] mt-0.5">Editor Chief</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("author@gmail.com", "author123")}
              className="flex flex-col items-center justify-center p-2.5 rounded-sm border border-[#e2e8f0] bg-[#f8fafc] hover:border-[#1e3a8a] hover:bg-white transition text-center group cursor-pointer"
            >
              <span className="text-xs font-bold text-[#0f172a] group-hover:text-[#1e3a8a]">
                Author
              </span>
              <span className="text-[10px] text-[#64748b] mt-0.5">Journalist</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("member@gmail.com", "member123")}
              className="flex flex-col items-center justify-center p-2.5 rounded-sm border border-[#e2e8f0] bg-[#f8fafc] hover:border-[#1e3a8a] hover:bg-white transition text-center group cursor-pointer"
            >
              <span className="text-xs font-bold text-[#0f172a] group-hover:text-[#1e3a8a]">
                Member
              </span>
              <span className="text-[10px] text-[#64748b] mt-0.5">Reader</span>
            </button>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-xs text-[#64748b] hover:text-[#1e3a8a] hover:underline"
          >
            ← Back to Frontpage
          </Link>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
