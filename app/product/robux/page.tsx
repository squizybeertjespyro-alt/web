"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Zap, Shield, DollarSign } from "lucide-react";

const PACKAGES = [
  { amount: "1,000 R$", price: "€5.99", discord: true },
  { amount: "2,500 R$", price: "€13.99", discord: true },
  { amount: "5,000 R$", price: "€25.99", discord: true },
  { amount: "7,500 R$+", price: "Custom", discord: true },
];

export default function RobuxPage() {
  const [robuxStock, setRobuxStock] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/robux-stock")
      .then((r) => r.json())
      .then((d) => setRobuxStock(d.robux))
      .catch(() => setRobuxStock(null));
  }, []);

  const inStock = robuxStock !== null && robuxStock > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/product-category/roblox-cheats" className="hover:text-foreground">Roblox</Link>
          <span>/</span>
          <span className="text-foreground">Robux</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left - image + info */}
          <div className="space-y-6">
            <div className="relative aspect-square max-w-sm overflow-hidden rounded-xl bg-card">
              <Image
                src="/images/roblox.png"
                alt="Robux"
                fill
                className="object-cover"
              />
            </div>

            <div className="cyber-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Availability</span>
                {robuxStock === null ? (
                  <span className="text-sm text-muted-foreground">Checking...</span>
                ) : inStock ? (
                  <span className="text-sm font-bold text-green-400">✅ In Stock — {robuxStock.toLocaleString()} R$ available</span>
                ) : (
                  <span className="text-sm font-bold text-red-400">❌ Out of Stock</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Delivery</span>
                <span className="text-sm text-foreground">Via Discord</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Payment</span>
                <span className="text-sm text-foreground">Crypto / PayPal via Discord</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="cyber-card flex flex-col items-center gap-1 py-3 text-center">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Fast</span>
              </div>
              <div className="cyber-card flex flex-col items-center gap-1 py-3 text-center">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Safe</span>
              </div>
              <div className="cyber-card flex flex-col items-center gap-1 py-3 text-center">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Cheap</span>
              </div>
            </div>
          </div>

          {/* Right - packages */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Robux</h1>
              <p className="text-muted-foreground">
                Get Robux at the best prices. Open a ticket on our Discord and we'll handle the rest. Fast, safe and reliable delivery.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-base font-semibold">Choose a package:</h2>
              {PACKAGES.map((pkg) => (
                <a
                  key={pkg.amount}
                  href="https://discord.gg/hardduckmarket"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${
                    inStock
                      ? "border-border bg-card hover:border-primary cursor-pointer"
                      : "border-border bg-muted opacity-50 cursor-not-allowed pointer-events-none"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-foreground">{pkg.amount}</p>
                    <p className="text-sm text-muted-foreground">via Discord</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{pkg.price}</p>
                  </div>
                </a>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="w-full"
              disabled={!inStock}
            >
              <a
                href="https://discord.gg/hardduckmarket"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                {inStock ? "Buy via Discord" : "Out of Stock"}
              </a>
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Open a ticket in our Discord server and mention the package you want. We'll confirm payment and deliver your Robux fast!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
