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
  subscriptions: "#c96442",
  api: "#4a7fc1",
  learning: "#c9a84c",
};

export type BillingCycle = "monthly" | "yearly";

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  nextRenewalDate: string; // ISO date string (YYYY-MM-DD)
  active: boolean;
  notes?: string;
  createdAt: string;
}
