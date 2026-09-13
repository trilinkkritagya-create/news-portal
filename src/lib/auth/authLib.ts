import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { UserRole } from "@/generated/prisma/enums";
import bcrypt from "bcryptjs";
import prisma from "../prisma";
import { Errors } from "../errors/errors";
import { ErrorResource } from "../errors/errors-resource";
import { MOCK_USERS } from "../mock-data";

export type SessionPayload = {
  id: string;
  email: string;
  role: UserRole;
};

const JWT_SECRET = process.env.JWT_SECRET || "news-portal-broadsheet-fallback-secret-2026";
const key = new TextEncoder().encode(JWT_SECRET);
const SALT_ROUNDS = 10;
const ACCESS_TOKEN_COOKIE = "access_token";

const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export async function signAccessToken(
  payload: SessionPayload,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);
}

export async function verifyAccessToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.id !== "string" ||
      typeof payload.email !== "string" ||
      !Object.values(UserRole).includes(payload.role as UserRole)
    ) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await signAccessToken(payload);

  const cookieStore = await cookies();

  cookieStore.set({
    name: ACCESS_TOKEN_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifyAccessToken(token);
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });

    if (user) {
      return user;
    }
  } catch {
    // Database offline or mock session
  }

  // Fallback to mock user
  const mockUser = MOCK_USERS.find(
    (u) => u.id === session.id || u.email.toLowerCase() === session.email.toLowerCase(),
  );

  return {
    id: session.id,
    name: mockUser?.name ?? "Editorial User",
    email: session.email,
    image: mockUser?.image ?? null,
    role: session.role,
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw Errors.unauthorized("Authentication required.", ErrorResource.AUTH);
  }

  return user;
}
