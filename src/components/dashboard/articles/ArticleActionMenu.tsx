"use client";

import { useEffect, useRef, useState } from "react";
import { Edit, Eye, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

interface ArticleActionsMenuProps {
  articleId: string;
  articleSlug: string;
  articleTitle: string;
  canEdit?: boolean;
}

export default function ArticleActionsMenu({
  articleId,
  articleSlug,
  articleTitle,
  canEdit = false,
}: ArticleActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleView = () => {
    setOpen(false);
    router.push(`/dashboard/articles/${articleId}`);
  };

  const handleEdit = () => {
    setOpen(false);
    router.push(`/dashboard/articles/${articleId}/edit`);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className={[
          "inline-flex size-8 items-center justify-center rounded-lg",
          "border border-slate-200 text-muted-foreground",
          "transition-colors hover:bg-slate-100 hover:text-foreground",
          "dark:border-slate-700 dark:hover:bg-slate-800",
          open && "bg-slate-100 text-foreground dark:bg-slate-800",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label={`More actions for ${articleTitle}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
          role="menu"
        >
          {/* View */}
          <button
            type="button"
            onClick={handleView}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            role="menuitem"
          >
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            <span>View article</span>
          </button>

          {/* Edit */}
          {canEdit && (
            <button
              type="button"
              onClick={handleEdit}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              role="menuitem"
            >
              <Edit className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Edit article</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
