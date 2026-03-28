"use client";

import { useState, useEffect, useCallback } from "react";
import type { Expense, Category } from "@/lib/types";
import * as storage from "@/lib/storage";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    setExpenses(storage.getExpenses());
  }, []);

  const addExpense = useCallback(
    (expense: Omit<Expense, "id" | "createdAt">) => {
      const newExpense = storage.addExpense(expense);
      setExpenses(storage.getExpenses());
      return newExpense;
    },
    []
  );

  const updateExpense = useCallback(
    (id: string, updates: Partial<Omit<Expense, "id" | "createdAt">>) => {
      const updated = storage.updateExpense(id, updates);
      if (updated) setExpenses(storage.getExpenses());
      return updated;
    },
    []
  );

  const deleteExpense = useCallback((id: string) => {
    const deleted = storage.deleteExpense(id);
    if (deleted) setExpenses(storage.getExpenses());
    return deleted;
  }, []);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const spentByCategory = expenses.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    },
    {} as Record<Category, number>
  );

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    totalSpent,
    spentByCategory,
  };
}
