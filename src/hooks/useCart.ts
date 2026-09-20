"use client";

import { useState, useCallback } from "react";
import type { Product, Extra, Neighborhood } from "@/lib/store/productsStore";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CartItem = {
  id: string;
  productId: number;
  name: string;
  quantity: number;
  unitType: "unidad" | "media_docena" | "docena";
  price: string;
  pricePerHalfDozen?: string;
  pricePerDozen?: string;
  originalSaleType: "unidad" | "docena" | "combo" | "quadra";
  quadraSelections?: string[];
  extras?: { name: string; price: number }[];
  customVariety?: string;
  customVarietyPrice?: number;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function parsePrice(priceStr?: string): number {
  if (!priceStr) return 0;
  const numeric = priceStr.replace(/\./g, "").replace(/[^0-9]/g, "");
  return Number(numeric) || 0;
}

export function formatPrice(num: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(num);
}

export function getItemSubtotal(item: CartItem): number {
  let base = 0;
  if (item.unitType === "docena") {
    if (item.originalSaleType === "docena") {
      base = parsePrice(item.price) * item.quantity;
    } else {
      base = item.pricePerDozen
        ? parsePrice(item.pricePerDozen) * item.quantity
        : parsePrice(item.price) * 12 * item.quantity;
    }
  } else if (item.unitType === "media_docena") {
    base = item.pricePerHalfDozen
      ? parsePrice(item.pricePerHalfDozen) * item.quantity
      : parsePrice(item.price) * 6 * item.quantity;
  } else {
    base = parsePrice(item.price) * item.quantity;
  }
  const extrasTotal = item.extras
    ? item.extras.reduce((acc, e) => acc + e.price, 0) * item.quantity
    : 0;
  const varietyTotal = (item.customVarietyPrice || 0) * item.quantity;
  return base + extrasTotal + varietyTotal;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback(
    (
      product: Product,
      quantity: number,
      unitType: "unidad" | "media_docena" | "docena",
      quadraSelections: string[],
      selectedExtras: Extra[],
      selectedCustomVariety: string
    ) => {
      const selectionsKey =
        quadraSelections.length > 0
          ? `-${quadraSelections.join("-")}`
          : "";
      const extrasKey =
        selectedExtras.length > 0
          ? `-ext-${selectedExtras.map((e) => e.id).join("-")}`
          : "";
      const varietyKey = selectedCustomVariety
        ? `-var-${selectedCustomVariety}`
        : "";
      const itemId = `${product.id}-${unitType}${selectionsKey}${extrasKey}${varietyKey}`;

      setCartItems((current) => {
        const existingIndex = current.findIndex((item) => item.id === itemId);
        if (existingIndex >= 0) {
          const updated = [...current];
          updated[existingIndex].quantity += quantity;
          return updated;
        }
        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          name: product.name,
          quantity,
          unitType,
          price: product.price,
          pricePerHalfDozen: product.pricePerHalfDozen,
          pricePerDozen: product.pricePerDozen,
          originalSaleType: product.saleType,
          quadraSelections:
            product.saleType === "quadra" ? [...quadraSelections] : undefined,
          extras:
            selectedExtras.length > 0
              ? selectedExtras.map((e) => ({ name: e.name, price: e.price }))
              : undefined,
          customVariety: selectedCustomVariety || undefined,
          customVarietyPrice:
            product.customVarieties?.find(
              (v) => v.name === selectedCustomVariety
            )?.price || 0,
        };
        return [...current, newItem];
      });

      setIsCartOpen(true);
    },
    []
  );

  const removeFromCart = useCallback((id: string) => {
    setCartItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateCartItemQuantity = useCallback((id: string, delta: number) => {
    setCartItems((current) =>
      current
        .map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const cartTotal = cartItems.reduce(
    (acc, item) => acc + getItemSubtotal(item),
    0
  );

  return {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    cartTotal,
  };
}
