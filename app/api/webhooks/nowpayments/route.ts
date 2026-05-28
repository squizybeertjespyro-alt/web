import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get("x-nowpayments-sig");

    // Verify webhook signature
    if (sig && process.env.NOWPAYMENTS_IPN_SECRET) {
      const hmac = crypto
        .createHmac("sha512", process.env.NOWPAYMENTS_IPN_SECRET)
        .update(body)
        .digest("hex");

      if (hmac !== sig) {
        console.error("Invalid NOWPayments signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const data = JSON.parse(body);
    const { payment_status, order_id } = data;

    console.log("NOWPayments webhook:", payment_status, order_id);

    if (payment_status === "finished" || payment_status === "confirmed") {
      const order = await prisma.order.update({
        where: { id: order_id },
        data: { status: "paid" },
        include: { items: true },
      });

      const customerEmail = order.guestEmail ?? order.user?.email;

      if (!order.emailSent && customerEmail) {
        try {
          await sendOrderConfirmationEmail({
            to: customerEmail,
            orderId: order.id,
            items: order.items,
            total: order.total,
            // productContent: "Your product: ...", // Add your product delivery here
          });
          await prisma.order.update({
            where: { id: order.id },
            data: { emailSent: true },
          });
        } catch (emailErr) {
          console.error("Email failed:", emailErr);
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
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
