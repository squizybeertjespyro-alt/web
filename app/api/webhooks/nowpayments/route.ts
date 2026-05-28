import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // NOWPayments sends payment status here
    console.log("NOWPayments webhook:", body);

    const status = body.payment_status;

    if (status === "finished") {
      // here you later unlock order / send email / give product
      console.log("PAYMENT COMPLETED:", body.order_id);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}