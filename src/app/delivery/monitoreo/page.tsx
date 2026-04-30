"use client";

import React, { useState, useEffect } from "react";
import { mockOrdersStore, MockOrder } from "@/lib/mockData";
import { Clock, ChefHat, Truck, CheckCircle2, RefreshCw, ChevronDown, ChevronUp, MapPin, Package, Phone } from "lucide-react";

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string; border: string }> = {
  "en-cocina": { label: "En Preparación",icon: ChefHat,      color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  listo:       { label: "Listo para Retirar",icon: Package,  color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  "en-camino": { label: "En Camino",    icon: Truck,        color: "text-sky-400",    bg: "bg-sky-500/10",    border: "border-sky-500/20"    },
  completado:  { label: "Entregado",     icon: CheckCircle2, color: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20"},
};

export default function DeliveryMonitoreoPage() {
  const [orders, setOrders] = useState<MockOrder[]>(() => mockOrdersStore.getSnapshot());
  const [filter, setFilter] = useState<string>("todos");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    return mockOrdersStore.subscribe(() => setOrders([...mockOrdersStore.getSnapshot()]));
  }, []);

  const isDelivery = (address: string) => {
    if (!address) return false;
    const lower = address.toLowerCase();
    return !lower.includes("retiro") && !lower.includes("local") && lower !== "envío";
  };

  const deliveryOrders = orders.filter(o => isDelivery(o.address) && ["en-cocina", "listo", "en-camino", "completado"].includes(o.status));

  const filtered = filter === "todos" ? deliveryOrders : deliveryOrders.filter(o => o.status === filter);
  
  const counts = {
    todos: deliveryOrders.length,
    "en-cocina": deliveryOrders.filter(o => o.status === "en-cocina").length,
    listo: deliveryOrders.filter(o => o.status === "listo").length,
    "en-camino": deliveryOrders.filter(o => o.status === "en-camino").length,
    completado: deliveryOrders.filter(o => o.status === "completado").length,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-zinc-800/60 bg-zinc-950 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Monitoreo General</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Visión global de envíos</p>
        </div>
        <button onClick={() => setOrders([...mockOrdersStore.getSnapshot()])} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="shrink-0 px-4 py-3 border-b border-zinc-800/60 bg-zinc-950/80 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { key: "todos", label: "Todos" },
          { key: "en-cocina", label: "En Prep" },
          { key: "listo", label: "Listos" },
          { key: "en-camino", label: "En Camino" },
          { key: "completado", label: "Entregados" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition flex items-center gap-1.5 ${
              filter === f.key
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : "bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
            }`}>
            {f.label} <span className="opacity-60">{counts[f.key as keyof typeof counts]}</span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-700">
            <Package size={40} strokeWidth={1.5} />
            <p className="font-bold text-sm uppercase tracking-widest">Sin envíos</p>
          </div>
        ) : filtered.map(order => {
          const st = STATUS_CONFIG[order.status] || { label: order.status, icon: Package, color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20" };
          const Icon = st.icon;
          const isExpanded = expandedId === order.id;

          return (
            <div key={order.id}
              className={`bg-zinc-900 border ${st.border} rounded-2xl overflow-hidden transition-all shadow-sm`}
            >
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
                      <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-md font-bold">{order.mockAge}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 text-[11px] text-zinc-400 font-medium leading-tight mt-1">
                      <span className="font-bold text-zinc-200">{order.clientName}</span>
                      <span className="flex items-center gap-1 truncate"><MapPin size={10} className="shrink-0"/>{order.address}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-2">
                    <span className="font-black text-sm text-white tabular-nums">{fmtARS(order.total)}</span>
                    <button onClick={() => setExpandedId(isExpanded ? null : order.id)} className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1.5 rounded-lg border transition ${isExpanded ? "bg-zinc-800 text-white border-zinc-700" : "bg-transparent text-zinc-500 border-transparent hover:bg-zinc-800/50 hover:text-zinc-300"}`}>
                      {isExpanded ? "Ocultar" : "Detalles"}
                      {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* DETALLE EXPANDIDO */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-zinc-800/60 bg-zinc-950/30">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {order.phone && (
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-col justify-center">
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1 flex items-center gap-1">Teléfono</p>
                        <p className="text-xs font-bold text-zinc-200">{order.phone}</p>
                      </div>
                    )}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-col justify-center">
                      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">A cobrar ({order.paymentMethod})</p>
                      <p className="text-xs font-bold text-zinc-200">{fmtARS(order.total)}</p>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                     <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Contenido de la entrega</p>
                     <div className="space-y-1.5">
                       {order.items.map((it, i) => (
                         <div key={i} className="flex items-center gap-2 text-xs">
                           <span className="w-5 h-5 rounded-lg bg-zinc-800 flex items-center justify-center font-black text-orange-400 text-[10px] shrink-0">{it.quantity}</span>
                           <span className="font-bold text-zinc-300 leading-tight">{it.name}</span>
                         </div>
                       ))}
                     </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
