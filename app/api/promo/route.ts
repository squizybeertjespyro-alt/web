import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { priceCart, CheckoutError } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  try {
    const { code, items } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Discount is computed from the server-side price of the cart,
    // never from a total supplied by the browser.
    const cart = await priceCart(items, code);

    const promo = await prisma.promoCode.findUnique({
      where: { code: cart.promoCode! },
    });

    return NextResponse.json({
      valid: true,
      code: cart.promoCode,
      type: promo?.type,
      value: promo?.value,
      discount: cart.discount,
      newTotal: cart.total,
    });
  } catch (err) {
    if (err instanceof CheckoutError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Promo error:", err);
    return NextResponse.json({ error: "Failed to validate code" }, { status: 500 });
  }
}