"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  SquarePen,
  MessageSquare,
  Users,
  BookOpen,
  Bookmark,
  History,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { UserRole } from "@/generated/prisma/enums";
import Logout from "../ui/Logout";
import { useSidebar } from "./SidebarContext";

interface SideBarProps {
  role?: UserRole;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

interface SidebarContentProps {
  role?: UserRole;
  isMobile?: boolean;
  onClose?: () => void;
}

function SidebarContent({ role, isMobile, onClose }: SidebarContentProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5 sm:py-6 shrink-0">
          <div>
            <Link
              href="/dashboard"
              onClick={onClose}
              className="text-2xl font-bold tracking-tight text-foreground block"
            >
              News Portal
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              {role === UserRole.ADMIN
                ? "Administrator"
                : role === UserRole.AUTHOR
                  ? "Author"
                  : "Member"}
            </p>
          </div>

          {/* Close button on mobile/tablet */}
          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 px-3 py-6">
          <SidebarItem
            href="/dashboard"
            label="Overview"
            icon={LayoutDashboard}
            active={isActive("/dashboard")}
            onClick={onClose}
          />

          {/* Admin & Author: Articles */}
          {role !== UserRole.MEMBER && (
            <SidebarItem
              href="/dashboard/articles"
              label="Articles"
              icon={FileText}
              active={isActive("/dashboard/articles")}
              onClick={onClose}
            />
          )}

          {/* Admin & Author: Create Article */}
          {role !== UserRole.MEMBER && (
            <SidebarItem
              href="/dashboard/articles/create"
              label="Create Article"
              icon={SquarePen}
              active={isActive("/dashboard/articles/create")}
              onClick={onClose}
            />
          )}

          {/* Admin only */}
          {role === UserRole.ADMIN && (
            <>
              <SidebarItem
                href="/dashboard/comments"
                label="Comments"
                icon={MessageSquare}
                active={isActive("/dashboard/comments")}
                onClick={onClose}
              />

              <SidebarItem
                href="/dashboard/users"
                label="Users"
                icon={Users}
                active={isActive("/dashboard/users")}
                onClick={onClose}
              />
            </>
          )}

          {/* Author only */}
          {role === UserRole.AUTHOR && (
            <SidebarItem
              href="/dashboard/my-articles"
              label="My Articles"
              icon={BookOpen}
              active={isActive("/dashboard/my-articles")}
              onClick={onClose}
            />
          )}

          {/* Member only */}
          {role === UserRole.MEMBER && (
            <>
              <SidebarItem
                href="/dashboard#saved-articles"
                label="Saved Stories"
                icon={Bookmark}
                active={false}
                onClick={onClose}
              />
              <SidebarItem
                href="/dashboard#reading-history"
                label="Reading History"
                icon={History}
                active={false}
                onClick={onClose}
              />
            </>
          )}

          <SidebarItem
            href="/dashboard/profile"
            label="Profile"
            icon={User}
            active={isActive("/dashboard/profile")}
            onClick={onClose}
          />
        </nav>
      </div>

      {/* Bottom Logout */}
      <div className="border-t border-border p-4 shrink-0">
        <Logout />
      </div>
    </div>
  );
}

const SideBar = ({ role }: SideBarProps) => {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* 1. Mobile & Tablet Drawer (Off-canvas, only opens when requested) */}
      <div className="lg:hidden">
        {isOpen && (
          <>
            <div
              onClick={close}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
              aria-hidden="true"
            />
            <aside className="fixed inset-y-0 left-0 z-50 flex h-full w-72 max-w-[85vw] flex-col border-r border-border bg-card shadow-2xl select-none animate-in slide-in-from-left duration-200">
              <SidebarContent role={role} isMobile onClose={close} />
            </aside>
          </>
        )}
      </div>

      {/* 2. Desktop Permanent Sidebar (In normal flex flow, side-by-side with content, static height) */}
      <aside className="hidden lg:flex h-screen w-64 flex-col border-r border-border bg-card select-none shrink-0 sticky top-0">
        <SidebarContent role={role} />
      </aside>
    </>
  );
};

interface SidebarItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: SidebarItemProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-[#0d1527] text-white font-semibold dark:bg-white dark:text-[#0d1527]"
          : "text-foreground/80 hover:bg-secondary hover:text-foreground"
      }`}
    >
      <Icon
        className={`h-4.5 w-4.5 shrink-0 transition-colors ${
          active
            ? "text-white dark:text-[#0d1527]"
            : "text-muted-foreground group-hover:text-foreground"
        }`}
      />
      <span>{label}</span>
    </Link>
  );
};

export default SideBar;
