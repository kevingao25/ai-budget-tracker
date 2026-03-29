import { DashboardClient } from "@/components/dashboard-client";
import { getBudgetConfig, listExpenses } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [initialExpenses, initialBudget] = await Promise.all([
    listExpenses(),
    getBudgetConfig(),
  ]);

  return (
    <DashboardClient
      initialExpenses={initialExpenses}
      initialBudget={initialBudget}
    />
  );
}
