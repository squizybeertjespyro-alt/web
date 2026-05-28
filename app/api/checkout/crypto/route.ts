import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { siteConfig } from "@/config/site";

export async function POST(req: NextRequest) {
  try {
    const { items, email } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const user = await getUser();
    const customerEmail = user?.email ?? email;

    if (!customerEmail) {
      return NextResponse.json({ error: "Email required for checkout" }, { status: 400 });
    }

    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    // Create order in DB
    const order = await prisma.order.create({
      data: {
        userId: user?.id ?? null,
        guestEmail: user ? null : customerEmail,
        status: "pending",
        paymentMethod: "crypto",
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

    // Create Coinbase Commerce charge
    const chargeRes = await fetch("https://api.commerce.coinbase.com/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": process.env.COINBASE_COMMERCE_API_KEY!,
        "X-CC-Version": "2018-03-22",
      },
      body: JSON.stringify({
        name: `${siteConfig.name} Order`,
        description: items.map((i: { productName: string; optionName: string }) => `${i.productName} (${i.optionName})`).join(", "),
        local_price: { amount: total.toFixed(2), currency: "USD" },
        pricing_type: "fixed_price",
        metadata: { orderId: order.id, customerEmail },
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?orderId=${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      }),
    });

    const chargeData = await chargeRes.json();
    if (!chargeRes.ok) {
      throw new Error(chargeData.error?.message ?? "Coinbase error");
    }

    const charge = chargeData.data;

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: charge.id },
    });

    return NextResponse.json({ hostedUrl: charge.hosted_url, orderId: order.id });
  } catch (error) {
    console.error("Crypto checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
