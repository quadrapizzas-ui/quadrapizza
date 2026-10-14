"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Plus, Filter, ChevronRight, LayoutGrid, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import type { Product, Category } from "@/lib/store/productsStore";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  searchQuery: string;
  onAddToCart: (product: Product) => void;
}

export const ProductGrid = React.memo(function ProductGrid({ products, categories, searchQuery, onAddToCart }: ProductGridProps) {
  const [selectedPath, setSelectedPath] = useState<number[]>([]);

  const handleSelectCategory = (categoryId: number | null, depth: number) => {
    if (categoryId === null) {
      setSelectedPath(selectedPath.slice(0, depth));
    } else {
      const newPath = [...selectedPath.slice(0, depth), categoryId];
      setSelectedPath(newPath);
    }
  };

  const getDescendantIds = (catId: number): number[] => {
    const children = categories.filter((c) => c.parentId === catId).map((c) => c.id);
    return children.reduce((acc, childId) => [...acc, ...getDescendantIds(childId)], children);
  };

  const isCategoryActive = (catId: number): boolean => {
    const descendantIds = [catId, ...getDescendantIds(catId)];
    return products.some((p) => p.stock && descendantIds.includes(p.categoryId || 0));
  };

  const activeCategoryId = selectedPath.length > 0 ? selectedPath[selectedPath.length - 1] : null;

  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      if (searchQuery.trim().length >= 3) {
        const q = searchQuery.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !(p.description || "").toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (activeCategoryId === null) return true;
      const validIds = [activeCategoryId, ...getDescendantIds(activeCategoryId)];
      return validIds.includes(p.categoryId || 0);
    });
  }, [products, searchQuery, activeCategoryId, categories]);

  const getCategoryBreadcrumbs = (categoryId: number) => {
    const crumbs: string[] = [];
    let currentId: number | null = categoryId;
    while (currentId !== null) {
      const cat = categories.find((c) => c.id === currentId);
      if (cat) {
        crumbs.unshift(cat.name);
        currentId = cat.parentId;
      } else {
        break;
      }
    }
    return crumbs;
  };

  return (
    <section id="catalogo" aria-label="Catálogo Completo de Quadra Pizza" className="mt-14">
      {/* Separador de Sección General */}
      <div className="mb-6 border-t border-white/20 pt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 rounded-xl bg-zinc-950/80 border border-white/20 text-amber-400 shadow-md">
              <LayoutGrid size={18} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
              Catálogo Completo
            </h2>
          </div>
          <p className="text-orange-100/90 text-xs sm:text-sm font-medium drop-shadow-sm">
            Ingredientes de primera, recetas clásicas y el toque único de Quadra. Todo listo para tu mesa.
          </p>
        </div>
      </div>

      {/* Filtros Recursivos con Liquid Sliding Pill en Negro Carbón */}
      <nav aria-label="Filtro de categorías de comida" className="mb-8 space-y-3">
        {[null, ...selectedPath].map((parentId, index) => {
          const children = categories.filter((c) => c.parentId === parentId && isCategoryActive(c.id));
          if (children.length === 0) return null;

          const selectedIdAtThisLevel = selectedPath.length > index ? selectedPath[index] : null;

          return (
            <div 
              key={`filter-row-${parentId ?? "root"}`} 
              className="flex overflow-x-auto gap-2 pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 items-center"
            >
              {index > 0 && (
                <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-amber-300 uppercase tracking-widest mr-1 font-display drop-shadow-sm">
                  <Filter size={11} /> Nivel {index + 1}:
                </div>
              )}
              
              {/* Botón Todos/Todas */}
              <button 
                onClick={() => handleSelectCategory(null, index)}
                className="relative shrink-0 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold border transition-colors active:scale-95 gpu-accelerated overflow-hidden border-white/20 text-white hover:border-white/50"
              >
                {selectedIdAtThisLevel === null && (
                  <motion.span
                    layoutId={`active-pill-${parentId ?? "root"}`}
                    className="absolute inset-0 bg-zinc-950 rounded-full shadow-2xl border border-white/30"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className={`relative z-10 ${selectedIdAtThisLevel === null ? "text-amber-400 font-extrabold" : "text-white"}`}>
                  {index === 0 ? "Todos" : "Todas"}
                </span>
              </button>
              
              {/* Botones de Categorías */}
              {children.map((cat) => {
                const isSelected = selectedIdAtThisLevel === cat.id;
                return (
                  <button 
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id, index)}
                    className="relative shrink-0 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold border transition-colors active:scale-95 gpu-accelerated overflow-hidden border-white/20 text-white hover:border-white/50"
                  >
                    {isSelected && (
                      <motion.span
                        layoutId={`active-pill-${parentId ?? "root"}`}
                        className="absolute inset-0 bg-zinc-950 rounded-full shadow-2xl border border-white/30"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span className={`relative z-10 ${isSelected ? "text-amber-400 font-extrabold" : "text-white"}`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Grid de Productos Flotantes Sin Bordes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 xl:gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts
            .filter((p) => p.stock)
            .map((p, idx) => {
              const breadcrumbs = getCategoryBreadcrumbs(p.categoryId || 0);
              return (
                <article 
                  key={p.id} 
                  className="group relative bg-transparent border-0 rounded-2xl flex flex-col select-none"
                >
                  {/* Comida Flotante con Sombras 3D Dual-Layer */}
                  <div className="aspect-square relative flex items-center justify-center p-2">
                    <div className="relative w-full h-full floating-food">
                      <Image 
                        src={p.image} 
                        alt={`${p.name} - Quadra Pizza`} 
                        fill 
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" 
                        loading={idx < 4 ? undefined : "lazy"}
                        priority={idx < 4}
                        className="object-contain pointer-events-none" 
                      />
                    </div>
                    
                    {/* Micro-pills de categorías y badge de Oferta */}
                    <div className="absolute top-1 left-1 flex flex-col gap-1 items-start z-10">
                      {p.isOffer && (
                        <div className="backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase shadow-md bg-amber-400 text-zinc-950 border border-amber-300">
                          OFERTA
                        </div>
                      )}
                      {breadcrumbs.map((crumb, bIdx) => (
                        <div 
                          key={bIdx} 
                          className="backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1 bg-zinc-950/75 border border-white/20 text-amber-300"
                        >
                          {bIdx > 0 && <ChevronRight size={10} className="opacity-60" />}
                          {crumb}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detalles del Producto */}
                  <div className="mt-2 p-1 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base leading-snug mb-1 text-white group-hover:text-amber-300 transition-colors font-display line-clamp-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                        {p.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-orange-100/90 line-clamp-2 leading-relaxed font-sans font-medium drop-shadow-sm">
                        {p.description}
                      </p>
                    </div>
                    
                    <div className="mt-3 pt-2 flex items-end justify-between gap-2">
                      <div className="flex flex-col">
                        {p.isOffer && p.oldPrice && (
                          <span className="text-[11px] sm:text-xs text-orange-200/80 line-through font-bold">
                            {p.oldPrice}
                          </span>
                        )}
                        <span className="font-black text-xl sm:text-2xl tracking-tight leading-none text-white font-display drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
                          {p.price}
                        </span>
                        {p.saleType === "combo" && p.pricePerDozen && (
                          <span className="text-[9px] sm:text-[10px] font-bold text-amber-300 mt-1 drop-shadow-sm">
                            Docena: {p.pricePerDozen}
                          </span>
                        )}
                        {p.saleType === "docena" && (
                          <span className="text-[9px] sm:text-[10px] font-bold text-orange-200 mt-1 drop-shadow-sm">
                            por docena
                          </span>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => onAddToCart(p)}
                        aria-label={`Agregar ${p.name} al pedido`}
                        className="w-10 h-10 rounded-xl bg-zinc-950 text-white hover:bg-black hover:text-amber-400 border border-white/20 flex items-center justify-center transition-all duration-200 active:scale-85 hover:scale-110 shadow-xl shrink-0 group-hover:border-amber-400/60"
                      >
                        <Plus size={19} className="transition-transform group-hover:rotate-90 duration-300" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
        ) : (
          <div className="col-span-full py-16 text-center text-white bg-black/15 rounded-3xl border border-white/15 p-8 backdrop-blur-md">
            <RotateCcw size={40} className="mx-auto mb-3 text-amber-300 animate-spin-slow" />
            <p className="font-bold text-lg text-white font-display">No encontramos platos con ese criterio</p>
            <p className="text-xs text-orange-100 mt-1 mb-4">Probá con otra palabra o mirá todas las delicias disponibles.</p>
            <button
              onClick={() => handleSelectCategory(null, 0)}
              className="px-5 py-2.5 rounded-full bg-zinc-950 text-white font-bold text-xs uppercase tracking-wider border border-white/20 hover:bg-black active:scale-95 transition-all shadow-xl"
            >
              Ver Menú Completo
            </button>
          </div>
        )}
      </div>
    </section>
  );
});
