import { NextResponse } from "next/server";
import { editSubscription, removeSubscription } from "@/lib/db";
import type { Subscription } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<Omit<Subscription, "id" | "createdAt">>;
    const subscription = await editSubscription(id, body);
    if (!subscription) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Failed to update subscription", error);
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await removeSubscription(id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete subscription", error);
    return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 });
  }
}
