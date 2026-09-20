import React from "react";

interface LoadingStateProps {
  title: string;
  description?: string;
  color?: string;
}

const LoadingState = ({
  title,
  description = "Please wait...",
  color = "#881337",
}: LoadingStateProps) => {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div
          className="h-10 w-10 animate-spin rounded-full border-[3px] border-muted"
          style={{
            borderTopColor: color,
          }}
          role="status"
          aria-label={title}
        />

        {/* Loading text */}
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-sm font-medium text-foreground">{title}</p>

          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
