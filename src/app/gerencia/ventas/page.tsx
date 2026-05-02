"use client";

import React, { useState, useEffect } from "react";
import { mockOrdersStore, MockOrder } from "@/lib/mockData";
import {
  Search,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

function StatusBadge({ status }: { status: string }) {
  const cfg =
    status === "completado"
      ? { cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", Icon: CheckCircle2 }
      : status === "cancelado"
      ? { cls: "bg-red-500/10 text-red-500 border-red-500/20", Icon: XCircle }
      : { cls: "bg-orange-500/10 text-orange-500 border-orange-500/20", Icon: Clock };
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${cfg.cls}`}>
      <cfg.Icon size={10} />
      {status}
    </div>
  );
}

// ── Mobile order card ─────────────────────────────────────────────────────────
function OrderCard({ order }: { order: MockOrder }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full px-4 py-3.5 flex items-start gap-3 text-left"
      >
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-black text-purple-400">#{order.id.split("-")[1] || order.id}</span>
            <StatusBadge status={order.status} />
          </div>
          <p className="font-bold text-sm text-white truncate">{order.clientName}</p>
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">
            {new Date(order.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })} hs
            {" · "}{order.paymentMethod}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="font-black text-sm text-white">{fmtARS(order.total)}</span>
          {expanded ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-zinc-800/50 space-y-2.5">
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Contenido</p>
          {order.items.map((it, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center font-black text-orange-400 text-[10px] shrink-0">
                {it.quantity}
              </span>
              <span className="text-xs font-bold text-zinc-300">{it.name}</span>
            </div>
          ))}
          {order.address && order.address !== "Retira en Local" && (
            <p className="text-[10px] text-zinc-500 font-bold">📍 {order.address}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function GerenciaVentasPage() {
  const [orders, setOrders] = useState<MockOrder[]>(() => mockOrdersStore.getSnapshot());
  const [search, setSearch] = useState("");

  useEffect(() => {
    return mockOrdersStore.subscribe(() => setOrders([...mockOrdersStore.getSnapshot()]));
  }, []);

  const filtered = orders.filter(
    o =>
      o.clientName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalVentas = filtered.reduce((s, o) => s + o.total, 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Header ── */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Clock size={20} className="text-purple-400" /> Historial de Ventas
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Registro completo de transacciones</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition active:scale-95 w-full sm:w-auto">
          <Download size={14} />
          Exportar CSV
        </button>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5 sm:space-y-6">

      {/* ── Quick stats ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total resultados", value: filtered.length, color: "text-white" },
          { label: "Total ventas",     value: fmtARS(totalVentas), color: "text-purple-400" },
          { label: "Completados",      value: filtered.filter(o => o.status === "completado").length, color: "text-emerald-400" },
          { label: "En proceso",       value: filtered.filter(o => o.status !== "completado" && o.status !== "cancelado").length, color: "text-orange-400" },
        ].map(stat => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 sm:p-4">
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{stat.label}</p>
            <p className={`font-black text-lg sm:text-xl tabular-nums leading-tight mt-0.5 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Search bar ─────────────────────────────────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            type="text"
            placeholder="Buscar por cliente o ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-zinc-100 placeholder:text-zinc-700 outline-none focus:border-purple-500/50 transition"
          />
        </div>
      </div>

      {/* ── Table (md+) — Cards (mobile) ────────────────────────── */}

      {/* Mobile card list */}
      <div className="md:hidden space-y-2.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-700">
            <p className="font-bold text-sm uppercase tracking-widest">No se encontraron ventas</p>
          </div>
        ) : (
          filtered.map(o => <OrderCard key={o.id} order={o} />)
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800">
                {["ID", "Cliente", "Estado", "Método", "Total", ""].map(h => (
                  <th key={h} className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map(o => (
                <tr key={o.id} className="group hover:bg-zinc-800/30 transition">
                  <td className="px-5 py-3.5 font-mono text-xs font-black text-zinc-400 group-hover:text-purple-400 transition whitespace-nowrap">
                    #{o.id.split("-")[1] || o.id}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white whitespace-nowrap">{o.clientName}</span>
                      <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">
                        {new Date(o.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })} hs
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-bold text-zinc-400 whitespace-nowrap">{o.paymentMethod}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-black text-white whitespace-nowrap">{fmtARS(o.total)}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
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
        <div className="px-5 py-4 bg-zinc-950/30 border-t border-zinc-800 flex items-center justify-between">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            Mostrando {filtered.length} de {orders.length} resultados
          </p>
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
    </div>
  );
}
