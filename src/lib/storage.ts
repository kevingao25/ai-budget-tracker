import { v4 as uuidv4 } from "uuid";
import type { Expense, BudgetConfig } from "./types";

const EXPENSES_KEY = "ai-budget-expenses";
const BUDGET_KEY = "ai-budget-config";

const DEFAULT_BUDGET: BudgetConfig = { totalBudget: 3000 };

export function getExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(EXPENSES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addExpense(
  expense: Omit<Expense, "id" | "createdAt">
): Expense {
  const newExpense: Expense = {
    ...expense,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  const expenses = getExpenses();
  expenses.push(newExpense);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  return newExpense;
}

export function updateExpense(
  id: string,
  updates: Partial<Omit<Expense, "id" | "createdAt">>
): Expense | null {
  const expenses = getExpenses();
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return null;
  expenses[index] = { ...expenses[index], ...updates };
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  return expenses[index];
}

export function deleteExpense(id: string): boolean {
  const expenses = getExpenses();
  const filtered = expenses.filter((e) => e.id !== id);
  if (filtered.length === expenses.length) return false;
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(filtered));
  return true;
}

export function getBudgetConfig(): BudgetConfig {
  if (typeof window === "undefined") return DEFAULT_BUDGET;
  const raw = localStorage.getItem(BUDGET_KEY);
  return raw ? JSON.parse(raw) : DEFAULT_BUDGET;
}

export function setBudgetConfig(config: BudgetConfig): void {
  localStorage.setItem(BUDGET_KEY, JSON.stringify(config));
}
