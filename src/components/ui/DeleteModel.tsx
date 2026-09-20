"use client";

import { useEffect } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface DeleteModelProps {
  open: boolean;
  title: string;
  description: string;
  itemName?: string;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export default function DeleteModel({
  open,
  title,
  description,
  itemName,
  onClose,
  onConfirm,
  loading = false,
}: DeleteModelProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, loading, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={!loading ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 py-4">
          <div className="flex items-start gap-3">
            {/* Warning Icon */}
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <AlertTriangle className="size-5" />
            </div>

            <div className="min-w-0">
              <h2
                id="delete-modal-title"
                className="text-sm font-semibold text-slate-900 dark:text-white"
              >
                {title}
              </h2>

              <p
                id="delete-modal-description"
                className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400"
              >
                {description}
              </p>
            </div>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-5">
          {itemName && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Item
              </p>

              <p className="mt-1 truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                {itemName}
              </p>
            </div>
          )}

          <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-slate-800/30">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex h-9 min-w-[90px] items-center justify-center gap-2 rounded-lg bg-red-600 px-3.5 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
