"use client";

import Image from "next/image";
import { useCartStore } from "@/lib/store/cartStore";
import { ExtendedProduct } from "@/lib/mockData";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface ProductCardProps {
  product: ExtendedProduct;
  variant?: "default" | "promo" | "menu-dia";
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      cartItemId: uuidv4(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      modifiers: {}, // Default modifiers for now
    });
    
    // Feedback vizual rápido
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  if (variant === "promo") {
    return (
      <div 
        onClick={handleAdd}
        className="bg-zinc-950 rounded-3xl p-4 md:p-5 border-2 border-orange-500/50 shadow-[0_0_30px_rgba(234,88,12,0.15)] flex gap-5 items-center group hover:bg-zinc-900 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      >
        <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 bg-zinc-800">
          <Image 
            src={product.image_url || ""} 
            alt={product.name}
            fill
            sizes="(max-width: 768px) 120px, 150px"
            className="object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          {product.is_promo && product.promo_label && (
             <div className="absolute top-2 left-2 bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md animate-pulse">
               {product.promo_label}
             </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg md:text-xl leading-tight mb-1 truncate text-white">{product.name}</h3>
          <p className="text-xs md:text-sm text-zinc-400 mb-3 line-clamp-2 md:line-clamp-3 leading-relaxed">
            {product.description}
          </p>
          <div className="flex flex-col">
            {product.original_price && (
              <span className="text-zinc-500 line-through text-xs font-bold">${product.original_price.toLocaleString()}</span>
            )}
            <div className={`font-black text-lg md:text-xl transition-colors ${isAdded ? "text-emerald-400" : "text-orange-500"}`}>
               {isAdded ? "¡Agregado!" : `$${product.price.toLocaleString()}`}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "menu-dia") {
    return (
      <div 
        onClick={handleAdd}
        className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl p-4 md:p-5 border border-zinc-800 shadow-2xl flex gap-5 items-center group hover:bg-zinc-800/80 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      >
        <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 bg-zinc-800">
          <Image 
            src={product.image_url || ""} 
            alt={product.name}
            fill
            sizes="(max-width: 768px) 120px, 150px"
            className="object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg md:text-xl leading-tight mb-1 truncate">{product.name}</h3>
          <p className="text-xs md:text-sm text-zinc-400 mb-3 line-clamp-2 md:line-clamp-3 leading-relaxed">
            {product.description}
          </p>
          <div className={`font-black text-lg md:text-xl transition-colors ${isAdded ? "text-emerald-400" : "text-orange-500"}`}>
             {isAdded ? "¡Agregado!" : `$${product.price.toLocaleString()}`}
          </div>
        </div>
      </div>
    );
  }

  // Default Grid Card
  return (
    <div 
      onClick={handleAdd}
      className="group bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/80 rounded-2xl md:rounded-3xl overflow-hidden flex flex-col active:scale-[0.98] transition-all duration-300 cursor-pointer hover:border-zinc-600 hover:shadow-2xl hover:-translate-y-1"
    >
      <div className="relative aspect-square bg-zinc-800 overflow-hidden">
         <Image 
           src={product.image_url || ""} 
           alt={product.name}
           fill
           loading="lazy"
           sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
           className="object-cover transition-transform duration-700 group-hover:scale-105" 
         />
      </div>
      <div className="p-3.5 md:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-sm md:text-base leading-tight mb-1.5 line-clamp-1 group-hover:text-orange-400 transition-colors">{product.name}</h3>
          <p className="text-[11px] md:text-xs text-zinc-400 line-clamp-2 md:line-clamp-3 leading-relaxed">{product.description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className={`font-black text-base md:text-lg lg:text-xl transition-colors ${isAdded ? "text-emerald-400" : "text-orange-500"}`}>
            {isAdded ? "¡Agregado!" : `$${product.price.toLocaleString()}`}
          </span>
          <div className={`p-2 md:p-2.5 rounded-xl transition-all shadow-sm ${isAdded ? "bg-emerald-500 text-white" : "bg-zinc-950 text-zinc-300 group-hover:bg-orange-500 group-hover:text-white"}`}>
            {isAdded ? (
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            ) : (
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7v14"/></svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
