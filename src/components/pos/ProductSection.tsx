"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/store/productsStore";
import type { ReactNode } from "react";

interface ProductSectionProps {
  title: string;
  icon: ReactNode;
  color: string;       // Tailwind color class prefix, e.g. "red", "emerald", "purple", "blue"
  products: Product[];
  onAddToCart: (product: Product) => void;
  isOffer?: boolean;
}

const COLOR_MAP: Record<string, { bg: string; text: string; button: string; buttonHover: string; shadow: string; badge?: string }> = {
  red: {
    bg: "bg-red-500/20",
    text: "text-red-500",
    button: "bg-red-600",
    buttonHover: "hover:bg-red-500",
    shadow: "shadow-red-600/30",
    badge: "bg-red-600",
  },
  emerald: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-500",
    button: "bg-emerald-600",
    buttonHover: "hover:bg-emerald-500",
    shadow: "shadow-emerald-600/30",
  },
  purple: {
    bg: "bg-purple-500/20",
    text: "text-purple-500",
    button: "bg-purple-600",
    buttonHover: "hover:bg-purple-500",
    shadow: "shadow-purple-600/30",
  },
  blue: {
    bg: "bg-blue-500/20",
    text: "text-blue-500",
    button: "bg-blue-600",
    buttonHover: "hover:bg-blue-500",
    shadow: "shadow-blue-600/30",
  },
};

export function ProductSection({ title, icon, color, products, onAddToCart, isOffer = false }: ProductSectionProps) {
  const colors = COLOR_MAP[color] || COLOR_MAP.red;

  if (products.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <div className={`${colors.bg} p-2 rounded-full ${colors.text}`}>
          {icon}
        </div>
        <h2 className={`text-2xl font-black tracking-tighter ${colors.text}`}>{title}</h2>
      </div>
      <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {products.map((p) => (
          <div key={p.id} className="shrink-0 w-[280px] bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden flex flex-col relative shadow-sm hover:shadow-md transition-shadow">
            {isOffer && (
              <div className={`absolute top-3 left-3 ${colors.badge || colors.button} text-white font-black text-[10px] tracking-widest px-3 py-1 rounded-full z-10 animate-pulse`}>OFERTA</div>
            )}
            <div className="aspect-[4/3] bg-zinc-800 relative overflow-hidden">
              <Image src={p.image} alt={p.name} fill sizes="280px" priority placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" className="object-cover hover:scale-105 transition duration-500" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between border-t border-zinc-900">
              <div>
                <h3 className="font-bold text-[17px] leading-tight mb-1.5 text-zinc-100">{p.name}</h3>
                <p className="text-[12px] text-zinc-400 line-clamp-2 leading-relaxed">{p.description}</p>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  {isOffer && p.oldPrice && (
                    <span className="text-xs text-red-400/80 line-through font-semibold block mb-0.5">{p.oldPrice}</span>
                  )}
                  <span className={`font-black text-2xl tracking-tight ${colors.text} leading-none`}>{p.price}</span>
                </div>
                <button onClick={() => onAddToCart(p)} className={`w-10 h-10 rounded-full ${colors.button} flex items-center justify-center text-white ${colors.buttonHover} transition active:scale-95 shadow-lg ${colors.shadow}`}>
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
