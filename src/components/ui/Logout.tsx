"use client";

import { logoutAction } from "@/lib/actions/auth/login-action";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogoutProps {
  className?: string;
}

const Logout = ({ className }: LogoutProps) => {
  return (
    <form action={logoutAction} className="w-full">
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className={
          className ||
          "group flex w-full items-center justify-start gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors h-8"
        }
      >
        <LogOut className="size-3.5 shrink-0 text-destructive transition-transform group-hover:-translate-x-0.5" />
        <span>Logout</span>
      </Button>
    </form>
  );
};

export default Logout;
