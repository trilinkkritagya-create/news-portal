"use client";

import { logoutAction } from "@/lib/actions/auth/login-action";

const Logout = () => {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        Logout
      </button>
    </form>
  );
};

export default Logout;
