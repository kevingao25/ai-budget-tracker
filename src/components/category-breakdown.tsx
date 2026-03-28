"use client";

import { Card, CardContent } from "@/components/ui/card";
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
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">Where You&apos;re Investing</h3>
          <p className="text-sm text-muted-foreground">
            No expenses yet. Log your first expense to see the breakdown.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-3">Where You&apos;re Investing</h3>
        <div className="flex gap-1 rounded-lg overflow-hidden h-10">
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
                className="flex items-center justify-center text-xs font-medium text-black min-w-[60px]"
              >
                {CATEGORY_LABELS[cat]}
                <br />${amount.toFixed(0)}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
