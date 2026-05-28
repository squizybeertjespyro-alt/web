"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import { games } from "@/config/games";

// ============================================
// This component reads from config/games.ts
// To add games, edit that file - not this one!
// ============================================

export function ProductGrid() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      return game.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 border-border bg-card pl-4 pr-12 text-base text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <Button size="lg" className="h-12 px-8">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {filteredGames.map((game) => (
          <ProductCard key={game.id} game={game} />
        ))}
      </div>

      {/* No Results */}
      {filteredGames.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg text-muted-foreground">No games found.</p>
        </div>
      )}
    </div>
  );
}
