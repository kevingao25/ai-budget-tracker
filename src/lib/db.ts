import type { BudgetConfig, Category, Expense } from "@/lib/types";
import { prisma } from "@/lib/prisma";

const BUDGET_ID = "default";
const VALID_CATEGORIES: Category[] = ["subscriptions", "api", "learning"];

function assertCategory(value: string): asserts value is Category {
  if (!VALID_CATEGORIES.includes(value as Category)) {
    throw new Error("Invalid category");
  }
}

function toExpenseDTO(expense: {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: Date;
  notes: string | null;
  createdAt: Date;
}): Expense {
  assertCategory(expense.category);
  return {
    id: expense.id,
    name: expense.name,
    amount: expense.amount,
    category: expense.category,
    date: expense.date.toISOString().slice(0, 10),
    notes: expense.notes ?? undefined,
    createdAt: expense.createdAt.toISOString(),
  };
}

export async function listExpenses(): Promise<Expense[]> {
  const rows = await prisma.expense.findMany({ orderBy: { date: "desc" } });
  return rows.map(toExpenseDTO);
}

export async function createExpense(input: Omit<Expense, "id" | "createdAt">) {
  assertCategory(input.category);
  const created = await prisma.expense.create({
    data: {
      name: input.name,
      amount: input.amount,
      category: input.category,
      date: new Date(`${input.date}T00:00:00.000Z`),
      notes: input.notes,
    },
  });
  return toExpenseDTO(created);
}

export async function editExpense(
  id: string,
  input: Partial<Omit<Expense, "id" | "createdAt">>
): Promise<Expense | null> {
  const existing = await prisma.expense.findUnique({ where: { id } });
  if (!existing) return null;
  if (input.category) assertCategory(input.category);

  const updated = await prisma.expense.update({
    where: { id },
    data: {
      name: input.name,
      amount: input.amount,
      category: input.category,
      date: input.date ? new Date(`${input.date}T00:00:00.000Z`) : undefined,
      notes: input.notes,
    },
  });
  return toExpenseDTO(updated);
}

export async function removeExpense(id: string): Promise<boolean> {
  const result = await prisma.expense.deleteMany({ where: { id } });
  return result.count > 0;
}

export async function getBudgetConfig(): Promise<BudgetConfig> {
  const row = await prisma.budgetConfig.findUnique({ where: { id: BUDGET_ID } });
  if (!row) {
    const created = await prisma.budgetConfig.create({
      data: { id: BUDGET_ID, totalBudget: 3000 },
    });
    return { totalBudget: created.totalBudget };
  }
  return { totalBudget: row.totalBudget };
}

export async function updateBudgetConfig(totalBudget: number): Promise<BudgetConfig> {
  const row = await prisma.budgetConfig.upsert({
    where: { id: BUDGET_ID },
    create: { id: BUDGET_ID, totalBudget },
    update: { totalBudget },
  });
  return { totalBudget: row.totalBudget };
}
