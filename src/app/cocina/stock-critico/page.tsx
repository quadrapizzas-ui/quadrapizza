"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, Clock, Search } from "lucide-react";
import { useStockStore } from "@/lib/store/stockStore";
import { normalizeSearch } from "@/lib/utils";
import { isKitchenItem } from "@/lib/orderKitchenHelper";

export default function StockCriticoPage() {
  const stock = useStockStore((s) => s.stock);
  const [time, setTime] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Solo insumos correspondientes al sector cocina (excluye bebidas y productos que no requieren preparación)
  const kitchenStock = useMemo(() => {
    return stock.filter((item) => isKitchenItem(item));
  }, [stock]);

  // Categorías presentes en los insumos de cocina del local
  const categories = useMemo(() => {
    return Array.from(new Set(kitchenStock.map((s) => s.category).filter(Boolean)));
  }, [kitchenStock]);

  // Filtrado reactivo insensible a tildes y por categoría dentro de cocina
  const filteredStock = useMemo(() => {
    const qNorm = normalizeSearch(search);
    return kitchenStock.filter((item) => {
      const matchesSearch = !qNorm || normalizeSearch(item.name).includes(qNorm) || normalizeSearch(item.category).includes(qNorm);
      const matchesCategory = selectedCategory === "todos" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [kitchenStock, search, selectedCategory]);

  // Orden idéntico al de Recepción (/recepcion/stock): por nivel de urgencia (ratio current / min)
  const criticos = useMemo(() => {
    return filteredStock
      .filter((i) => i.current <= i.min)
      .slice()
      .sort((a, b) => {
        const ratioA = a.min > 0 ? a.current / a.min : 1;
        const ratioB = b.min > 0 ? b.current / b.min : 1;
        return ratioA - ratioB;
      });
  }, [filteredStock]);

  const estables = useMemo(() => {
    return filteredStock
      .filter((i) => i.current > i.min)
      .slice()
      .sort((a, b) => {
        const ratioA = a.min > 0 ? a.current / a.min : 1;
        const ratioB = b.min > 0 ? b.current / b.min : 1;
        return ratioA - ratioB;
      });
  }, [filteredStock]);

  const totalCriticosGlobal = kitchenStock.filter((i) => i.current <= i.min).length;

  if (!mounted) {
    return (
      <div className="flex flex-col h-full bg-[#09090b] items-center justify-center text-zinc-500">
        <span className="w-8 h-8 border-2 border-zinc-800 border-t-orange-500 rounded-full animate-spin mb-3" />
        <p className="text-xs font-bold uppercase tracking-widest">Sincronizando stock con Recepción...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#09090b] overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-6 py-4 border-b border-zinc-900/80 bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Visor de Insumos
            </h1>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sincronizado con Recepción
            </span>
          </div>
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-1 flex items-center gap-1.5">
            <ShieldAlert size={12} className="text-orange-500" />
            Niveles y consumos en tiempo real ({kitchenStock.length} materias primas de cocina)
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <Clock size={12} className="text-zinc-400" />
            <span className="text-xs font-black text-zinc-300 tabular-nums">{time || "--:--"}</span>
          </div>
          
          {totalCriticosGlobal > 0 ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 animate-pulse">
              <AlertTriangle size={15} />
              <span className="text-xs font-black uppercase tracking-wider">{totalCriticosGlobal} Críticos</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider">
              <CheckCircle2 size={14} />
              Stock Óptimo
            </div>
          )}
        </div>
      </div>

      {/* ── Barra de Filtros y Búsqueda ───────────────────────────────── */}
      <div className="shrink-0 px-6 py-3 border-b border-zinc-900/60 bg-zinc-950/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Buscador predictivo sin tildes */}
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar insumo (ej: muzzarella, harina, salsa)..."
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs font-bold text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-orange-500/60 transition"
          />
        </div>

        {/* Pestañas de categorías */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setSelectedCategory("todos")}
            className={`px-3 py-1 rounded-lg text-xs font-black tracking-wide transition shrink-0 ${
              selectedCategory === "todos"
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
            }`}
          >
            Todos ({kitchenStock.length})
          </button>
          {categories.map((cat) => {
            const countInCat = kitchenStock.filter((s) => s.category === cat).length;
            const hasCritInCat = kitchenStock.some((s) => s.category === cat && s.current <= s.min);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wide transition shrink-0 flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? "bg-zinc-100 text-zinc-900 shadow-sm"
                    : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                  hasCritInCat ? "bg-red-500/20 text-red-400" : "bg-zinc-800 text-zinc-500"
                }`}>
                  {countInCat}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Scrollable body ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-8">

        {/* Sin resultados de búsqueda */}
        {filteredStock.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-600 gap-3">
            <Search size={36} strokeWidth={1.5} />
            <p className="text-sm font-bold uppercase tracking-widest">No se encontraron insumos</p>
            <p className="text-xs text-zinc-500">Probá buscando con otro nombre o cambiando de categoría.</p>
          </div>
        )}

        {/* Critical zone */}
        {criticos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-red-500/15 text-red-400 flex items-center justify-center shrink-0">
                  <AlertTriangle size={15} />
                </div>
                <h2 className="text-sm font-black text-white uppercase tracking-widest">
                  Faltantes Críticos ({criticos.length})
                </h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                Por debajo del mínimo establecido
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {criticos.map((item) => {
                const ratio = item.min > 0 ? item.current / item.min : 0;
                const pct = Math.min(100, Math.round(ratio * 100));
                const isUrgente = ratio <= 0.5;

                return (
                  <div
                    key={item.id}
                    className={`relative overflow-hidden bg-gradient-to-b ${
                      isUrgente
                        ? "from-red-950/25 via-zinc-900 to-zinc-950 border-red-500/40 shadow-[0_0_20px_-5px_rgba(239,68,68,0.25)]"
                        : "from-amber-950/20 via-zinc-900 to-zinc-950 border-amber-500/35 shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)]"
                    } border rounded-2xl p-4 group transition`}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
                      <div
                        className={`h-full ${
                          isUrgente
                            ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                            : "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-bold text-base text-white line-clamp-1">{item.name}</h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                          isUrgente
                            ? "bg-red-500/15 text-red-400 border-red-500/30"
                            : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                        }`}>
                          {isUrgente ? "Urgente" : "Bajo"}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 shrink-0">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between pt-1">
                      <div>
                        <p className={`text-[10px] font-black ${isUrgente ? "text-red-400/90" : "text-amber-400/90"} uppercase tracking-widest mb-0.5`}>
                          Stock Actual
                        </p>
                        <div className="flex items-baseline gap-1.5">
                          <span className={`text-3xl font-black ${isUrgente ? "text-red-400" : "text-amber-400"} tabular-nums leading-none`}>
                            {item.current}
                          </span>
                          <span className={`text-xs font-bold ${isUrgente ? "text-red-400/80" : "text-amber-400/80"}`}>
                            {item.unit}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Mínimo</p>
                        <span className="text-base font-black text-zinc-300 tabular-nums leading-none">
                          {item.min} {item.unit}
                        </span>
                        <div className={`text-[9px] font-bold mt-1 ${isUrgente ? "text-red-400" : "text-amber-400"}`}>
                          Capacidad: {pct}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Stable zone */}
        {estables.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={15} />
                </div>
                <h2 className="text-sm font-black text-white uppercase tracking-widest">
                  Niveles Óptimos ({estables.length})
                </h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/80">
                Stock suficiente para el turno
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {estables.map((item) => (
                <div key={item.id} className="bg-zinc-900/60 border border-zinc-800/70 hover:border-zinc-700/80 transition rounded-xl p-3.5 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-1.5 mb-2">
                    <h3 className="font-bold text-xs text-zinc-200 line-clamp-1">{item.name}</h3>
                    <span className="text-[8px] font-bold text-zinc-500 bg-zinc-800/80 px-1.5 py-0.5 rounded shrink-0">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-end justify-between mt-auto pt-2 border-t border-zinc-800/40">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-emerald-400 tabular-nums leading-none">{item.current}</span>
                      <span className="text-[10px] font-bold text-zinc-500">{item.unit}</span>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500">Mín: {item.min}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
