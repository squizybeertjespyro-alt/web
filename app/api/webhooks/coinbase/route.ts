import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("x-cc-webhook-signature");

  // Verify webhook signature
  const expectedSig = crypto
    .createHmac("sha256", process.env.COINBASE_COMMERCE_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (sig !== expectedSig) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  const { type, data } = event.event;

  if (type === "charge:confirmed" || type === "charge:resolved") {
    const orderId = data.metadata?.orderId;
    const customerEmail = data.metadata?.customerEmail;

    if (!orderId) return NextResponse.json({ received: true });

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
        });
        await prisma.order.update({ where: { id: orderId }, data: { emailSent: true } });
      } catch (err) {
        console.error("Email send failed:", err);
      }
    }
  }

  if (type === "charge:failed") {
    const orderId = data.metadata?.orderId;
    if (orderId) {
      await prisma.order.update({ where: { id: orderId }, data: { status: "failed" } });
    }
  }

  return NextResponse.json({ received: true });
}
