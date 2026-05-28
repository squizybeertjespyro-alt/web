import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

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
    const customerEmail = intent.metadata.customerEmail;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: "paid" },
      include: { items: true },
    });

    if (!order.emailSent && customerEmail) {
      try {
        await sendOrderConfirmationEmail({
          to: customerEmail,
          orderId: order.id,
          items: order.items,
          total: order.total,
          // productContent: "Your license key: XXXX-XXXX-XXXX-XXXX", // Add delivery here
        });
        await prisma.order.update({ where: { id: orderId }, data: { emailSent: true } });
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
      }
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    await prisma.order.updateMany({
      where: { paymentId: intent.id },
      data: { status: "failed" },
    });
  }

  return NextResponse.json({ received: true });
}
