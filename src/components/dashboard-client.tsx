"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BudgetOverview } from "@/components/budget-overview";
import { CategoryBreakdown } from "@/components/category-breakdown";
import { ExpenseTable } from "@/components/expense-table";
import { ExpenseForm } from "@/components/expense-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { useExpenses } from "@/hooks/use-expenses";
import { useBudget } from "@/hooks/use-budget";
import type { BudgetConfig, Expense } from "@/lib/types";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

interface DashboardClientProps {
  initialExpenses: Expense[];
  initialBudget: BudgetConfig;
}

export function DashboardClient({
  initialExpenses,
  initialBudget,
}: DashboardClientProps) {
  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    totalSpent,
    spentByCategory,
  } = useExpenses(initialExpenses);
  const { budget, updateBudget } = useBudget(initialBudget);
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  async function handleSubmit(expense: Omit<Expense, "id" | "createdAt">) {
    if (editingExpense) {
      await updateExpense(editingExpense.id, expense);
    } else {
      await addExpense(expense);
    }
    setEditingExpense(null);
  }

  function handleEdit(expense: Expense) {
    setEditingExpense(expense);
    setFormOpen(true);
  }

  function handleFormOpenChange(open: boolean) {
    setFormOpen(open);
    if (!open) setEditingExpense(null);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-5 py-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          <motion.header variants={fadeUp} className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">AI Learning Budget</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Your exploration fund for staying ahead.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                size="sm"
                onClick={() => setFormOpen(true)}
                className="cursor-pointer"
              >
                + Log Expense
              </Button>
            </div>
          </motion.header>

          <motion.div variants={fadeUp}>
            <BudgetOverview
              totalBudget={budget.totalBudget}
              totalSpent={totalSpent}
              onUpdateBudget={updateBudget}
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <CategoryBreakdown
              spentByCategory={spentByCategory}
              totalSpent={totalSpent}
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <ExpenseTable
              expenses={expenses}
              onEdit={handleEdit}
              onDelete={deleteExpense}
            />
          </motion.div>
        </motion.div>
      </div>

      <ExpenseForm
        key={`${editingExpense?.id ?? "new"}-${formOpen ? "open" : "closed"}`}
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        onSubmit={handleSubmit}
        editingExpense={editingExpense}
      />
    </div>
  );
}
