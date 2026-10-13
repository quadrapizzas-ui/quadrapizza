"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";

interface CatalogHeaderProps {
  cartItemCount: number;
  onOpenCart: () => void;
}

export function CatalogHeader({ cartItemCount, onOpenCart }: CatalogHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-900">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.jpg" alt="Quadra Pizza Logo" width={32} height={32} className="rounded-lg object-cover shadow-md" />
          <span className="font-black text-xl tracking-tight">Quadra <span className="text-orange-500">Pizza</span></span>
        </div>
        
        <div className="flex items-center gap-3">
          <a
            href="/recepcion/estado-pedidos"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition"
          >
            <span>Acceso Personal ERP</span>
          </a>

          <button 
            onClick={onOpenCart}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white transition active:scale-95 relative shrink-0 border border-zinc-800"
          >
             <ShoppingBag size={18} className="sm:hidden" />
             <ShoppingBag size={20} className="hidden sm:block" />
             {cartItemCount > 0 && (
               <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[9px] sm:text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-zinc-950">
                 {cartItemCount}
               </span>
             )}
          </button>
        </div>
      </div>
    </header>
  );
}
