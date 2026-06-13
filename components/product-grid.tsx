"use client";

import { ProductCard } from "./product-card";
import { games } from "@/config/games";

export function ProductGrid() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {games.map((game) => (
          <ProductCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}