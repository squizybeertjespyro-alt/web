import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

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

    // Save order to database
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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://hardduckmarket.xyz";

    // Create NOWPayments invoice
    const response = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: total,
        price_currency: "usd",
        order_id: order.id,
        order_description: items
          .map((i: { productName: string; optionName: string }) => `${i.productName} (${i.optionName})`)
          .join(", "),
        ipn_callback_url: `${baseUrl}/api/webhooks/nowpayments`,
        success_url: `${baseUrl}/order-success?orderId=${order.id}`,
        cancel_url: `${baseUrl}/cart`,
        customer_email: customerEmail,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("NOWPayments error:", data);
      throw new Error(data.message ?? "NOWPayments error");
    }

    // Save payment ID
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: data.id },
    });

    return NextResponse.json({
      hostedUrl: data.invoice_url,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Crypto checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
