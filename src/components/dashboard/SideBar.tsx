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
  Radio,
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

function SidebarContent({ role, user, isMobile, onClose }: SidebarContentProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const navItems: NavItem[] = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
    },
  ];

  if (role !== UserRole.MEMBER) {
    navItems.push({
      href: "/dashboard/articles",
      label: "Articles",
      icon: FileText,
    });
  }

  if (role === UserRole.ADMIN) {
    navItems.push(
      {
        href: "/dashboard/comments",
        label: "Comments",
        icon: MessageSquare,
        badge: "14",
        badgeType: "default",
      },
      {
        href: "/dashboard/users",
        label: "Users",
        icon: Users,
      }
    );
  }

  if (role === UserRole.AUTHOR) {
    navItems.push({
      href: "/dashboard/my-articles",
      label: "My Articles",
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
      }
    );
  }

  navItems.push({
    href: "/dashboard/profile",
    label: "Profile",
    icon: User,
  });

  const roleTitle =
    role === UserRole.ADMIN
      ? "Administrator"
      : role === UserRole.AUTHOR
        ? "Author"
        : "Member";

  const userInitial = (
    user?.name?.[0] ||
    user?.email?.[0] ||
    "A"
  ).toUpperCase();

  return (
    <div className="flex h-full flex-col justify-between bg-sidebar text-foreground select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 shrink-0 bg-card">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <Link
                href="/dashboard"
                onClick={onClose}
                className="font-serif font-bold text-base text-foreground tracking-tight leading-tight block hover:text-primary transition-colors"
              >
                News Portal
              </Link>
              <span className="inline-block mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 tracking-wider uppercase font-mono">
                {roleTitle}
              </span>
            </div>
          </div>

          {/* Close button on mobile/tablet drawer */}
          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-8 items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none cursor-pointer transition-colors"
              aria-label="Close sidebar"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 p-3">
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

        {/* Desktop Wire Feed Stream Status Widget */}
        {!isMobile && (
          <div className="mx-3 mt-2 rounded-lg border border-border bg-card p-3 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-foreground">
                Wire Feed
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                SYNCED
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground truncate font-mono">
              AP, Reuters, Bloomberg live
            </div>
          </div>
        )}

        {/* Mobile / Tablet Newsroom Notice */}
        {isMobile && (
          <div className="mx-3 mt-2 rounded-lg border border-border bg-card p-3 shadow-2xs">
            <div className="flex items-center gap-1.5 mb-1 text-red-600 dark:text-red-400">
              <Radio className="h-3.5 w-3.5" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                Newsroom Wire
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              AP &amp; Reuters terminal live sync active. All economic desk dispatches queued.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Footer: User Identity & Logout */}
      <div className="border-t border-border bg-card/60 p-4 shrink-0 space-y-2">
        <div className="flex items-center gap-3 px-1 py-1 rounded-lg">
          <Avatar className="size-9 shrink-0 ring-1 ring-border">
            {user?.image && (
              <AvatarImage src={user.image} alt={user?.name || "User"} />
            )}
            <AvatarFallback className="bg-[#1e3a8a] text-white font-semibold text-xs">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-xs font-semibold text-foreground truncate">
              {user?.name || "Eleanor Vance"}
            </p>
            <p className="text-[11px] font-mono text-muted-foreground truncate">
              {user?.email || "e.vance@newsportal.com"}
            </p>
          </div>
        </div>

        <form action={logoutAction} className="pt-1">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-200 dark:hover:border-red-900/40"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </div>
  );
}

const SideBar = ({ role, user }: SideBarProps) => {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* 1. Mobile & Tablet Drawer */}
      <div className="lg:hidden">
        {isOpen && (
          <>
            <div
              onClick={close}
              className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
              aria-hidden="true"
            />
            <aside className="fixed inset-y-0 left-0 z-50 flex h-full w-72 max-w-[85vw] flex-col border-r border-border bg-sidebar shadow-2xl select-none animate-in slide-in-from-left duration-200">
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

      {/* 2. Desktop Permanent Sidebar */}
      <aside className="hidden lg:flex h-screen w-64 flex-col border-r border-border bg-sidebar select-none shrink-0 sticky top-0">
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
      className={`group flex items-center justify-between rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all ${
        active
          ? "bg-[#0d1527] text-white shadow-xs dark:bg-white dark:text-[#0d1527]"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`size-4.5 shrink-0 transition-colors ${
            active
              ? "text-white dark:text-[#0d1527]"
              : "text-muted-foreground group-hover:text-foreground"
          }`}
        />
        <span>{label}</span>
      </div>

      {badge && (
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono transition-colors ${
            active
              ? "bg-slate-800 text-slate-200 dark:bg-slate-200 dark:text-slate-800"
              : badgeType === "alert"
                ? "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400"
                : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
};

export default SideBar;
