import { Megaphone, ArrowRight } from "lucide-react";

export default function BureauDirectives() {
  return (
    <div className="bg-card border border-[#E2E8F0] dark:border-slate-800 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#E2E8F0] dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-[#881337] dark:text-rose-400" />
          <h4 className="font-serif font-bold text-sm text-foreground">
            Bureau Directives
          </h4>
        </div>
        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
      </div>

      {/* Directives List */}
      <div className="space-y-2.5">
        {/* Directive 1: Priority 1 (Red) */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 border-l-2 border-red-600 rounded-r text-xs">
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-mono font-semibold text-red-700 dark:text-red-400 text-[10px] uppercase tracking-wider">
              Priority 1
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              14:00 EST
            </span>
          </div>
          <p className="font-serif font-bold text-foreground leading-snug text-xs">
            Election Special Coverage Deadline
          </p>
          <p className="text-muted-foreground text-[11px] mt-0.5 font-sans">
            Primary infographics lock required by art direction.
          </p>
        </div>

        {/* Directive 2: Style Guide (Burgundy) */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 border-l-2 border-[#881337] rounded-r text-xs">
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-mono font-semibold text-[#881337] dark:text-rose-400 text-[10px] uppercase tracking-wider">
              Style Guide
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              v3.2
            </span>
          </div>
          <p className="font-serif font-bold text-foreground leading-snug text-xs">
            Editorial Fact-Check Guidelines
          </p>
          <p className="text-muted-foreground text-[11px] mt-0.5 font-sans">
            Manuscripts marked Draft require double-blind review before publishing.
          </p>
        </div>

        {/* Directive 3: Wire Desk (Emerald) */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 border-l-2 border-emerald-600 rounded-r text-xs">
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 text-[10px] uppercase tracking-wider">
              Wire Desk
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              Active
            </span>
          </div>
          <p className="font-serif font-bold text-foreground leading-snug text-xs">
            Syndication Wire Sync
          </p>
          <p className="text-muted-foreground text-[11px] mt-0.5 font-sans">
            AP &amp; Reuters terminal live feeds connected and streaming.
          </p>
        </div>
      </div>

      {/* Action Link */}
      <button
        type="button"
        className="w-full mt-3 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-muted text-xs font-medium text-foreground rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
      >
        <span>View All Directives</span>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    </div>
  );
}
