"use client";

import React, { useState } from "react";
import { Search, AlertTriangle, CheckCircle2, Plus, Minus, Package, Edit3, Trash2 } from "lucide-react";

const MOCK_INVENTORY = [
  { id: 1,  name: "Masa de Pizza",       unit: "unidades", current: 12,  min: 10, cost: 350,   category: "Bases"    },
  { id: 2,  name: "Muzzarella",          unit: "kg",       current: 3.5, min: 5,  cost: 4200,  category: "Lácteos"  },
  { id: 3,  name: "Salsa de Tomate",     unit: "litros",   current: 8,   min: 4,  cost: 1800,  category: "Salsas"   },
  { id: 4,  name: "Jamón Cocido",        unit: "kg",       current: 1.2, min: 3,  cost: 6500,  category: "Fiambres" },
  { id: 5,  name: "Coca-Cola 1.5L",      unit: "unidades", current: 24,  min: 12, cost: 1200,  category: "Bebidas"  },
  { id: 6,  name: "Pan de Hamburguesa",  unit: "unidades", current: 6,   min: 15, cost: 280,   category: "Bases"    },
  { id: 7,  name: "Cheddar Feteado",     unit: "paquetes", current: 8,   min: 5,  cost: 3200,  category: "Lácteos"  },
  { id: 8,  name: "Huevos",              unit: "docenas",  current: 1,   min: 3,  cost: 3800,  category: "Básicos"  },
  { id: 9,  name: "Aceite de Oliva",     unit: "litros",   current: 4,   min: 2,  cost: 5500,  category: "Básicos"  },
  { id: 10, name: "Bacon",               unit: "kg",       current: 2,   min: 3,  cost: 7800,  category: "Fiambres" },
];

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

export default function InventarioPage() {
  const [items, setItems] = useState(MOCK_INVENTORY);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Todos");

  const categories = ["Todos", ...Array.from(new Set(items.map(i => i.category)))];
  
  const filtered = items.filter(i => {
    if (catFilter !== "Todos" && i.category !== catFilter) return false;
    if (search.trim()) return i.name.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const criticalCount = items.filter(i => i.current <= i.min).length;
  const totalValue = items.reduce((s, i) => s + i.current * i.cost, 0);

  function adjustStock(id: number, delta: number) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, current: Math.max(0, +(i.current + delta).toFixed(1)) } : i));
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Inventario</h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-1">Gestión completa de insumos</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-center">
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Valor Stock</p>
            <p className="font-black text-lg text-white tabular-nums leading-tight">{fmtARS(totalValue)}</p>
          </div>
          {criticalCount > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400" />
              <div>
                <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Críticos</p>
                <p className="font-black text-lg text-red-400 leading-tight">{criticalCount}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar insumo..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-bold text-zinc-100 placeholder:text-zinc-700 outline-none focus:border-purple-500/50 transition" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition ${catFilter === c ? "bg-purple-500/15 text-purple-400 border-purple-500/30" : "border-zinc-800 text-zinc-500 hover:text-zinc-300"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800">
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Insumo</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Categoría</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Costo Unitario</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map(item => {
                const isCritical = item.current <= item.min;
                return (
                  <tr key={item.id} className="hover:bg-zinc-800/20 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isCritical ? "bg-red-500/10" : "bg-zinc-800"}`}>
                          <Package size={16} className={isCritical ? "text-red-400" : "text-zinc-500"} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white">{item.name}</p>
                          <p className="text-[10px] text-zinc-600 font-bold">{item.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-zinc-800 px-2.5 py-1 rounded-full text-[10px] font-bold text-zinc-400">{item.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-0.5">
                          <button onClick={() => adjustStock(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded transition"><Minus size={10} /></button>
                          <span className={`font-black text-sm w-10 text-center tabular-nums ${isCritical ? "text-red-400" : "text-white"}`}>{item.current}</span>
                          <button onClick={() => adjustStock(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded transition"><Plus size={10} /></button>
                        </div>
                        <span className="text-[10px] text-zinc-600 font-bold">/ mín. {item.min}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isCritical ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                          <AlertTriangle size={9} /> Crítico
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={9} /> OK
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-zinc-300 tabular-nums">{fmtARS(item.cost)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition">
                        <button className="p-2 text-zinc-600 hover:text-white transition rounded-lg"><Edit3 size={14} /></button>
                        <button className="p-2 text-zinc-600 hover:text-red-500 transition rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
