"use client";

import type { Category } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/types";

interface CategoryBreakdownProps {
  spentByCategory: Record<string, number>;
  totalSpent: number;
}

const CATEGORIES: Category[] = ["subscriptions", "api", "learning"];

export function CategoryBreakdown({
  spentByCategory,
  totalSpent,
}: CategoryBreakdownProps) {
  if (totalSpent === 0) {
    return (
      <div>
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
          Where You&apos;re Investing
        </h3>
        <p className="text-sm text-muted-foreground">
          No expenses yet. Log your first expense to see the breakdown.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
        Where You&apos;re Investing
      </h3>

      {/* Stacked bars (mobile) */}
      <div className="sm:hidden space-y-2.5">
        {CATEGORIES.map((cat) => {
          const amount = spentByCategory[cat] || 0;
          if (amount === 0) return null;
          const pct = (amount / totalSpent) * 100;
          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">
                  {CATEGORY_LABELS[cat]}
                </span>
                <span className="text-sm font-number font-medium">
                  ${amount.toFixed(0)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: CATEGORY_COLORS[cat],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Proportional bar (desktop) */}
      <div className="hidden sm:flex gap-1 rounded-lg overflow-hidden h-9 mb-4">
        {CATEGORIES.map((cat) => {
          const amount = spentByCategory[cat] || 0;
          if (amount === 0) return null;
          const pct = (amount / totalSpent) * 100;
          return (
            <div
              key={cat}
              style={{
                flex: pct,
                backgroundColor: CATEGORY_COLORS[cat],
              }}
              className="flex items-center justify-center text-xs font-medium text-white/90 min-w-[60px] transition-all duration-500"
            >
              {pct > 15 && CATEGORY_LABELS[cat]}
            </div>
          );
        })}
      </div>

      {/* Legend (desktop) */}
      <div className="hidden sm:flex flex-wrap gap-x-6 gap-y-2">
        {CATEGORIES.map((cat) => {
          const amount = spentByCategory[cat] || 0;
          if (amount === 0) return null;
          return (
            <div key={cat} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[cat] }}
              />
              <span className="text-sm text-muted-foreground">
                {CATEGORY_LABELS[cat]}
              </span>
              <span className="text-sm font-number font-medium">
                ${amount.toFixed(0)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
