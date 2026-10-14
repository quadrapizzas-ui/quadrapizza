"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { FlameKindling, Crown, Beer } from "lucide-react";
import { useProductsStore } from "@/lib/store/productsStore";
import type { Product } from "@/lib/store/productsStore";
import { useCart } from "@/hooks/useCart";
import { CatalogHeader } from "@/components/pos/CatalogHeader";
import { CatalogHero } from "@/components/pos/CatalogHero";
import { SearchBar } from "@/components/pos/SearchBar";
import { ProductSection } from "@/components/pos/ProductSection";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { LocalShowcase } from "@/components/pos/LocalShowcase";
import { MobileCartBar } from "@/components/pos/MobileCartBar";
import { CatalogFooter } from "@/components/pos/CatalogFooter";
import { RestaurantJsonLd } from "@/components/seo/RestaurantJsonLd";

const AddToCartModal = dynamic(() => import("@/components/pos/AddToCartModal").then(mod => mod.AddToCartModal), { ssr: false });
const CartSidebar = dynamic(() => import("@/components/pos/CartSidebar").then(mod => mod.CartSidebar), { ssr: false });

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
    clearCart,
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
  const almacen = products.filter((p) => [5, 7].includes(p.categoryId || 0) && p.stock).filter(filterBySearch);
  const bebidas = products.filter((p) => p.categoryId === 4 && p.stock).filter(filterBySearch);

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-screen text-white selection:bg-zinc-950 selection:text-amber-400 overflow-x-hidden bg-quadra-orange">
      {/* Schema.org Structured Data para Google Rich Snippets */}
      <RestaurantJsonLd />
      
      {/* Header Sticky con logo original, nombre intacto y animaciones GPU */}
      <CatalogHeader cartItemCount={cartItems.length} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Banner Hero Compacto con H1 Semántico e Identidad Quadra */}
        <CatalogHero />

        {/* Barra de Búsqueda y Título de Catálogo */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
              Explorá Nuestro Menú
            </h2>
            <p className="text-xs text-orange-100 font-medium drop-shadow-sm">
              Pizzas rectangulares exclusivas, lomos, burgers y delicias para compartir.
            </p>
          </div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Secciones Destacadas con Personalidad Quadra y Shimmer */}
        <ProductSection 
          title="Ofertas de la Casa" 
          icon={<FlameKindling size={20} className="text-amber-400 animate-pulse" />} 
          products={offers} 
          onAddToCart={setSelectedProductForCart} 
          isOffer 
        />
        
        <ProductSection 
          title="Tentaciones & Postres" 
          icon={<Crown size={20} className="text-amber-300" />} 
          products={almacen} 
          onAddToCart={setSelectedProductForCart} 
        />
        
        <ProductSection 
          title="Bebidas Frías" 
          icon={<Beer size={20} className="text-sky-300" />} 
          products={bebidas} 
          onAddToCart={setSelectedProductForCart} 
        />

        {/* Catálogo Completo con Liquid Sliding Pill Filters */}
        <ProductGrid 
          products={products} 
          categories={categories} 
          searchQuery={searchQuery} 
          onAddToCart={setSelectedProductForCart} 
        />

        {/* Sección de Nuestro Local Auténtico en Yocsina */}
        <LocalShowcase />
      </main>

      {/* Barra Flotante de Carrito en Móviles */}
      <MobileCartBar 
        cartItemCount={cartItems.length}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Pie de Página Semántico con Enfoque SEO Local */}
      <CatalogFooter />

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
          onClearCart={clearCart}
        />
      )}
    </div>
  );
}
