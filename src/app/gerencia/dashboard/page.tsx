"use client";

import React, { useState, useEffect, useMemo } from "react";
import { mockOrdersStore, MockOrder } from "@/lib/mockData";
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

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

function fmtChartVal(v: number) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000)    return `${Math.floor(v / 1000)}k`;
  return String(v);
}

type Timeframe = "Hoy" | "Semanal" | "Mensual" | "Anual";

function filterOrdersByTimeframe(orders: MockOrder[], tf: Timeframe) {
  const now = new Date();
  const todayMs = getBusinessDay().getTime();
  
  return orders.filter(o => {
    const oDate = new Date(o.createdAt);
    const ms = oDate.getTime();
    if (tf === "Hoy") return getBusinessDay(o.createdAt).getTime() === todayMs;
    if (tf === "Semanal") return (now.getTime() - ms) <= 7 * 24 * 60 * 60 * 1000;
    if (tf === "Mensual") return (now.getTime() - ms) <= 30 * 24 * 60 * 60 * 1000;
    if (tf === "Anual") return (now.getTime() - ms) <= 365 * 24 * 60 * 60 * 1000;
    return true;
  });
}

function KpiCard({ title, value, icon: Icon, color, trend }: {
  title: string; value: string; icon: React.ElementType; color: string;
  trend?: { val: string; up: boolean };
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm hover:border-zinc-700 transition">
      <div className="flex justify-between items-start">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-[10px] font-bold ${trend.up ? "text-emerald-400" : "text-red-400"}`}>
            {trend.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend.val}
          </div>
        )}
      </div>
      <div>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">{value}</p>
      </div>
    </div>
  );
}

function getBarStyle(val: number, max: number) {
  if (max === 0) max = 1;
  const pct = val / max;
  if (pct >= 0.8) return {
    background: "linear-gradient(to top, #a855f7, #c084fc)",
    borderColor: "#e9d5ff", shadowColor: "rgba(192,132,252,0.3)", labelColor: "#e9d5ff",
  };
  if (pct >= 0.4) return {
    background: "linear-gradient(to top, #9333ea, #a855f7)",
    borderColor: "#d8b4fe", shadowColor: "rgba(168,85,247,0.2)", labelColor: "#d8b4fe",
  };
  return {
    background: "linear-gradient(to top, #7e22ce, #9333ea)",
    borderColor: "#c084fc", shadowColor: "rgba(147,51,234,0.1)", labelColor: "#c084fc",
  };
}

function TimeframeSelector({ value, onChange }: { value: Timeframe, onChange: (v: Timeframe) => void }) {
  const options: Timeframe[] = ["Hoy", "Semanal", "Mensual", "Anual"];
  return (
    <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 shrink-0 z-10">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition ${
            value === opt ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function CustomPieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  
  let currentStart = 0;
  const gradientStops = data.map(d => {
    const pct = (d.value / total) * 100;
    const stop = `${d.color} ${currentStart}% ${currentStart + pct}%`;
    currentStart += pct;
    return stop;
  }).join(", ");

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 justify-center mt-8 mb-4">
      <div 
        className="w-48 h-48 sm:w-56 sm:h-56 rounded-full shadow-2xl shrink-0"
        style={{ background: `conic-gradient(${gradientStops})` }}
      />
      <div className="flex flex-col gap-4">
        {data.map(d => {
          const pct = Math.round((d.value / total) * 100);
          return (
            <div key={d.label} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-md shrink-0" style={{ backgroundColor: d.color }} />
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-0.5">{d.label}</p>
                <p className="text-xl sm:text-2xl font-black text-white">{d.value} <span className="text-zinc-500 text-sm font-bold">({pct}%)</span></p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GerenciaDashboardPage() {
  const [orders, setOrders] = useState<MockOrder[]>([]);

  const [salesTf, setSalesTf] = useState<Timeframe>("Hoy");
  const [deliveryTf, setDeliveryTf] = useState<Timeframe>("Hoy");
  const [paymentTf, setPaymentTf] = useState<Timeframe>("Hoy");

  useEffect(() => {
    setOrders(mockOrdersStore.getSnapshot());
    return mockOrdersStore.subscribe(() => setOrders([...mockOrdersStore.getSnapshot()]));
  }, []);

  // Compute KPIs (Always 'Hoy' for the top KPIs)
  const { todayOrders, todaySales, activeCount, avgTicket, topProducts } = useMemo(() => {
    const todayOrdersList = filterOrdersByTimeframe(orders, "Hoy").filter(o => o.status !== "cancelado");
    const todaySalesVal = todayOrdersList.reduce((acc, o) => acc + o.total, 0);
    const activeCountVal = todayOrdersList.filter(o => o.status !== "completado").length;
    const avgTicketVal = todayOrdersList.length > 0 ? todaySalesVal / todayOrdersList.length : 0;

    const productCounts: Record<string, { name: string, qty: number, revenue: number }> = {};
    todayOrdersList.forEach(o => {
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
        for (let h = parseInt(hours[0]); h <= parseInt(hours[hours.length - 1]); h++) {
          const hourLabel = h.toString().padStart(2, '0') + ":00";
          res.push({ label: hourLabel, val: map[hourLabel] || 0 });
        }
      } else {
        res.push({ label: "20:00", val: 0 }, { label: "21:00", val: 0 }, { label: "22:00", val: 0 });
      }
    } else if (salesTf === "Semanal") {
      const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
      days.forEach(d => res.push({ label: d, val: map[d] || 0 }));
    } else if (salesTf === "Mensual") {
      for (let i = 1; i <= 31; i++) {
        if (map[`Día ${i}`]) res.push({ label: String(i), val: map[`Día ${i}`] });
      }
      if (res.length === 0) res.push({ label: "1", val: 0 });
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
            <div className="relative flex-1 min-h-[220px] mt-4">
              {[100, 75, 50, 25].map(pct => (
                <div
                  key={pct}
                  className="absolute left-0 right-0 border-t border-dashed border-zinc-800/70 flex items-center"
                  style={{ bottom: `${pct}%` }}
                >
                  <span className="absolute left-0 text-[9px] sm:text-[10px] font-bold text-zinc-600 whitespace-nowrap bg-zinc-900 pr-2">
                    {fmtChartVal(Math.round(maxChartVal * pct / 100))}
                  </span>
                </div>
              ))}
              <div className="absolute inset-0 flex items-end justify-between gap-1 sm:gap-2 pl-10 sm:pl-12">
                {salesCurve.map((d, i) => {
                  const style = getBarStyle(d.val, maxChartVal);
                  const heightPct = (d.val / maxChartVal) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                      <div className="w-full relative flex flex-col justify-end" style={{ height: "100%" }}>
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 pointer-events-none">
                          <div
                            className="px-2 py-1 rounded-lg text-[11px] font-black whitespace-nowrap shadow-lg bg-zinc-950"
                            style={{ border: `1px solid ${style.borderColor}`, color: style.labelColor }}
                          >
                            {fmtARS(d.val)}
                          </div>
                        </div>
                        <div
                          className="w-full rounded-t-md transition-all duration-500 ease-out min-h-[4px]"
                          style={{
                            height: `${heightPct}%`,
                            background: style.background,
                            borderTop: `2px solid ${style.borderColor}`,
                            boxShadow: `0 -4px 20px ${style.shadowColor}`,
                          }}
                        />
                      </div>
                      <span className="text-[8px] sm:text-[9px] font-bold text-zinc-500 uppercase tracking-widest truncate max-w-full">{d.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
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
