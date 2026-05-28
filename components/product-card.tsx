"use client";

import Link from "next/link";
import Image from "next/image";
import type { Game } from "@/config/games";

interface ProductCardProps {
  game: Game;
}

export function ProductCard({ game }: ProductCardProps) {
  return (
    <Link
      href={`/product-category/${game.slug}`}
      className="group relative block overflow-hidden rounded-lg bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={game.image}
          alt={game.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-3">
        <h3 className="text-sm font-semibold text-foreground md:text-base">
          {game.name}
        </h3>
      </div>
    </Link>
  );
}
