import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// We store Robux stock as a special "license key" entry
// productId: "robux", optionName: the package, used: false = available

export async function GET(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stock = await prisma.licenseKey.groupBy({
    by: ["optionName"],
    where: { productId: "robux", used: false },
    _count: { key: true },
  });

  return NextResponse.json({ stock });
}

export async function POST(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { amount } = await req.json();

  if (typeof amount !== "number" || amount < 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  // Delete existing robux stock and reset to new amount
  await prisma.licenseKey.deleteMany({
    where: { productId: "robux", used: false },
  });

  // Insert dummy keys representing Robux units
  // Each "key" represents 1 Robux unit
  if (amount > 0) {
    await prisma.licenseKey.createMany({
      data: Array.from({ length: amount }, (_, i) => ({
        productId: "robux",
        optionName: "robux",
        key: `ROBUX-${Date.now()}-${i}`,
        used: false,
      })),
    });
  }

  return NextResponse.json({ ok: true, amount });
}
