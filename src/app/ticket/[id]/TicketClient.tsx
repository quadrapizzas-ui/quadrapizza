"use client"
import React, { useEffect, useState } from "react";
import { mockOrdersStore, MockOrder } from "@/lib/mockData";
import { useParams } from "next/navigation";

export default function TicketClient() {
  const params = useParams();
  const [order, setOrder] = useState<MockOrder | null>(null);

  useEffect(() => {
    // Buscar la orden en el store local usando mockOrdersStore de memoria
    const found = mockOrdersStore.getSnapshot().find(o => o.id === params.id);
    if (found) setOrder(found);
  }, [params.id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white p-4 text-center">
        <div>
          <h1 className="text-2xl font-black text-orange-500 mb-2">Ticket no encontrado</h1>
          <p className="text-zinc-400">Es posible que este ticket haya expirado o no exista.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center py-12 px-4 font-mono text-zinc-900">
      {/* Contenedor con estilo de ticket de papel (bordes dentados emulados y sombra fuerte) */}
      <div className="bg-white max-w-sm w-full rounded-none shadow-2xl p-8 relative flex flex-col h-fit"
           style={{
             backgroundImage: "radial-gradient(circle at top left, transparent 15px, #ffffff 16px), radial-gradient(circle at top right, transparent 15px, #ffffff 16px), radial-gradient(circle at bottom right, transparent 15px, #ffffff 16px), radial-gradient(circle at bottom left, transparent 15px, #ffffff 16px)",
             backgroundSize: "51% 51%",
             backgroundRepeat: "no-repeat",
             backgroundPosition: "top left, top right, bottom right, bottom left"
           }}>
        
        {/* Encabezado del Ticket */}
        <div className="text-center border-b-2 border-dashed border-zinc-300 pb-6 mb-6">
          <div className="w-16 h-16 mx-auto bg-black text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
             <span className="font-black text-3xl mb-1">Q</span>
          </div>
          <h1 className="font-black text-3xl mb-1 uppercase tracking-tighter">Quadra Pizza</h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Comprobante Virtual</p>
          <div className="mt-4 pt-4 border-t border-zinc-200">
            <p className="text-sm">Orden: <strong className="text-xl bg-orange-100 text-orange-700 px-2 py-1 rounded ml-1">{order.id}</strong></p>
            <p className="text-xs text-zinc-400 mt-2">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Datos Cliente */}
        <div className="mb-6 space-y-1">
          <p className="text-sm"><strong>Cliente:</strong> {order.clientName}</p>
          {order.phone && <p className="text-sm"><strong>WhatsApp:</strong> {order.phone}</p>}
          {order.address && <p className="text-sm"><strong>Entrega a:</strong> <span className="font-bold">{order.address}</span></p>}
          <p className="text-sm"><strong>Forma de pago:</strong> <span className="uppercase text-orange-600 font-bold">{order.paymentMethod}</span></p>
        </div>

        {/* Ítems Componentizados */}
        <div className="border-b-2 border-dashed border-zinc-300 pb-6 mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="text-left font-bold pb-2 w-8">Cant</th>
                <th className="text-left font-bold pb-2">Consumo</th>
                <th className="text-right font-bold pb-2">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-bold align-top">{item.quantity}</td>
                  <td className="py-3 pr-2 align-top">{item.name}</td>
                  <td className="py-3 text-right font-bold align-top">${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
              {order.deliveryFee ? (
                <tr>
                  <td className="py-3 font-bold text-emerald-600 align-top">1</td>
                  <td className="py-3 pr-2 font-bold text-emerald-600 align-top">Servicio de Logística (Delivery)</td>
                  <td className="py-3 text-right font-bold text-emerald-600 align-top">${order.deliveryFee.toLocaleString()}</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Total Gigante */}
        <div className="flex justify-between items-end mb-8 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
          <span className="text-xl font-bold uppercase text-zinc-500">Total a Pagar</span>
          <span className="text-4xl font-black text-black">${order.total.toLocaleString()}</span>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-zinc-400 mt-auto">
          <div className="mb-4">
             <span className={`inline-block px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest
                 ${order.status === 'confirmado' ? 'bg-zinc-100 border-zinc-300 text-zinc-600' : 
                   order.status === 'en-cocina' ? 'bg-orange-100 border-orange-300 text-orange-600' : 
                   order.status === 'en-camino' ? 'bg-blue-100 border-blue-300 text-blue-600' : 
                   'bg-emerald-100 border-emerald-300 text-emerald-600'}`}>
                 Estado: {order.status.replace('-', ' ')}
             </span>
          </div>
          <p className="font-bold text-zinc-500">¡Gracias por elegirnos!</p>
          <p className="mt-1">
            Si hay algún error, comunicate con recepción.
          </p>
        </div>

      </div>
    </div>
  );
}
