"use client";

import { logoutAction } from "@/lib/actions/auth/login-action";
import { LogOut } from "lucide-react";

const Logout = () => {
  return (
    <form action={logoutAction} className="w-full">
      <button
        type="submit"
        className="group flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/25 cursor-pointer"
      >
        <LogOut className="h-4.5 w-4.5 shrink-0 text-red-500 transition-colors group-hover:text-red-600 dark:text-red-400" />
        <span>Logout</span>
      </button>
    </form>
  );
};

export default Logout;
