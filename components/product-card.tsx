"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Game } from "@/config/games";
import { products } from "@/config/products";

interface ProductCardProps {
  game: Game;
}

export function ProductCard({ game }: ProductCardProps) {
  const [inStock, setInStock] = useState<boolean | null>(null);

  useEffect(() => {
    if (game.comingSoon) return; // skip stock check for coming soon games

    const gameProducts = products.filter((p) => p.gameSlug === game.slug);
    if (gameProducts.length === 0) return;

    const checkStock = async () => {
      try {
        const results = await Promise.all(
          gameProducts.flatMap((product) =>
            product.options.map((option) =>
              fetch(`/api/stock?productId=${encodeURIComponent(product.id)}&optionName=${encodeURIComponent(option.name)}`)
                .then((r) => r.json())
                .then((d) => d.inStock as boolean)
            )
          )
        );
        setInStock(results.some(Boolean));
      } catch {
        setInStock(null);
      }
    };

    checkStock();
  }, [game.slug, game.comingSoon]);

  return (
    <Link
      href={`/product-category/${game.slug}`}
      className="cyber-card group relative block overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={game.image}
          alt={game.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badge */}
        {game.comingSoon ? (
          <div className="absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            Coming Soon
          </div>
        ) : inStock !== null ? (
          <div className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            inStock
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
          }`}>
            {inStock ? "In Stock" : "Stock Soon"}
          </div>
        ) : null}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-sm font-semibold text-purple-200 md:text-base drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
          {game.name}
        </h3>
      </div>
    </Link>
  );
}