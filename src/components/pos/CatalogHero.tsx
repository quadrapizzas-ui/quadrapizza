"use client";

import React from "react";
import { Flame, Bike, Clock, Sparkles } from "lucide-react";

export function CatalogHero() {
  return (
    <section
      aria-label="Presentación de Quadra Pizza"
      className="relative overflow-hidden rounded-3xl bg-black/15 border border-white/15 p-4 sm:p-7 mb-6 sm:mb-8 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.15)]"
    >
      <div className="relative z-10 flex flex-col gap-3.5 sm:gap-4">
        {/* Eyebrow: Status vivo de horno y delivery en Yocsina */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950/50 border border-white/20 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5 font-display">
              <Flame size={13} className="text-amber-400 fill-amber-400" />
              Horno Encendido
            </span>
          </div>
          <span className="text-[11px] sm:text-xs text-orange-100 font-semibold drop-shadow-sm">
            Envíos calientes en <strong className="text-white">Yocsina, Malagueño y La Perla</strong>
          </span>
        </div>

        {/* H1 Semántico con proporciones armoniosas en móvil y escritorio */}
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight font-display drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]">
            Pizzas artesanales & rotisería con el{" "}
            <span className="text-amber-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
              auténtico sabor de QuadraPizza
            </span>
          </h1>

          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-orange-100/90 font-medium leading-relaxed max-w-2xl drop-shadow-sm">
            Masa casera fresca, fermentación lenta, abundantes ingredientes de primera y cocción crujiente a punto. Elegí tus platos favoritos y te los llevamos volando a la mesa.
          </p>
        </div>

        {/* Barra unificada de beneficios: distribución perfecta sin espacios vacíos */}
        <div className="grid grid-cols-3 divide-x divide-white/10 rounded-2xl bg-zinc-950/40 border border-white/15 backdrop-blur-md p-2 sm:p-2.5 shadow-sm mt-1">
          <div className="flex items-center justify-center gap-1.5 px-1 sm:px-3 text-center">
            <Bike size={14} className="text-amber-400 shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold text-white">
              <span className="hidden sm:inline">Envíos rápidos a domicilio</span>
              <span className="sm:hidden">Envíos rápidos</span>
            </span>
          </div>

          <div className="flex items-center justify-center gap-1.5 px-1 sm:px-3 text-center">
            <Sparkles size={14} className="text-amber-300 shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold text-white">
              <span className="hidden sm:inline">Masa 100% fresca</span>
              <span className="sm:hidden">Masa casera</span>
            </span>
          </div>

          <div className="flex items-center justify-center gap-1.5 px-1 sm:px-3 text-center">
            <Clock size={14} className="text-emerald-400 shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold text-white">
              <span className="hidden sm:inline">Pedí online en 2 min</span>
              <span className="sm:hidden">Pedí en 2 min</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
