import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { items, email } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const user = await getUser();
    const customerEmail = user?.email ?? email;

    if (!customerEmail) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: user?.id ?? null,
        guestEmail: user ? null : customerEmail,
        status: "pending",
        paymentMethod: "stripe",
        total,
        items: {
          create: items.map((item: {
            productId: string;
            productName: string;
            optionName: string;
            quantity: number;
            price: number;
          }) => ({
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
      amount: Math.round(total * 100),
      currency: "eur",
      metadata: {
        orderId: order.id,
        customerEmail,
      },
      receipt_email: customerEmail,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: paymentIntent.id },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}