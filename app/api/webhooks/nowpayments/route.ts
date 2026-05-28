import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  console.log("🔔 NOWPayments webhook received!");

  try {
    const body = await req.text();
    console.log("Webhook body:", body);

    const sig = req.headers.get("x-nowpayments-sig");
    console.log("Webhook signature:", sig);

    if (sig && process.env.NOWPAYMENTS_IPN_SECRET) {
      const hmac = crypto
        .createHmac("sha512", process.env.NOWPAYMENTS_IPN_SECRET)
        .update(body)
        .digest("hex");

      console.log("Expected signature:", hmac);

      if (hmac !== sig) {
        console.error("❌ Invalid NOWPayments signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } else {
      console.log("⚠️ No signature or IPN secret, skipping verification");
    }

    const data = JSON.parse(body);
    const { payment_status, order_id } = data;

    console.log("Payment status:", payment_status, "Order ID:", order_id);

    if (payment_status === "finished" || payment_status === "confirmed") {
      console.log("✅ Payment finished, updating order...");

      const order = await prisma.order.update({
        where: { id: order_id },
        data: { status: "paid" },
        include: { items: true, user: true },
      });

      const customerEmail = order.guestEmail ?? order.user?.email;
      console.log("Customer email:", customerEmail);

      if (!order.emailSent && customerEmail) {
        try {
          await sendOrderConfirmationEmail({
            to: customerEmail,
            orderId: order.id,
            items: order.items,
            total: order.total,
            productContent: "Thank you for your order! Join our Discord to receive your product.",
          });
          await prisma.order.update({
            where: { id: order.id },
            data: { emailSent: true },
          });
          console.log("📧 Email sent to:", customerEmail);
        } catch (emailErr) {
          console.error("❌ Email failed:", emailErr);
        }
      }
    }

    if (payment_status === "failed" || payment_status === "expired") {
      await prisma.order.update({
        where: { id: order_id },
        data: { status: "failed" },
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}