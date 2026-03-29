"use client";

import { useState, useCallback } from "react";
import type { BudgetConfig } from "@/lib/types";

export function useBudget(initialBudget: BudgetConfig) {
  const [budget, setBudget] = useState<BudgetConfig>(initialBudget);

  const updateBudget = useCallback(async (totalBudget: number) => {
    const response = await fetch("/api/budget", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalBudget }),
    });
    if (!response.ok) throw new Error("Failed to update budget");
    const data = (await response.json()) as { budget: BudgetConfig };
    setBudget(data.budget);
  }, []);

  return { budget, updateBudget };
}
