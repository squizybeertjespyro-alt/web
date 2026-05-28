"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface CartItem {
  productId: string;
  productName: string;
  optionName: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, optionName: string) => void;
  updateQuantity: (productId: string, optionName: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === newItem.productId && i.optionName === newItem.optionName
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === newItem.productId && i.optionName === newItem.optionName
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((productId: string, optionName: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.optionName === optionName))
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, optionName: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, optionName);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.optionName === optionName ? { ...i, quantity } : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
