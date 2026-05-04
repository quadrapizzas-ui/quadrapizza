"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, Clock } from "lucide-react";

const MOCK_INSUMOS = [
  { id: 1, name: "Muzzarella",         unit: "kg",       current: 2,   min: 5  },
  { id: 2, name: "Pan de Hamburguesa", unit: "unidades", current: 4,   min: 15 },
  { id: 3, name: "Jamón Cocido",       unit: "kg",       current: 1.2, min: 3  },
  { id: 4, name: "Huevos",             unit: "docenas",  current: 1,   min: 3  },
  { id: 5, name: "Masa de Pizza",      unit: "unidades", current: 8,   min: 10 },
  { id: 6, name: "Salsa de Tomate",    unit: "litros",   current: 7,   min: 4  },
  { id: 7, name: "Cheddar Feteado",    unit: "paquetes", current: 3,   min: 5  },
];

export default function StockCriticoPage() {
  const [insumos] = useState(MOCK_INSUMOS);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const criticos = insumos.filter(i => i.current <= i.min);
  const estables = insumos.filter(i => i.current > i.min);

  return (
    <div className="flex flex-col h-full bg-[#09090b] overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-6 py-5 border-b border-zinc-900/80 bg-zinc-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Visor de Insumos
          </h1>
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-1 flex items-center gap-1.5">
            <ShieldAlert size={12} className="text-orange-500" />
            Gestionado e informado por Recepción
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <Clock size={12} className="text-zinc-400" />
            <span className="text-xs font-black text-zinc-300 tabular-nums">{time || "--:--"}</span>
          </div>
          
          {criticos.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 animate-pulse">
              <AlertTriangle size={16} className="text-red-400" />
              <span className="text-sm font-black text-red-400">{criticos.length} CRÍTICOS</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Scrollable body ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-8">

        {/* Critical zone */}
        {criticos.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle size={16} className="text-red-500" />
              </div>
              <h2 className="text-sm font-black text-white uppercase tracking-widest">
                Faltantes Críticos
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {criticos.map(item => {
                const pct = Math.min(100, (item.current / item.min) * 100);
                return (
                  <div
                    key={item.id}
                    className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 border border-red-500/30 rounded-2xl p-5 shadow-[0_0_15px_-3px_rgba(239,68,68,0.15)] group"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20">
                      <div className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" style={{ width: `${pct}%` }} />
                    </div>
                    
                    <h3 className="font-bold text-lg text-white mb-4 line-clamp-1">{item.name}</h3>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-red-400/80 uppercase tracking-widest mb-1">Stock Actual</p>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-4xl font-black text-red-400 tabular-nums leading-none">{item.current}</span>
                          <span className="text-sm font-bold text-red-400/70">{item.unit}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Mínimo</p>
                        <span className="text-lg font-bold text-zinc-400 tabular-nums leading-none">{item.min}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Stable zone */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} className="text-emerald-500" />
            </div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">
              Niveles Óptimos
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {estables.map(item => (
              <div key={item.id} className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 flex flex-col justify-between">
                <h3 className="font-bold text-sm text-zinc-300 mb-3">{item.name}</h3>
                <div className="flex items-end justify-between mt-auto">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-emerald-400 tabular-nums leading-none">{item.current}</span>
                    <span className="text-[10px] font-bold text-zinc-500">{item.unit}</span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-600">Mín: {item.min}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
