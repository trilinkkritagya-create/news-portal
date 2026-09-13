import { CategoryDistributionItem } from "@/lib/dashboard/get-dashboard-data";

interface CategoryBreakdownProps {
  categories: CategoryDistributionItem[];
}

export default function CategoryBreakdown({
  categories,
}: CategoryBreakdownProps) {
  return (
    <div className="border border-border bg-card p-5 rounded-lg">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
        <h3 className="font-serif text-base font-bold text-foreground">
          Category Distribution
        </h3>
        <span className="font-mono text-[10px] uppercase text-muted-foreground">
          Volume %
        </span>
      </div>

      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
        Percentage volume of catalogued manuscripts distributed across primary editorial desks.
      </p>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.slug} className="text-xs">
            <div className="flex justify-between items-center mb-1.5 font-mono text-[11px]">
              <span className="flex items-center gap-1.5 font-sans font-medium text-foreground">
                <span
                  className="h-2 w-2 inline-block shrink-0"
                  style={{ backgroundColor: cat.color }}
                ></span>
                {cat.name}
              </span>
              <span className="font-semibold text-foreground">
                {cat.percentage}%{" "}
                <span className="text-muted-foreground font-normal">
                  ({cat.count})
                </span>
              </span>
            </div>

            <div className="h-1.5 w-full bg-secondary overflow-hidden">
              <div
                className="h-1.5 transition-all duration-300"
                style={{
                  width: `${Math.max(cat.percentage, 4)}%`,
                  backgroundColor: cat.color,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-dashed border-border pt-3 font-mono text-[11px] text-muted-foreground">
        <span>Active Desks:</span>
        <span className="font-semibold text-live">
          {categories.length} / {categories.length} Online
        </span>
      </div>
    </div>
  );
}
