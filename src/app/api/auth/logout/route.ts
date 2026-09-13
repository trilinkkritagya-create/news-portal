import { logout } from "@/lib/auth/authLib";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await logout();
    return NextResponse.json(
      {
        success: true,
        message: "Logout successful.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("LOGOUT API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong.",
        },
      },
      { status: 500 },
    );
  }
}
