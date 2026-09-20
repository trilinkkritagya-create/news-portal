"use client";

import { useActionState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  updateArticleFeaturesAction,
  UpdateArticleFeaturesState,
} from "@/lib/actions/article/article.action";
import Tooltip from "@/components/ui/tooltip";

interface FeatureButtonProps {
  articleId: string;
  feature: "allowLikes" | "allowComments" | "allowShares";
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
  disabled?: boolean;
}

const initialUpdateArticleFeaturesState: UpdateArticleFeaturesState = {
  success: false,
};

export default function FeatureButton({
  articleId,
  feature,
  label,
  icon,
  enabled,
  disabled = false,
}: FeatureButtonProps) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    updateArticleFeaturesAction,
    initialUpdateArticleFeaturesState,
  );

  const currentEnabled =
    typeof state.data?.article === "boolean" ? state.data.article : enabled;

  useEffect(() => {
    if (state.success) {
      toast.success(state.message ?? `${label} updated successfully.`);

      router.refresh();
      return;
    }

    if (state.error) {
      toast.error(state.error.message);
    }
  }, [state, label, router]);

  const tooltipContent = currentEnabled
    ? `Disable ${label}`
    : `Enable ${label}`;

  return (
    <form action={formAction}>
      <input type="hidden" name="articleId" value={articleId} />
      <input type="hidden" name={feature} value={String(!currentEnabled)} />
      <Tooltip content={tooltipContent}>
        <button
          type="submit"
          disabled={disabled || isPending}
          title={tooltipContent}
          aria-label={tooltipContent}
          className={[
            "inline-flex size-8 items-center justify-center rounded-lg border transition-colors",
            currentEnabled
              ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400"
              : "border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400",
            disabled
              ? "cursor-not-allowed opacity-70"
              : "cursor-pointer hover:opacity-80",
            isPending && "cursor-wait opacity-70",
          ].join(" ")}
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : icon}
        </button>
      </Tooltip>
    </form>
  );
}
