"use client";

import React, { useState, useEffect } from "react";
import { MockOrder } from "@/types/models";
import { useOrdersStore } from "@/lib/store/ordersStore";
import { getBusinessDay } from "@/lib/businessDay";
import {
  MapPin, Navigation, Package, CheckCircle2, Bike, Phone,
  ChevronDown, ChevronUp, ChefHat, AlertTriangle,
} from "lucide-react";

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

function openMap(address: string) {
  window.open(`https://maps.google.com/?q=${encodeURIComponent(address + ", Córdoba, Argentina")}`, "_blank");
}

// ── Delivery Card ─────────────────────────────────────────────────────────────
const DeliveryCard = React.memo(function DeliveryCard({
  order,
  onAction,
  readonly = false,
}: {
  order: MockOrder;
  onAction?: (status: string, markPaid?: boolean) => void;
  readonly?: boolean;
}) {
  const isEfectivo   = order.paymentMethod?.toLowerCase() === "efectivo";
  const isListo      = order.status === "listo";
  const isEnCocina   = order.status === "en-cocina" || order.status === "confirmado";
  const isCompletado = order.status === "completado";
  const isPending    = order.paymentStatus === "pendiente";
  const [showConfirm, setShowConfirm] = useState(false);

  // Visual identity per status & payment
  const headerTheme = isPending
    ? "bg-red-950/80 border-red-900/80"
    : isEnCocina
    ? "bg-orange-950/40 border-orange-900/30"
    : isListo
    ? "bg-yellow-950/30 border-yellow-900/30"
    : isCompletado
    ? "bg-emerald-950/30 border-emerald-900/30"
    : "bg-sky-950/30 border-sky-900/30";

  const cardBorder = isPending
    ? "border-2 border-red-600 shadow-[0_0_20px_-3px_rgba(239,68,68,0.45)] ring-1 ring-red-500/50"
    : isEnCocina
    ? "border-orange-900/40"
    : isListo
    ? "border-yellow-900/50"
    : isCompletado
    ? "border-emerald-900/40"
    : "border-sky-900/40";

  const statusBadge = isEnCocina
    ? "bg-orange-500/15 border-orange-500/25 text-orange-400"
    : isListo
    ? "bg-yellow-500/15 border-yellow-500/25 text-yellow-400"
    : isCompletado
    ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-400"
    : "bg-sky-500/15 border-sky-500/25 text-sky-400";

  const statusLabel = isEnCocina
    ? "🍕 En Cocina"
    : isListo
    ? "🏪 A Retirar"
    : isCompletado
    ? "✅ Entregado"
    : "🛵 En Camino";

  const addressTheme = isPending
    ? "bg-red-950/20 border-red-900/40"
    : isEnCocina
    ? "bg-orange-950/20 border-orange-900/30"
    : isListo
    ? "bg-yellow-950/20 border-yellow-900/30"
    : isCompletado
    ? "bg-emerald-950/20 border-emerald-900/30"
    : "bg-sky-950/20 border-sky-900/30";

  const pinColor = isPending
    ? "bg-red-500/10 border-red-500/20"
    : isEnCocina
    ? "bg-orange-500/10 border-orange-500/20"
    : isListo
    ? "bg-yellow-500/10 border-yellow-500/20"
    : isCompletado
    ? "bg-emerald-500/10 border-emerald-500/20"
    : "bg-sky-500/10 border-sky-500/20";

  const pinIconColor = isPending
    ? "text-red-400"
    : isEnCocina
    ? "text-orange-400"
    : isListo
    ? "text-yellow-400"
    : isCompletado
    ? "text-emerald-400"
    : "text-sky-400";

  return (
    <div className={`rounded-2xl overflow-hidden shadow-xl border ${cardBorder} ${isPending ? 'bg-gradient-to-b from-red-950/25 via-zinc-900 to-zinc-900' : 'bg-zinc-900'}`}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className={`px-4 py-3 border-b ${headerTheme}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono font-black text-white text-base shrink-0">#{order.id}</span>
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0 ${statusBadge}`}>
              {statusLabel}
            </span>
            <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-full truncate">
              {order.mockAge}
            </span>
          </div>
          <div className="text-right shrink-0">
            {isPending ? (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 bg-red-600 text-white animate-pulse inline-flex items-center gap-1 shadow-sm">
                ⚠️ IMPAGO
              </span>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-block">
                ✓ PAGADO
              </span>
            )}
            <p className={`font-black text-lg tabular-nums leading-tight ${isPending ? 'text-red-400' : 'text-white'}`}>{fmtARS(order.total)}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">

        {/* ── Cliente + Pago ────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Cliente</p>
            <p className="font-black text-xl text-white leading-tight truncate">{order.clientFirstName} {order.clientLastName}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className={`text-xs font-black px-3 py-1 rounded-xl ${
              isEfectivo
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
            }`}>
              {isEfectivo ? "💵 Efectivo" : order.paymentMethod === "Tarjeta" ? "💳 Tarjeta" : "📲 Transfer."}
            </span>
            {order.deliveryFee !== undefined && order.deliveryFee > 0 && (
              <span className="text-[10px] font-bold text-zinc-500">Envío: {fmtARS(order.deliveryFee)}</span>
            )}
          </div>
        </div>

        {/* ── Dirección ─────────────────────────────────────── */}
        <div className={`border rounded-xl p-3 flex items-start gap-3 ${addressTheme}`}>
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${pinColor}`}>
            <MapPin size={16} className={pinIconColor} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-0.5">Destino</p>
            <p className="font-bold text-sm text-zinc-100 leading-snug">{order.address}</p>
          </div>
        </div>

        {/* ── Items ────────────────────────────────────────── */}
        <div className="bg-zinc-950 border border-zinc-800/60 rounded-xl p-3 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 border-b border-zinc-800/60 pb-2">
            <Package size={13} className="text-zinc-600" />
            {order.items.length} {order.items.length === 1 ? "producto" : "productos"}
          </div>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="shrink-0 w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black text-orange-400 text-xs">
                  {item.quantity}
                </span>
                <p className="font-bold text-xs text-zinc-200 leading-tight pt-1">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions (only for active states) ─────────────── */}
        {!readonly && !isEnCocina && !isCompletado && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            {order.phone && (
              <a
                href={`tel:${order.phone}`}
                className="col-span-2 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700 font-bold text-sm transition active:scale-95"
              >
                <Phone size={16} />
                Llamar ({order.phone})
              </a>
            )}
            <button
              onClick={() => openMap(order.address)}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-sky-600/20 border border-sky-500/30 text-sky-400 hover:bg-sky-600/30 font-bold text-sm transition active:scale-95"
            >
              <Navigation size={16} />
              Navegar
            </button>
            {isListo ? (
              <button
                onClick={() => onAction?.("en-camino")}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-yellow-950 font-black text-sm transition active:scale-95 shadow-lg shadow-yellow-900/20"
              >
                <Bike size={16} />
                Tomar Viaje
              </button>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition active:scale-95 shadow-lg shadow-emerald-900/40"
              >
                <CheckCircle2 size={16} />
                Entregado
              </button>
            )}
          </div>
        )}

        {/* Read-only info for en-cocina */}
        {isEnCocina && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <ChefHat size={14} className="text-orange-400 shrink-0" />
            <p className="text-xs font-bold text-orange-300">El pedido está siendo preparado en cocina</p>
          </div>
        )}

        {/* Read-only info for completado */}
        {isCompletado && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            <p className="text-xs font-bold text-emerald-300">Entrega confirmada y registrada</p>
          </div>
        )}
      </div>

      {/* ── Confirm bottom sheet ──────────────────────────────── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom sm:zoom-in duration-200">
            {order.paymentStatus === "pagado" ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} className="text-emerald-400" />
                </div>
                <h3 className="font-black text-xl text-white text-center mb-2">¿Confirmar Entrega?</h3>
                <p className="text-emerald-400 font-bold text-sm text-center mb-6 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                  Este pedido YA ESTÁ PAGADO ({order.paymentMethod}).<br />Solo entregalo al cliente.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-3.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition active:scale-95"
                  >
                    Volver
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                      onAction?.("completado", true);
                    }}
                    className="flex-1 py-3.5 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-500 transition active:scale-95 shadow-lg shadow-emerald-900/40"
                  >
                    Confirmar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle size={28} className="text-red-400" />
                </div>
                <h3 className="font-black text-xl text-white text-center mb-1">Cobro y Entrega</h3>
                <p className="text-zinc-400 text-xs text-center mb-3">
                  Cliente: <span className="font-bold text-white">{order.clientFirstName} {order.clientLastName}</span>
                </p>
                <div className="text-red-300 text-xs text-center mb-5 font-bold bg-red-950/40 p-3 rounded-2xl border border-red-900/60 space-y-1">
                  <p className="text-red-400 font-black uppercase tracking-wider text-[10px]">⚠️ PEDIDO A COBRAR</p>
                  <p className="text-base font-black text-white">{fmtARS(order.total)}</p>
                  <p className="text-zinc-400 font-medium text-[11px]">Medio acordado: {order.paymentMethod}</p>
                </div>
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                      onAction?.("completado", true);
                    }}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-500 transition active:scale-95 shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 text-sm"
                  >
                    <CheckCircle2 size={18} />
                    Cobrado en Mano ({fmtARS(order.total)})
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                      onAction?.("completado", false);
                    }}
                    className="w-full py-3 rounded-xl bg-red-950 text-red-300 border border-red-800 hover:bg-red-900/60 font-black text-xs transition active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle size={15} />
                    Entregar Fiado (Queda Debiendo)
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="w-full py-2.5 rounded-xl bg-zinc-800/80 text-zinc-400 font-bold text-xs hover:bg-zinc-800 hover:text-white transition"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

// ── Tab config ────────────────────────────────────────────────────────────────
const TABS = [
  {
    key:            "en-cocina" as const,
    label:          "En Cocina",
    shortLabel:     "Cocina",
    dotColor:       "bg-orange-500",
    activeText:     "text-orange-400",
    activeBg:       "bg-orange-500/10",
    badgeBg:        "bg-orange-500/20 text-orange-400",
    borderAccent:   "border-orange-900/40",
    labelColor:     "text-orange-400",
    contextLabel:   "Pedidos en preparación — aún no listos para retirar",
    emptyIcon:      "🍕",
    emptyText:      "Nada en preparación",
    emptySubtext:   "Los pedidos entrados a cocina aparecerán aquí.",
    waitDot:        "bg-orange-500",
    waitText:       "Esperando nuevos pedidos...",
    readonly:       true,
  },
  {
    key:            "listo" as const,
    label:          "A Retirar",
    shortLabel:     "Retirar",
    dotColor:       "bg-yellow-500",
    activeText:     "text-yellow-400",
    activeBg:       "bg-yellow-500/10",
    badgeBg:        "bg-yellow-500/20 text-yellow-400",
    borderAccent:   "border-yellow-900/40",
    labelColor:     "text-yellow-500",
    contextLabel:   "Pedidos listos en cocina — retirá y salí a entregar",
    emptyIcon:      "🏪",
    emptyText:      "Sin pedidos a retirar",
    emptySubtext:   "Cuando cocina marque un pedido como listo, aparecerá aquí.",
    waitDot:        "bg-yellow-500",
    waitText:       "Esperando que cocina marque listos...",
    readonly:       false,
  },
  {
    key:            "en-camino" as const,
    label:          "En Camino",
    shortLabel:     "En Ruta",
    dotColor:       "bg-sky-500",
    activeText:     "text-sky-400",
    activeBg:       "bg-sky-500/10",
    badgeBg:        "bg-sky-500/20 text-sky-400",
    borderAccent:   "border-sky-900/40",
    labelColor:     "text-sky-400",
    contextLabel:   "Rutas activas — pedidos en camino al cliente",
    emptyIcon:      "🛵",
    emptyText:      "Sin viajes en curso",
    emptySubtext:   "Tomá un pedido de \"A Retirar\" para que aparezca aquí.",
    waitDot:        "bg-sky-500",
    waitText:       "Sin salidas activas.",
    readonly:       false,
  },
  {
    key:            "completado" as const,
    label:          "Entregados",
    shortLabel:     "Entregados",
    dotColor:       "bg-emerald-500",
    activeText:     "text-emerald-400",
    activeBg:       "bg-emerald-500/10",
    badgeBg:        "bg-emerald-500/20 text-emerald-400",
    borderAccent:   "border-emerald-900/40",
    labelColor:     "text-emerald-400",
    contextLabel:   "Historial del turno — entregas confirmadas hoy",
    emptyIcon:      "✅",
    emptyText:      "Sin entregas aún",
    emptySubtext:   "Las entregas confirmadas de hoy se acumularán aquí.",
    waitDot:        "bg-emerald-500",
    waitText:       "Empezá a hacer entregas.",
    readonly:       true,
  },
];

// ── Kanban Column Component (Multi-column view for landscape/desktop) ─────────
function DeliveryColumn({
  title,
  icon: Icon,
  count,
  accent,
  badgeBg,
  emptyIcon,
  emptyText,
  emptySubtext,
  children,
}: {
  title: string;
  icon: React.ElementType;
  count: number;
  accent: string;
  badgeBg: string;
  emptyIcon: string;
  emptyText: string;
  emptySubtext: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col rounded-2xl border ${accent} overflow-hidden bg-zinc-950/60 h-full min-w-0`}>
      <div className="shrink-0 px-3.5 py-3 border-b border-inherit flex items-center justify-between bg-zinc-900/40">
        <div className="flex items-center gap-2 min-w-0">
          <Icon size={16} className="text-inherit opacity-80 shrink-0" />
          <h2 className="font-black text-xs uppercase tracking-wider truncate text-zinc-100">{title}</h2>
        </div>
        <span className={`font-black text-xs min-w-[24px] h-6 px-1.5 rounded-full flex items-center justify-center shrink-0 ${badgeBg} tabular-nums`}>
          {count}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-2.5 space-y-3">
        {count === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-700 font-bold text-xs uppercase tracking-widest py-14 gap-2 text-center">
            <span className="text-3xl opacity-35">{emptyIcon}</span>
            <span className="text-xs text-zinc-500 font-bold">{emptyText}</span>
            <span className="text-[10px] text-zinc-700 font-medium max-w-[180px] normal-case">{emptySubtext}</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MisViajesPage() {
  const orders = useOrdersStore((s) => s.orders);
  const updateOrderStatus = useOrdersStore((s) => s.updateOrderStatus);
  const updateOrderPaymentStatus = useOrdersStore((s) => s.updateOrderPaymentStatus);
  const [activeTab, setActiveTab] = useState<"en-cocina" | "listo" | "en-camino" | "completado">("listo");

  const isDelivery = (address: string) => {
    if (!address) return false;
    const lower = address.toLowerCase().trim();
    return lower !== "retiro en local" && lower !== "retira en local" && lower !== "local" && lower !== "retiro";
  };

  const { currentShiftOrders, byStatus } = React.useMemo(() => {
    const todayTime = getBusinessDay().getTime();
    const shiftOrders = orders.filter(o => getBusinessDay(o.createdAt).getTime() === todayTime);
    
    return {
      currentShiftOrders: shiftOrders,
      byStatus: {
        "en-cocina": shiftOrders.filter(o => ["confirmado", "en-cocina"].includes(o.status) && isDelivery(o.address)),
        listo:       shiftOrders.filter(o => o.status === "listo"       && isDelivery(o.address)),
        "en-camino": shiftOrders.filter(o => o.status === "en-camino"   && isDelivery(o.address)),
        completado:  shiftOrders.filter(o => o.status === "completado"  && isDelivery(o.address)),
      }
    };
  }, [orders]);

  function handleAction(id: string, newStatus: string, markPaid?: boolean) {
    updateOrderStatus(id, newStatus as any);
    if (newStatus === "completado" && markPaid === true) {
      updateOrderPaymentStatus(id, "pagado");
    }
  }

  const current = TABS.find(t => t.key === activeTab)!;
  const currentOrders = byStatus[activeTab];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-zinc-950">

      {/* ── MOBILE ONLY (Portrait): Tab switcher ─────────────────────────── */}
      <div className="shrink-0 md:hidden flex border-b border-zinc-900 bg-zinc-950 overflow-x-auto no-scrollbar">
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;
          const count = byStatus[tab.key].length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex-1 min-w-[80px] flex flex-col items-center justify-center py-3 gap-0.5 transition-colors ${
                isActive ? `${tab.activeText} ${tab.activeBg}` : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">{tab.label}</span>
              {count > 0 ? (
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full mt-0.5 ${isActive ? tab.badgeBg : "bg-zinc-800 text-zinc-500"}`}>
                  {count}
                </span>
              ) : (
                <span className="text-[9px] text-zinc-700 mt-0.5">—</span>
              )}
              {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-current" />}
            </button>
          );
        })}
      </div>

      {/* ── MOBILE ONLY (Portrait): Single active column ─────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:hidden">
        {currentOrders.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-20 gap-4 text-center max-w-xs mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-4xl">
              {current.emptyIcon}
            </div>
            <div>
              <h2 className="font-black text-xl text-zinc-400">{current.emptyText}</h2>
              <p className="text-zinc-600 text-sm mt-1.5 leading-snug">{current.emptySubtext}</p>
            </div>
            <div className="flex items-center gap-2 mt-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5">
              <span className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${current.waitDot}`} />
              <span className="text-xs font-bold text-zinc-500">{current.waitText}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-lg mx-auto">
            {currentOrders.map(o => (
              <DeliveryCard
                key={o.id}
                order={o}
                readonly={current.readonly}
                onAction={(s, markPaid) => handleAction(o.id, s, markPaid)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── HORIZONTAL / LANDSCAPE PHONE & TABLET & DESKTOP: 4-column kanban ─ */}
      <div className="hidden md:grid md:grid-cols-4 gap-3 p-3 flex-1 overflow-hidden">
        {TABS.map(tab => {
          const list = byStatus[tab.key];
          const tabIcon = tab.key === "en-cocina" ? ChefHat : tab.key === "listo" ? Package : tab.key === "en-camino" ? Bike : CheckCircle2;
          return (
            <DeliveryColumn
              key={tab.key}
              title={tab.label}
              icon={tabIcon}
              count={list.length}
              accent={tab.borderAccent}
              badgeBg={tab.badgeBg}
              emptyIcon={tab.emptyIcon}
              emptyText={tab.emptyText}
              emptySubtext={tab.emptySubtext}
            >
              {list.map(o => (
                <DeliveryCard
                  key={o.id}
                  order={o}
                  readonly={tab.readonly}
                  onAction={(s, markPaid) => handleAction(o.id, s, markPaid)}
                />
              ))}
            </DeliveryColumn>
          );
        })}
      </div>
    </div>
  );
}
