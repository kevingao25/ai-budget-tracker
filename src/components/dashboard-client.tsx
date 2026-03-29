"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BudgetOverview } from "@/components/budget-overview";
import { CategoryBreakdown } from "@/components/category-breakdown";
import { ExpenseTable } from "@/components/expense-table";
import { ExpenseForm } from "@/components/expense-form";
import { RenewalBanner } from "@/components/renewal-banner";
import { SubscriptionsSheet } from "@/components/subscriptions-sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { useExpenses } from "@/hooks/use-expenses";
import { useBudget } from "@/hooks/use-budget";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import type { BudgetConfig, Expense, Subscription } from "@/lib/types";

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
  initialSubscriptions: Subscription[];
}

export function DashboardClient({
  initialExpenses,
  initialBudget,
  initialSubscriptions,
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
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription } =
    useSubscriptions(initialSubscriptions);
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [subsOpen, setSubsOpen] = useState(false);

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
      <div className="max-w-2xl mx-auto px-4 sm:px-5 py-6 sm:py-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="space-y-8 sm:space-y-10"
        >
          <motion.header variants={fadeUp} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src="/icon.svg" alt="" className="hidden sm:block w-9 h-9 opacity-90" />
                <h1 className="text-2xl font-bold tracking-tight text-coral">Drift</h1>
              </div>
              <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSubsOpen(true)}
                className="cursor-pointer"
              >
                Subscriptions
              </Button>
              <Button
                size="sm"
                onClick={() => setFormOpen(true)}
                className="cursor-pointer"
              >
                + Log Expense
              </Button>
            </div>
            </div>
            <p className="hidden sm:block text-xs text-muted-foreground pl-1">
              Personal AI expense tracker for waving the curve
            </p>
          </motion.header>

          <motion.div variants={fadeUp}>
            <RenewalBanner subscriptions={subscriptions} />
          </motion.div>

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

      <SubscriptionsSheet
        open={subsOpen}
        onOpenChange={setSubsOpen}
        subscriptions={subscriptions}
        onAdd={addSubscription}
        onUpdate={updateSubscription}
        onDelete={deleteSubscription}
      />
    </div>
  );
}
