"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen text-foreground">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-white">Welcome to Our Store</h1>
            <p className="text-lg text-muted-foreground">
              Discover the best games at the lowest prices.
            </p>
          </div>
        </main>
        <Footer />
      
    </div>
  );
}