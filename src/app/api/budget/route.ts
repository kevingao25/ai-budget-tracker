import { NextResponse } from "next/server";
import { getBudgetConfig, updateBudgetConfig } from "@/lib/db";

export async function GET() {
  try {
    const budget = await getBudgetConfig();
    return NextResponse.json({ budget });
  } catch (error) {
    console.error("Failed to fetch budget", error);
    return NextResponse.json({ error: "Failed to fetch budget" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { totalBudget?: number };
    if (!body.totalBudget || body.totalBudget <= 0) {
      return NextResponse.json({ error: "Invalid budget amount" }, { status: 400 });
    }
    const budget = await updateBudgetConfig(body.totalBudget);
    return NextResponse.json({ budget });
  } catch (error) {
    console.error("Failed to update budget", error);
    return NextResponse.json({ error: "Failed to update budget" }, { status: 400 });
  }
}
