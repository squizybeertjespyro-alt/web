import { prisma } from "@/lib/prisma";
import { products } from "@/config/products";

/**
 * Server-side pricing. The browser only tells us WHAT is in the cart
 * (productId, optionName, quantity). Prices, promo discounts and the final
 * total are always computed here from config/products.ts and the database.
 */

export class CheckoutError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const MAX_LINES = 20;
const MAX_QUANTITY = 10;

export interface PricedItem {
  productId: string;
  productName: string;
  optionName: string;
  quantity: number;
  price: number; // unit price, from config
}

export interface PricedCart {
  items: PricedItem[];
  subtotal: number;
  discount: number;
  total: number;
  promoCode: string | null;
}

const toCents = (n: number) => Math.round(n * 100);
const fromCents = (c: number) => c / 100;

export function priceItems(raw: unknown): PricedItem[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new CheckoutError("No items in cart");
  }
  if (raw.length > MAX_LINES) {
    throw new CheckoutError("Too many items in cart");
  }

  return raw.map((entry) => {
    const { productId, optionName, quantity } = (entry ?? {}) as Record<string, unknown>;

    if (typeof productId !== "string" || typeof optionName !== "string") {
      throw new CheckoutError("Invalid cart item");
    }
    if (!Number.isInteger(quantity) || (quantity as number) < 1 || (quantity as number) > MAX_QUANTITY) {
      throw new CheckoutError("Invalid quantity");
    }

    const product = products.find((p) => p.id === productId);
    const option = product?.options.find((o) => o.name === optionName);
    if (!product || !option) {
      throw new CheckoutError("Product not found");
    }
    if (product.comingSoon || option.comingSoon) {
      throw new CheckoutError(`${product.name} is not available yet`);
    }

    const unitPrice = option.salePrice ?? option.price;
    if (!(unitPrice > 0)) {
      throw new CheckoutError("Invalid price");
    }

    return {
      productId: product.id,
      productName: product.name,
      optionName: option.name,
      quantity: quantity as number,
      price: unitPrice,
    };
  });
}

export async function priceCart(rawItems: unknown, rawPromo?: unknown): Promise<PricedCart> {
  const items = priceItems(rawItems);
  const subtotalCents = items.reduce((sum, i) => sum + toCents(i.price) * i.quantity, 0);

  let discountCents = 0;
  let promoCode: string | null = null;

  if (typeof rawPromo === "string" && rawPromo.trim()) {
    const code = rawPromo.toUpperCase().trim();
    const promo = await prisma.promoCode.findUnique({ where: { code } });

    if (!promo || !promo.active) throw new CheckoutError("Invalid promo code");
    if (promo.expiresAt && promo.expiresAt < new Date()) throw new CheckoutError("This promo code has expired");
    if (promo.maxUses !== null && promo.uses >= promo.maxUses) {
      throw new CheckoutError("This promo code has reached its usage limit");
    }

    if (promo.type === "percent") {
      const pct = Math.min(Math.max(promo.value, 0), 100);
      discountCents = Math.round((subtotalCents * pct) / 100);
    } else {
      discountCents = Math.min(Math.max(toCents(promo.value), 0), subtotalCents);
    }
    promoCode = promo.code;
  }

  const totalCents = Math.max(0, subtotalCents - discountCents);

  return {
    items,
    subtotal: fromCents(subtotalCents),
    discount: fromCents(discountCents),
    total: fromCents(totalCents),
    promoCode,
  };
}

/**
 * Atomically use up one redemption. Returns false if the code is no longer
 * valid (e.g. someone else just used the last redemption), so two people can
 * never both get the "last" use.
 */
export async function redeemPromo(code: string): Promise<boolean> {
  const changed = await prisma.$executeRaw`
    UPDATE "PromoCode"
    SET "uses" = "uses" + 1
    WHERE "code" = ${code}
      AND "active" = true
      AND ("expiresAt" IS NULL OR "expiresAt" > NOW())
      AND ("maxUses" IS NULL OR "uses" < "maxUses")
  `;
  return changed === 1;
}

export function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}