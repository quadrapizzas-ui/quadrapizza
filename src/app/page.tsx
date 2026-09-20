"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Tag, Utensils, ShoppingBasket, Coffee } from "lucide-react";
import { useProductsStore } from "@/lib/store/productsStore";
import type { Product } from "@/lib/store/productsStore";
import { useCart } from "@/hooks/useCart";
import { CatalogHeader } from "@/components/catalog/CatalogHeader";
import { SearchBar } from "@/components/catalog/SearchBar";
import { ProductSection } from "@/components/catalog/ProductSection";
import { ProductGrid } from "@/components/catalog/ProductGrid";
const AddToCartModal = dynamic(() => import("@/components/catalog/AddToCartModal").then(mod => mod.AddToCartModal), { ssr: false });
const CartSidebar = dynamic(() => import("@/components/catalog/CartSidebar").then(mod => mod.CartSidebar), { ssr: false });

export default function CatalogPage() {
  const { products, categories, neighborhoods, extras, varieties } = useProductsStore();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    cartTotal,
  } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductForCart, setSelectedProductForCart] = useState<Product | null>(null);

  // ─── Filtered product lists ─────────────────────────────────────────────────

  const filterBySearch = (p: Product) => {
    if (searchQuery.trim().length >= 3) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !(p.description || "").toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  };

  const offers = products.filter((p) => p.isOffer && p.stock).filter(filterBySearch);
  const menuDelDia = products.filter((p) => p.categoryId === 6 && p.stock).filter(filterBySearch);
  const almacen = products.filter((p) => [5, 7].includes(p.categoryId || 0) && p.stock).filter(filterBySearch);
  const bebidas = products.filter((p) => p.categoryId === 4 && p.stock).filter(filterBySearch);

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-orange-600 selection:text-white pb-20 overflow-x-hidden">
      
      <CatalogHeader cartItemCount={cartItems.length} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Título Principal y Buscador */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tighter shrink-0">Nuestro Catálogo</h2>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Secciones Destacadas */}
        <ProductSection title="En Oferta" icon={<Tag fill="currentColor" size={20} />} color="red" products={offers} onAddToCart={setSelectedProductForCart} isOffer />
        <ProductSection title="Menú del Día" icon={<Utensils size={20} />} color="emerald" products={menuDelDia} onAddToCart={setSelectedProductForCart} />
        <ProductSection title="Déjate Tentar" icon={<ShoppingBasket size={20} />} color="purple" products={almacen} onAddToCart={setSelectedProductForCart} />
        <ProductSection title="Bebidas" icon={<Coffee size={20} />} color="blue" products={bebidas} onAddToCart={setSelectedProductForCart} />

        {/* Catálogo Completo con Filtros */}
        <ProductGrid products={products} categories={categories} searchQuery={searchQuery} onAddToCart={setSelectedProductForCart} />
      </main>

      {/* Modal: Agregar al Carrito */}
      {selectedProductForCart && (
        <AddToCartModal
          product={selectedProductForCart}
          extras={extras}
          varieties={varieties}
          onConfirm={(product, quantity, unitType, quadraSelections, selectedExtras, selectedCustomVariety) => {
            addToCart(product, quantity, unitType, quadraSelections, selectedExtras, selectedCustomVariety);
            setSelectedProductForCart(null);
          }}
          onClose={() => setSelectedProductForCart(null)}
        />
      )}

      {/* Sidebar: Carrito */}
      {isCartOpen && (
        <CartSidebar
          cartItems={cartItems}
          neighborhoods={neighborhoods}
          cartTotal={cartTotal}
          onUpdateQuantity={updateCartItemQuantity}
          onRemove={removeFromCart}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
}
