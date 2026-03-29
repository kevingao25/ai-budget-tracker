"use client";

import { useState, useCallback } from "react";
import type { Expense, Category } from "@/lib/types";

export function useExpenses(initialExpenses: Expense[]) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  const addExpense = useCallback(
    async (expense: Omit<Expense, "id" | "createdAt">) => {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense),
      });
      if (!response.ok) throw new Error("Failed to create expense");
      const data = (await response.json()) as { expense: Expense };
      setExpenses((prev) => [data.expense, ...prev]);
      return data.expense;
    },
    []
  );

  const updateExpense = useCallback(
    async (id: string, updates: Partial<Omit<Expense, "id" | "createdAt">>) => {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update expense");
      const data = (await response.json()) as { expense: Expense };
      setExpenses((prev) =>
        prev.map((expense) => (expense.id === id ? data.expense : expense))
      );
      return data.expense;
    },
    []
  );

  const deleteExpense = useCallback(async (id: string) => {
    const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete expense");
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    return true;
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
