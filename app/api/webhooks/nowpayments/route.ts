import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  console.log("🔔 NOWPayments webhook received!");

  try {
    const body = await req.text();
    const sig = req.headers.get("x-nowpayments-sig");

    if (sig && process.env.NOWPAYMENTS_IPN_SECRET) {
      const hmac = crypto
        .createHmac("sha512", process.env.NOWPAYMENTS_IPN_SECRET)
        .update(body)
        .digest("hex");

      if (hmac !== sig) {
        console.error("❌ Invalid signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const data = JSON.parse(body);
    const { payment_status, order_id } = data;

    console.log("Payment status:", payment_status, "Order ID:", order_id);

    if (payment_status === "finished" || payment_status === "confirmed") {
      const order = await prisma.order.findUnique({
        where: { id: order_id },
        include: { items: true, user: true },
      });

      if (!order) {
        console.error("Order not found:", order_id);
        return NextResponse.json({ ok: true });
      }

      // Assign license keys to each order item
      const assignedKeys: { productName: string; optionName: string; keys: string[] }[] = [];

      for (const item of order.items) {
        const keys: string[] = [];

        for (let i = 0; i < item.quantity; i++) {
          // Find next available key for this product + option
          const licenseKey = await prisma.licenseKey.findFirst({
            where: {
              productId: item.productId,
              optionName: item.optionName,
              used: false,
            },
          });

          if (licenseKey) {
            // Mark key as used and link to order item
            await prisma.licenseKey.update({
              where: { id: licenseKey.id },
              data: {
                used: true,
                usedAt: new Date(),
                orderItemId: item.id,
              },
            });
            keys.push(licenseKey.key);
            console.log(`✅ Assigned key for ${item.productName} (${item.optionName})`);
          } else {
            console.error(`❌ No keys available for ${item.productName} (${item.optionName})`);
            keys.push("NO KEY AVAILABLE - Contact support on Discord");
          }
        }

        assignedKeys.push({
          productName: item.productName,
          optionName: item.optionName,
          keys,
        });
      }

      // Build product content for email
      const productContent = assignedKeys
        .map((p) =>
          `${p.productName} — ${p.optionName}:\n${p.keys.join("\n")}`
        )
        .join("\n\n");

      // Update order status
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "paid" },
      });

      const customerEmail = order.guestEmail ?? order.user?.email;

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
