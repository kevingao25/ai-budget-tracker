export type Category = "subscriptions" | "api" | "learning";

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: Category;
  date: string; // ISO date string (YYYY-MM-DD)
  notes?: string;
  createdAt: string; // ISO timestamp
}

export interface BudgetConfig {
  totalBudget: number;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  subscriptions: "Subscriptions",
  api: "API / Tokens",
  learning: "Learning",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  subscriptions: "#5b8fd9",
  api: "#2a9d8f",
  learning: "#e9c46a",
};
