"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BudgetOverviewProps {
  totalBudget: number;
  totalSpent: number;
  onUpdateBudget: (amount: number) => void;
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

  function handleSave() {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val > 0) {
      onUpdateBudget(val);
    }
    setEditing(false);
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-baseline mb-4">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              Remaining Budget
            </p>
            <p className="text-4xl font-extrabold text-emerald-400">
              ${remaining.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              Invested So Far
            </p>
            <p className="text-2xl font-bold text-blue-400">
              ${totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <Progress value={percentUsed} className="h-2 mb-2" />

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{percentUsed.toFixed(0)}% of budget used</span>
          {editing ? (
            <div className="flex items-center gap-2">
              <span>$</span>
              <Input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                className="w-24 h-7 text-sm"
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handleSave}>
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
              className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline cursor-pointer"
            >
              Total: ${totalBudget.toLocaleString()}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
