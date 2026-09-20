"use client";

import React, { useState, useEffect } from "react";
import { mockOrdersStore, MockOrder } from "@/lib/mockData";
import { TrendingUp, Download, Search } from "lucide-react";

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

export default function FinanzasPage() {
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setOrders(mockOrdersStore.getSnapshot());
    return mockOrdersStore.subscribe(() => setOrders([...mockOrdersStore.getSnapshot()]));
  }, []);

  const filtered = orders.filter(
    o => o.clientName.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalIngresos = filtered.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#09090b]">
      {/* ── Header ── */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <TrendingUp size={20} className="text-purple-400" /> Registro Financiero
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Ingresos y movimientos</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition active:scale-95">
          <Download size={14} /> Exportar CSV
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <div className="relative w-full sm:w-96">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar movimiento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-purple-500 transition"
            />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Listado</p>
            <p className="text-xl font-black text-emerald-400 tabular-nums">{fmtARS(totalIngresos)}</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800">
                <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fecha/Hora</th>
                <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Concepto / Cliente</th>
                <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Método</th>
                <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Ingreso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-zinc-800/30 transition">
                  <td className="px-5 py-4 text-xs font-bold text-zinc-400">
                    {new Date(o.createdAt).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-zinc-200">Venta #{o.id.split("-")[1] || o.id}</p>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{o.clientName}</p>
                  </td>
                  <td className="px-5 py-4 text-xs font-bold text-zinc-400 capitalize">{o.paymentMethod}</td>
                  <td className="px-5 py-4 text-sm font-black text-emerald-400 text-right tabular-nums">+{fmtARS(o.total)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-zinc-600 font-bold text-sm">
                    No se encontraron registros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
