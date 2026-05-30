import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await req.json();
  if (!orderId) {
    return NextResponse.json({ error: "Order ID required" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const customerEmail = order.guestEmail ?? order.user?.email;
  if (!customerEmail) {
    return NextResponse.json({ error: "No email on this order" }, { status: 400 });
  }

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
    where: { id: order.id },
    data: { status: "paid", emailSent: true },
  });

  await sendOrderConfirmationEmail({
    to: customerEmail,
    orderId: order.id,
    items: order.items,
    total: order.total,
    productContent,
  });

  return NextResponse.json({ ok: true, email: customerEmail });
}