import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { products } from "@/config/products";

export async function POST(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, optionName, email } = await req.json();

  const product = products.find((p) => p.id === productId);
  const option = product?.options.find((o) => o.name === optionName);

  if (!product || !option) {
    return NextResponse.json({ error: "Product or option not found" }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      guestEmail: email,
      status: "pending",
      paymentMethod: "test",
      total: option.salePrice ?? option.price,
      items: {
        create: [{
          productId: product.id,
          productName: product.name,
          optionName: option.name,
          quantity: 1,
          price: option.salePrice ?? option.price,
        }],
      },
    },
  });

  return NextResponse.json({ orderId: order.id });
}