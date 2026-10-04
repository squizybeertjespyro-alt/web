import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { priceCart, redeemPromo, isValidEmail, CheckoutError } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  try {
    // Only item identity + quantity + promo code are read from the client.
    // Any price / discountedTotal sent by the browser is ignored.
    const { items, email, promoCode } = await req.json();

    const user = await getUser();
    const customerEmail = user?.email ?? email;
    if (!isValidEmail(customerEmail)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    const cart = await priceCart(items, promoCode);

    if (cart.total <= 0) {
      return NextResponse.json({ error: "Order total is too low to process" }, { status: 400 });
    }

    if (cart.promoCode && !(await redeemPromo(cart.promoCode))) {
      return NextResponse.json({ error: "This promo code is no longer available" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: user?.id ?? null,
        guestEmail: user ? null : customerEmail,
        status: "pending",
        paymentMethod: "crypto",
        total: cart.total,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            optionName: item.optionName,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://hardduckmarket.xyz";

    const response = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: cart.total,
        price_currency: "usd",
        order_id: order.id,
        order_description: cart.items.map((i) => `${i.productName} (${i.optionName})`).join(", "),
        ipn_callback_url: `${baseUrl}/api/webhooks/nowpayments`,
        success_url: `${baseUrl}/order-success?orderId=${order.id}`,
        cancel_url: `${baseUrl}/cart`,
        customer_email: customerEmail,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message ?? "NOWPayments error");

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: String(data.id) },
    });

    return NextResponse.json({ hostedUrl: data.invoice_url, orderId: order.id, total: cart.total });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Crypto checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}