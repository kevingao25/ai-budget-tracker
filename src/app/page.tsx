"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BudgetOverview } from "@/components/budget-overview";
import { CategoryBreakdown } from "@/components/category-breakdown";
import { ExpenseTable } from "@/components/expense-table";
import { ExpenseForm } from "@/components/expense-form";
import { useExpenses } from "@/hooks/use-expenses";
import { useBudget } from "@/hooks/use-budget";
import type { Expense } from "@/lib/types";

export default function Home() {
  const { expenses, addExpense, updateExpense, deleteExpense, totalSpent, spentByCategory } =
    useExpenses();
  const { budget, updateBudget } = useBudget();
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  function handleSubmit(expense: Omit<Expense, "id" | "createdAt">) {
    if (editingExpense) {
      updateExpense(editingExpense.id, expense);
    } else {
      addExpense(expense);
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
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">AI Learning Budget</h1>
            <p className="text-sm text-muted-foreground">
              ${budget.totalBudget.toLocaleString()} exploration fund
            </p>
          </div>
          <Button onClick={() => setFormOpen(true)}>+ Log Expense</Button>
        </div>

        <div className="space-y-6">
          <BudgetOverview
            totalBudget={budget.totalBudget}
            totalSpent={totalSpent}
            onUpdateBudget={updateBudget}
          />

          <CategoryBreakdown
            spentByCategory={spentByCategory}
            totalSpent={totalSpent}
          />

          <ExpenseTable
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={deleteExpense}
          />
        </div>

        <ExpenseForm
          open={formOpen}
          onOpenChange={handleFormOpenChange}
          onSubmit={handleSubmit}
          editingExpense={editingExpense}
        />
      </div>
    </div>
  );
}
