import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/auth/server";
import { ensureProjectThread } from "@/lib/db/queries";
import { sendOrderPaidEmail } from "@/lib/email/send";
import { getStripe } from "@/lib/stripe/client";

export const runtime = "nodejs";

type OrderRow = {
  id: string;
  user_id: string;
  package_id: string;
};

export async function POST(request: Request): Promise<NextResponse> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook verification failed" },
      { status: 400 },
    );
  }

  const admin = createSupabaseAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const sessionId = session.id;

    const { data: order, error: orderError } = await admin
      .from("orders")
      .select("id,user_id,package_id")
      .eq("stripe_checkout_session_id", sessionId)
      .maybeSingle<OrderRow>();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await admin
      .from("orders")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        stripe_payment_intent_id:
          typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
      })
      .eq("id", order.id);

    const { data: project } = await admin
      .from("projects")
      .insert({
        id: randomUUID(),
        user_id: order.user_id,
        order_id: order.id,
        title: "New Snap Plan Project",
        property_type: "unknown",
        scope_summary: "Complete intake to define project scope.",
        status: "queued",
      })
      .select("id")
      .single();

    if (project) {
      await admin.from("project_intake").upsert({ project_id: project.id });
      await ensureProjectThread(project.id);

      const { data: authUser } = await admin.auth.admin.getUserById(order.user_id);
      if (authUser.user?.email) {
        const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
        await sendOrderPaidEmail(authUser.user.email, `${site}/portal/projects/${project.id}`);
      }
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object;
    if (charge.payment_intent) {
      await admin
        .from("orders")
        .update({ status: "refunded" })
        .eq("stripe_payment_intent_id", String(charge.payment_intent));
    }
  }

  return NextResponse.json({ received: true });
}
