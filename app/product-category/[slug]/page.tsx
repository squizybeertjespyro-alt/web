import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { games } from "@/config/games";
import { getProductsByGame, type Product } from "@/config/products";
import { siteConfig } from "@/config/site";

// ============================================
// This page is AUTOMATIC!
// Just add games to config/games.ts and 
// products to config/products.ts
// Pages are created automatically!
// ============================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Find the game
  const game = games.find((g) => g.slug === slug);
  if (!game) {
    notFound();
  }

  // Get products for this game
  const products = getProductsByGame(slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{game.name}</span>
        </nav>

        {/* Title */}
        <h1 className="mb-8 text-3xl font-bold text-foreground">{game.name}</h1>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">
              No products available yet. Add products in config/products.ts
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Product card component for category page
function ProductCard({ product }: { product: Product }) {
  const lowestPrice = Math.min(...product.options.map((o) => o.salePrice ?? o.price));
  const highestPrice = Math.max(...product.options.map((o) => o.price));

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative overflow-hidden rounded-lg bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10"
    >
      {/* Sale Badge */}
      {product.onSale && (
        <div className="absolute left-3 top-3 z-10 rounded bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
          Sale!
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 font-semibold text-foreground">{product.name}</h3>
        <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
          {product.shortDescription}
        </p>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          {product.onSale && (
            <span className="text-sm text-muted-foreground line-through">
              {siteConfig.currency}{highestPrice.toFixed(2)}
            </span>
          )}
          <span className="font-bold text-primary">
            {siteConfig.currency}{lowestPrice.toFixed(2)}
            {product.options.length > 1 && "+"}
          </span>
        </div>

        {/* Status */}
        <div className="mt-2">
          <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
            product.status === "Undetected" 
              ? "bg-green-500/20 text-green-400"
              : product.status === "Detected"
              ? "bg-red-500/20 text-red-400"
              : "bg-yellow-500/20 text-yellow-400"
          }`}>
            {product.status}
          </span>
        </div>
      </div>
    </Link>
  );
}
