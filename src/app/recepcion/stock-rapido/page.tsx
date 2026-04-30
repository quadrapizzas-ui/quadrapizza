"use client";

import React, { useState } from "react";
import { Search, AlertTriangle, CheckCircle2, Package, Minus, Plus } from "lucide-react";

const MOCK_STOCK = [
  { id: 1, name: "Masa de Pizza",       unit: "unidades", current: 12,  min: 10, category: "Bases"    },
  { id: 2, name: "Muzzarella",          unit: "kg",       current: 3.5, min: 5,  category: "Lácteos"  },
  { id: 3, name: "Salsa de Tomate",     unit: "litros",   current: 8,   min: 4,  category: "Salsas"   },
  { id: 4, name: "Jamón Cocido",        unit: "kg",       current: 1.2, min: 3,  category: "Fiambres" },
  { id: 5, name: "Coca-Cola 1.5L",      unit: "unidades", current: 24,  min: 12, category: "Bebidas"  },
  { id: 6, name: "Pan de Hamburguesa",  unit: "unidades", current: 6,   min: 15, category: "Bases"    },
  { id: 7, name: "Cheddar Feteado",     unit: "paquetes", current: 8,   min: 5,  category: "Lácteos"  },
  { id: 8, name: "Huevos",              unit: "docenas",  current: 1,   min: 3,  category: "Básicos"  },
];

export default function StockRapidoPage() {
  const [stock, setStock] = useState(MOCK_STOCK);
  const [search, setSearch] = useState("");

  const filtered = stock
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a.current / a.min) - (b.current / b.min));
  const criticalCount = stock.filter(s => s.current <= s.min).length;

  function adjustStock(id: number, delta: number) {
    setStock(prev => prev.map(s => s.id === id ? { ...s, current: Math.max(0, s.current + delta) } : s));
  }

  function setStockItem(id: number, val: number) {
    setStock(prev => prev.map(s => s.id === id ? { ...s, current: Math.max(0, val) } : s));
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Stock Rápido</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Consulta y ajuste de inventario</p>
        </div>
        {criticalCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle size={14} className="text-red-400" />
            <span className="text-xs font-black text-red-400">{criticalCount} crítico{criticalCount > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="shrink-0 px-5 py-3 border-b border-zinc-800/60">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar insumo..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-sky-500/60 transition" />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map(item => {
            const isCritical = item.current <= item.min;
            return (
              <div key={item.id} className={`bg-zinc-900 border rounded-2xl p-4 flex flex-col gap-3 transition ${isCritical ? "border-red-500/40 shadow-lg shadow-red-900/10" : "border-zinc-800 hover:border-zinc-700"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white leading-tight">{item.name}</h3>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">{item.category}</p>
                  </div>
                  {isCritical ? (
                    <AlertTriangle size={16} className="text-red-400 shrink-0" />
                  ) : (
                    <CheckCircle2 size={16} className="text-emerald-500/50 shrink-0" />
                  )}
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <input
                      type="number"
                      step="any"
                      value={item.current === 0 ? "" : item.current}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : Number(e.target.value);
                        setStockItem(item.id, val);
                      }}
                      className={`w-24 bg-transparent outline-none text-3xl font-black tabular-nums leading-none ${isCritical ? "text-red-400" : "text-white"} [&::-webkit-inner-spin-button]:appearance-none`}
                      placeholder="0"
                    />
                    <p className="text-[10px] font-bold text-zinc-500 mt-1">{item.unit} · mín. {item.min}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-zinc-800 rounded-xl p-1">
                    <button onClick={() => adjustStock(item.id, -1)} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition active:scale-90">
                      <Minus size={14} />
                    </button>
                    <button onClick={() => adjustStock(item.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition active:scale-90">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${isCritical ? "bg-red-500" : "bg-emerald-500"}`}
                    style={{ width: `${Math.min(100, (item.current / (item.min * 2)) * 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
