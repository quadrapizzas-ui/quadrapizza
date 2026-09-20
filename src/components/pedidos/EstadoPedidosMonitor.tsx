"use client";

import React, { useState, useEffect, useCallback } from "react";
import { mockOrdersStore, MockOrder } from "@/lib/mockData";
import { getBusinessDay } from "@/lib/businessDay";
import { Clock, ChefHat, Truck, CheckCircle2, XCircle, ShoppingBag, Eye, RefreshCw, AlertTriangle, Flame, Copy, Check } from "lucide-react";

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

function useElapsedMinutes(isoDate: string) {
  const calc = useCallback(() => Math.floor((Date.now() - new Date(isoDate).getTime()) / 60000), [isoDate]);
  const [mins, setMins] = useState(calc);
  useEffect(() => { const id = setInterval(() => setMins(calc()), 30000); return () => clearInterval(id); }, [calc]);
  return mins;
}

// ── Reception Card ──────────────────────────────────────────────────────────
function ReceptionCard({ order, expandedId, setExpandedId, readOnly }: {
  order: MockOrder;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  readOnly?: boolean;
}) {
  const mins = useElapsedMinutes(order.createdAt);
  const isHot = mins >= 30; // 30 mins para recepcion
  const isWarm = mins >= 15 && mins < 30;
  const isDelivery = order.address !== "Retiro en local" && order.address !== "Local" && order.address !== "Retira en Local";
  const isExpanded = expandedId === order.id;
  const [copied, setCopied] = useState(false);

  return (
    <div className={`flex flex-col bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm hover:border-zinc-700 transition-all`}>
      {/* Header */}
      <div className={`px-2.5 py-2 flex items-center justify-between border-b border-zinc-800/60 bg-zinc-950/50 gap-1`}>
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-black text-white text-xs leading-none">#{order.id}</span>
          <span className="shrink-0 text-[8px] font-black uppercase tracking-widest px-1 py-0.5 rounded bg-zinc-800 text-zinc-300">
            {isDelivery ? '🛵 Envío' : '🏪 Retiro'}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {isHot && <Flame size={12} className="text-red-500 animate-pulse shrink-0" />}
          {isWarm && <AlertTriangle size={12} className="text-yellow-500 shrink-0" />}
          <span className="font-mono font-bold text-zinc-400 text-[10px] tabular-nums leading-none shrink-0">{mins}'</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm text-zinc-200 leading-tight break-words">{order.clientName}</p>
            <p className="text-[10px] text-zinc-500 font-medium mt-0.5 leading-snug break-words">
              {isDelivery && <>{order.address} • </>}<span className="capitalize">{order.paymentMethod}</span>
            </p>
          </div>
          <span className="font-black text-sm text-white tabular-nums shrink-0">{fmtARS(order.total)}</span>
        </div>

        <div className="space-y-1 mt-2">
          {order.items.slice(0, isExpanded ? undefined : 2).map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className="font-black text-orange-400 text-[10px] shrink-0 mt-0.5">{item.quantity}x</span>
              <span className="font-medium text-zinc-400 leading-tight line-clamp-1">{item.name}</span>
            </div>
          ))}
          {!isExpanded && order.items.length > 2 && (
            <div className="text-[10px] font-bold text-zinc-600 pl-4">+{order.items.length - 2} ítems más...</div>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-2 border-t border-zinc-800/60 bg-zinc-950/30 flex flex-col gap-2">
           <button 
             onClick={(e) => {
               e.stopPropagation();
               const url = `${window.location.origin}/estado-pedido/${order.id}`;
               navigator.clipboard.writeText(url);
               setCopied(true);
               setTimeout(() => setCopied(false), 2000);
             }}
             className="mt-2 w-full text-[10px] font-black uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 py-1.5 rounded flex items-center justify-center gap-1.5 hover:bg-sky-500/20 transition"
           >
             {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Enlace copiado" : "Copiar enlace"}
           </button>

           {!readOnly && order.status !== "cancelado" && order.status !== "completado" && (
             <button 
               onClick={() => mockOrdersStore.updateOrderStatus(order.id, "cancelado")}
               className="w-full text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 py-1.5 rounded flex items-center justify-center gap-1.5 hover:bg-red-500/20 transition"
             >
               <XCircle size={14} /> Cancelar Pedido
             </button>
           )}
        </div>
      )}

      {/* Footer Toggle */}
      <button 
        onClick={() => setExpandedId(isExpanded ? null : order.id)}
        className="w-full py-1.5 bg-zinc-900 border-t border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors flex justify-center items-center gap-1"
      >
        <Eye size={12} /> {isExpanded ? "Ocultar" : "Ver Más"}
      </button>
    </div>
  );
}

// ── Column ───────────────────────────────────────────────────────────────────
function KanbanColumn({ title, icon: Icon, count, color, bg, border, children }: {
  title: string; icon: React.ElementType; count: number; color: string; bg: string; border: string; children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col rounded-2xl border ${border} overflow-hidden bg-zinc-950/60 h-full w-full min-w-0`}>
      <div className={`shrink-0 px-4 py-3 border-b ${border} ${bg} flex items-center justify-between`}>
        <div className={`flex items-center gap-2 ${color}`}>
          <Icon size={16} />
          <h2 className="font-black text-sm uppercase tracking-widest">{title}</h2>
        </div>
        <span className={`font-black text-xs w-6 h-6 rounded-full flex items-center justify-center bg-black/40 border ${border} ${color} tabular-nums`}>{count}</span>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
        {count === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-700 font-bold text-[10px] uppercase tracking-widest py-10 gap-2">
             <span className="text-2xl opacity-20"><Icon size={24} /></span>
             Vacío
          </div>
        ) : children}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function EstadoPedidosMonitor({ readOnly = false }: { readOnly?: boolean }) {
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [activeTab, setActiveTab] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setOrders(mockOrdersStore.getSnapshot());
    return mockOrdersStore.subscribe(() => setOrders([...mockOrdersStore.getSnapshot()]));
  }, []);

  const todayBusinessDayTime = getBusinessDay().getTime();
  const currentShiftOrders = orders.filter(o => getBusinessDay(o.createdAt).getTime() === todayBusinessDayTime);

  const columns = [
    { id: "confirmado", title: "Confirmados", icon: Clock,        color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { id: "en-cocina",  title: "En Cocina",   icon: ChefHat,      color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    { id: "listo",      title: "Listos",      icon: ShoppingBag,  color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { id: "en-camino",  title: "En Camino",   icon: Truck,        color: "text-sky-400",    bg: "bg-sky-500/10",    border: "border-sky-500/20" },
    { id: "completado", title: "Completados", icon: CheckCircle2, color: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20"}
  ].map(col => ({
    ...col,
    orders: currentShiftOrders.filter(o => o.status === col.id)
  }));

  const activeColumn = columns[activeTab];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Estado de Pedidos</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Monitor Kanban {readOnly && "(Solo Lectura)"}</p>
        </div>
        <button onClick={() => setOrders([...mockOrdersStore.getSnapshot()])} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* MOBILE (< md): Tab switcher */}
      <div className="shrink-0 md:hidden flex overflow-x-auto no-scrollbar border-b border-zinc-900 bg-zinc-950">
        {columns.map((col, idx) => {
          const isActive = activeTab === idx;
          return (
            <button
              key={col.title}
              onClick={() => setActiveTab(idx as any)}
              className={`relative flex-1 min-w-[64px] shrink-0 flex flex-col items-center justify-center py-3 gap-1 text-[9px] font-black uppercase tracking-widest transition-colors ${
                isActive ? `${col.color} ${col.bg}` : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              <col.icon size={15} className={isActive ? "opacity-100" : "opacity-50"} />
              <span className="leading-none mt-1 text-center">{col.title}</span>
              <span className="text-[10px] opacity-70 tabular-nums">{col.orders.length}</span>
              {isActive && <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${col.color.replace('text-', 'bg-')}`} />}
            </button>
          );
        })}
      </div>

      {/* MOBILE (< md): Active Column */}
      <div className="flex-1 overflow-y-auto no-scrollbar md:hidden p-4">
        <div className="space-y-3">
          {activeColumn.orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-700 gap-2">
              <span className="text-3xl opacity-20"><activeColumn.icon size={32} /></span>
              <p className="font-bold text-xs uppercase tracking-widest">Sin pedidos</p>
            </div>
          ) : (
            activeColumn.orders.map(o => (
              <ReceptionCard key={o.id} order={o} expandedId={expandedId} setExpandedId={setExpandedId} readOnly={readOnly} />
            ))
          )}
        </div>
      </div>

      {/* TABLET (md to lg): 2-column grid */}
      <div className="hidden md:grid lg:hidden grid-cols-2 flex-1 overflow-y-auto p-4 gap-3 bg-zinc-950/30">
        {columns.map(col => (
          <KanbanColumn key={col.id} title={col.title} icon={col.icon} count={col.orders.length} color={col.color} bg={col.bg} border={col.border}>
            {col.orders.map(o => (
              <ReceptionCard key={o.id} order={o} expandedId={expandedId} setExpandedId={setExpandedId} readOnly={readOnly} />
            ))}
          </KanbanColumn>
        ))}
      </div>

      {/* DESKTOP (lg+): Full 5-column Kanban */}
      <div className="hidden lg:grid lg:grid-cols-5 flex-1 overflow-hidden p-4 gap-3 bg-zinc-950/30">
        {columns.map(col => (
          <KanbanColumn key={col.id} title={col.title} icon={col.icon} count={col.orders.length} color={col.color} bg={col.bg} border={col.border}>
            {col.orders.map(o => (
              <ReceptionCard key={o.id} order={o} expandedId={expandedId} setExpandedId={setExpandedId} readOnly={readOnly} />
            ))}
          </KanbanColumn>
        ))}
      </div>
    </div>
  );
}
