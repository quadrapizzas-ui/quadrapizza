"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";

interface CatalogHeaderProps {
  cartItemCount: number;
  onOpenCart: () => void;
}

export function CatalogHeader({ cartItemCount, onOpenCart }: CatalogHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Micro-glow superior de horno */}
      <div className="h-[2px] w-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 opacity-90" />

      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-orange-500/30 blur-sm group-hover:bg-orange-500/50 transition duration-300 pointer-events-none" />
            <Image 
              src="/logo.webp" 
              alt="Quadra Pizza Logo" 
              width={36} 
              height={36} 
              priority
              className="relative rounded-xl object-cover shadow-lg border border-orange-500/30 transform group-hover:scale-105 transition duration-300" 
            />
          </div>
          <span className="font-black text-xl tracking-tight text-white select-none font-display">
            Quadra <span className="text-orange-500 drop-shadow-[0_2px_12px_rgba(255,94,0,0.45)]">Pizza</span>
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenCart}
            aria-label={`Ver carrito de compras con ${cartItemCount} productos`}
            className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl bg-white/[0.05] hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 text-zinc-200 hover:text-white transition-all duration-200 active:scale-90 relative shrink-0 border border-white/10 hover:border-orange-500/60 shadow-lg group"
          >
             <ShoppingBag size={19} className="sm:hidden transition-transform group-hover:scale-110" />
             <ShoppingBag size={21} className="hidden sm:block transition-transform group-hover:scale-110" />
             {cartItemCount > 0 && (
               <span 
                 key={cartItemCount}
                 className="absolute -top-1.5 -right-1.5 bg-gradient-to-tr from-orange-600 to-amber-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-zinc-950 shadow-lg shadow-orange-600/50 animate-cart-bounce font-display"
               >
                 {cartItemCount}
               </span>
             )}
          </button>
        </div>
      </div>
    </header>
  );
}
