import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, optionName } = await req.json();

  if (!productId || !optionName) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Delete all unused keys for this product + option
  const deleted = await prisma.licenseKey.deleteMany({
    where: { productId, optionName, used: false },
  });

  return NextResponse.json({ deleted: deleted.count });
}