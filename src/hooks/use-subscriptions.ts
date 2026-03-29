"use client";

import { useState, useCallback } from "react";
import type { Subscription } from "@/lib/types";

export function useSubscriptions(initialSubscriptions: Subscription[]) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);

  const addSubscription = useCallback(async (input: Omit<Subscription, "id" | "createdAt">) => {
    const response = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error("Failed to create subscription");
    const data = (await response.json()) as { subscription: Subscription };
    setSubscriptions((prev) => [...prev, data.subscription]);
    return data.subscription;
  }, []);

  const updateSubscription = useCallback(
    async (id: string, updates: Partial<Omit<Subscription, "id" | "createdAt">>) => {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update subscription");
      const data = (await response.json()) as { subscription: Subscription };
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? data.subscription : s))
      );
      return data.subscription;
    },
    []
  );

  const deleteSubscription = useCallback(async (id: string) => {
    const response = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete subscription");
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { subscriptions, addSubscription, updateSubscription, deleteSubscription };
}
