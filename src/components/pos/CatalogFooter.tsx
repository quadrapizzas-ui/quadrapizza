"use client";

import React from "react";
import Image from "next/image";
import { ArrowUp, MapPin, Bike, ShieldCheck, Heart } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";

export function CatalogFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-16 sm:mt-24 border-t border-white/[0.08] bg-zinc-950/95 text-zinc-400 py-10 sm:py-14 relative overflow-hidden backdrop-blur-xl">
      {/* Resplandor inferior tenue */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mb-8 sm:mb-10">
          
          {/* Columna Marca e Identidad */}
          <div className="lg:col-span-6 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <Image 
                src="/logo.webp" 
                alt="Quadra Pizza" 
                width={36} 
                height={36} 
                className="rounded-xl object-cover shadow-sm border border-orange-500/30" 
              />
              <div>
                <span className="font-black text-xl tracking-tight text-white font-display block leading-none">
                  Quadra <span className="text-orange-500 drop-shadow-[0_2px_10px_rgba(255,94,0,0.3)]">Pizza</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                  Pizzería & Rotisería Artesanal
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg leading-relaxed font-medium">
              Cocinamos con ingredientes nobles, masas de fermentación prolongada y la abundancia que nos identifica. Pedí directo a nuestro WhatsApp sin comisiones ni demoras.
            </p>

            {/* Accesos Rápidos: Ubicación e Instagram en chips compactos */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a 
                href="https://maps.google.com/?q=Pje.+Blas+Parera+148,+X5101+Yocsina,+C%C3%B3rdoba"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-orange-400 hover:text-orange-300 transition group max-w-full"
              >
                <MapPin size={14} className="shrink-0 text-orange-500 group-hover:scale-110 transition-transform" />
                <span className="font-semibold truncate">Pje. Blas Parera 148, Yocsina</span>
              </a>

              <a 
                href="https://www.instagram.com/quadra.pizza/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-zinc-300 hover:text-pink-400 transition group"
              >
                <InstagramIcon size={14} className="shrink-0 text-pink-500 group-hover:scale-110 transition-transform" />
                <span className="font-bold">@quadra.pizza</span>
              </a>
            </div>
          </div>

          {/* Panel organizado de Zonas de Entrega y Medios de Pago */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.07] backdrop-blur-sm">
            
            {/* Zonas de Envíos */}
            <div className="space-y-2.5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-200 flex items-center gap-2 font-display">
                <Bike size={15} className="text-orange-500" />
                Zonas de Envíos
              </h3>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-white/10 text-[11px] font-semibold text-zinc-200">
                  Yocsina
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-white/10 text-[11px] font-semibold text-zinc-200">
                  Malagueño
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-white/10 text-[11px] font-semibold text-zinc-200">
                  Barrio La Perla
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                Envíos rápidos a domicilio o retiro directo en mostrador.
              </p>
            </div>

            {/* Medios de Pago */}
            <div className="space-y-2.5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-200 flex items-center gap-2 font-display">
                <ShieldCheck size={15} className="text-emerald-400" />
                Medios de Pago
              </h3>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-white/10 text-zinc-200">Efectivo</span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-white/10 text-zinc-200">Transferencia</span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-white/10 text-zinc-200">Mercado Pago</span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-white/10 text-zinc-200">Tarjetas</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                Confirmación instantánea al mostrador por WhatsApp.
              </p>
            </div>

          </div>
        </div>

        {/* Barra Inferior */}
        <div className="border-t border-white/[0.06] pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <p className="flex items-center gap-1.5 text-center sm:text-left">
            © {new Date().getFullYear()} Quadra Pizza · Hecho con <Heart size={13} className="text-orange-500 fill-orange-500 inline" /> para nuestra gente.
          </p>

          <button
            onClick={scrollToTop}
            aria-label="Volver al inicio del catálogo"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 transition active:scale-95 text-xs font-semibold shadow-sm"
          >
            <span>Volver arriba</span>
            <ArrowUp size={13} className="text-orange-500" />
          </button>
        </div>
      </div>
    </footer>
  );
}
