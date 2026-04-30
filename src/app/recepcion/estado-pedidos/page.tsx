"use client";

import React, { useState, useEffect } from "react";
import { mockOrdersStore, MockOrder, OrderStatus } from "@/lib/mockData";
import { Clock, ChefHat, Truck, CheckCircle2, RefreshCw, Eye, Phone, ChevronDown, ChevronUp, XCircle, ShoppingBag } from "lucide-react";

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  confirmado:  { label: "Confirmado",   icon: Clock,        color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  "en-cocina": { label: "En Preparación",icon: ChefHat,      color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  listo:       { label: "Listo",        icon: ShoppingBag,  color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  "en-camino": { label: "En Camino",    icon: Truck,        color: "text-sky-400",    bg: "bg-sky-500/10",    border: "border-sky-500/20"    },
  completado:  { label: "Completado",   icon: CheckCircle2, color: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20"},
  cancelado:   { label: "Cancelado",    icon: XCircle,      color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/20"},
};

export default function EstadoPedidosPage() {
  const [orders, setOrders] = useState<MockOrder[]>(() => mockOrdersStore.getSnapshot());
  const [filter, setFilter] = useState<string>("todos");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    return mockOrdersStore.subscribe(() => setOrders([...mockOrdersStore.getSnapshot()]));
  }, []);

  const filtered = filter === "todos" ? orders : orders.filter(o => o.status === filter);
  const counts = {
    todos: orders.length,
    confirmado: orders.filter(o => o.status === "confirmado").length,
    "en-cocina": orders.filter(o => o.status === "en-cocina").length,
    listo: orders.filter(o => o.status === "listo").length,
    "en-camino": orders.filter(o => o.status === "en-camino").length,
    completado: orders.filter(o => o.status === "completado").length,
    cancelado: orders.filter(o => o.status === "cancelado").length,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Estado de Pedidos</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Monitor en tiempo real</p>
        </div>
        <button onClick={() => setOrders([...mockOrdersStore.getSnapshot()])} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="shrink-0 px-5 py-3 border-b border-zinc-800/60 bg-zinc-950/80 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { key: "todos", label: "Todos" },
          { key: "confirmado", label: "Confirmados" },
          { key: "en-cocina", label: "En Preparación" },
          { key: "listo", label: "Listos" },
          { key: "en-camino", label: "En Camino" },
          { key: "completado", label: "Completados" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
              filter === f.key
                ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
                : "bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
            }`}>
            {f.label} <span className="ml-1 opacity-60">{counts[f.key as keyof typeof counts]}</span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-700">
            <Clock size={40} strokeWidth={1.5} />
            <p className="font-bold text-sm uppercase tracking-widest">Sin pedidos</p>
          </div>
        ) : filtered.map(order => {
          const st = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmado;
          const Icon = st.icon;
          const isExpanded = expandedId === order.id;
          const isDelivery = order.address !== "Retiro en local" && order.address !== "Local";

          return (
            <div key={order.id}
              className={`bg-zinc-900 border ${st.border} rounded-2xl overflow-hidden transition-all shadow-sm hover:shadow-md`}
            >
              {/* Row */}
              <div className="w-full px-4 py-3.5 flex flex-col gap-3 text-left">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl ${st.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={16} className={st.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-black text-sm text-white">#{order.id}</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${st.bg} ${st.border} ${st.color}`}>
                        {st.label}
                      </span>
                      {isDelivery && <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-bold">🛵 ENVÍO</span>}
                    </div>
                    {/* INFO COMPACTA DEL CLIENTE */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-zinc-400 font-medium leading-tight">
                      <span className="font-bold text-zinc-200">{order.clientName}</span>
                      {order.phone && <span>· {order.phone}</span>}
                      <span>· {order.address || "Retiro en local"}</span>
                      <span className="capitalize">· {order.paymentMethod}</span>
                      <span>· {new Date(order.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-2">
                    <span className="font-black text-sm text-white tabular-nums">{fmtARS(order.total)}</span>
                    <button onClick={() => setExpandedId(isExpanded ? null : order.id)} className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1.5 rounded-lg border transition ${isExpanded ? "bg-zinc-800 text-white border-zinc-700" : "bg-transparent text-zinc-500 border-transparent hover:bg-zinc-800/50 hover:text-zinc-300"}`}>
                      {isExpanded ? "Ocultar" : "Ver Más"}
                      {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  </div>
                </div>
                
                {/* ITEMS VISIBLES SIEMPRE */}
                <div className="pl-12 space-y-1 mt-1">
                  {order.items.map((it, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="w-4 h-4 rounded bg-zinc-800/80 flex items-center justify-center font-black text-orange-400 text-[9px] shrink-0">{it.quantity}</span>
                      <span className="font-bold text-zinc-300 leading-tight">{it.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DETALLE EXPANDIDO */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-zinc-800/60 bg-zinc-950/30">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Información del Cliente y Envío</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Cliente</p>
                      <p className="text-xs font-bold text-zinc-200">{order.clientName}</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Dirección</p>
                      <p className="text-xs font-bold text-zinc-200">{order.address || "Retiro en local"}</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Pago</p>
                      <p className="text-xs font-bold text-zinc-200 capitalize">{order.paymentMethod}</p>
                    </div>
                    {order.phone && (
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                          Teléfono
                        </p>
                        <p className="text-xs font-bold text-zinc-200">{order.phone}</p>
                      </div>
                    )}
                  </div>
                  {order.status !== "cancelado" && (
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={() => mockOrdersStore.updateOrderStatus(order.id, "cancelado")}
                        className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition flex items-center gap-1.5"
                      >
                        <XCircle size={14} strokeWidth={2.5} />
                        Cancelar Pedido
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
