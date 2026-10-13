"use client";

import React, { useState, useEffect } from "react";
import { MockOrder } from "@/types/models";
import { useOrdersStore } from "@/lib/store/ordersStore";
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
  AlertCircle,
} from "lucide-react";
import { normalizeSearch } from "@/lib/utils";

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

// ── Desktop order row ────────────────────────────────────────────────────────
function DesktopOrderRow({ order }: { order: MockOrder }) {
  const [expanded, setExpanded] = useState(false);
  const isPending = order.paymentStatus === "pendiente";
  const updateOrderPaymentStatus = useOrdersStore((s) => s.updateOrderPaymentStatus);

  return (
    <>
      <tr
        className={`group transition cursor-pointer border-l-4 ${
          isPending
            ? "bg-red-950/25 border-l-red-600 hover:bg-red-950/40"
            : "border-l-transparent hover:bg-zinc-800/30"
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-5 py-3.5 font-mono text-xs font-black text-zinc-400 group-hover:text-purple-400 transition whitespace-nowrap">
          #{order.id.split("-")[1] || order.id}
        </td>
        <td className="px-5 py-3.5">
          <div className="flex flex-col">
            <span className={`text-sm font-bold whitespace-nowrap ${isPending ? "text-red-200" : "text-white"}`}>
              {order.clientFirstName} {order.clientLastName}
            </span>
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">
              {new Date(order.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })} hs
            </span>
          </div>
        </td>
        <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
        <td className="px-5 py-3.5">
          <div className="flex flex-col gap-1 items-start">
            <span className="text-xs font-bold text-zinc-300 whitespace-nowrap">{order.paymentMethod}</span>
            {isPending ? (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-red-600 text-white animate-pulse shadow-sm">
                ⚠️ IMPAGO
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ✓ PAGADO
              </span>
            )}
          </div>
        </td>
        <td className="px-5 py-3.5">
          <span className={`text-sm font-black whitespace-nowrap tabular-nums ${isPending ? "text-red-400" : "text-white"}`}>
            {fmtARS(order.total)}
          </span>
        </td>
        <td className="px-5 py-3.5 text-right">
          <button className="p-2 text-zinc-700 group-hover:text-white transition">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className={isPending ? "bg-red-950/40" : "bg-zinc-950/50"}>
          <td colSpan={6} className="px-5 py-5 border-t border-zinc-800/50">
            <div className="flex flex-col gap-4">
              {isPending && (
                <div className="flex flex-wrap items-center justify-between p-3.5 rounded-xl bg-red-950/70 border border-red-800/80 gap-3">
                  <div>
                    <p className="text-xs font-black text-red-200 flex items-center gap-1.5">
                      <AlertCircle size={15} className="text-red-400 shrink-0" />
                      Pedido no abonado (Deuda pendiente activa)
                    </p>
                    <p className="text-[10px] text-red-300/80 mt-0.5">
                      Este saldo computa en el módulo de Deudores y Cuentas por Cobrar.
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateOrderPaymentStatus(order.id, "pagado");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center gap-2 shadow-lg shadow-emerald-950/50"
                  >
                    <CheckCircle2 size={15} /> Marcar como Pagado
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Cajero/a</p>
                  <p className="text-xs text-zinc-300 font-medium">{order.cajero_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Teléfono Cliente</p>
                  <p className="text-xs text-zinc-300 font-medium">{order.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Entrega</p>
                  <p className="text-xs text-zinc-300 font-medium">
                    {order.address === "Retiro en local" || order.address === "Retira en Local" || order.address === "Local" 
                      ? "🏪 Retiro en Local" 
                      : `🛵 Envío: ${order.address}`
                    }
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Costo Envío</p>
                  <p className="text-xs text-zinc-300 font-medium">{order.deliveryFee ? fmtARS(order.deliveryFee) : "Bonificado / No aplica"}</p>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Detalle de Productos</p>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden max-w-2xl">
                  {order.items.map((it, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/50 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center font-black text-orange-400 text-[10px] shrink-0">
                          {it.quantity}x
                        </span>
                        <span className="text-xs font-bold text-zinc-300">{it.name}</span>
                      </div>
                      <span className="text-xs font-medium text-zinc-400">{fmtARS(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Mobile order card ─────────────────────────────────────────────────────────
function OrderCard({ order }: { order: MockOrder }) {
  const [expanded, setExpanded] = useState(false);
  const isPending = order.paymentStatus === "pendiente";
  const updateOrderPaymentStatus = useOrdersStore((s) => s.updateOrderPaymentStatus);

  return (
    <div className={`rounded-2xl overflow-hidden border ${isPending ? "bg-red-950/20 border-red-600/80 shadow-md shadow-red-950/40" : "bg-zinc-900 border-zinc-800"}`}>
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full px-4 py-3.5 flex items-start gap-3 text-left"
      >
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-black text-purple-400">#{order.id.split("-")[1] || order.id}</span>
            <StatusBadge status={order.status} />
            {isPending ? (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-red-600 text-white animate-pulse">
                ⚠️ IMPAGO
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ✓ PAGADO
              </span>
            )}
          </div>
          <p className={`font-bold text-sm truncate ${isPending ? "text-red-200" : "text-white"}`}>{order.clientFirstName} {order.clientLastName}</p>
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">
            {new Date(order.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })} hs
            {" · "}{order.paymentMethod}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`font-black text-sm tabular-nums ${isPending ? "text-red-400" : "text-white"}`}>{fmtARS(order.total)}</span>
          {expanded ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-zinc-800/50 space-y-3">
          {isPending && (
            <button
              onClick={() => updateOrderPaymentStatus(order.id, "pagado")}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <CheckCircle2 size={14} /> Marcar como Pagado
            </button>
          )}

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
  const orders = useOrdersStore((s) => s.orders);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<"todos" | "pagados" | "impagos">("todos");
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    setVisibleCount(20);
  }, [search, paymentFilter]);

  const filtered = orders.filter((o) => {
    const searchNorm = normalizeSearch(search);
    const matchSearch =
      normalizeSearch(o.clientFirstName + " " + o.clientLastName).includes(searchNorm) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.phone || "").includes(search);

    const matchPayment =
      paymentFilter === "todos"
        ? true
        : paymentFilter === "pagados"
        ? o.paymentStatus === "pagado"
        : o.paymentStatus === "pendiente";

    return matchSearch && matchPayment;
  });

  const paginated = filtered.slice(0, visibleCount);

  const totalVentas = filtered.reduce((s, o) => s + o.total, 0);
  const totalCobrado = filtered.filter(o => o.paymentStatus === "pagado").reduce((s, o) => s + o.total, 0);
  const totalDeuda = filtered.filter(o => o.paymentStatus === "pendiente").reduce((s, o) => s + o.total, 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Header ── */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Clock size={20} className="text-purple-400" /> Historial de Ventas
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Registro completo de transacciones y estados de cobro</p>
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5 sm:space-y-6">

      {/* ── Quick stats ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "Total resultados", value: filtered.length, color: "text-white" },
          { label: "Facturación bruta", value: fmtARS(totalVentas), color: "text-purple-400" },
          { label: "Cobrado efectivo/dig.", value: fmtARS(totalCobrado), color: "text-emerald-400" },
          { label: "Deuda / Fiado pendiente", value: fmtARS(totalDeuda), color: "text-red-400" },
          { label: "Completados", value: filtered.filter(o => o.status === "completado").length, color: "text-sky-400" },
        ].map((stat, idx) => (
          <div key={stat.label} className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-3 sm:p-4 ${idx === 4 ? "col-span-2 sm:col-span-1" : ""}`}>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{stat.label}</p>
            <p className={`font-black text-lg sm:text-xl tabular-nums leading-tight mt-0.5 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Search & Filter bar ─────────────────────────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            type="text"
            placeholder="Buscar por cliente, teléfono o ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-zinc-100 placeholder:text-zinc-700 outline-none focus:border-purple-500/50 transition"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto shrink-0 overflow-x-auto no-scrollbar max-w-full">
          <button
            onClick={() => setPaymentFilter("todos")}
            className={`px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition shrink-0 ${
              paymentFilter === "todos" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Todos ({orders.length})
          </button>
          <button
            onClick={() => setPaymentFilter("pagados")}
            className={`px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition shrink-0 ${
              paymentFilter === "pagados" ? "bg-emerald-600 text-white" : "text-zinc-500 hover:text-emerald-400"
            }`}
          >
            ✓ Pagados ({orders.filter(o => o.paymentStatus === "pagado").length})
          </button>
          <button
            onClick={() => setPaymentFilter("impagos")}
            className={`px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition shrink-0 ${
              paymentFilter === "impagos" ? "bg-red-600 text-white animate-pulse" : "text-zinc-500 hover:text-red-400"
            }`}
          >
            ⚠️ Con Deuda ({orders.filter(o => o.paymentStatus === "pendiente").length})
          </button>
        </div>
      </div>

      {/* ── Table (md+) — Cards (mobile) ────────────────────────── */}

      {/* Mobile card list */}
      <div className="md:hidden space-y-2.5">
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-700">
            <p className="font-bold text-sm uppercase tracking-widest">No se encontraron ventas</p>
          </div>
        ) : (
          paginated.map(o => <OrderCard key={o.id} order={o} />)
        )}
        {visibleCount < filtered.length && (
          <div className="py-4 flex flex-col items-center gap-2">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Mostrando {paginated.length} de {filtered.length} resultados
            </p>
            <button 
              onClick={() => setVisibleCount(prev => prev + 20)}
              className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition active:scale-95"
            >
              Cargar más
            </button>
          </div>
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
              {paginated.map(o => <DesktopOrderRow key={o.id} order={o} />)}
              {paginated.length === 0 && (
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
            Mostrando {paginated.length} de {filtered.length} resultados
          </p>
          {visibleCount < filtered.length && (
            <button 
              onClick={() => setVisibleCount(prev => prev + 20)}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition active:scale-95"
            >
              Cargar más
            </button>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
