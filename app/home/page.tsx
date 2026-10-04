import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Zap, HeadphonesIcon, DollarSign, Shield, Star, Package } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Delivery",
    description: "Your license key is delivered to your email the second your payment is confirmed. No waiting, no delays.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Got a problem? Our team is available around the clock on Discord to help you out.",
  },
  {
    icon: DollarSign,
    title: "Best Prices",
    description: "We offer the most competitive prices on the market. Quality products without breaking the bank.",
  },
  {
    icon: Shield,
    title: "Trusted & Safe",
    description: "Hundreds of satisfied customers. We take your trust seriously and deliver on every order.",
  },
  {
    icon: Star,
    title: "Top Quality",
    description: "We only sell verified, working license keys. Every product is tested before it hits our store.",
  },
  {
    icon: Package,
    title: "Reliable Stock",
    description: "We keep our inventory stocked and up to date so you never have to wait for a restock.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="mx-auto max-w-5xl px-4 text-center lg:px-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-3.5 w-3.5" />
              Instant digital delivery
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              The Most Trusted<br />
              <span className="text-primary">Digital Key Store</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              Premium license keys delivered instantly to your inbox. Cheap prices, and 24/7 support — everything you need in one place.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/shop">Browse Shop</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
                <a href="https://discord.gg/hardduckmarket" target="_blank" rel="noopener noreferrer">
                  Join Discord
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-14 text-center">
              <h2 className="mb-3 text-3xl font-bold text-foreground">Why choose us?</h2>
              <p className="text-muted-foreground">We built HardDuckMarket to be the store we always wished existed.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="cyber-card space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
            <div className="cyber-card space-y-6 p-10">
              <h2 className="text-3xl font-bold text-foreground">Ready to shop?</h2>
              <p className="text-muted-foreground">
                Browse our full catalog and get your key delivered instantly.
              </p>
              <Button asChild size="lg" className="h-12 px-10 text-base">
                <Link href="/shop">Go to Shop</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}