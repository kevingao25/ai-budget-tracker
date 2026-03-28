"use client";

import { useState, useEffect, useCallback } from "react";
import type { BudgetConfig } from "@/lib/types";
import * as storage from "@/lib/storage";

export function useBudget() {
  const [budget, setBudget] = useState<BudgetConfig>({ totalBudget: 3000 });

  useEffect(() => {
    setBudget(storage.getBudgetConfig());
  }, []);

  const updateBudget = useCallback((totalBudget: number) => {
    const config = { totalBudget };
    storage.setBudgetConfig(config);
    setBudget(config);
  }, []);

  return { budget, updateBudget };
}
