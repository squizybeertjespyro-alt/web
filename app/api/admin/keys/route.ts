import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // Simple admin key check
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, optionName, keys } = await req.json();

  if (!productId || !optionName || !keys?.length) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Insert keys, skip duplicates
  let added = 0;
  let skipped = 0;

  for (const key of keys) {
    const trimmed = key.trim();
    if (!trimmed) continue;
    try {
      await prisma.licenseKey.create({
        data: { productId, optionName, key: trimmed },
      });
      added++;
    } catch {
      skipped++; // duplicate key
    }
  }

  return NextResponse.json({ added, skipped });
}

export async function GET(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const optionName = searchParams.get("optionName");

  const where: { productId?: string; optionName?: string; used: boolean } = { used: false };
  if (productId) where.productId = productId;
  if (optionName) where.optionName = optionName;

  const counts = await prisma.licenseKey.groupBy({
    by: ["productId", "optionName"],
    where: { used: false },
    _count: { key: true },
  });

  return NextResponse.json({ stock: counts });
}
