"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  sideOffset?: number;
  className?: string;
  disabled?: boolean;
}

const positionStyles: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2",
  bottom: "top-full left-1/2 -translate-x-1/2",
  left: "right-full top-1/2 -translate-y-1/2",
  right: "left-full top-1/2 -translate-y-1/2",
};

const arrowStyles: Record<TooltipPosition, string> = {
  top: "left-1/2 top-full -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent",
  bottom:
    "left-1/2 bottom-full -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent",
  right:
    "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent",
};

export default function Tooltip({
  children,
  content,
  position = "top",
  sideOffset = 8,
  className,
  disabled = false,
}: TooltipProps) {
  if (disabled) {
    return <>{children}</>;
  }

  const offsetStyle = {
    top: { marginBottom: sideOffset },
    bottom: { marginTop: sideOffset },
    left: { marginRight: sideOffset },
    right: { marginLeft: sideOffset },
  };

  return (
    <span className="group relative inline-block w-fit">
      {children}

      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-[2147483647]",
          "w-max max-w-xs",
          "rounded-md px-2.5 py-1.5",
          "bg-black text-white",
          "border border-white/10",
          "shadow-lg shadow-black/20",
          "text-[11px] font-medium leading-tight",
          "whitespace-nowrap",
          "invisible opacity-0",
          "group-hover:visible group-hover:opacity-100",
          "transition-opacity duration-150 ease-out",
          positionStyles[position],
          className,
        )}
        style={offsetStyle[position]}
      >
        {content}

        <span
          className={cn(
            "absolute h-0 w-0",
            "border-[4px] border-black",
            arrowStyles[position],
          )}
        />
      </span>
    </span>
  );
}
