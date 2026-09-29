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
import { ShoppingBag, Bitcoin, Lock, MessageCircle, CreditCard, Tag, X } from "lucide-react";
import { useRouter } from "next/navigation";

type PayMethod = "card" | "crypto" | "discord";

interface PromoResult {
  code: string;
  type: string;
  value: number;
  discount: number;
  newTotal: number;
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState(user?.email ?? "");
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoResult | null>(null);

  const finalTotal = appliedPromo ? appliedPromo.newTotal : total;

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

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput.trim(), total }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAppliedPromo(data);
      setPromoInput("");
    } catch (err: unknown) {
      setPromoError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError("");
  };

  const handleCheckout = async () => {
    setError("");

    if (payMethod === "discord") {
      window.open(`https://discord.gg/hardduckmarket`, "_blank");
      return;
    }

    if (!email && !user) { setError("Please enter your email address."); return; }

    setLoading(true);
    try {
      if (payMethod === "card") {
        const res = await fetch("/api/checkout/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            email: user?.email ?? email,
            promoCode: appliedPromo?.code,
            discountedTotal: finalTotal,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        sessionStorage.setItem("stripe_client_secret", data.clientSecret);
        sessionStorage.setItem("pending_order_id", data.orderId);
        router.push("/checkout/payment");
      } else {
        const res = await fetch("/api/checkout/crypto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            email: user?.email ?? email,
            promoCode: appliedPromo?.code,
            discountedTotal: finalTotal,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        clearCart();
        window.location.href = data.hostedUrl;
      }
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

            {/* Email */}
            {payMethod !== "discord" && (
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
                    <Input id="email" type="email" placeholder="you@example.com" value={email}
                      onChange={(e) => setEmail(e.target.value)} />
                    <p className="text-xs text-muted-foreground">
                      Your order confirmation and license key will be sent here.{" "}
                      <Link href="/login" className="text-primary underline">Have an account?</Link>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Payment method */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-base font-semibold">Payment Method</h2>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setPayMethod("card")}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors ${
                    payMethod === "card" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}>
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Card</p>
                    <p className="text-xs text-muted-foreground">Visa, Apple Pay…</p>
                  </div>
                </button>

                <button onClick={() => setPayMethod("crypto")}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors ${
                    payMethod === "crypto" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}>
                  <Bitcoin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Crypto</p>
                    <p className="text-xs text-muted-foreground">BTC, ETH…</p>
                  </div>
                </button>

                <button onClick={() => setPayMethod("discord")}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors ${
                    payMethod === "discord" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}>
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">PayPal</p>
                    <p className="text-xs text-muted-foreground">via Discord</p>
                  </div>
                </button>
              </div>

              {payMethod === "card" && <p className="mt-3 text-xs text-muted-foreground">Pay securely with your card, Apple Pay or Google Pay via Stripe.</p>}
              {payMethod === "crypto" && <p className="mt-3 text-xs text-muted-foreground">You'll be redirected to NOWPayments to complete your payment securely.</p>}
              {payMethod === "discord" && <p className="mt-3 text-xs text-muted-foreground">You'll be redirected to our Discord. Open a ticket and we'll process your PayPal payment manually.</p>}
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">{error}</div>
            )}

            <Button onClick={handleCheckout} disabled={loading} size="lg" className="w-full">
              <Lock className="mr-2 h-4 w-4" />
              {loading ? "Processing…"
                : payMethod === "discord" ? "Continue to Discord"
                : payMethod === "crypto" ? `Pay with Crypto — ${siteConfig.currency}${finalTotal.toFixed(2)}`
                : `Continue to Payment — ${siteConfig.currency}${finalTotal.toFixed(2)}`}
            </Button>
          </div>

          {/* Summary */}
          <div className="h-fit rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-base font-semibold">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={`${item.productId}-${item.optionName}`} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.productName} ({item.optionName}) × {item.quantity}</span>
                  <span>{siteConfig.currency}{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Promo code */}
            <div className="mt-4 space-y-2">
              {appliedPromo ? (
                <div className="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-xs font-mono font-bold text-green-400">{appliedPromo.code}</span>
                    <span className="text-xs text-green-400">
                      -{appliedPromo.type === "percent" ? `${appliedPromo.value}%` : `${siteConfig.currency}${appliedPromo.value}`}
                    </span>
                  </div>
                  <button onClick={handleRemovePromo} className="text-green-400 hover:text-green-300">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    className="h-9 text-sm font-mono"
                  />
                  <Button size="sm" variant="outline" onClick={handleApplyPromo} disabled={promoLoading} className="h-9 px-3">
                    {promoLoading ? "..." : "Apply"}
                  </Button>
                </div>
              )}
              {promoError && <p className="text-xs text-destructive">{promoError}</p>}
            </div>

            <div className="mt-4 border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{siteConfig.currency}{total.toFixed(2)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">Discount</span>
                  <span className="text-green-400">-{siteConfig.currency}{appliedPromo.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
                <span>Total</span>
                <span className="text-primary">{siteConfig.currency}{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}