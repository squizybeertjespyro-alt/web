import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, oldOptionName, newOptionName } = await req.json();

  const keys = await prisma.licenseKey.updateMany({
    where: { productId, optionName: oldOptionName },
    data: { optionName: newOptionName },
  });

  const items = await prisma.orderItem.updateMany({
    where: { productId, optionName: oldOptionName },
    data: { optionName: newOptionName },
  });

  return NextResponse.json({
    keysUpdated: keys.count,
    orderItemsUpdated: items.count,
  });
}