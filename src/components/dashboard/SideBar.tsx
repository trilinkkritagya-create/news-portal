"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserRole } from "@/generated/prisma/enums";
import Logout from "../ui/Logout";

interface SideBarProps {
  role?: UserRole;
}

const SideBar = ({ role }: SideBarProps) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="border-b border-gray-200 px-6 py-5">
        <Link href="/dashboard" className="text-xl font-bold text-gray-900">
          News Portal
        </Link>

        <p className="mt-1 text-xs text-gray-500">
          {role === UserRole.ADMIN ? "Administrator" : "Author"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5">
        <SidebarItem
          href="/dashboard"
          label="Overview"
          active={isActive("/dashboard")}
        />

        <SidebarItem
          href="/dashboard/articles"
          label="Articles"
          active={isActive("/dashboard/articles")}
        />

        {/* Admin + Author */}
        <SidebarItem
          href="/dashboard/articles/create"
          label="Create Article"
          active={isActive("/dashboard/articles/create")}
        />

        {/* Admin only */}
        {role === UserRole.ADMIN && (
          <>
            <SidebarItem
              href="/dashboard/comments"
              label="Comments"
              active={isActive("/dashboard/comments")}
            />

            <SidebarItem
              href="/dashboard/users"
              label="Users"
              active={isActive("/dashboard/users")}
            />
          </>
        )}

        {/* Author only */}
        {role === UserRole.AUTHOR && (
          <SidebarItem
            href="/dashboard/my-articles"
            label="My Articles"
            active={isActive("/dashboard/my-articles")}
          />
        )}

        <SidebarItem
          href="/dashboard/profile"
          label="Profile"
          active={isActive("/dashboard/profile")}
        />
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-200 p-3">
        <Logout />
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  href: string;
  label: string;
  active: boolean;
}

const SidebarItem = ({ href, label, active }: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-gray-900 text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {label}
    </Link>
  );
};

export default SideBar;
