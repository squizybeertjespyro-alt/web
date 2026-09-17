"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Mail, Package, BookOpen } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!cleared) {
      localStorage.removeItem("cart");
      sessionStorage.removeItem("stripe_client_secret");
      sessionStorage.removeItem("pending_order_id");
      setCleared(true);
    }
  }, [cleared]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <h1 className="mb-3 text-3xl font-bold">Order Confirmed!</h1>
        <p className="mb-2 text-muted-foreground">
          Thank you for your purchase. Your order has been received.
        </p>
        {orderId && (
          <p className="mb-8 text-sm text-muted-foreground">
            Order ID:{" "}
            <span className="font-mono text-foreground">
              #{orderId.slice(-8).toUpperCase()}
            </span>
          </p>
        )}

        <div className="mb-8 grid gap-4 text-left">
          <div className="flex gap-4 rounded-xl border border-border bg-card p-4">
            <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
            <div>
              <p className="font-medium">Check your email</p>
              <p className="text-sm text-muted-foreground">
                Your order confirmation and license key will be sent to your email address shortly.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-xl border border-border bg-card p-4">
            <BookOpen className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
            <div>
              <p className="font-medium">How to activate your product</p>
              <p className="text-sm text-muted-foreground mb-2">
                Check our documentation for step-by-step activation and download instructions.
              </p>
              <Link
                href="/docs"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline hover:opacity-80"
              >
                📖 View Documentation →
              </Link>
            </div>
          </div>

          <div className="flex gap-4 rounded-xl border border-border bg-card p-4">
            <Package className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
            <div>
              <p className="font-medium">Need help?</p>
              <p className="text-sm text-muted-foreground">
                If you don't receive your email within 10 minutes, contact us on{" "}
                <a
                  href={siteConfig.socials.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Discord
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <Button asChild variant="outline">
            <Link href="/docs"> Documentation</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/account">View Orders</Link>
          </Button>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}