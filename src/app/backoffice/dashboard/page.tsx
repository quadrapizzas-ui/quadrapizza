"use client"
import React, { useState, useEffect } from "react";
import { mockOrdersStore, MockOrder } from "@/lib/mockData";
import { Button } from "@/components/ui/Button";

// Componentes simples para iconos genéricos
const IconCard = ({ children, bg }: { children: React.ReactNode, bg: string }) => (
  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>{children}</div>
);

export default function BackofficeDashboardPage() {
  const [orders, setOrders] = useState<MockOrder[]>(mockOrdersStore.getSnapshot());

  useEffect(() => {
    return mockOrdersStore.subscribe(() => {
      setOrders([...mockOrdersStore.getSnapshot()]);
    });
  }, []);

  // Cálculos Core
  const totalOrders = orders.length;
  // Solo contamos el revenue de ordenes completadas (facturadas realmente) o confirmadas.
  // Para un dashboard de demo asumo ingresos brutos base de todo.
  const grossRevenue = orders.reduce((acc, current) => acc + current.total, 0);
  const ticketPromedio = totalOrders > 0 ? (grossRevenue / totalOrders).toFixed(2) : 0;

  const ordersEfectivo = orders.filter(o => o.paymentMethod === 'efectivo').length;
  const ordersTransf = orders.filter(o => o.paymentMethod === 'transferencia').length;

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-50 pb-20 p-4 md:p-8">
      
      {/* Top Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
           <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2">Backoffice</h1>
           <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Resumen Contable y Administrativo</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:text-white bg-zinc-900">Descargar CSV</Button>
           <Button className="shadow-[0_0_20px_rgba(234,88,12,0.3)] px-8">Ver Reporte Mes</Button>
        </div>
      </header>

      {/* Tarjetas KPI Superiores (Master Ledger) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[24px] shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
               <div>
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs block mb-1">Caja Bruta Hoy</span>
                  <span className="text-3xl font-black text-white">$ {grossRevenue.toLocaleString()}</span>
               </div>
               <IconCard bg="bg-emerald-500/20 text-emerald-500">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
               </IconCard>
            </div>
            <div className="text-xs font-bold text-emerald-500 bg-emerald-500/10 self-start px-2 py-1 rounded">+12% vs ayer</div>
         </div>

         <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[24px] shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
               <div>
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs block mb-1">Volumen Órdenes</span>
                  <span className="text-3xl font-black text-white">{totalOrders}</span>
               </div>
               <IconCard bg="bg-blue-500/20 text-blue-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
               </IconCard>
            </div>
            <div className="text-xs font-bold text-zinc-500 bg-zinc-800 self-start px-2 py-1 rounded">Todas las plataformas</div>
         </div>

         <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[24px] shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
               <div>
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs block mb-1">Ticket Promedio</span>
                  <span className="text-3xl font-black text-white">$ {ticketPromedio}</span>
               </div>
               <IconCard bg="bg-purple-500/20 text-purple-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
               </IconCard>
            </div>
            <div className="text-xs font-bold text-zinc-500 bg-zinc-800 self-start px-2 py-1 rounded">Basado en {totalOrders} ventas</div>
         </div>

         <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[24px] shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
               <div className="w-full">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs block mb-3">Ingresos Múltiples (Split)</span>
                  
                  <div className="flex flex-col gap-2 w-full">
                     <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-zinc-300">Transferencia</span>
                        <span className="text-blue-400">{((ordersTransf/totalOrders)*100 || 0).toFixed(0)}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{width: `${(ordersTransf/totalOrders)*100}%`}}></div>
                     </div>

                     <div className="flex justify-between items-center text-sm font-bold mt-2">
                        <span className="text-zinc-300">Efectivo Físico</span>
                        <span className="text-emerald-400">{((ordersEfectivo/totalOrders)*100 || 0).toFixed(0)}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{width: `${(ordersEfectivo/totalOrders)*100}%`}}></div>
                     </div>
                  </div>

               </div>
            </div>
         </div>
      </div>

      {/* Historial de Órdenes (Tabla Contable) */}
      <h2 className="text-xl font-black mb-4">Registro Histórico Bruto</h2>
      <div className="bg-zinc-900 border border-zinc-800 rounded-[24px] overflow-hidden shadow-xl overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-zinc-950/50 text-zinc-400 border-b border-zinc-800 uppercase tracking-widest text-[10px] font-black">
            <tr>
              <th className="px-6 py-5">Cod. Operación</th>
              <th className="px-6 py-5">Comprador</th>
              <th className="px-6 py-5">Monto Liquidado</th>
              <th className="px-6 py-5">Medio de Pago</th>
              <th className="px-6 py-5">Tipo</th>
              <th className="px-6 py-5 text-right">Estado Actual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {orders.length === 0 && (
               <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500 font-bold tracking-widest uppercase">No hay registros financieros hoy</td>
               </tr>
            )}
            {[...orders].reverse().map(o => (
              <tr key={o.id} className="hover:bg-zinc-800/40 transition">
                <td className="px-6 py-4 font-mono text-zinc-400 text-xs">{o.id.toUpperCase()}</td>
                <td className="px-6 py-4 font-bold text-white">{o.clientName}</td>
                <td className="px-6 py-4 font-black text-white">$ {o.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${o.paymentMethod === 'efectivo' ? 'bg-zinc-800 text-emerald-500' : 'bg-blue-900/30 text-blue-500'}`}>
                    {o.paymentMethod}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-zinc-400">{o.address === 'Local' ? 'Mostrador' : 'Delivery'}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${o.status === 'completado' ? 'border-emerald-500 text-emerald-500' : 'border-zinc-700 text-zinc-500'}`}>
                    {o.status.replace('-', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
