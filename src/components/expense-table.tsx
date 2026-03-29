"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import type { Expense, Category } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/types";

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => Promise<boolean>;
}

const FILTERS: (Category | "all")[] = [
  "all",
  "subscriptions",
  "api",
  "learning",
];

export function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
}: ExpenseTableProps) {
  const [filter, setFilter] = useState<Category | "all">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered =
    filter === "all"
      ? expenses
      : expenses.filter((e) => e.category === filter);

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          All Expenses
        </h3>
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs cursor-pointer transition-colors ${
                filter === f
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : CATEGORY_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground py-12 text-center">
          {filter === "all"
            ? 'No expenses yet. Click "+ Log Expense" to get started.'
            : `No ${CATEGORY_LABELS[filter].toLowerCase()} expenses yet.`}
        </p>
      ) : (
        <div className="divide-y divide-border">
          {sorted.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between py-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: CATEGORY_COLORS[expense.category],
                  }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {expense.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge
                      variant="outline"
                      className="text-[11px] h-4 px-1.5"
                      style={{
                        borderColor: CATEGORY_COLORS[expense.category],
                        color: CATEGORY_COLORS[expense.category],
                      }}
                    >
                      {CATEGORY_LABELS[expense.category]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(`${expense.date}T00:00:00`).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium font-number">
                  ${expense.amount.toFixed(2)}
                </span>
                <div className="flex gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 cursor-pointer"
                    onClick={() => onEdit(expense)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-destructive cursor-pointer"
                    onClick={() => setDeletingId(expense.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deletingId} onOpenChange={(open) => { if (!open) setDeletingId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                if (deletingId) void onDelete(deletingId);
                setDeletingId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
