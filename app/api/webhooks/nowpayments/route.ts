import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { fulfillOrder } from "@/lib/fulfillment";

// NOWPayments signs the JSON body with its keys sorted alphabetically (recursively).
function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortKeys((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return value;
}

function validSignature(body: string, sig: string, secret: string): boolean {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return false;
  }
  const expected = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(sortKeys(parsed)))
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(sig, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.NOWPAYMENTS_IPN_SECRET;
    if (!secret) {
      // Fail closed: never accept payment notifications we can't verify.
      console.error("NOWPAYMENTS_IPN_SECRET is not set - rejecting webhook");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    const body = await req.text();
    const sig = req.headers.get("x-nowpayments-sig");

    // Signature is mandatory. No header = rejected.
    if (!sig || !validSignature(body, sig, secret)) {
      console.error("Invalid or missing NOWPayments signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const data = JSON.parse(body);
    const { payment_status, order_id } = data;

    if (typeof order_id !== "string") {
      return NextResponse.json({ ok: true });
    }

    if (payment_status === "finished" || payment_status === "confirmed") {
      const order = await prisma.order.findUnique({ where: { id: order_id } });

      if (!order) {
        console.error("Order not found:", order_id);
        return NextResponse.json({ ok: true });
      }

      // Only crypto orders can be paid through this endpoint
      if (order.paymentMethod !== "crypto") {
        console.error("Webhook for non-crypto order:", order_id);
        return NextResponse.json({ ok: true });
      }

      // The invoice must be for the amount we priced the order at
      const invoicedAmount = Number(data.price_amount);
      if (!Number.isFinite(invoicedAmount) || Math.abs(invoicedAmount - order.total) > 0.01) {
        console.error(`Amount mismatch on order ${order_id}: got ${data.price_amount}, expected ${order.total}`);
        return NextResponse.json({ ok: true });
      }

      await fulfillOrder(order.id);
    }

    if (payment_status === "failed" || payment_status === "expired") {
      // Never downgrade an order that's already paid
      await prisma.order
        .updateMany({
          where: { id: order_id, status: { not: "paid" } },
          data: { status: "failed" },
        })
        .catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}