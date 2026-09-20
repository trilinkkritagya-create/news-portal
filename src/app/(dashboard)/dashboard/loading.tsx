export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div
          className="h-10 w-10 animate-spin rounded-full border-[3px] border-muted border-t-[#881337]"
          role="status"
          aria-label="Loading dashboard"
        />

        {/* Loading text */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-foreground">
            Loading overview
          </p>

          <p className="text-xs text-muted-foreground">
            Preparing your dashboard...
          </p>
        </div>
      </div>
    </div>
  );
}
