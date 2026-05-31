import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const optionName = searchParams.get("optionName");

  if (!productId || !optionName) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const count = await prisma.licenseKey.count({
    where: { productId, optionName, used: false },
  });

  return NextResponse.json({ inStock: count > 0, count });
}