"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.alreadySubscribed ? "You're already subscribed!" : "You're subscribed! 🎉");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong");
    }
  };

  return (
    <footer className="mt-auto border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-xl font-bold text-foreground">
              {siteConfig.name.slice(0, -6)}<span className="text-primary">{siteConfig.name.slice(-6)}</span>
            </Link>
            <p className="text-sm text-muted-foreground">{siteConfig.description}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Home</Link></li>
              <li><Link href="/shop" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Shop</Link></li>
              <li><Link href="/docs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Documentation</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/tos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Terms of Service</Link></li>
              <li>
                <a href={siteConfig.socials.discord} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Contact us on Discord
                </a>
              </li>
              {siteConfig.socials.trustpilot && (
                <li>
                  <a href="https://www.trustpilot.com/review/hardduckmarket.xyz" target="_blank" rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Leave a review on Trustpilot
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Stay Updated</h4>
            <p className="mb-3 text-sm text-muted-foreground">Get notified about new products and deals.</p>
            {status === "success" ? (
              <p className="text-sm font-medium text-primary">{message}</p>
            ) : (
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  className="h-9 text-sm"
                />
                <Button
                  onClick={handleSubscribe}
                  disabled={status === "loading"}
                  size="sm"
                  className="w-full"
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </Button>
                {status === "error" && (
                  <p className="text-xs text-destructive">{message}</p>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {siteConfig.socials.discord && (
              <a href={siteConfig.socials.discord} target="_blank" rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            )}
            <Link href="/tos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}