// import { CategoryDistributionItem } from "@/lib/dashboard/get-dashboard-data";

import { getCategoryColor } from "@/lib/constants/extra";
import { CategoryDistributionItem } from "@/lib/types/dashboard.types";

interface CategoryBreakdownProps {
  categories: CategoryDistributionItem[];
}

export default function CategoryBreakdown({
  categories,
}: CategoryBreakdownProps) {
  console.log(categories, "is categories");
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-border">
        <h4 className="font-serif font-bold text-sm text-foreground">
          Category Breakdown
        </h4>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-muted-foreground border border-border">
          Past 30D
        </span>
      </div>

      <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
        Story volume distribution across primary editorial desks.
      </p>

      {/* Progress Bars */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const categoryColor = getCategoryColor(cat.slug);
          return (
            <div key={cat.slug}>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-foreground flex items-center gap-1.5 text-[11px]">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: categoryColor || "#1e3a8a" }}
                  />
                  {cat.name}
                </span>
                <span className="font-mono text-muted-foreground text-[11px] font-semibold">
                  {/* {cat.percentage}%{" "} */}
                  <span className="font-normal text-[10px]">
                    ({cat._count.articles})
                  </span>
                </span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  // style={{
                  //   width: `${Math.max(cat.percentage, 5)}%`,
                  //   backgroundColor: cat.color || "#1e3a8a",
                  // }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Telemetry */}
      <div className="mt-4 pt-2.5 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-mono">
        <span>Avg. Words / Article:</span>
        <span className="font-semibold text-foreground">1,180 words</span>
      </div>

      <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
        <span>Active Desks:</span>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          {categories.length} / {categories.length} Online
        </span>
      </div>
    </div>
  );
}
