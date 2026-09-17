import { verifyPassword } from "@/lib/auth/authLib";
import { Errors } from "@/lib/errors/errors";
import { ErrorResource } from "@/lib/errors/errors-resource";
import prisma from "@/lib/prisma";

interface LoginServiceInput {
  email: string;
  password: string;
}
class AuthService {
  async login({ email, password }: LoginServiceInput) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user || !user.password) {
      throw Errors.unauthorized(
        "Invalid email or password.",
        ErrorResource.AUTH,
      );
    }
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw Errors.unauthorized(
        "Invalid email or password.",
        ErrorResource.AUTH,
      );
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}

export const authService = new AuthService();
