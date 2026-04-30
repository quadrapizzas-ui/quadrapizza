"use client";

import React, { useState, useEffect, useMemo } from "react";
import { mockOrdersStore, MockOrder } from "@/lib/mockData";
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  Users, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight
} from "lucide-react";

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

// ── KPI Card Component ──────────────────────────────────────────────────────
function KpiCard({ title, value, icon: Icon, color, trend }: { 
  title: string; value: string; icon: any; color: string; trend?: { val: string, up: boolean }
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:border-zinc-700 transition cursor-pointer group">
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-[10px] font-bold ${trend.up ? "text-emerald-400" : "text-red-400"}`}>
            {trend.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend.val}
          </div>
        )}
      </div>
      <div>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}

// ── Dashboard Page ──────────────────────────────────────────────────────────
export default function DuenoDashboardPage() {
  const [orders, setOrders] = useState<MockOrder[]>(() => mockOrdersStore.getSnapshot());

  useEffect(() => {
    return mockOrdersStore.subscribe(() => setOrders([...mockOrdersStore.getSnapshot()]));
  }, []);

  const todaySales = useMemo(() => orders.reduce((acc, o) => acc + o.total, 0), [orders]);
  const activeCount = useMemo(() => orders.filter(o => o.status !== "completado").length, [orders]);
  const avgTicket   = useMemo(() => orders.length > 0 ? todaySales / orders.length : 0, [todaySales, orders.length]);

  // Mock weekly data
  const weeklyData = [
    { day: "Lun", val: 45000 },
    { day: "Mar", val: 52000 },
    { day: "Mie", val: 48000 },
    { day: "Jue", val: 61000 },
    { day: "Vie", val: 89000 },
    { day: "Sab", val: 124000 },
    { day: "Dom", val: 98000 },
  ];
  const maxWeekly = Math.max(...weeklyData.map(d => d.val));

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">Mando Central</h1>
          <p className="text-zinc-500 font-bold mt-1 uppercase tracking-widest text-xs flex items-center gap-2">
            <Activity size={14} className="text-purple-500 animate-pulse" />
            Estado Operativo en Tiempo Real
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 flex items-center gap-3 text-xs font-bold text-zinc-400">
           <span>Hoy: {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</span>
           <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
           <span className="text-emerald-400">Local Abierto</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Ventas de Hoy" 
          value={fmtARS(todaySales)} 
          icon={DollarSign} 
          color="bg-orange-500/10 text-orange-500" 
          trend={{ val: "12%", up: true }}
        />
        <KpiCard 
          title="Pedidos Activos" 
          value={String(activeCount)} 
          icon={ShoppingBag} 
          color="bg-sky-500/10 text-sky-500" 
        />
        <KpiCard 
          title="Ticket Promedio" 
          value={fmtARS(avgTicket)} 
          icon={TrendingUp} 
          color="bg-purple-500/10 text-purple-500" 
          trend={{ val: "4%", up: true }}
        />
        <KpiCard 
          title="Nuevos Clientes" 
          value="24" 
          icon={Users} 
          color="bg-emerald-500/10 text-emerald-500" 
          trend={{ val: "2%", up: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly Chart Mock */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col gap-6 shadow-xl relative overflow-hidden">
           <div className="flex items-center justify-between">
              <h2 className="font-black text-xl text-white">Ventas Semanales</h2>
              <button className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition">Detalle Semanal</button>
           </div>
           <div className="flex-1 flex justify-between gap-2 pt-4 min-h-[200px]">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group h-full">
                   <div className="w-full relative flex-1 flex flex-col justify-end">
                      <div 
                        className="w-full bg-purple-600/20 border-t-2 border-purple-500 rounded-t-lg transition-all duration-700 ease-out group-hover:bg-purple-500 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                        style={{ height: `${(d.val / maxWeekly) * 100}%` }}
                      >
                         <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            {Math.floor(d.val/1000)}k
                         </div>
                      </div>
                   </div>
                   <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{d.day}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Recent Orders Sidepanel */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col gap-6 shadow-xl relative overflow-hidden">
           <div className="flex items-center justify-between">
              <h2 className="font-black text-xl text-white">Últimos Pedidos</h2>
              <Clock size={16} className="text-zinc-600" />
           </div>
           <div className="flex flex-col gap-3">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="bg-zinc-950 border border-zinc-800 p-3 rounded-2xl flex items-center gap-3 group hover:border-zinc-700 transition cursor-pointer">
                   <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center font-black text-xs text-zinc-500 group-hover:text-white transition">
                      {o.id.split('-')[1] || o.id}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-100 truncate">{o.clientName}</p>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{o.status}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-black text-white">{fmtARS(o.total)}</p>
                      <ChevronRight size={12} className="text-zinc-800 ml-auto group-hover:text-purple-500 transition" />
                   </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-center text-xs text-zinc-700 py-10 font-bold uppercase tracking-widest">Sin ventas registradas</p>}
           </div>
           <button className="mt-auto w-full py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-500 hover:text-white hover:border-zinc-700 transition">
              Ver Historial Completo
           </button>
        </div>

      </div>

      {/* Grid inferiror: Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="bg-purple-600 border border-purple-500 p-6 rounded-3xl flex flex-col gap-4 shadow-xl shadow-purple-900/20 cursor-pointer group">
            <h3 className="text-white font-black text-xl tracking-tight leading-tight">Auditoría de<br/>Cierre de Caja</h3>
            <p className="text-purple-200 text-xs font-medium leading-relaxed">Genera el reporte de balance del turno actual para conciliación de ingresos.</p>
            <div className="mt-2 flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
               Empezar Auditoría <ChevronRight size={14} />
            </div>
         </div>
         <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex flex-col gap-4 shadow-sm hover:border-zinc-700 transition cursor-pointer group">
            <h3 className="text-white font-black text-xl tracking-tight leading-tight">Control de<br/>Stock Crítico</h3>
            <p className="text-zinc-500 text-xs font-medium leading-relaxed">Visualiza insumos con bajo inventario reportados desde el módulo de cocina.</p>
            <div className="mt-2 flex items-center gap-2 text-zinc-400 font-black text-xs uppercase tracking-widest group-hover:text-white transition">
               Ver Inventario <ChevronRight size={14} />
            </div>
         </div>
         <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex flex-col gap-4 shadow-sm hover:border-zinc-700 transition cursor-pointer group">
            <h3 className="text-white font-black text-xl tracking-tight leading-tight">Gestión de<br/>Personal</h3>
            <p className="text-zinc-500 text-xs font-medium leading-relaxed">Administra perfiles de acceso y permisos para receptores, cocineros y repartidores.</p>
            <div className="mt-2 flex items-center gap-2 text-zinc-400 font-black text-xs uppercase tracking-widest group-hover:text-white transition">
               Gestionar Usuarios <ChevronRight size={14} />
            </div>
         </div>
      </div>

    </div>
  );
}
