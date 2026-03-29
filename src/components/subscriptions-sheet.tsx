"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { BillingCycle, Subscription } from "@/lib/types";

interface SubscriptionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptions: Subscription[];
  onAdd: (input: Omit<Subscription, "id" | "createdAt">) => Promise<unknown>;
  onUpdate: (id: string, updates: Partial<Omit<Subscription, "id" | "createdAt">>) => Promise<unknown>;
  onDelete: (id: string) => Promise<void>;
}

type FormState = {
  name: string;
  amount: string;
  billingCycle: BillingCycle;
  nextRenewalDate: string;
  notes: string;
};

function defaultNextRenewal(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function emptyForm(): FormState {
  return {
    name: "",
    amount: "",
    billingCycle: "monthly",
    nextRenewalDate: defaultNextRenewal(),
    notes: "",
  };
}

function subscriptionToForm(s: Subscription): FormState {
  return {
    name: s.name,
    amount: s.amount.toString(),
    billingCycle: s.billingCycle,
    nextRenewalDate: s.nextRenewalDate,
    notes: s.notes ?? "",
  };
}

function formatRenewalDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function SubscriptionsSheet({
  open,
  onOpenChange,
  subscriptions,
  onAdd,
  onUpdate,
  onDelete,
}: SubscriptionsSheetProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm());
    setShowForm(true);
  }

  function openEditForm(s: Subscription) {
    setEditingId(s.id);
    setForm(subscriptionToForm(s));
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setShowForm(false);
      setEditingId(null);
    }
    onOpenChange(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.name || isNaN(amount) || amount <= 0) return;
    setSaving(true);
    try {
      if (editingId) {
        await onUpdate(editingId, {
          name: form.name,
          amount,
          billingCycle: form.billingCycle,
          nextRenewalDate: form.nextRenewalDate,
          notes: form.notes || undefined,
        });
      } else {
        await onAdd({
          name: form.name,
          amount,
          billingCycle: form.billingCycle,
          nextRenewalDate: form.nextRenewalDate,
          active: true,
          notes: form.notes || undefined,
        });
      }
      setShowForm(false);
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const monthlyTotal = subscriptions
    .filter((s) => s.active)
    .reduce((sum, s) => sum + (s.billingCycle === "yearly" ? s.amount / 12 : s.amount), 0);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        {/* List view */}
        {!showForm && (
          <>
            <DialogHeader>
              <DialogTitle>Subscriptions</DialogTitle>
            </DialogHeader>

            {subscriptions.length > 0 && (
              <div className="flex items-baseline justify-between px-1">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                  {subscriptions.filter((s) => s.active).length} active
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-number font-medium text-foreground">${monthlyTotal.toFixed(2)}</span>/mo
                </p>
              </div>
            )}

            {subscriptions.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No subscriptions yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {subscriptions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between py-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Switch
                        checked={s.active}
                        onCheckedChange={(checked) => {
                          void onUpdate(s.id, { active: checked });
                        }}
                        aria-label={s.active ? "Pause" : "Resume"}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium truncate ${!s.active ? "text-muted-foreground line-through" : ""}`}>
                            {s.name}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[11px] h-4 px-1.5 shrink-0"
                          >
                            {s.billingCycle}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Renews {formatRenewalDate(s.nextRenewalDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium font-number">
                        ${s.amount.toFixed(2)}
                      </span>
                      <div className="flex gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 cursor-pointer"
                          onClick={() => openEditForm(s)}
                          aria-label="Edit"
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive cursor-pointer"
                          onClick={() => { void onDelete(s.id); }}
                          aria-label="Delete"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <DialogFooter>
              <Button onClick={openAddForm} className="w-full gap-2 cursor-pointer">
                <Plus className="h-4 w-4" />
                Add Subscription
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Form view */}
        {showForm && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                {editingId ? "Edit Subscription" : "New Subscription"}
              </DialogTitle>
            </DialogHeader>

            <form
              onSubmit={(e) => { void handleSubmit(e); }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="sub-name">Name</Label>
                <Input
                  id="sub-name"
                  placeholder="e.g., Claude Pro"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sub-amount">Amount ($)</Label>
                <Input
                  id="sub-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setField("amount", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Billing cycle</Label>
                <Select
                  value={form.billingCycle}
                  onValueChange={(v) => setField("billingCycle", v as BillingCycle)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sub-renewal">Next renewal date</Label>
                <Input
                  id="sub-renewal"
                  type="date"
                  value={form.nextRenewalDate}
                  onChange={(e) => setField("nextRenewalDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sub-notes">Notes (optional)</Label>
                <Input
                  id="sub-notes"
                  placeholder="Any additional details"
                  value={form.notes}
                  onChange={(e) => setField("notes", e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={cancelForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : editingId ? "Save Changes" : "Add Subscription"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
