import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { priceCart, redeemPromo, isValidEmail, CheckoutError } from "@/lib/pricing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

    // Stripe's minimum charge is 0.50
    if (cart.total < 0.5) {
      return NextResponse.json({ error: "Order total is too low to process by card" }, { status: 400 });
    }

    if (cart.promoCode && !(await redeemPromo(cart.promoCode))) {
      return NextResponse.json({ error: "This promo code is no longer available" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: user?.id ?? null,
        guestEmail: user ? null : customerEmail,
        status: "pending",
        paymentMethod: "stripe",
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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(cart.total * 100),
      currency: "eur",
      metadata: { orderId: order.id, customerEmail },
      receipt_email: customerEmail,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: paymentIntent.id },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
      total: cart.total,
    });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}