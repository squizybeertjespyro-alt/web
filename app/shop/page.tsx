import { Header } from "@/components/header";
import { ProductGrid } from "@/components/product-grid";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function ShopPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-primary transition-colors hover:text-primary/80"
            >
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Shop</span>
          </nav>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-balance text-2xl font-bold italic text-primary md:text-3xl lg:text-4xl">
              Best Gaming Products for Your Favorite Games
            </h1>
          </div>

          {/* Product Grid */}
          <ProductGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
}
