"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { ShoppingBag, Bitcoin, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState(user?.email ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!items.length) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-xl px-4 py-20 text-center">
          <ShoppingBag className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />
          <h1 className="mb-3 text-xl font-bold">Your cart is empty</h1>
          <Button asChild><Link href="/shop">Go Shopping</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCheckout = async () => {
    setError("");
    if (!email) { setError("Please enter your email address."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout/crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      clearCart();
      window.location.href = data.hostedUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
        <h1 className="mb-8 text-2xl font-bold">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">

            {/* Email+1 */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-base font-semibold">Contact</h2>
              {user ? (
                <p className="text-sm text-muted-foreground">
                  Ordering as <span className="text-foreground font-medium">{user.email}</span>
                  {" "}— <Link href="/api/auth/logout" className="text-primary underline">Not you?</Link>
                </p>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your order confirmation and product will be sent here.{" "}
                    <Link href="/login" className="text-primary underline">Have an account?</Link>
                  </p>
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-base font-semibold">Payment</h2>
              <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/10 p-4">
                <Bitcoin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Crypto</p>
                  <p className="text-xs text-muted-foreground">BTC, ETH, USDT, LTC and more via NOWPayments</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                You'll be redirected to NOWPayments to complete your payment securely.
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button onClick={handleCheckout} disabled={loading} size="lg" className="w-full">
              <Lock className="mr-2 h-4 w-4" />
              {loading ? "Processing…" : `Pay with Crypto — ${siteConfig.currency}${total.toFixed(2)}`}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full mt-3"
              onClick={() => window.open("https://discord.gg/sTvRtUZBxR", "_blank")}
             >
              Pay with PayPal or gift cards or others
            </Button>
          </div>

          {/* Summary */}
          <div className="h-fit rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-base font-semibold">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={`${item.productId}-${item.optionName}`} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.productName} ({item.optionName}) × {item.quantity}
                  </span>
                  <span>{siteConfig.currency}{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="my-4 border-t border-border pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">{siteConfig.currency}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
