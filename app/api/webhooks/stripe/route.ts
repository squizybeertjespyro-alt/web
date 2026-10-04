import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { fulfillOrder } from "@/lib/fulfillment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const orderId = intent.metadata.orderId;
    if (!orderId) return NextResponse.json({ received: true });

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ received: true });

    // The payment must be the one we created for this order...
    if (order.paymentMethod !== "stripe" || order.paymentId !== intent.id) {
      console.error(`PaymentIntent ${intent.id} does not belong to order ${orderId}`);
      return NextResponse.json({ received: true });
    }

    // ...and must cover the full price of the order.
    if (intent.amount_received < Math.round(order.total * 100)) {
      console.error(`Underpaid order ${orderId}: received ${intent.amount_received}, expected ${Math.round(order.total * 100)}`);
      return NextResponse.json({ received: true });
    }

    await fulfillOrder(order.id, intent.metadata.customerEmail);
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    // Never downgrade an order that's already paid
    await prisma.order.updateMany({
      where: { paymentId: intent.id, status: { not: "paid" } },
      data: { status: "failed" },
    });
  }

  return NextResponse.json({ received: true });
}