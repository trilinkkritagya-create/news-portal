import { NextRequest, NextResponse } from "next/server";

import { UserRole } from "@/generated/prisma/enums";
import { verifyAccessToken } from "@/lib/auth/authLib";

const ACCESS_TOKEN_COOKIE = "access_token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  const session = token ? await verifyAccessToken(token) : null;

  const isLoginRoute = pathname === "/login";
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isDashboardRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (session.role === UserRole.MEMBER) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (session.role === UserRole.ADMIN || session.role === UserRole.AUTHOR) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isLoginRoute && session) {
    if (session.role === UserRole.ADMIN || session.role === UserRole.AUTHOR) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (session.role === UserRole.MEMBER) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
