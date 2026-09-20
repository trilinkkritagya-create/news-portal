import { ArticleStatus } from "@/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ArticleStatusBadgeProps {
  status: ArticleStatus;
  className?: string;
}

const statusConfig: Record<
  ArticleStatus,
  {
    label: string;
    className: string;
    dotClassName: string;
    pingClassName: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
    dotClassName: "bg-amber-500",
    pingClassName: "bg-amber-400",
  },

  PUBLISHED: {
    label: "Published",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    dotClassName: "bg-emerald-500",
    pingClassName: "bg-emerald-400",
  },

  ARCHIVED: {
    label: "Archived",
    className:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700",
    dotClassName: "bg-slate-500",
    pingClassName: "bg-slate-400",
  },
};

export default function ArticleStatusBadge({
  status,
  className,
}: ArticleStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium",
        config.className,
        className,
      )}
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        {/* Ping animation */}
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
            config.pingClassName,
          )}
        />

        {/* Actual dot */}
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            config.dotClassName,
          )}
        />
      </span>
      {config.label}
    </Badge>
  );
}
