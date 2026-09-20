"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { mockOrdersStore, MockOrder, getFirstName } from "@/lib/mockData";
import { CheckCircle2, ChefHat, Clock, Package, MapPin, Truck, Store, Receipt, XCircle } from "lucide-react";
import { useParams } from "next/navigation";

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

export default function EstadoPedidoPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<MockOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchOrder = () => {
      const allOrders = mockOrdersStore.getSnapshot();
      const found = allOrders.find(o => o.id === id);
      setOrder(found || null);
      setLoading(false);
    };
    
    fetchOrder();

    // Subscribe to changes
    const unsubscribe = mockOrdersStore.subscribe(() => {
      fetchOrder();
    });

    return unsubscribe;
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-zinc-400">
        <span className="w-8 h-8 border-2 border-zinc-800 border-t-orange-500 rounded-full animate-spin mb-4" />
        <p className="font-bold uppercase tracking-widest text-xs">Cargando pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
          <Receipt size={32} />
        </div>
        <h1 className="font-black text-2xl text-zinc-100 mb-2">¡Ups! Pedido no encontrado</h1>
        <p className="text-zinc-500 text-sm max-w-xs">Verificá que el link sea el correcto o avisanos por WhatsApp. ¡Queremos ayudarte!</p>
      </div>
    );
  }

  const isDelivery = order.address !== "Retiro en local" && order.address !== "Local" && order.address !== "Retira en Local";

  const getSteps = () => {
    if (order.status === "cancelado") {
      return [
        { id: "cancelado", label: "Pedido Cancelado", desc: "El pedido ha sido cancelado", icon: XCircle, active: true, done: false }
      ];
    }

    if (isDelivery) {
      return [
        { id: "confirmado", label: "Confirmado", desc: "Recibimos tu pedido", icon: Clock },
        { id: "en-cocina", label: "En Preparación", desc: "Cocinando tu pedido", icon: ChefHat },
        { id: "listo", label: "Esperando Repartidor", desc: "Listo para salir", icon: Package }, // Hidden step for mapping
        { id: "en-camino", label: "En Camino", desc: "El repartidor está en viaje", icon: Truck },
        { id: "completado", label: "Entregado", desc: "Pedido entregado", icon: CheckCircle2 }
      ];
    } else {
      return [
        { id: "confirmado", label: "Confirmado", desc: "Recibimos tu pedido", icon: Clock },
        { id: "en-cocina", label: "En Preparación", desc: "Cocinando tu pedido", icon: ChefHat },
        { id: "listo", label: "Listo para Retirar", desc: "Te esperamos en el local", icon: Store },
        { id: "completado", label: "Entregado", desc: "Pedido entregado", icon: CheckCircle2 }
      ];
    }
  };

  const steps = getSteps();
  
  // Find current step index based on order status
  let currentIndex = 0;
  if (order.status === "completado") currentIndex = steps.findIndex(s => s.id === "completado");
  else if (order.status === "en-camino") currentIndex = steps.findIndex(s => s.id === "en-camino");
  else if (order.status === "listo") currentIndex = steps.findIndex(s => s.id === "listo");
  else if (order.status === "en-cocina") currentIndex = steps.findIndex(s => s.id === "en-cocina");
  else if (order.status === "confirmado") currentIndex = steps.findIndex(s => s.id === "confirmado");
  else if (order.status === "cancelado") currentIndex = 0;

  // For delivery, if it's "listo", we might want to map it to "Esperando Repartidor" which is between en-cocina and en-camino.
  const visualSteps = isDelivery ? steps.filter(s => s.id !== "listo") : steps;
  let visualCurrentIndex = 0;
  if (order.status === "completado") visualCurrentIndex = visualSteps.findIndex(s => s.id === "completado");
  else if (order.status === "en-camino") visualCurrentIndex = visualSteps.findIndex(s => s.id === "en-camino");
  else if (order.status === "listo" && isDelivery) visualCurrentIndex = visualSteps.findIndex(s => s.id === "en-cocina"); // If delivery and listo, we show "En preparación" as active, or maybe we show "En preparación" done. Let's just keep it at "En preparación" until it's "En camino".
  else if (order.status === "listo" && !isDelivery) visualCurrentIndex = visualSteps.findIndex(s => s.id === "listo");
  else if (order.status === "en-cocina") visualCurrentIndex = visualSteps.findIndex(s => s.id === "en-cocina");
  else if (order.status === "confirmado") visualCurrentIndex = visualSteps.findIndex(s => s.id === "confirmado");

  // Actually, let's simplify for delivery: if it's "listo", we just show it as "En Preparación" (done) and waiting for "En Camino".
  // A better approach is to just map it exactly to the UI steps.
  const firstName = getFirstName(order.clientName);

  const mappedSteps = isDelivery 
    ? [
        { id: "confirmado", label: "¡Pedido Confirmado!", desc: `¡Mil gracias por elegirnos, ${firstName}! Ya anotamos todo para mimarte hoy.`, icon: Clock },
        { id: "en-cocina", label: "¡Manos a la Obra!", desc: "Nuestros pizzeros están preparando tu pedido con muchísimo amor y cuidado.", icon: ChefHat },
        { id: "en-camino", label: "¡En Camino!", desc: order.status === "listo" ? "Asignando al mejor repartidor para que te lo lleve súper calentito." : `¡Tu pedido ya salió, ${firstName}! Va en viaje con mucho cuidado para que lo disfrutes como te merecés.`, icon: Truck },
        { id: "completado", label: "¡Entregado!", desc: "¡Que lo disfrutes muchísimo! Gracias por dejarnos ser parte de tu mesa hoy. ❤️", icon: CheckCircle2 }
      ]
    : [
        { id: "confirmado", label: "¡Pedido Confirmado!", desc: `¡Mil gracias por elegirnos, ${firstName}! Ya anotamos todo para mimarte hoy.`, icon: Clock },
        { id: "en-cocina", label: "¡Manos a la Obra!", desc: "Nuestros pizzeros están preparando tu pedido con muchísimo amor y cuidado.", icon: ChefHat },
        { id: "listo", label: "¡Listo para Retirar!", desc: `¡Tu pedido está súper calentito y esperándote con los brazos abiertos, ${firstName}!`, icon: Store },
        { id: "completado", label: "¡Entregado!", desc: "¡Que lo disfrutes muchísimo! Gracias por tu visita, ¡nos vemos la próxima! ❤️", icon: CheckCircle2 }
      ];

  let currentStepIdx = 0;
  if (order.status === "completado") currentStepIdx = 3;
  else if (order.status === "en-camino") currentStepIdx = 2;
  else if (order.status === "listo") currentStepIdx = 2;
  else if (order.status === "en-cocina") currentStepIdx = 1;
  else if (order.status === "confirmado") currentStepIdx = 0;

  const itemsTotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const surcharge = order.total - (itemsTotal + (order.deliveryFee || 0));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      {/* Header */}
      <header className="shrink-0 h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 px-4 flex items-center justify-between z-40 sticky top-0">
        <div className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="Logo" width={36} height={36} className="rounded-xl object-cover shadow-sm" />
          <div className="flex flex-col leading-none">
            <span className="font-black text-base tracking-tight">Quadra <span className="text-orange-500">Pizza</span></span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Seguimiento</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pedido</p>
          <p className="font-mono font-black text-sm text-zinc-300">#{order.id}</p>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-6 overflow-y-auto">
        
        {/* Status Card */}
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          {order.status === "cancelado" ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="font-black text-2xl text-white mb-2">Pedido Cancelado</h2>
              <p className="text-zinc-400 text-sm">Lamentablemente tuvimos que cancelar este pedido. ¡Esperamos verte pronto!</p>
            </div>
          ) : (
            <>
              <h2 className="font-black text-lg text-white mb-6 uppercase tracking-wider text-center">Seguimiento en vivo</h2>
              
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute top-6 bottom-6 left-[1.125rem] w-0.5 bg-zinc-800" />
                
                <div className="space-y-6 relative">
                  {mappedSteps.map((step, idx) => {
                    // Si el estado es "listo" y delivery, "En Camino" está en progreso (esperando repartidor)
                    const isDone = idx < currentStepIdx || (order.status === "listo" && isDelivery && idx === 1);
                    const isActive = idx === currentStepIdx;
                    const isWaiting = idx > currentStepIdx;

                    // Ajustes visuales para el paso activo
                    let stepColor = "text-zinc-600 bg-zinc-900 border-zinc-800";
                    let iconColor = "text-zinc-600";
                    let lineGlow = false;

                    if (isDone) {
                      stepColor = "bg-orange-500 border-orange-500 text-white";
                      iconColor = "text-white";
                    } else if (isActive) {
                      stepColor = "bg-zinc-900 border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]";
                      iconColor = "text-orange-500 animate-pulse";
                      lineGlow = true;
                    }

                    return (
                      <div key={step.id} className="flex items-start gap-4 relative">
                        {/* Connecting Line Glow if active */}
                        {isDone && idx < mappedSteps.length - 1 && (
                          <div className="absolute top-10 left-[1.125rem] w-0.5 h-full bg-orange-500 -z-0" />
                        )}

                        {/* Step Icon */}
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all duration-500 ${stepColor}`}>
                          <step.icon size={18} className={iconColor} />
                        </div>
                        
                        {/* Step Text */}
                        <div className={`pt-2 transition-all duration-500 ${isActive ? 'opacity-100' : isWaiting ? 'opacity-40' : 'opacity-80'}`}>
                          <h3 className={`font-black text-base leading-none mb-1 ${isActive ? 'text-orange-400' : isDone ? 'text-zinc-200' : 'text-zinc-500'}`}>
                            {step.label}
                          </h3>
                          <p className="text-xs font-bold text-zinc-500">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="font-black text-sm text-zinc-400 uppercase tracking-widest mb-4">Detalle del Pedido</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-3 text-sm">
                  <div className="flex gap-2.5 items-start">
                    <span className="font-black text-orange-400 mt-0.5">{item.quantity}x</span>
                    <span className="font-bold text-zinc-200 leading-tight">{item.name}</span>
                  </div>
                  <span className="font-black text-zinc-400 shrink-0 tabular-nums">{fmtARS(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-800/60 pt-4 space-y-2">
            {order.deliveryFee !== undefined && order.deliveryFee > 0 && (
              <div className="flex justify-between items-center text-xs font-bold text-zinc-500">
                <span>Costo de envío</span>
                <span className="tabular-nums">{fmtARS(order.deliveryFee)}</span>
              </div>
            )}
            {surcharge > 0 && (
              <div className="flex justify-between items-center text-xs font-bold text-zinc-500">
                <span>Cargo por método de pago</span>
                <span className="tabular-nums">{fmtARS(surcharge)}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="font-black text-sm text-zinc-300 uppercase tracking-widest">Total</span>
              <span className="font-black text-2xl text-white tabular-nums">{fmtARS(order.total)}</span>
            </div>
          </div>
          
          <div className="bg-zinc-950 border border-zinc-800/60 rounded-xl p-3 flex items-start gap-3 mt-4">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
              {isDelivery ? <MapPin size={16} className="text-zinc-400" /> : <Store size={16} className="text-zinc-400" />}
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">{isDelivery ? 'Dirección de entrega' : 'Retiro en sucursal'}</p>
              <p className="font-bold text-sm text-zinc-200 leading-snug">{isDelivery ? order.address : 'Te esperamos en el local'}</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
