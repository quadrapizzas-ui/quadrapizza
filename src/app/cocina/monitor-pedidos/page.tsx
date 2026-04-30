"use client";

import React, { useState, useEffect, useCallback } from "react";
import { mockOrdersStore, MockOrder, OrderStatus } from "@/lib/mockData";
import { ChefHat, Clock, Truck, CheckCircle2, Flame, AlertTriangle } from "lucide-react";

function useElapsedMinutes(isoDate: string) {
  const calc = useCallback(() => Math.floor((Date.now() - new Date(isoDate).getTime()) / 60000), [isoDate]);
  const [mins, setMins] = useState(calc);
  useEffect(() => { const id = setInterval(() => setMins(calc()), 30000); return () => clearInterval(id); }, [calc]);
  return mins;
}

// ── KDS Ticket Card ─────────────────────────────────────────────────────────
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
      <div className={`${headerBg} px-4 py-2.5 flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <span className="font-mono font-black text-white text-lg leading-none">#{order.id}</span>
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${isDelivery ? "bg-white/20 text-white" : "bg-white/15 text-white/80"}`}>
            {isDelivery ? "🛵 Delivery" : "🏠 Local"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {isHot && <Flame size={14} className="text-white animate-pulse" />}
          {isWarm && <AlertTriangle size={13} className="text-white/90" />}
          <span className="font-mono font-black text-white text-xl tabular-nums">{mins}'</span>
        </div>
      </div>

      {/* Cliente */}
      <div className="px-4 pt-2.5 pb-1.5 border-b border-zinc-800/60">
        <p className="font-bold text-xs text-zinc-400 truncate">{order.clientName}</p>
      </div>

      {/* Items */}
      <div className="flex-1 p-3 space-y-2 min-h-[100px]">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="shrink-0 w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black text-white text-base">
              {item.quantity}
            </span>
            <p className="font-bold text-sm text-zinc-100 leading-tight pt-0.5">{item.name}</p>
          </div>
        ))}
      </div>

      {/* Action */}
      <button
        onClick={onAdvance}
        className={`w-full py-3.5 font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${advanceColor}`}
      >
        {advanceLabel}
      </button>
    </div>
  );
}

// ── Column ───────────────────────────────────────────────────────────────────
function KdsColumn({ title, icon: Icon, count, accent, children }: {
  title: string; icon: React.ElementType; count: number; accent: string; children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col rounded-2xl border ${accent} overflow-hidden bg-zinc-950/60`}>
      <div className="shrink-0 px-4 py-3 border-b border-inherit flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-inherit opacity-70" />
          <h2 className="font-black text-sm uppercase tracking-widest">{title}</h2>
        </div>
        <span className={`font-black text-sm w-7 h-7 rounded-full flex items-center justify-center bg-black/30 border border-inherit tabular-nums`}>{count}</span>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
        {count === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-700 font-bold text-xs uppercase tracking-widest py-8">Libre</div>
        ) : children}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function CocinaMonitorPage() {
  const [orders, setOrders] = useState<MockOrder[]>(() => mockOrdersStore.getSnapshot());

  useEffect(() => {
    return mockOrdersStore.subscribe(() => setOrders([...mockOrdersStore.getSnapshot()]));
  }, []);

  const pendientes  = orders.filter(o => o.status === "confirmado");
  const enCocina    = orders.filter(o => o.status === "en-cocina");
  const listos      = orders.filter(o => o.status === "listo");
  const totalActivos = pendientes.length + enCocina.length + listos.length;

  return (
    <div className="flex flex-col h-full bg-black overflow-hidden">

      {/* KDS Sub-header */}
      <div className="shrink-0 px-6 py-3 bg-zinc-950 border-b border-zinc-900 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Sistema sincronizado</span>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <div className="text-center">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Pendientes</p>
            <p className="font-black text-lg text-zinc-300 tabular-nums leading-none">{pendientes.length}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider">En Cocina</p>
            <p className="font-black text-lg text-yellow-500 tabular-nums leading-none">{enCocina.length}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-green-800 uppercase tracking-wider">Listos</p>
            <p className="font-black text-lg text-green-500 tabular-nums leading-none">{listos.length}</p>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="text-center">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Total activos</p>
            <p className="font-black text-lg text-white tabular-nums leading-none">{totalActivos}</p>
          </div>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex-1 grid grid-cols-3 gap-3 p-3 overflow-hidden">

        {/* Col 1 — Pendientes */}
        <KdsColumn title="Pendientes" icon={Clock} count={pendientes.length} accent="border-zinc-800 text-zinc-400">
          {pendientes.map(o => (
            <KdsCard key={o.id} order={o}
              onAdvance={() => mockOrdersStore.updateOrderStatus(o.id, "en-cocina")}
              advanceLabel="▶ Empezar"
              advanceColor="bg-yellow-500 hover:bg-yellow-400 text-yellow-950"
            />
          ))}
        </KdsColumn>

        {/* Col 2 — En Cocina */}
        <KdsColumn title="En Cocina" icon={ChefHat} count={enCocina.length} accent="border-yellow-900/60 text-yellow-500">
          {enCocina.map(o => (
            <KdsCard key={o.id} order={o}
              onAdvance={() => mockOrdersStore.updateOrderStatus(o.id, "listo")}
              advanceLabel="✓ Listo"
              advanceColor="bg-green-600 hover:bg-green-500 text-white"
            />
          ))}
        </KdsColumn>

        {/* Col 3 — A Despachar */}
        <KdsColumn title="Listo para Envío" icon={Truck} count={listos.length} accent="border-green-900/50 text-green-500">
          {listos.map(o => (
            <KdsCard key={o.id} order={o}
              onAdvance={() => mockOrdersStore.updateOrderStatus(o.id, "completado")}
              advanceLabel="✓ Despachado"
              advanceColor="bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            />
          ))}
        </KdsColumn>

      </div>
    </div>
  );
}
