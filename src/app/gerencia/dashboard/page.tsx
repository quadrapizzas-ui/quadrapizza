"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MockOrder } from "@/types/models";
import { useOrdersStore } from "@/lib/store/ordersStore";
import { getBusinessDay } from "@/lib/businessDay";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  CreditCard,
  MapPin,
  Store,
  Smartphone
} from "lucide-react";
import { Timeframe, filterOrdersByTimeframe, KpiCard, getBarStyle, TimeframeSelector } from "@/components/admin/DashboardComponents";

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

function fmtChartVal(v: number) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000)    return `${Math.floor(v / 1000)}k`;
  return String(v);
}

import dynamic from "next/dynamic";

const CustomPieChart = dynamic(() => import('@/components/admin/Charts').then(mod => mod.CustomPieChart), { ssr: false, loading: () => <div className="h-48 flex items-center justify-center text-zinc-500 font-bold">Cargando gráfico...</div> });
const CustomBarChart = dynamic(() => import('@/components/admin/Charts').then(mod => mod.CustomBarChart), { ssr: false, loading: () => <div className="h-48 flex items-center justify-center text-zinc-500 font-bold">Cargando gráfico...</div> });

export default function GerenciaDashboardPage() {
  const orders = useOrdersStore((s) => s.orders);

  const [salesTf, setSalesTf] = useState<Timeframe>("Hoy");
  const [deliveryTf, setDeliveryTf] = useState<Timeframe>("Hoy");
  const [paymentTf, setPaymentTf] = useState<Timeframe>("Hoy");

  // Compute KPIs (Always 'Hoy' for the top KPIs)
  // Compute KPIs
  const { todayOrders, todaySales, activeCount, avgTicket, topProducts } = useMemo(() => {
    // Hoy for sales/orders count
    const todayOrdersList = filterOrdersByTimeframe(orders, "Hoy").filter(o => o.status !== "cancelado");
    const todaySalesVal = todayOrdersList.reduce((acc, o) => acc + o.total, 0);
    const activeCountVal = todayOrdersList.filter(o => o.status !== "completado").length;
    
    // 30 days for avgTicket and topProducts
    const last30DaysList = filterOrdersByTimeframe(orders, "Mensual").filter(o => o.status !== "cancelado");
    const monthSalesVal = last30DaysList.reduce((acc, o) => acc + o.total, 0);
    const avgTicketVal = last30DaysList.length > 0 ? monthSalesVal / last30DaysList.length : 0;

    const productCounts: Record<string, { name: string, qty: number, revenue: number }> = {};
    last30DaysList.forEach(o => {
      o.items.forEach(it => {
        if (!productCounts[it.name]) productCounts[it.name] = { name: it.name, qty: 0, revenue: 0 };
        productCounts[it.name].qty += it.quantity;
        productCounts[it.name].revenue += (it.price * it.quantity);
      });
    });
    const topProd = Object.values(productCounts)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    return { todayOrders: todayOrdersList, todaySales: todaySalesVal, activeCount: activeCountVal, avgTicket: avgTicketVal, topProducts: topProd };
  }, [orders]);

  // Curva de Ventas data
  const salesCurve = useMemo(() => {
    const filtered = filterOrdersByTimeframe(orders, salesTf).filter(o => o.status !== "cancelado");
    const map: Record<string, number> = {};

    filtered.forEach(o => {
      const d = new Date(o.createdAt);
      let key = "";
      if (salesTf === "Hoy") {
        key = d.getHours().toString().padStart(2, '0') + ":00";
      } else if (salesTf === "Semanal") {
        const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
        key = days[d.getDay()];
      } else if (salesTf === "Mensual") {
        key = `Día ${d.getDate()}`;
      } else if (salesTf === "Anual") {
        const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        key = months[d.getMonth()];
      }
      map[key] = (map[key] || 0) + o.total;
    });

    const res = [];
    if (salesTf === "Hoy") {
      const hours = Object.keys(map).sort();
      if (hours.length > 0) {
        let startH = parseInt(hours[0]);
        let endH = parseInt(hours[hours.length - 1]);
        if (endH - startH < 4) {
          startH = Math.max(0, startH - 1);
          endH = Math.min(23, startH + 4);
        }
        for (let h = startH; h <= endH; h++) {
          const hourLabel = h.toString().padStart(2, '0') + ":00";
          res.push({ label: hourLabel, val: map[hourLabel] || 0 });
        }
      } else {
        ["19:00", "20:00", "21:00", "22:00", "23:00"].forEach(h => res.push({ label: h, val: 0 }));
      }
    } else if (salesTf === "Semanal") {
      const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
      days.forEach(d => res.push({ label: d, val: map[d] || 0 }));
    } else if (salesTf === "Mensual") {
      const weeks = [
        { label: "Sem 1", minDay: 1, maxDay: 7 },
        { label: "Sem 2", minDay: 8, maxDay: 14 },
        { label: "Sem 3", minDay: 15, maxDay: 21 },
        { label: "Sem 4", minDay: 22, maxDay: 31 },
      ];
      weeks.forEach(w => {
        let weekTotal = 0;
        filtered.forEach(o => {
          const day = new Date(o.createdAt).getDate();
          if (day >= w.minDay && day <= w.maxDay) {
            weekTotal += o.total;
          }
        });
        res.push({ label: w.label, val: weekTotal });
      });
    } else if (salesTf === "Anual") {
      const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      months.forEach(m => res.push({ label: m, val: map[m] || 0 }));
    }

    return res;
  }, [orders, salesTf]);

  const maxChartVal = Math.max(...salesCurve.map(d => d.val), 1000);

  // Delivery stats
  const deliveryData = useMemo(() => {
    const filtered = filterOrdersByTimeframe(orders, deliveryTf).filter(o => o.status !== "cancelado");
    let retiro = 0;
    let envio = 0;
    filtered.forEach(o => {
      const addr = o.address?.toLowerCase() || "";
      if (addr.includes("local") || addr.includes("retira") || addr.includes("retiro")) retiro++;
      else envio++;
    });
    return [
      { label: "Envíos (Delivery)", value: envio, color: "#0ea5e9" }, // sky-500
      { label: "Retiro en Local", value: retiro, color: "#f97316" }  // orange-500
    ];
  }, [orders, deliveryTf]);

  // Payment stats
  const paymentData = useMemo(() => {
    const filtered = filterOrdersByTimeframe(orders, paymentTf).filter(o => o.status !== "cancelado");
    let efectivo = 0;
    let transferencia = 0;
    let credito = 0;
    filtered.forEach(o => {
      const method = o.paymentMethod?.toLowerCase() || "";
      if (method.includes("efectivo")) efectivo++;
      else if (method.includes("credito") || method.includes("crédito") || method.includes("tarjeta")) credito++;
      else transferencia++; // Defaults any digital/transfer to transfer
    });
    return [
      { label: "Efectivo", value: efectivo, color: "#10b981" }, // emerald-500
      { label: "Transferencia", value: transferencia, color: "#3b82f6" }, // blue-500
      { label: "Crédito", value: credito, color: "#a855f7" } // purple-500
    ];
  }, [orders, paymentTf]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#09090b]">
      {/* ── Header ── */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            Mando Central
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
            <Activity size={12} className="text-emerald-500 animate-pulse" />
            Métricas de la Jornada Actual
          </p>
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        
        {/* ── KPI Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <KpiCard title="Facturación Hoy" value={fmtARS(todaySales)} icon={DollarSign} color="bg-emerald-500/10 text-emerald-500" />
          <KpiCard title="Pedidos Hoy" value={String(todayOrders.length)} icon={ShoppingBag} color="bg-orange-500/10 text-orange-500" />
          <KpiCard title="Ticket Promedio" value={fmtARS(avgTicket)} icon={TrendingUp} color="bg-purple-500/10 text-purple-500" />
          <KpiCard title="En Preparación/Envío" value={String(activeCount)} icon={Clock} color="bg-sky-500/10 text-sky-500" />
        </div>

        {/* ── Analytics ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">

          {/* Histórico de Ventas */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-6 flex flex-col gap-4 shadow-xl relative overflow-hidden">
            <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-purple-600/5 blur-3xl" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative">
              <div>
                <h2 className="font-black text-lg sm:text-xl text-white">Curva de Ventas</h2>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">
                  Evolución Histórica
                </p>
              </div>
              <TimeframeSelector value={salesTf} onChange={setSalesTf} />
            </div>

            {/* Chart area */}
            <CustomBarChart 
              data={salesCurve.map(d => ({ label: d.label, value: d.val }))} 
              maxValue={maxChartVal} 
            />
          </div>

          {/* Top Products */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-6 flex flex-col gap-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg sm:text-xl text-white">Top 5 Productos</h2>
              <ShoppingBag size={16} className="text-orange-500" />
            </div>
            
            {topProducts.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                Sin ventas hoy
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {topProducts.map((p, i) => (
                  <div key={i} className="bg-zinc-950 border border-zinc-800 p-3 rounded-2xl flex items-center gap-3 hover:border-zinc-700 transition">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-black text-xs shrink-0">
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-100 truncate">{p.name}</p>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{p.qty} unidades vendidas</p>
                    </div>
                    <div className="font-black text-xs text-white tabular-nums shrink-0">
                      {fmtARS(p.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Extra Stats Row ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
          
          {/* Entregas vs Retiros */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
              <h2 className="font-black text-lg text-white">Modalidad de Entrega</h2>
              <TimeframeSelector value={deliveryTf} onChange={setDeliveryTf} />
            </div>
            <CustomPieChart data={deliveryData} />
          </div>

          {/* Medios de Pago */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
              <h2 className="font-black text-lg text-white">Medios de Pago</h2>
              <TimeframeSelector value={paymentTf} onChange={setPaymentTf} />
            </div>
            <CustomPieChart data={paymentData} />
          </div>

        </div>
      </div>
    </div>
  );
}
