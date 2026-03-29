"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Subscription } from "@/lib/types";

interface RenewalBannerProps {
  subscriptions: Subscription[];
}

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const renewal = new Date(`${dateStr}T00:00:00.000Z`);
  return Math.round((renewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function RenewalBanner({ subscriptions }: RenewalBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  const upcoming = subscriptions.filter((s) => {
    if (!s.active) return false;
    const days = getDaysUntil(s.nextRenewalDate);
    return days >= 0 && days <= 3;
  });

  if (dismissed || upcoming.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="font-medium text-amber-600 dark:text-amber-400">
            Upcoming renewals
          </p>
          <ul className="space-y-0.5 text-muted-foreground">
            {upcoming.map((s) => {
              const days = getDaysUntil(s.nextRenewalDate);
              const label =
                days === 0 ? "today" : days === 1 ? "tomorrow" : `in ${days} days`;
              return (
                <li key={s.id}>
                  <span className="text-foreground font-medium">{s.name}</span>
                  {" — "}${s.amount.toFixed(2)} renews {label}
                </li>
              );
            })}
          </ul>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
