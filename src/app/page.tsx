import { DashboardClient } from "@/components/dashboard-client";
import { getBudgetConfig, listExpenses, listSubscriptions } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [initialExpenses, initialBudget, initialSubscriptions] = await Promise.all([
    listExpenses(),
    getBudgetConfig(),
    listSubscriptions(),
  ]);

  return (
    <DashboardClient
      initialExpenses={initialExpenses}
      initialBudget={initialBudget}
      initialSubscriptions={initialSubscriptions}
    />
  );
}
