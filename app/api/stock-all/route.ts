import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { products } from "@/config/products";

export async function GET(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stock = [];

  for (const product of products) {
    // Skip Robux — it has its own endpoint
    if (product.id === "robux" || product.isRobux) continue;

    for (const option of product.options) {
      const count = await prisma.licenseKey.count({
        where: { productId: product.id, optionName: option.name, used: false },
      });
      stock.push({
        productId: product.id,
        productName: product.name,
        optionName: option.name,
        count,
      });
    }
  }

  return NextResponse.json({ stock });
}
