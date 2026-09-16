"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { siteConfig } from "@/config/site";
import { Lock } from "lucide-react";

declare global {
  interface Window {
    Stripe?: (key: string) => StripeInstance;
  }
}

interface StripeInstance {
  elements: (opts: object) => ElementsInstance;
  confirmPayment: (opts: object) => Promise<{ error?: { message: string } }>;
}

interface ElementsInstance {
  create: (type: string, opts?: object) => StripeElement;
  submit: () => Promise<{ error?: { message: string } }>;
}

interface StripeElement {
  mount: (el: HTMLElement) => void;
  destroy: () => void;
}

export default function PaymentPage() {
  const router = useRouter();
  const { total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const elementsRef = useRef<ElementsInstance | null>(null);
  const stripeRef = useRef<StripeInstance | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    const clientSecret = sessionStorage.getItem("stripe_client_secret");
    if (!clientSecret) { router.push("/checkout"); return; }

    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.onload = () => {
      if (!window.Stripe) return;
      const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      stripeRef.current = stripe;

      const elements = stripe.elements({
        clientSecret,
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#b100ff",
            colorBackground: "#111",
            colorText: "#ffffff",
            borderRadius: "8px",
          }
        },
      });
      elementsRef.current = elements;

      const paymentEl = elements.create("payment");
      const container = document.getElementById("payment-element");
      if (container && !mountedRef.current) {
        paymentEl.mount(container);
        mountedRef.current = true;
        setReady(true);
      }
    };
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [router]);

  const handleSubmit = async () => {
    if (!stripeRef.current || !elementsRef.current) return;
    setLoading(true);
    setError("");

    const { error: submitError } = await elementsRef.current.submit();
    if (submitError) { setError(submitError.message ?? "Validation failed"); setLoading(false); return; }

    const orderId = sessionStorage.getItem("pending_order_id");

    const { error: confirmError } = await stripeRef.current.confirmPayment({
      elements: elementsRef.current,
      confirmParams: {
        return_url: `${window.location.origin}/order-success?orderId=${orderId}`,
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed");
      setLoading(false);
    } else {
      clearCart();
      sessionStorage.removeItem("stripe_client_secret");
      sessionStorage.removeItem("pending_order_id");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-12">
        <h1 className="mb-2 text-2xl font-bold">Complete Payment</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Total: <span className="font-semibold text-foreground">{siteConfig.currency}{total.toFixed(2)}</span>
        </p>

        <div className="rounded-xl border border-border bg-card p-6">
          <div id="payment-element" className="min-h-[200px]">
            {!ready && (
              <div className="flex h-48 items-center justify-center text-muted-foreground text-sm">
                Loading payment form…
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading || !ready}
            size="lg"
            className="mt-6 w-full"
          >
            <Lock className="mr-2 h-4 w-4" />
            {loading ? "Processing…" : `Pay ${siteConfig.currency}${total.toFixed(2)}`}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Secured by Stripe. Apple Pay and Google Pay supported on compatible devices.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}