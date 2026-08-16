import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const count = await prisma.licenseKey.count({
    where: { productId: "robux", used: false },
  });

  return NextResponse.json({ robux: count });
}
