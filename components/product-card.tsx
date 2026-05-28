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
      className="group relative block overflow-hidden rounded-xl border border-purple-500/20 bg-[#12001f]/60 backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-purple-500/60 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-sm font-semibold text-purple-200 md:text-base drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
          {game.name}
        </h3>
      </div>
    </Link>
  );
}