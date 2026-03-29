"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  return d.toISOString().slice(0, 10);
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Subscriptions</SheetTitle>
        </SheetHeader>

        {/* List */}
        {!showForm && (
          <div className="flex flex-col gap-4">
            {subscriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No subscriptions yet.</p>
            ) : (
              <ul className="space-y-3">
                {subscriptions.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-start justify-between gap-3 rounded-lg border p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm truncate">{s.name}</span>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {s.billingCycle}
                        </Badge>
                        {!s.active && (
                          <Badge variant="outline" className="text-xs shrink-0 text-muted-foreground">
                            paused
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        ${s.amount.toFixed(2)} · renews {s.nextRenewalDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Switch
                        checked={s.active}
                        onCheckedChange={(checked) => {
                          void onUpdate(s.id, { active: checked });
                        }}
                        aria-label={s.active ? "Pause subscription" : "Resume subscription"}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => openEditForm(s)}
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => { void onDelete(s.id); }}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Button onClick={openAddForm} variant="outline" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Subscription
            </Button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <form
            onSubmit={(e) => { void handleSubmit(e); }}
            className="space-y-4"
          >
            <p className="text-sm font-medium">
              {editingId ? "Edit subscription" : "New subscription"}
            </p>

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
                placeholder="Any details"
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button type="button" variant="outline" onClick={cancelForm} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? "Saving…" : editingId ? "Save" : "Add"}
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
