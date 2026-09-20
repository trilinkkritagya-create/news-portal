"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  BookOpen,
  Bookmark,
  History,
  User,
  X,
  LogOut,
  Newspaper,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { UserRole } from "@/generated/prisma/enums";
import { useSidebar } from "./SidebarContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutAction } from "@/lib/actions/auth/login-action";

interface UserInfo {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface SideBarProps {
  role?: UserRole;
  user?: UserInfo | null;
}

interface SidebarContentProps {
  role?: UserRole;
  user?: UserInfo | null;
  isMobile?: boolean;
  onClose?: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: "default" | "alert";
}

function SidebarContent({
  role,
  user,
  isMobile,
  onClose,
}: SidebarContentProps) {
  const pathname = usePathname();
  const { customSidebarContent } = useSidebar();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const navItems: NavItem[] = [
    {
      href: "/dashboard",
      label: "Overviews",
      icon: LayoutDashboard,
    },
  ];

  if (role !== UserRole.MEMBER) {
    navItems.push({
      href: "/dashboard/articles",
      label: "Article",
      icon: FileText,
    });
  }

  if (role === UserRole.ADMIN) {
    navItems.push(
      {
        href: "/dashboard/comments",
        label: "Comments",
        icon: MessageSquare,
        badge: "2",
        badgeType: "alert",
      },
      {
        href: "/dashboard/users",
        label: "Users",
        icon: Users,
      },
    );
  }

  if (role === UserRole.AUTHOR) {
    navItems.push({
      href: "/dashboard/my-articles",
      label: "My Dispatches",
      icon: BookOpen,
    });
  }

  if (role === UserRole.MEMBER) {
    navItems.push(
      {
        href: "/dashboard#saved-articles",
        label: "Saved Stories",
        icon: Bookmark,
      },
      {
        href: "/dashboard#reading-history",
        label: "Reading History",
        icon: History,
      },
    );
  }

  navItems.push({
    href: "/dashboard/profile",
    label: "Profile",
    icon: User,
  });

  const roleTitle =
    role === UserRole.ADMIN
      ? "Chief Discourse Editor"
      : role === UserRole.AUTHOR
        ? "Staff Columnist"
        : "Verified Reader";

  const userInitial = (
    user?.name?.[0] ||
    user?.email?.[0] ||
    "E"
  ).toUpperCase();

  return (
    <div className="flex h-full flex-col justify-between bg-[#213145] text-white select-none overflow-hidden">
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        {/* Top Masthead Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-[#881337] text-white shadow-sm shrink-0">
              <Newspaper className="h-5 w-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <Link
                href="/dashboard"
                onClick={onClose}
                className="font-serif font-bold text-base text-white tracking-tight leading-tight block hover:text-[#ffd9dd] transition-colors truncate"
              >
                News Portal
              </Link>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#d3e4fe]/80 font-medium truncate">
                Editorial Operations
              </span>
            </div>
          </div>

          {/* Close button on mobile/tablet drawer */}
          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-8 items-center justify-center rounded p-1 text-[#cbdbf5] hover:bg-white/10 hover:text-white focus:outline-none cursor-pointer transition-colors"
              aria-label="Close sidebar"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="space-y-1 p-3 shrink-0">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              badge={item.badge}
              badgeType={item.badgeType}
              active={isActive(item.href)}
              onClick={onClose}
            />
          ))}
        </nav>

        {/* Custom Contextual Section for Mobile & Tablet (e.g. Filters) */}
        {isMobile && customSidebarContent && (
          <div className="px-3 py-2 border-t border-white/10 shrink-0">
            {customSidebarContent}
          </div>
        )}
      </div>

      {/* Bottom User Profile Footer */}
      <div className="border-t border-white/15 bg-black/15 p-3.5 shrink-0 space-y-2">
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="size-8.5 shrink-0 rounded border border-white/20">
              {user?.image ? (
                <AvatarImage src={user.image} alt={user?.name || "User"} />
              ) : (
                <AvatarImage
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Editorial User"
                />
              )}
              <AvatarFallback className="bg-[#881337] text-white font-semibold text-xs rounded">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-white truncate">
                {user?.name || roleTitle}
              </span>
              <span className="text-[10px] font-mono text-[#cbdbf5]/70 truncate">
                {user?.email || "mod-desk@newsportal.press"}
              </span>
            </div>
            {/* <p className="text-[11px] text-muted-foreground leading-snug">
              AP &amp; Reuters terminal live sync active. All economic desk
              dispatches queued.
            </p> */}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Link
              href="/dashboard/profile"
              onClick={onClose}
              className="text-[#cbdbf5] hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
              title="Editorial Settings"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Link>
            <form action={logoutAction} className="inline">
              <button
                type="submit"
                className="text-[#cbdbf5] hover:text-red-400 p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const SideBar = ({ role, user }: SideBarProps) => {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* 1. Mobile & Tablet Drawer */}
      <div className="xl:hidden">
        {isOpen && (
          <>
            <div
              onClick={close}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
              aria-hidden="true"
            />
            <aside className="fixed inset-y-0 left-0 z-50 flex h-full w-72 max-w-[85vw] flex-col border-r border-white/10 bg-[#213145] shadow-2xl select-none animate-in slide-in-from-left duration-200">
              <SidebarContent
                role={role}
                user={user}
                isMobile
                onClose={close}
              />
            </aside>
          </>
        )}
      </div>

      {/* 2. Desktop Permanent Sidebar (>= 1280px) */}
      <aside className="hidden xl:flex h-screen w-64 flex-col border-r border-white/10 bg-[#213145] select-none shrink-0 sticky top-0">
        <SidebarContent role={role} user={user} />
      </aside>
    </>
  );
};

interface SidebarItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: "default" | "alert";
  active: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  href,
  label,
  icon: Icon,
  badge,
  badgeType = "default",
  active,
  onClick,
}: SidebarItemProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group flex items-center justify-between rounded px-3 py-2.5 text-xs sm:text-[13px] transition-colors ${
        active
          ? "bg-[#881337] text-white font-semibold border-l-2 border-[#ffd9dd] shadow-sm"
          : "text-[#cbdbf5] hover:text-white hover:bg-white/10 font-normal"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`h-4 w-4 shrink-0 transition-colors ${
            active
              ? "text-white fill-white/20"
              : "text-[#cbdbf5] group-hover:text-white"
          }`}
        />
        <span>{label}</span>
      </div>

      {badge && (
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full font-mono transition-colors ${
            active
              ? "bg-[#640023] text-white"
              : badgeType === "alert"
                ? "bg-rose-500 text-white"
                : "bg-white/20 text-white"
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
};

export default SideBar;
