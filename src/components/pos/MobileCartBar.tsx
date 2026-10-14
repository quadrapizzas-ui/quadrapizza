"use client";

import { ShoppingBag, ArrowRight } from "lucide-react";
import { formatPrice } from "@/hooks/useCart";

interface MobileCartBarProps {
  cartItemCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export function MobileCartBar({ cartItemCount, cartTotal, onOpenCart }: MobileCartBarProps) {
  if (cartItemCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={onOpenCart}
        className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/95 border border-orange-500/40 backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.6)] active:scale-98 transition group"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black shadow-md shadow-orange-600/40 group-hover:scale-105 transition">
            <ShoppingBag size={18} />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-zinc-950 text-[11px] font-black flex items-center justify-center shadow">
              {cartItemCount}
            </span>
          </div>
          <div className="text-left">
            <span className="block text-xs font-black uppercase tracking-wider text-orange-400">Tu Pedido</span>
            <span className="block text-xs text-zinc-300 font-medium">Tocá para revisar y confirmar</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-base font-black text-white font-mono">
            {formatPrice(cartTotal)}
          </span>
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:translate-x-0.5 transition">
            <ArrowRight size={16} />
          </div>
        </div>
      </button>
    </div>
  );
}
