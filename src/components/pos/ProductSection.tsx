"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/store/productsStore";
import type { ReactNode } from "react";

interface ProductSectionProps {
  title: string;
  icon: ReactNode;
  products: Product[];
  onAddToCart: (product: Product) => void;
  isOffer?: boolean;
}

export function ProductSection({ title, icon, products, onAddToCart, isOffer = false }: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section aria-label={`Sección: ${title}`} className="mb-14 content-visibility-auto">
      {/* Encabezado con Medallón Gastronómico de Autor */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-2xl bg-zinc-950/80 border border-white/20 text-amber-400 shadow-xl backdrop-blur-md">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
            {title}
          </h2>
        </div>
      </div>

      {/* Carrusel de Comida Flotante Sin Bordes */}
      <div className="flex overflow-x-auto gap-5 sm:gap-7 pb-6 pt-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
        {products.map((p, idx) => (
          <article 
            key={p.id} 
            className="group shrink-0 w-[260px] sm:w-[280px] bg-transparent border-0 rounded-2xl flex flex-col relative select-none"
          >
            {/* Badge de Oferta con Shimmer */}
            {isOffer && (
              <div className="absolute top-2 left-2 overflow-hidden rounded-lg z-20 shadow-xl border border-white/25">
                <div className="relative bg-zinc-950 text-amber-400 font-black text-[10px] tracking-wider px-2.5 py-1 uppercase font-display">
                  OFERTA
                  <span 
                    aria-hidden="true" 
                    className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-fire-shimmer" 
                  />
                </div>
              </div>
            )}

            {/* Comida Flotante con Sombras 3D Dual-Layer (Cero Marcos) */}
            <div className="aspect-square relative flex items-center justify-center p-2">
              <div className="relative w-full h-full floating-food">
                <Image 
                  src={p.image} 
                  alt={`${p.name} - Quadra Pizza`} 
                  fill 
                  sizes="280px" 
                  priority={isOffer && idx < 2}
                  loading={isOffer && idx < 2 ? undefined : "lazy"}
                  className="object-contain pointer-events-none" 
                />
              </div>
            </div>

            {/* Detalles del Producto Flotante */}
            <div className="mt-2 flex-1 flex flex-col justify-between px-1">
              <div>
                <h3 className="font-bold text-base sm:text-lg leading-snug mb-1 text-white group-hover:text-amber-300 transition-colors font-display line-clamp-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]">
                  {p.name}
                </h3>
                <p className="text-xs text-orange-100/90 line-clamp-2 leading-relaxed font-sans font-medium drop-shadow-sm">
                  {p.description}
                </p>
              </div>

              {/* Fila de Precio y Botón de Agregar al Carrito */}
              <div className="mt-3 pt-2 flex items-end justify-between gap-3">
                <div className="flex flex-col">
                  {isOffer && p.oldPrice && (
                    <span className="text-xs text-orange-200/80 line-through font-semibold drop-shadow-sm">
                      {p.oldPrice}
                    </span>
                  )}
                  <span className="font-black text-2xl sm:text-3xl tracking-tight text-white font-display leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                    {p.price}
                  </span>
                </div>

                <button 
                  onClick={() => onAddToCart(p)} 
                  aria-label={`Agregar ${p.name} al pedido`}
                  className="w-10 h-10 rounded-xl bg-zinc-950 text-white hover:bg-black hover:text-amber-400 border border-white/20 flex items-center justify-center transition-all duration-200 active:scale-85 hover:scale-110 shadow-2xl shrink-0 group-hover:border-amber-400/60"
                >
                  <Plus size={20} className="transition-transform group-hover:rotate-90 duration-300" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
