"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { games } from "@/config/games";
import { getProductsByGame, type Product } from "@/config/products";
import { siteConfig } from "@/config/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const { slug } = use(params);

  const game = games.find((g) => g.slug === slug);
  if (!game) notFound();

  const products = getProductsByGame(slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{game.name}</span>
        </nav>

        <h1 className="mb-8 text-3xl font-bold text-foreground">{game.name}</h1>

        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">No products available yet.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const lowestPrice = Math.min(...product.options.map((o) => o.salePrice ?? o.price));
  const [inStock, setInStock] = useState<boolean | null>(null);

  useEffect(() => {
    if (product.comingSoon) return;

    const checkStock = async () => {
      try {
        const results = await Promise.all(
          product.options.map((option) =>
            fetch(`/api/stock?productId=${encodeURIComponent(product.id)}&optionName=${encodeURIComponent(option.name)}`)
              .then((r) => r.json())
              .then((d) => d.inStock as boolean)
          )
        );
        setInStock(results.some(Boolean));
      } catch {
        setInStock(null);
      }
    };
    checkStock();
  }, [product]);

  return (
    <Link
      href={product.comingSoon ? "#" : `/product/${product.slug}`}
      onClick={product.comingSoon ? (e) => e.preventDefault() : undefined}
      className={`group relative overflow-hidden rounded-lg bg-card transition-all duration-300 ${
        product.comingSoon ? "cursor-default opacity-80" : "hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10"
      }`}
    >
      {product.onSale && !product.comingSoon && (
        <div className="absolute left-3 top-3 z-10 rounded bg-primary px-2 py-1 text-xs font-bold text-black">
          Sale!
        </div>
      )}

      {/* Badge */}
      {product.comingSoon ? (
        <div className="absolute right-3 top-3 z-10 rounded-full px-2 py-0.5 text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
          Coming Soon
        </div>
      ) : inStock !== null ? (
        <div className={`absolute right-3 top-3 z-10 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
          inStock
            ? "bg-green-500/20 text-green-400 border-green-500/30"
            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
        }`}>
          {inStock ? "In Stock" : "Stock Soon"}
        </div>
      ) : null}

      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      <div className="p-4">
        <h3 className="mb-1 font-semibold text-foreground">{product.name}</h3>
        <p className="mb-2 text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>

        <div className="flex items-center justify-between">
          {product.comingSoon ? (
            <span className="text-sm font-medium text-yellow-400">Coming Soon</span>
          ) : (
            <span className="font-bold text-primary">
              {siteConfig.currency}{lowestPrice.toFixed(2)}
              {product.options.length > 1 && "+"}
            </span>
          )}

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