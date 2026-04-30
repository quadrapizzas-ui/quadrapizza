"use client";

import React, { useState, useEffect } from "react";
import { mockOrdersStore, MockOrder } from "@/lib/mockData";
import { MapPin, Navigation, Package, CheckCircle2, Bike, Phone } from "lucide-react";

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

function openMap(address: string) {
  window.open(`https://maps.google.com/?q=${encodeURIComponent(address + ", Córdoba, Argentina")}`, "_blank");
}

function DeliveryCard({ order, onAction }: { order: MockOrder; onAction: (status: string) => void }) {
  const isEfectivo = order.paymentMethod?.toLowerCase() === "efectivo";
  const isListo = order.status === "listo";
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">

      {/* Header */}
      <div className="px-4 py-3 bg-zinc-800/60 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono font-black text-white text-base">#{order.id}</span>
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${isListo ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
            {isListo ? "A Retirar" : "En camino"}
          </span>
          <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-full">
            {order.mockAge}
          </span>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">A cobrar</p>
          <p className="font-black text-lg text-white tabular-nums leading-tight">{fmtARS(order.total)}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Cliente */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Cliente</p>
            <p className="font-black text-xl text-white">{order.clientName}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs font-black px-3 py-1 rounded-xl ${isEfectivo ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"}`}>
              {isEfectivo ? "💵 Efectivo" : order.paymentMethod === "Tarjeta" ? "💳 Tarjeta" : "📲 Transfer."}
            </span>
            {order.deliveryFee && order.deliveryFee > 0 && (
              <span className="text-[10px] font-bold text-zinc-500">Envío: {fmtARS(order.deliveryFee)}</span>
            )}
          </div>
        </div>

        {/* Dirección */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <MapPin size={16} className="text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-0.5">Destino</p>
            <p className="font-bold text-sm text-zinc-100 leading-snug">{order.address}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {order.phone && (
            <a
              href={`tel:${order.phone}`}
              className="col-span-2 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700 font-bold text-sm transition active:scale-95"
            >
              <Phone size={16} />
              Llamar al cliente ({order.phone})
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
              onClick={() => onAction("en-camino")}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-yellow-950 font-black text-sm transition active:scale-95 shadow-lg shadow-yellow-900/20"
            >
              <Package size={16} />
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
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-xs w-full shadow-2xl animate-in zoom-in duration-200">
            <h3 className="font-black text-xl text-white text-center mb-2">¿Entregado?</h3>
            <p className="text-zinc-400 text-sm text-center mb-6">Confirmá que cobraste <span className="font-bold text-white">{fmtARS(order.total)}</span></p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  onAction("completado");
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/40"
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

export default function MisViajesPage() {
  const [orders, setOrders] = useState<MockOrder[]>(() => mockOrdersStore.getSnapshot());

  useEffect(() => {
    return mockOrdersStore.subscribe(() => setOrders([...mockOrdersStore.getSnapshot()]));
  }, []);

  const isDelivery = (address: string) => {
    if (!address) return false;
    const lower = address.toLowerCase();
    return !lower.includes("retiro") && !lower.includes("local") && lower !== "envío";
  };

  const viajes = orders.filter(o => (o.status === "en-camino" || o.status === "listo") && isDelivery(o.address));
  const deliveredToday = orders.filter(o => o.status === "completado" && isDelivery(o.address)).length;

  function handleAction(id: string, newStatus: string) {
    mockOrdersStore.updateOrderStatus(id, newStatus as any);
  }

  return (
    <div className="flex flex-col min-h-full">

      {/* Stats bar */}
      <div className="shrink-0 px-4 py-3 border-b border-zinc-900 bg-zinc-950 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
            <Bike size={15} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Pendientes</p>
            <p className="font-black text-lg text-white tabular-nums leading-tight">{viajes.length}</p>
          </div>
        </div>
        <div className="w-px h-8 bg-zinc-800" />
        <div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Entregados hoy</p>
          <p className="font-black text-lg text-emerald-400 tabular-nums leading-tight">{deliveredToday}</p>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <Package size={13} className="text-zinc-600" />
          <span className="text-xs font-bold text-zinc-600">
            {orders.filter(o => o.status === "en-camino").length} total salidas
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {viajes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Bike size={32} className="text-zinc-700" />
            </div>
            <div>
              <h2 className="font-black text-xl text-zinc-400">Sin rutas activas</h2>
              <p className="text-zinc-600 text-sm mt-1">Los pedidos listos en cocina aparecerán aquí</p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-zinc-500">Esperando despacho de cocina...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-lg mx-auto">
            {viajes.map(o => (
              <DeliveryCard key={o.id} order={o} onAction={(s) => handleAction(o.id, s)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
