"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use } from "react";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { games } from "@/config/games";
import { getProductBySlug, type ProductOption } from "@/config/products";
import { siteConfig } from "@/config/site";
import { useCart } from "@/context/cart-context";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const game = games.find((g) => g.slug === product.gameSlug);
  const { addItem } = useCart();

  const [selectedOption, setSelectedOption] = useState<ProductOption>(product.options[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const currentPrice = selectedOption.salePrice ?? selectedOption.price;
  const totalPrice = currentPrice * quantity;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      optionName: selectedOption.name,
      price: currentPrice,
      quantity,
      image: product.image,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          {game && (
            <>
              <Link href={`/product-category/${game.slug}`} className="hover:text-foreground">{game.name}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative max-w-md mx-auto lg:mx-0">
            {product.onSale && (
              <div className="absolute left-4 top-4 z-10 rounded bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">Sale!</div>
            )}
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-card">
              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-foreground">{product.name}</h1>
              <div className="flex items-center gap-3">
                {selectedOption.salePrice && (
                  <span className="text-xl text-muted-foreground line-through">{siteConfig.currency}{selectedOption.price.toFixed(2)}</span>
                )}
                <span className="text-3xl font-bold text-primary">{siteConfig.currency}{currentPrice.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <span className={`inline-block rounded px-3 py-1 text-sm font-medium ${
                product.status === "Undetected" ? "bg-green-500/20 text-green-400"
                : product.status === "Detected" ? "bg-red-500/20 text-red-400"
                : "bg-yellow-500/20 text-yellow-400"
              }`}>
                {product.status}
              </span>
            </div>

            <p className="text-muted-foreground">{product.fullDescription}</p>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Type:</label>
              <div className="flex flex-wrap gap-2">
                {product.options.map((option) => (
                  <button key={option.name} onClick={() => setSelectedOption(option)}
                    disabled={!option.inStock}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      selectedOption.name === option.name
                        ? "border-primary bg-primary text-primary-foreground"
                        : option.inStock
                        ? "border-border bg-card text-foreground hover:border-primary"
                        : "cursor-not-allowed border-border bg-muted text-muted-foreground opacity-50"
                    }`}>
                    {option.name}{!option.inStock && " (Out of Stock)"}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-card p-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Selected:</span>
                <span className="text-foreground">{selectedOption.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stock:</span>
                <span className={selectedOption.inStock ? "text-green-400" : "text-red-400"}>
                  {selectedOption.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex items-center rounded-lg border border-border">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-muted-foreground hover:text-foreground">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-foreground">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-muted-foreground hover:text-foreground">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button size="lg" className="flex-1" disabled={!selectedOption.inStock} onClick={handleAddToCart}>
                {added ? (
                  <><Check className="mr-2 h-5 w-5" />Added to Cart!</>
                ) : (
                  <><ShoppingCart className="mr-2 h-5 w-5" />Add to Cart — {siteConfig.currency}{totalPrice.toFixed(2)}</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
