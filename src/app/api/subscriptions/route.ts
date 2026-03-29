import { NextResponse } from "next/server";
import { createSubscription, listSubscriptions } from "@/lib/db";
import type { Subscription } from "@/lib/types";

export async function GET() {
  try {
    const subscriptions = await listSubscriptions();
    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error("Failed to fetch subscriptions", error);
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Omit<Subscription, "id" | "createdAt">;
    const subscription = await createSubscription(body);
    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error) {
    console.error("Failed to create subscription", error);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 400 });
  }
}
