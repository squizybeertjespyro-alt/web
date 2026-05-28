import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const status = body.payment_status;
    const orderId = body.order_id;

    console.log("NOWPayments webhook:", body);

    if (status === "finished") {
      console.log("PAYMENT SUCCESS:", orderId);

      // later we connect:
      // - database order update
      // - email send
      // - product delivery
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}