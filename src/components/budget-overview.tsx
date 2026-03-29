"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BudgetOverviewProps {
  totalBudget: number;
  totalSpent: number;
  onUpdateBudget: (amount: number) => Promise<void>;
}

export function BudgetOverview({
  totalBudget,
  totalSpent,
  onUpdateBudget,
}: BudgetOverviewProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const remaining = totalBudget - totalSpent;
  const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  async function handleSave() {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val > 0) {
      await onUpdateBudget(val);
    }
    setEditing(false);
  }

  return (
    <div>
      {/* Big numbers */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
            Remaining
          </p>
          <p className="text-5xl font-bold tracking-tight font-number text-teal">
            ${remaining.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
            Invested
          </p>
          <p className="text-2xl font-semibold tracking-tight font-number text-coral">
            ${totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <Progress value={percentUsed} className="h-1.5 mb-3" />

      {/* Footer row */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span className="font-number">{percentUsed.toFixed(0)}% used</span>
        {editing ? (
          <div className="flex items-center gap-2">
            <span>$</span>
            <Input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleSave();
                }
              }}
              className="w-24 h-7 text-sm"
              autoFocus
            />
            <Button size="sm" variant="ghost" onClick={() => void handleSave()}>
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <button
            onClick={() => {
              setEditValue(totalBudget.toString());
              setEditing(true);
            }}
            className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline cursor-pointer transition-colors"
          >
            Budget: ${totalBudget.toLocaleString()}
          </button>
        )}
      </div>
    </div>
  );
}
