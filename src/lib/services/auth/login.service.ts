import { verifyPassword } from "@/lib/auth/authLib";
import { Errors } from "@/lib/errors/errors";
import { ErrorResource } from "@/lib/errors/errors-resource";
import prisma from "@/lib/prisma";
import { MOCK_USERS } from "@/lib/mock-data";
import { UserRole } from "@/generated/prisma/enums";

interface LoginServiceInput {
  email: string;
  password?: string;
}

class AuthService {
  async login({ email, password }: LoginServiceInput) {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check Mock Users First (Allows frictionless local UI testing without DB)
    const mockUserMap: Record<string, { id: string; name: string; email: string; role: UserRole }> = {
      "admin@gmail.com": {
        id: "usr-admin-1",
        name: "Alexander Vance",
        email: "admin@gmail.com",
        role: UserRole.ADMIN,
      },
      "alexander.vance@newsportal.com": {
        id: "usr-admin-1",
        name: "Alexander Vance",
        email: "alexander.vance@newsportal.com",
        role: UserRole.ADMIN,
      },
      "author@gmail.com": {
        id: "usr-author-1",
        name: "Sophia Chen",
        email: "author@gmail.com",
        role: UserRole.AUTHOR,
      },
      "sophia.chen@chronicle.org": {
        id: "usr-author-1",
        name: "Sophia Chen",
        email: "sophia.chen@chronicle.org",
        role: UserRole.AUTHOR,
      },
      "member@gmail.com": {
        id: "usr-member-1",
        name: "Liam O'Connor",
        email: "member@gmail.com",
        role: UserRole.MEMBER,
      },
      "liam.reader@gmail.com": {
        id: "usr-member-1",
        name: "Liam O'Connor",
        email: "liam.reader@gmail.com",
        role: UserRole.MEMBER,
      },
    };

    if (mockUserMap[normalizedEmail]) {
      return mockUserMap[normalizedEmail];
    }

    // Also check MOCK_USERS list
    const foundMock = MOCK_USERS.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (foundMock) {
      return {
        id: foundMock.id,
        name: foundMock.name,
        email: foundMock.email,
        role: foundMock.role as UserRole,
      };
    }

    // 2. Fallback to Database Query if available
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

      if (user && user.password && password) {
        const isPasswordValid = await verifyPassword(password, user.password);
        if (isPasswordValid) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
      }
    } catch (dbError) {
      console.warn("Database offline, using mock authentication fallback:", dbError);
    }

    // If none matched
    throw Errors.unauthorized(
      "Invalid credentials. Use admin@gmail.com, author@gmail.com, or member@gmail.com",
      ErrorResource.AUTH,
    );
  }
}

export const authService = new AuthService();
