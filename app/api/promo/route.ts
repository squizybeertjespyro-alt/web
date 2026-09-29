import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { code, total } = await req.json();

    if (!code || !total) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!promo) {
      return NextResponse.json({ error: "Invalid promo code" }, { status: 404 });
    }

    if (!promo.active) {
      return NextResponse.json({ error: "This promo code is no longer active" }, { status: 400 });
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return NextResponse.json({ error: "This promo code has expired" }, { status: 400 });
    }

    if (promo.maxUses !== null && promo.uses >= promo.maxUses) {
      return NextResponse.json({ error: "This promo code has reached its usage limit" }, { status: 400 });
    }

    // Calculate discount
    let discount = 0;
    if (promo.type === "percent") {
      discount = (total * promo.value) / 100;
    } else {
      discount = Math.min(promo.value, total);
    }

    const newTotal = Math.max(0, total - discount);

    return NextResponse.json({
      valid: true,
      code: promo.code,
      type: promo.type,
      value: promo.value,
      discount: Math.round(discount * 100) / 100,
      newTotal: Math.round(newTotal * 100) / 100,
    });
  } catch (err) {
    console.error("Promo error:", err);
    return NextResponse.json({ error: "Failed to validate code" }, { status: 500 });
  }
}