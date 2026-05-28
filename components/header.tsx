"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, ShoppingCart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-foreground">
            {siteConfig.name.slice(0, -6)}<span className="text-primary">{siteConfig.name.slice(-6)}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative hidden md:flex" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Account */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/account"><User className="mr-2 h-4 w-4" />{user.name ?? "Account"}</Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={logout} title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" className="hidden md:flex" asChild>
              <Link href="/login"><User className="mr-2 h-4 w-4" />Sign In</Link>
            </Button>
          )}

          {/* Discord */}
          {siteConfig.socials.discord && (
            <Button asChild className="hidden md:inline-flex">
              <a href={siteConfig.socials.discord} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" className="mr-2 h-4 w-4">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Discord
              </a>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col px-4 py-4">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}
                className="py-3 text-base font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
            <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />Cart {itemCount > 0 && `(${itemCount})`}
                </Link>
              </Button>
              {user ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
                    <User className="mr-2 h-4 w-4" />Account
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <User className="mr-2 h-4 w-4" />Sign In
                  </Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
