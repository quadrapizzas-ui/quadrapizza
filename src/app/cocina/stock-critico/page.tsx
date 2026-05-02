"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, Send, Bell } from "lucide-react";

const MOCK_INSUMOS = [
  { id: 1, name: "Muzzarella",         unit: "kg",       current: 2,   min: 5,  reported: false },
  { id: 2, name: "Pan de Hamburguesa", unit: "unidades", current: 4,   min: 15, reported: true  },
  { id: 3, name: "Jamón Cocido",       unit: "kg",       current: 1.2, min: 3,  reported: false },
  { id: 4, name: "Huevos",             unit: "docenas",  current: 1,   min: 3,  reported: false },
  { id: 5, name: "Masa de Pizza",      unit: "unidades", current: 8,   min: 10, reported: true  },
  { id: 6, name: "Salsa de Tomate",    unit: "litros",   current: 7,   min: 4,  reported: false },
  { id: 7, name: "Cheddar Feteado",    unit: "paquetes", current: 3,   min: 5,  reported: false },
];

export default function StockCriticoPage() {
  const [insumos, setInsumos] = useState(MOCK_INSUMOS);

  const criticos = insumos.filter(i => i.current <= i.min);
  const estables = insumos.filter(i => i.current > i.min);

  function toggleReport(id: number) {
    setInsumos(prev => prev.map(i => i.id === id ? { ...i, reported: !i.reported } : i));
  }

  return (
    <div className="flex flex-col h-full bg-black overflow-hidden">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-4 sm:px-6 py-4 border-b border-zinc-900 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">Stock Crítico</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
            <Bell size={10} className="text-orange-500" />
            Alertas de insumos para cocina
          </p>
        </div>
        {criticos.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 animate-pulse shrink-0">
            <AlertTriangle size={15} className="text-red-400" />
            <span className="text-sm font-black text-red-400">{criticos.length}</span>
            <span className="hidden sm:block text-xs font-bold text-red-500/70">críticos</span>
          </div>
        )}
      </div>

      {/* ── Scrollable body ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">

        {/* Critical zone */}
        {criticos.length > 0 && (
          <div>
            <h2 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
              <AlertTriangle size={12} /> Nivel Crítico — Requiere Reposición
            </h2>
            <div className="space-y-2.5">
              {criticos.map(item => (
                <div
                  key={item.id}
                  className={`bg-zinc-900 border rounded-2xl p-4 transition ${
                    item.reported ? "border-yellow-500/30 bg-yellow-950/10" : "border-red-500/40"
                  }`}
                >
                  {/* Top row: name + button */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-base text-white leading-tight">{item.name}</h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-black text-red-400 tabular-nums">{item.current}</span>
                        <span className="text-xs text-zinc-500 font-bold">/ mín. {item.min} {item.unit}</span>
                      </div>
                    </div>
                    {/* Button: compact on mobile, full on sm+ */}
                    <button
                      onClick={() => toggleReport(item.id)}
                      className={`shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition active:scale-95 ${
                        item.reported
                          ? "bg-yellow-500/15 border border-yellow-500/30 text-yellow-400"
                          : "bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/30"
                      }`}
                    >
                      {item.reported ? (
                        <><CheckCircle2 size={14} /><span className="hidden sm:inline">Reportado</span><span className="sm:hidden">OK</span></>
                      ) : (
                        <><Send size={14} /><span className="hidden sm:inline">Reportar</span><span className="sm:hidden">!</span></>
                      )}
                    </button>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (item.current / item.min) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stable zone */}
        <div>
          <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
            <CheckCircle2 size={12} /> Nivel Estable
          </h2>
          <div className="space-y-2">
            {estables.map(item => (
              <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-zinc-200">{item.name}</h3>
                  <p className="text-xs text-zinc-500 font-bold mt-0.5">
                    {item.current} {item.unit} · mín. {item.min}
                  </p>
                </div>
                <div className="w-16 sm:w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden shrink-0">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.min(100, (item.current / (item.min * 2)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
