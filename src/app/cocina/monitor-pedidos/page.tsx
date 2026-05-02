"use client";

import React, { useState, useEffect, useCallback } from "react";
import { mockOrdersStore, MockOrder } from "@/lib/mockData";
import { ChefHat, Clock, Truck, Flame, AlertTriangle } from "lucide-react";

function useElapsedMinutes(isoDate: string) {
  const calc = useCallback(() => Math.floor((Date.now() - new Date(isoDate).getTime()) / 60000), [isoDate]);
  const [mins, setMins] = useState(calc);
  useEffect(() => { const id = setInterval(() => setMins(calc()), 30000); return () => clearInterval(id); }, [calc]);
  return mins;
}

// ── KDS Ticket Card ──────────────────────────────────────────────────────────
function KdsCard({ order, onAdvance, advanceLabel, advanceColor }: {
  order: MockOrder;
  onAdvance: () => void;
  advanceLabel: string;
  advanceColor: string;
}) {
  const mins = useElapsedMinutes(order.createdAt);
  const isWarm    = mins >= 10 && mins < 20;
  const isHot     = mins >= 20;
  const isDelivery = order.address !== "Retira en Local" && order.address !== "Retiro en local" && order.address !== "Local";

  const borderColor = isHot ? "border-red-500/70" : isWarm ? "border-yellow-500/50" : "border-zinc-800/80";
  const headerBg    = isHot ? "bg-red-600" : isWarm ? "bg-yellow-600" : "bg-zinc-800";

  return (
    <div className={`flex flex-col bg-zinc-900 border ${borderColor} rounded-2xl overflow-hidden shadow-xl ${isHot ? "shadow-red-900/30" : ""} transition-all`}>

      {/* Header */}
      <div className={`${headerBg} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <span className="font-mono font-black text-white text-xl leading-none">#{order.id}</span>
          <span className={`text-[11px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${isDelivery ? "bg-white/20 text-white" : "bg-white/15 text-white/80"}`}>
            {isDelivery ? "🛵 Delivery" : "🏠 Local"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isHot && <Flame size={16} className="text-white animate-pulse" />}
          {isWarm && <AlertTriangle size={15} className="text-white/90" />}
          <span className="font-mono font-black text-white text-2xl tabular-nums leading-none">{mins}&apos;</span>
        </div>
      </div>

      {/* Cliente */}
      <div className="px-4 pt-3 pb-2 border-b border-zinc-800/60">
        <p className="font-bold text-sm text-zinc-300 truncate">{order.clientName}</p>
      </div>

      {/* Items */}
      <div className="flex-1 p-3 space-y-2.5 min-h-[80px]">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="shrink-0 w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black text-white text-lg">
              {item.quantity}
            </span>
            <p className="font-bold text-sm text-zinc-100 leading-tight pt-1.5">{item.name}</p>
          </div>
        ))}
      </div>

      {/* Action — full width, large tap target for kitchen staff */}
      <button
        onClick={onAdvance}
        className={`w-full py-4 font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${advanceColor}`}
      >
        {advanceLabel}
      </button>
    </div>
  );
}

// ── Column (desktop / tablet) ─────────────────────────────────────────────────
function KdsColumn({ title, icon: Icon, count, accent, children }: {
  title: string; icon: React.ElementType; count: number; accent: string; children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col rounded-2xl border ${accent} overflow-hidden bg-zinc-950/60 h-full`}>
      <div className="shrink-0 px-4 py-3 border-b border-inherit flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-inherit opacity-70" />
          <h2 className="font-black text-sm uppercase tracking-widest">{title}</h2>
        </div>
        <span className="font-black text-sm w-7 h-7 rounded-full flex items-center justify-center bg-black/30 border border-inherit tabular-nums">{count}</span>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
        {count === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-700 font-bold text-xs uppercase tracking-widest py-12 gap-2">
            <span className="text-2xl opacity-30">✓</span>
            Libre
          </div>
        ) : children}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CocinaMonitorPage() {
  const [orders, setOrders] = useState<MockOrder[]>(() => mockOrdersStore.getSnapshot());
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    return mockOrdersStore.subscribe(() => setOrders([...mockOrdersStore.getSnapshot()]));
  }, []);

  const pendientes  = orders.filter(o => o.status === "confirmado");
  const enCocina    = orders.filter(o => o.status === "en-cocina");
  const listos      = orders.filter(o => o.status === "listo");
  const totalActivos = pendientes.length + enCocina.length + listos.length;

  const columns = [
    {
      title: "Pendientes",
      icon: Clock,
      count: pendientes.length,
      accent: "border-zinc-800 text-zinc-400",
      orders: pendientes,
      advanceLabel: "▶ Empezar",
      advanceColor: "bg-yellow-500 hover:bg-yellow-400 text-yellow-950",
      nextStatus: "en-cocina" as const,
      dotColor: "bg-zinc-600",
      textColor: "text-zinc-300",
      badgeBg: "bg-zinc-700 text-zinc-200",
    },
    {
      title: "En Preparación",
      icon: ChefHat,
      count: enCocina.length,
      accent: "border-yellow-900/60 text-yellow-500",
      orders: enCocina,
      advanceLabel: "✓ Listo",
      advanceColor: "bg-green-600 hover:bg-green-500 text-white",
      nextStatus: "listo" as const,
      dotColor: "bg-yellow-500",
      textColor: "text-yellow-400",
      badgeBg: "bg-yellow-500/20 text-yellow-400",
    },
    {
      title: "Listo p/ Envío",
      icon: Truck,
      count: listos.length,
      accent: "border-green-900/50 text-green-500",
      orders: listos,
      advanceLabel: "✓ Despachado",
      advanceColor: "bg-zinc-800 hover:bg-zinc-700 text-zinc-300",
      nextStatus: "completado" as const,
      dotColor: "bg-green-500",
      textColor: "text-green-400",
      badgeBg: "bg-green-500/20 text-green-400",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-black overflow-hidden">

      {/* ── Sub-header: stats bar ─────────────────────────────────────── */}
      <div className="shrink-0 px-4 md:px-6 py-2 bg-zinc-950 border-b border-zinc-900 flex items-center gap-3 md:gap-6">
        {/* Sync indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden sm:block">Sincronizado</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 ml-auto">
          {columns.map((col, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${col.dotColor}`} />
              <span className={`font-black text-lg tabular-nums ${col.textColor}`}>{col.count}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${col.textColor} opacity-60`}>
                {idx === 0 ? "Pend." : idx === 1 ? "Prep." : "Listo"}
              </span>
            </div>
          ))}
          <div className="h-6 w-px bg-zinc-800 hidden sm:block" />
          <div className="hidden sm:flex flex-col items-center">
            <span className="font-black text-lg text-white tabular-nums">{totalActivos}</span>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Total</span>
          </div>
        </div>
      </div>

      {/* ── MOBILE ONLY: Tab switcher ──────────────────────────────────── */}
      <div className="shrink-0 md:hidden flex border-b border-zinc-900 bg-zinc-950">
        {columns.map((col, idx) => {
          const isActive = activeTab === idx;
          return (
            <button
              key={col.title}
              onClick={() => setActiveTab(idx as 0 | 1 | 2)}
              className={`relative flex-1 flex flex-col items-center justify-center py-3.5 gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
                isActive ? "text-white bg-zinc-900/80" : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              <col.icon size={17} className={isActive ? "opacity-100" : "opacity-35"} />
              <span className="leading-none">{col.title}</span>
              {col.count > 0 && (
                <span className={`absolute top-2 right-2.5 min-w-[18px] h-[18px] rounded-full text-[10px] font-black flex items-center justify-center px-1 ${col.badgeBg}`}>
                  {col.count}
                </span>
              )}
              {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
            </button>
          );
        })}
      </div>

      {/* ── MOBILE ONLY: Single active column ─────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar md:hidden">
        {(() => {
          const col = columns[activeTab];
          return col.count === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-zinc-700 gap-3">
              <span className="text-4xl opacity-20">✓</span>
              <p className="font-bold text-sm uppercase tracking-widest">Cola vacía</p>
              <p className="text-xs text-zinc-800 font-bold">No hay pedidos en esta etapa</p>
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {col.orders.map(o => (
                <KdsCard
                  key={o.id}
                  order={o}
                  onAdvance={() => mockOrdersStore.updateOrderStatus(o.id, col.nextStatus)}
                  advanceLabel={col.advanceLabel}
                  advanceColor={col.advanceColor}
                />
              ))}
            </div>
          );
        })()}
      </div>

      {/* ── TABLET / DESKTOP: 3-column kanban ─────────────────────────── */}
      <div className="hidden md:grid md:grid-cols-3 gap-3 p-3 flex-1 overflow-hidden">
        {columns.map((col) => (
          <KdsColumn
            key={col.title}
            title={col.title}
            icon={col.icon}
            count={col.count}
            accent={col.accent}
          >
            {col.orders.map(o => (
              <KdsCard
                key={o.id}
                order={o}
                onAdvance={() => mockOrdersStore.updateOrderStatus(o.id, col.nextStatus)}
                advanceLabel={col.advanceLabel}
                advanceColor={col.advanceColor}
              />
            ))}
          </KdsColumn>
        ))}
      </div>
    </div>
  );
}
