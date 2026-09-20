"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, Filter, ChevronRight } from "lucide-react";
import type { Product, Category } from "@/lib/store/productsStore";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  searchQuery: string;
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, categories, searchQuery, onAddToCart }: ProductGridProps) {
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

  const filteredProducts = products.filter((p) => {
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
    <>
      {/* Separador para catálogo general */}
      <div className="mt-12 mb-6 border-t border-zinc-800/80 pt-8">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl font-black tracking-tighter text-zinc-100">Catálogo Completo</h2>
        </div>
        <p className="text-zinc-400 text-sm font-medium">Ingredientes de primera, recetas clásicas y el toque único de Quadra. Todo listo para tu mesa.</p>
      </div>

      {/* Filtros Recursivos */}
      <div className="mb-6 space-y-4">
        {[null, ...selectedPath].map((parentId, index) => {
          const children = categories.filter((c) => c.parentId === parentId && isCategoryActive(c.id));
          if (children.length === 0) return null;

          const selectedIdAtThisLevel = selectedPath.length > index ? selectedPath[index] : null;

          return (
            <div key={`filter-row-${parentId ?? "root"}`} className="flex overflow-x-auto gap-2 pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 items-center animate-in fade-in slide-in-from-top-2">
              {index > 0 && (
                <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-widest mr-2">
                  <Filter size={12} /> Nivel {index + 1}:
                </div>
              )}
              
              <button 
                onClick={() => handleSelectCategory(null, index)}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-bold border transition ${selectedIdAtThisLevel === null ? (index === 0 ? "bg-orange-600 text-white border-orange-600" : "bg-zinc-700 text-white border-zinc-700") : "bg-transparent border-zinc-700 text-zinc-400 hover:border-orange-500 hover:text-white"}`}
              >
                {index === 0 ? "Todos" : "Todas"}
              </button>
              
              {children.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id, index)}
                  className={`shrink-0 px-5 py-2 rounded-full text-sm font-bold border transition ${selectedIdAtThisLevel === cat.id ? (index === 0 ? "bg-orange-600 text-white border-orange-600" : "bg-zinc-700 text-white border-zinc-700") : "bg-transparent border-zinc-700 text-zinc-400 hover:border-orange-500 hover:text-white"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-8 mt-2">
        {filteredProducts.length > 0 ? (
          filteredProducts
            .filter((p) => {
              if (p.isOffer || !p.stock) return false;
              // If viewing "Todos" (activeCategoryId === null), exclude special categories from the general grid
              if (activeCategoryId === null && [4, 5, 6, 7].includes(p.categoryId || 0)) {
                return false;
              }
              return true;
            })
            .map((p) => {
              const breadcrumbs = getCategoryBreadcrumbs(p.categoryId || 0);
              return (
                <div key={p.id} className="group relative bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="aspect-[4/3] bg-zinc-800 relative overflow-hidden">
                    <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" loading="lazy" className="object-cover group-hover:scale-105 transition duration-500" />
                    
                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                      {breadcrumbs.map((crumb, idx) => (
                        <div 
                          key={idx} 
                          className={`backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-sm flex items-center gap-1 ${idx === 0 ? "bg-zinc-950/90 border border-white/50 text-white" : "bg-zinc-900/80 text-white border-transparent"}`}
                        >
                          {idx > 0 && <ChevronRight size={10} className="opacity-50" />}
                          {crumb}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base leading-tight mb-1.5">{p.name}</h3>
                      <p className="text-[12px] text-zinc-400 line-clamp-2 leading-relaxed">{p.description}</p>
                    </div>
                    
                    <div className="mt-5 flex items-end sm:items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-black text-lg sm:text-xl tracking-tight leading-none text-orange-500">{p.price}</span>
                        {p.saleType === "combo" && p.pricePerDozen && (
                          <span className="text-[9px] sm:text-[10px] font-bold text-orange-500 mt-1">Docena: {p.pricePerDozen}</span>
                        )}
                        {p.saleType === "docena" && (
                          <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 mt-1">por docena</span>
                        )}
                      </div>
                      <button 
                        onClick={() => onAddToCart(p)}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white hover:bg-orange-500 transition active:scale-90 shrink-0 shadow-lg shadow-orange-600/20"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
        ) : (
          <div className="col-span-full py-12 text-center text-zinc-400">
            <Filter size={40} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold text-lg text-zinc-100">No hay productos disponibles</p>
            <p className="text-sm">Intenta seleccionar otra categoría o subcategoría.</p>
          </div>
        )}
      </div>
    </>
  );
}
