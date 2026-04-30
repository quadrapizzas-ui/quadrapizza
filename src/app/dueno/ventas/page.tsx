"use client";

import React, { useState, useEffect } from "react";
import { mockOrdersStore, MockOrder } from "@/lib/mockData";
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  XCircle,
  MoreVertical
} from "lucide-react";

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

export default function DuenoVentasPage() {
  const [orders, setOrders] = useState<MockOrder[]>(() => mockOrdersStore.getSnapshot());
  const [search, setSearch] = useState("");

  useEffect(() => {
    return mockOrdersStore.subscribe(() => setOrders([...mockOrdersStore.getSnapshot()]));
  }, []);

  const filtered = orders.filter(o => 
    o.clientName.toLowerCase().includes(search.toLowerCase()) || 
    o.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Historial de Ventas</h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-1">Registro completo de transacciones</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition">
            <Download size={14} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input 
            type="text" 
            placeholder="Buscar por cliente o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm font-bold text-zinc-100 placeholder:text-zinc-700 outline-none focus:border-purple-500/50 transition"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-bold text-zinc-500">
          <Filter size={14} />
          Filtros
        </button>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800">
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Método</th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map((o) => (
                <tr key={o.id} className="group hover:bg-zinc-800/30 transition cursor-default">
                  <td className="px-6 py-4 font-mono text-xs font-black text-zinc-400 group-hover:text-purple-400 transition">
                    #{o.id.split('-')[1] || o.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{o.clientName}</span>
                      <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">{new Date(o.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      o.status === 'completado' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                      o.status === 'cancelado' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                      "bg-orange-500/10 text-orange-500 border-orange-500/20"
                    }`}>
                      {o.status === 'completado' ? <CheckCircle2 size={10} /> : o.status === 'cancelado' ? <XCircle size={10} /> : <Clock size={10} />}
                      {o.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-zinc-400">{o.paymentMethod}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-white">{fmtARS(o.total)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-zinc-700 hover:text-white transition">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-zinc-700 font-bold uppercase tracking-widest text-sm">
                    No se encontraron ventas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="px-6 py-4 bg-zinc-950/30 border-t border-zinc-800 flex items-center justify-between">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Mostrando {filtered.length} de {orders.length} resultados</p>
          <div className="flex gap-1">
             <button disabled className="p-2 rounded-lg bg-zinc-900 text-zinc-700 border border-zinc-800 disabled:opacity-30">
                <ChevronRight size={14} className="rotate-180" />
             </button>
             <button className="p-2 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white transition">
                <ChevronRight size={14} />
             </button>
          </div>
        </div>
      </div>

    </div>
  );
}
