import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await prisma.newsletterSubscriber.create({
      data: { email: email.trim().toLowerCase() },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    // Already subscribed
    if (err?.code === "P2002") {
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}