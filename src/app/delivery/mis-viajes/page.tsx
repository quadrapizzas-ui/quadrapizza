"use client";

import React, { useState, useEffect } from "react";
import { mockOrdersStore, MockOrder } from "@/lib/mockData";
import {
  MapPin, Navigation, Package, CheckCircle2, Bike, Phone,
  ChevronDown, ChevronUp, ChefHat,
} from "lucide-react";

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

function openMap(address: string) {
  window.open(`https://maps.google.com/?q=${encodeURIComponent(address + ", Córdoba, Argentina")}`, "_blank");
}

// ── Delivery Card ─────────────────────────────────────────────────────────────
function DeliveryCard({
  order,
  onAction,
  readonly = false,
}: {
  order: MockOrder;
  onAction?: (status: string) => void;
  readonly?: boolean;
}) {
  const isEfectivo   = order.paymentMethod?.toLowerCase() === "efectivo";
  const isListo      = order.status === "listo";
  const isEnCocina   = order.status === "en-cocina";
  const isCompletado = order.status === "completado";
  const [showConfirm, setShowConfirm] = useState(false);
  const [showItems, setShowItems]     = useState(false);

  // Visual identity per status
  const headerTheme = isEnCocina
    ? "bg-orange-950/40 border-orange-900/30"
    : isListo
    ? "bg-yellow-950/30 border-yellow-900/30"
    : isCompletado
    ? "bg-emerald-950/30 border-emerald-900/30"
    : "bg-sky-950/30 border-sky-900/30";

  const cardBorder = isEnCocina
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

  const addressTheme = isEnCocina
    ? "bg-orange-950/20 border-orange-900/30"
    : isListo
    ? "bg-yellow-950/20 border-yellow-900/30"
    : isCompletado
    ? "bg-emerald-950/20 border-emerald-900/30"
    : "bg-sky-950/20 border-sky-900/30";

  const pinColor = isEnCocina
    ? "bg-orange-500/10 border-orange-500/20"
    : isListo
    ? "bg-yellow-500/10 border-yellow-500/20"
    : isCompletado
    ? "bg-emerald-500/10 border-emerald-500/20"
    : "bg-sky-500/10 border-sky-500/20";

  const pinIconColor = isEnCocina
    ? "text-orange-400"
    : isListo
    ? "text-yellow-400"
    : isCompletado
    ? "text-emerald-400"
    : "text-sky-400";

  return (
    <div className={`bg-zinc-900 rounded-2xl overflow-hidden shadow-xl border ${cardBorder}`}>

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
            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide leading-none">
              {isCompletado ? "Cobrado" : "A cobrar"}
            </p>
            <p className="font-black text-lg text-white tabular-nums leading-tight">{fmtARS(order.total)}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">

        {/* ── Cliente + Pago ────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Cliente</p>
            <p className="font-black text-xl text-white leading-tight truncate">{order.clientName}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className={`text-xs font-black px-3 py-1 rounded-xl ${
              isEfectivo
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
            }`}>
              {isEfectivo ? "💵 Efectivo" : order.paymentMethod === "Tarjeta" ? "💳 Tarjeta" : "📲 Transfer."}
            </span>
            {order.deliveryFee && order.deliveryFee > 0 && (
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

        {/* ── Items toggle ──────────────────────────────────── */}
        <button
          onClick={() => setShowItems(v => !v)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-800/40 border border-zinc-800/60 text-xs font-bold text-zinc-400 hover:text-zinc-200 transition"
        >
          <span className="flex items-center gap-2">
            <Package size={13} className="text-zinc-600" />
            {order.items.length} {order.items.length === 1 ? "producto" : "productos"}
          </span>
          {showItems ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {showItems && (
          <div className="bg-zinc-950 border border-zinc-800/60 rounded-xl p-3 space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="shrink-0 w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black text-orange-400 text-xs">
                  {item.quantity}
                </span>
                <p className="font-bold text-xs text-zinc-200 leading-tight pt-1">{item.name}</p>
              </div>
            ))}
          </div>
        )}

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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <div className="bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-xs shadow-2xl animate-in slide-in-from-bottom sm:zoom-in duration-200">
            <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-5 sm:hidden" />
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-emerald-400" />
            </div>
            <h3 className="font-black text-xl text-white text-center mb-2">¿Pedido entregado?</h3>
            <p className="text-zinc-400 text-sm text-center mb-6">
              Confirmá que cobraste <span className="font-bold text-white">{fmtARS(order.total)}</span>
              {order.paymentMethod && <span className="text-zinc-500"> ({order.paymentMethod})</span>}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition active:scale-95"
              >
                Cancelar
              </button>
              <button
                onClick={() => { setShowConfirm(false); onAction?.("completado"); }}
                className="flex-1 py-3.5 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-500 transition active:scale-95 shadow-lg shadow-emerald-900/40"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MisViajesPage() {
  const [orders, setOrders]   = useState<MockOrder[]>(() => mockOrdersStore.getSnapshot());
  const [activeTab, setActiveTab] = useState<"en-cocina" | "listo" | "en-camino" | "completado">("listo");

  useEffect(() => {
    return mockOrdersStore.subscribe(() => setOrders([...mockOrdersStore.getSnapshot()]));
  }, []);

  const isDelivery = (address: string) => {
    if (!address) return false;
    const lower = address.toLowerCase();
    return !lower.includes("retiro") && !lower.includes("local") && lower !== "envío";
  };

  const byStatus = {
    "en-cocina": orders.filter(o => o.status === "en-cocina"  && isDelivery(o.address)),
    listo:       orders.filter(o => o.status === "listo"       && isDelivery(o.address)),
    "en-camino": orders.filter(o => o.status === "en-camino"   && isDelivery(o.address)),
    completado:  orders.filter(o => o.status === "completado"  && isDelivery(o.address)),
  };

  function handleAction(id: string, newStatus: string) {
    mockOrdersStore.updateOrderStatus(id, newStatus as any);
  }

  const current = TABS.find(t => t.key === activeTab)!;
  const currentOrders = byStatus[activeTab];

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Stats bar (4 counters) ──────────────────────────────── */}
      <div className="shrink-0 px-3 py-2.5 border-b border-zinc-900 bg-zinc-950">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex flex-col items-center gap-0.5"
            >
              <span className={`font-black text-xl tabular-nums leading-none ${activeTab === tab.key ? tab.activeText : "text-zinc-500"}`}>
                {byStatus[tab.key].length}
              </span>
              <span className={`text-[9px] font-bold uppercase tracking-wide leading-none flex items-center gap-1 ${activeTab === tab.key ? tab.activeText : "text-zinc-700"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${tab.dotColor} opacity-${activeTab === tab.key ? "100" : "40"}`} />
                {tab.shortLabel}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab switcher (4 tabs, scrollable if needed) ─────────── */}
      <div className="shrink-0 flex border-b border-zinc-900 bg-zinc-950 overflow-x-auto no-scrollbar">
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

      {/* ── Context label ──────────────────────────────────────── */}
      <div className={`shrink-0 px-4 py-2 border-b ${current.borderAccent} bg-zinc-950/50 flex items-center gap-2`}>
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${current.dotColor}`} />
        <p className={`text-[10px] font-black uppercase tracking-widest ${current.labelColor}`}>
          {current.contextLabel}
        </p>
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
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
                onAction={(s) => handleAction(o.id, s)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
