"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MockOrder } from "@/types/models";
import { useOrdersStore } from "@/lib/store/ordersStore";
import { getBusinessDay } from "@/lib/businessDay";
import { Clock, ChefHat, Truck, CheckCircle2, XCircle, ShoppingBag, Eye, RefreshCw, AlertTriangle, Flame, Copy, Check, ExternalLink, MessageSquare } from "lucide-react";
import { orderRequiresKitchen } from "@/lib/orderKitchenHelper";
import { getTrackingUrl } from "@/lib/trackingHelper";
import { buildWhatsAppUrl } from "@/lib/utils";

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
const ReceptionCard = React.memo(function ReceptionCard({ order, expandedId, setExpandedId, readOnly }: {
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
  const updateOrderStatus = useOrdersStore((s) => s.updateOrderStatus);
  const updateOrderPaymentStatus = useOrdersStore((s) => s.updateOrderPaymentStatus);
  const isPending = order.paymentStatus === "pendiente";
  const requiresKitchen = orderRequiresKitchen(order);

  return (
    <div
      className={`flex flex-col rounded-2xl overflow-hidden shadow-sm transition-all ${
        isPending
          ? "bg-gradient-to-b from-red-950/35 via-zinc-900 to-zinc-900 border-2 border-red-600 shadow-[0_0_20px_-3px_rgba(239,68,68,0.45)] ring-1 ring-red-500/50"
          : "bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700"
      }`}
    >
      {/* Header */}
      <div
        className={`px-2.5 py-2 flex items-center justify-between border-b gap-1 ${
          isPending
            ? "border-red-900/80 bg-red-950/80"
            : "border-zinc-800/60 bg-zinc-950/50"
        }`}
      >
        <div className="flex items-center gap-1.5 flex-wrap">
          <a
            href={getTrackingUrl(order)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-mono font-black text-sky-400 hover:text-sky-300 text-xs leading-none flex items-center gap-1 hover:underline transition"
            title="Abrir seguimiento en vivo del pedido"
          >
            #{order.id}
            <ExternalLink size={10} className="opacity-70" />
          </a>
          <span className="shrink-0 text-[8px] font-black uppercase tracking-widest px-1 py-0.5 rounded bg-zinc-800 text-zinc-300">
            {isDelivery ? '🛵 Envío' : '🏪 Retiro'}
          </span>
          {!requiresKitchen && (
            <span className="shrink-0 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60">
              🥤 Solo Bebidas
            </span>
          )}
          {isPending ? (
            <span className="shrink-0 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-red-600 text-white animate-pulse shadow-sm flex items-center gap-1">
              ⚠️ IMPAGO
            </span>
          ) : (
            <span className="shrink-0 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ✓ PAGADO
            </span>
          )}
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
            <p className={`font-bold text-sm leading-tight break-words ${isPending ? "text-red-200" : "text-zinc-200"}`}>
              {order.clientFirstName} {order.clientLastName}
            </p>
            <p className="text-[10px] text-zinc-500 font-medium mt-0.5 leading-snug break-words">
              {isDelivery && <>{order.address} • </>}<span className="capitalize">{order.paymentMethod}</span>
            </p>
          </div>
          <span className={`font-black text-sm tabular-nums shrink-0 ${isPending ? "text-red-400" : "text-white"}`}>
            {fmtARS(order.total)}
          </span>
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
            {/* Quick Share / Tracking Bar (Sin botón 'Ver Estado') */}
            <div className="flex items-center gap-2 mt-1">
              {order.phone ? (
                <>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const url = getTrackingUrl(order);
                      const text = `¡Hola ${order.clientFirstName || "Cliente"}! 👋 Acá tenés el link para seguir tu pedido #${order.id} en vivo: ${url}`;
                      const phoneDigits = order.phone!.replace(/\D/g, "");
                      window.open(buildWhatsAppUrl(phoneDigits, text), "_blank");
                    }}
                    className="flex-1 text-[11px] font-bold text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/25 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95"
                    title="Enviar seguimiento por WhatsApp"
                  >
                    <MessageSquare size={13} className="shrink-0" />
                    <span>WhatsApp</span>
                  </button>

                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const url = getTrackingUrl(order);
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(url);
                      }
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex-1 text-[11px] font-bold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95"
                    title="Copiar enlace de seguimiento"
                  >
                    {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    <span>{copied ? "¡Copiado!" : "Copiar Link"}</span>
                  </button>
                </>
              ) : (
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const url = getTrackingUrl(order);
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(url);
                    }
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="w-full text-[11px] font-bold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95"
                  title="Copiar enlace de seguimiento"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? "¡Copiado al portapapeles!" : "Copiar Link de Seguimiento"}</span>
                </button>
              )}
            </div>

            {/* Acción de avance según el estado actual del pedido */}
            {!readOnly && order.status === "confirmado" && (
              requiresKitchen ? (
                <button 
                  onClick={() => updateOrderStatus(order.id, "en-cocina")}
                  className="w-full text-xs font-bold text-yellow-300 bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/30 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
                >
                  <ChefHat size={15} /> Pasar a Cocina
                </button>
              ) : (
                <button 
                  onClick={() => updateOrderStatus(order.id, "listo")}
                  className="w-full text-xs font-bold text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
                >
                  <ShoppingBag size={15} /> Marcar como Listo (Bebidas)
                </button>
              )
            )}

            {!readOnly && order.status === "en-cocina" && (
              <button 
                onClick={() => updateOrderStatus(order.id, "listo")}
                className="w-full text-xs font-bold text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
              >
                <ShoppingBag size={15} /> Marcar como Listo
              </button>
            )}

            {!readOnly && order.status === "listo" && (
              isDelivery ? (
                <div className="flex flex-col gap-1.5 w-full">
                  <button 
                    onClick={() => updateOrderStatus(order.id, "en-camino")}
                    className="w-full text-xs font-bold text-sky-300 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
                  >
                    <Truck size={15} /> Despachar (En Camino)
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(order.id, "completado")}
                    className="w-full text-xs font-bold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
                  >
                    <CheckCircle2 size={15} /> Entregar en Mostrador
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => updateOrderStatus(order.id, "completado")}
                  className="w-full text-xs font-bold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
                >
                  <CheckCircle2 size={15} /> Entregar al Cliente
                </button>
              )
            )}

            {!readOnly && order.status === "en-camino" && (
              <button 
                onClick={() => updateOrderStatus(order.id, "completado")}
                className="w-full text-xs font-bold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
              >
                <CheckCircle2 size={15} /> Marcar como Entregado
              </button>
            )}

            {!readOnly && isPending && (
              <button 
                onClick={() => updateOrderPaymentStatus(order.id, "pagado")}
                className="w-full text-[11px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 py-2 rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <CheckCircle2 size={14} /> Marcar como Pagado
              </button>
            )}

            {!readOnly && order.status !== "cancelado" && order.status !== "completado" && (
              <button 
                onClick={() => updateOrderStatus(order.id, "cancelado")}
                className="w-full text-[11px] font-semibold text-red-400/80 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition active:scale-95"
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
});

// ── Column ───────────────────────────────────────────────────────────────────
const KanbanColumn = React.memo(function KanbanColumn({ title, icon: Icon, count, color, bg, border, children }: {
  title: string; icon: React.ElementType; count: number; color: string; bg: string; border: string; children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col rounded-2xl border ${border} overflow-hidden bg-zinc-950/60 h-full w-full min-w-0 shadow-sm`}>
      <div className={`shrink-0 px-3.5 py-2.5 border-b ${border} ${bg} flex items-center justify-between`}>
        <div className={`flex items-center gap-2 ${color} min-w-0`}>
          <Icon size={16} className="shrink-0" />
          <h2 className="font-black text-xs sm:text-sm uppercase tracking-wider truncate">{title}</h2>
        </div>
        <span className={`font-black text-xs px-2 py-0.5 rounded-full flex items-center justify-center bg-black/40 border ${border} ${color} tabular-nums shrink-0 ml-2`}>
          {count}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-2.5 sm:p-3 space-y-2.5 sm:space-y-3">
        {count === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-700 font-bold text-[10px] uppercase tracking-widest py-10 gap-2">
             <span className="text-2xl opacity-20"><Icon size={24} /></span>
             Vacío
          </div>
        ) : children}
      </div>
    </div>
  );
});

// ── Main ──────────────────────────────────────────────────────────────────────
const EstadoPedidosMonitor = React.memo(function EstadoPedidosMonitor({ readOnly = false }: { readOnly?: boolean }) {
  const orders = useOrdersStore((s) => s.orders);
  const [activeTab, setActiveTab] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
      <div className="shrink-0 px-4 sm:px-5 py-3 sm:py-3.5 border-b border-zinc-800/60 bg-zinc-950 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">Estado de Pedidos</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
            Monitor Kanban {readOnly && "(Solo Lectura)"} • {currentShiftOrders.length} {currentShiftOrders.length === 1 ? "pedido hoy" : "pedidos hoy"}
          </p>
        </div>
        <button onClick={() => window.location.reload()} className="p-2 sm:p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition active:scale-95" title="Refrescar">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* MOBILE (< md): Tab switcher */}
      <div className="shrink-0 md:hidden flex overflow-x-auto no-scrollbar border-b border-zinc-900 bg-zinc-950 px-1 py-1 gap-1">
        {columns.map((col, idx) => {
          const isActive = activeTab === idx;
          return (
            <button
              key={col.title}
              onClick={() => setActiveTab(idx as any)}
              className={`relative flex-1 min-w-[62px] shrink-0 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                isActive ? `${col.color} ${col.bg} border border-current shadow-sm` : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <col.icon size={15} className={isActive ? "opacity-100" : "opacity-60"} />
              <span className="leading-tight mt-1 text-center truncate max-w-[60px]">{col.title}</span>
              <span className="text-[10px] font-mono mt-0.5 tabular-nums opacity-80">{col.orders.length}</span>
            </button>
          );
        })}
      </div>

      {/* MOBILE (< md): Active Column */}
      <div className="flex-1 overflow-y-auto no-scrollbar md:hidden p-3 sm:p-4">
        <KanbanColumn
          title={activeColumn.title}
          icon={activeColumn.icon}
          count={activeColumn.orders.length}
          color={activeColumn.color}
          bg={activeColumn.bg}
          border={activeColumn.border}
        >
          {activeColumn.orders.map(o => (
            <ReceptionCard
              key={o.id}
              order={o}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              readOnly={readOnly}
            />
          ))}
        </KanbanColumn>
      </div>

      {/* TABLET & DESKTOP (>= md): Responsive Fluid Kanban Track with min-width and horizontal scroll */}
      <div className="hidden md:flex flex-1 overflow-x-auto overflow-y-hidden p-3.5 lg:p-4 gap-3.5 bg-zinc-950/40 no-scrollbar">
        {columns.map(col => (
          <div 
            key={col.id} 
            className="w-[280px] lg:w-[290px] xl:w-[310px] 2xl:w-auto 2xl:flex-1 shrink-0 h-full flex flex-col min-w-0"
          >
            <KanbanColumn
              title={col.title}
              icon={col.icon}
              count={col.orders.length}
              color={col.color}
              bg={col.bg}
              border={col.border}
            >
              {col.orders.map(o => (
                <ReceptionCard
                  key={o.id}
                  order={o}
                  expandedId={expandedId}
                  setExpandedId={setExpandedId}
                  readOnly={readOnly}
                />
              ))}
            </KanbanColumn>
          </div>
        ))}
      </div>
    </div>
  );
});

export default EstadoPedidosMonitor;
