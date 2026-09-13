export default function BureauDirectives() {
  return (
    <div className="border border-border bg-secondary/30 p-5 rounded-lg space-y-3">
      <div className="flex items-center gap-2">
        <svg
          className="h-4 w-4 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
          Bureau Directives
        </h4>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Manuscripts marked as{" "}
        <span className="border border-opinion/30 bg-opinion/10 px-1 py-0.5 font-mono text-[10px] font-semibold text-opinion">
          DRAFT
        </span>{" "}
        must complete double-blind factual verification and desk clearance prior to live syndicate publishing.
      </p>

      <div className="flex items-center justify-between border-t border-border pt-3 font-mono text-[10px] text-muted-foreground">
        <span>Editorial Code v4.2</span>
        <span className="text-primary font-medium">Standards Compliant</span>
      </div>
    </div>
  );
}
