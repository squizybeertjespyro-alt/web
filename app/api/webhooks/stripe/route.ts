import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { sendOrderNotification } from "@/lib/discord";

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

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: true },
    });

    if (!order) return NextResponse.json({ received: true });

    // Assign license keys
    const assignedKeys: { productName: string; optionName: string; keys: string[] }[] = [];

    for (const item of order.items) {
      const keys: string[] = [];
      for (let i = 0; i < item.quantity; i++) {
        const licenseKey = await prisma.licenseKey.findFirst({
          where: { productId: item.productId, optionName: item.optionName, used: false },
        });
        if (licenseKey) {
          await prisma.licenseKey.update({
            where: { id: licenseKey.id },
            data: { used: true, usedAt: new Date(), orderItemId: item.id },
          });
          keys.push(licenseKey.key);
        } else {
          keys.push("NO KEY AVAILABLE - Contact support on Discord");
        }
      }
      assignedKeys.push({ productName: item.productName, optionName: item.optionName, keys });
    }

    const productContent = assignedKeys
      .map((p) => `${p.productName} — ${p.optionName}:\n${p.keys.join("\n")}`)
      .join("\n\n");

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "paid" },
    });

    if (!order.emailSent && customerEmail) {
      try {
        await sendOrderConfirmationEmail({
          to: customerEmail,
          orderId: order.id,
          items: order.items,
          total: order.total,
          productContent,
        });
        await prisma.order.update({
          where: { id: orderId },
          data: { emailSent: true },
        });
        await sendOrderNotification({
          orderId: order.id,
          customerEmail,
          items: order.items,
          total: order.total,
        });
      } catch (emailErr) {
        console.error("Email failed:", emailErr);
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