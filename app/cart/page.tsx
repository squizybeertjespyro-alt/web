"use client";

import { useCart } from "@/context/cart-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-20 text-center">
          <ShoppingBag className="mx-auto mb-6 h-16 w-16 text-muted-foreground" />
          <h1 className="mb-3 text-2xl font-bold">Your cart is empty</h1>
          <p className="mb-8 text-muted-foreground">Add some products to get started.</p>
          <Button asChild>
            <Link href="/shop">Browse Shop</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
        <h1 className="mb-8 text-2xl font-bold">Your Cart ({itemCount} items)</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.optionName}`}
                className="flex gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image src={item.image} alt={item.productName} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-semibold hover:text-primary"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.optionName}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.optionName)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-lg border border-border">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.optionName, item.quantity - 1)
                        }
                        className="p-2 text-muted-foreground hover:text-foreground"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.optionName, item.quantity + 1)
                        }
                        className="p-2 text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-semibold text-primary">
                      {siteConfig.currency}{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="h-fit rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div key={`${item.productId}-${item.optionName}`} className="flex justify-between">
                  <span className="text-muted-foreground">
                    {item.productName} × {item.quantity}
                  </span>
                  <span>{siteConfig.currency}{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="my-4 border-t border-border pt-4">
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-primary">{siteConfig.currency}{total.toFixed(2)}</span>
              </div>
            </div>
            <Button asChild className="w-full" size="lg">
              <Link href="/checkout">
                Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full" size="sm">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
