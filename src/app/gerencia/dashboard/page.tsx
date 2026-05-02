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
  ChevronRight,
} from "lucide-react";

type ChartPeriod = "semanal" | "mensual" | "anual";

const CHART_DATA: Record<ChartPeriod, { label: string; val: number }[]> = {
  semanal: [
    { label: "Lun", val: 280000 },
    { label: "Mar", val: 310000 },
    { label: "Mié", val: 295000 },
    { label: "Jue", val: 420000 },
    { label: "Vie", val: 750000 },
    { label: "Sáb", val: 920000 },
    { label: "Dom", val: 680000 },
  ],
  mensual: [
    { label: "S1", val: 3500000 },
    { label: "S2", val: 2800000 },
    { label: "S3", val: 2100000 },
    { label: "S4", val: 1600000 },
  ],
  anual: [
    { label: "Ene", val: 16500000 },
    { label: "Feb", val: 14200000 },
    { label: "Mar", val: 9800000  },
    { label: "Abr", val: 8500000  },
    { label: "May", val: 9100000  },
    { label: "Jun", val: 10500000 },
    { label: "Jul", val: 12800000 },
    { label: "Ago", val: 9400000  },
    { label: "Sep", val: 10200000 },
    { label: "Oct", val: 11500000 },
    { label: "Nov", val: 12100000 },
    { label: "Dic", val: 18200000 },
  ],
};

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

function fmtChartVal(v: number) {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000)    return `${Math.floor(v / 1000)}k`;
  return String(v);
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
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

// ── Dashboard Page ────────────────────────────────────────────────────────────
export default function GerenciaDashboardPage() {
  const [orders, setOrders] = useState<MockOrder[]>(() => mockOrdersStore.getSnapshot());

  useEffect(() => {
    return mockOrdersStore.subscribe(() => setOrders([...mockOrdersStore.getSnapshot()]));
  }, []);

  const todaySales  = useMemo(() => orders.reduce((acc, o) => acc + o.total, 0), [orders]);
  const activeCount = useMemo(() => orders.filter(o => o.status !== "completado").length, [orders]);
  const avgTicket   = useMemo(() => orders.length > 0 ? todaySales / orders.length : 0, [todaySales, orders.length]);

  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("semanal");
  const chartData = CHART_DATA[chartPeriod];
  const maxChartVal = Math.max(...chartData.map(d => d.val));

  const periodTabs: { key: ChartPeriod; label: string }[] = [
    { key: "semanal", label: "Sem." },
    { key: "mensual", label: "Mes"  },
    { key: "anual",   label: "Año"  },
  ];

  const chartTotal = useMemo(
    () => CHART_DATA[chartPeriod].reduce((s, d) => s + d.val, 0),
    [chartPeriod]
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Header ── */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Mando Central</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
            <Activity size={12} className="text-purple-500 animate-pulse" />
            Estado Operativo en Tiempo Real
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 flex items-center gap-3 text-xs font-bold text-zinc-400 self-start sm:self-auto">
          <span>Hoy: {new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long" })}</span>
          <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
          <span className="text-emerald-400">Local Abierto</span>
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        {/* ── KPI Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <KpiCard title="Ventas de Hoy"   value={fmtARS(todaySales)}   icon={DollarSign}  color="bg-orange-500/10 text-orange-500"  trend={{ val: "12%", up: true  }} />
        <KpiCard title="Pedidos Activos" value={String(activeCount)}   icon={ShoppingBag} color="bg-sky-500/10 text-sky-500" />
        <KpiCard title="Ticket Promedio" value={fmtARS(avgTicket)}     icon={TrendingUp}  color="bg-purple-500/10 text-purple-500" trend={{ val: "4%", up: true  }} />
        <KpiCard title="Nuevos Clientes" value="24"                     icon={Users}       color="bg-emerald-500/10 text-emerald-500" trend={{ val: "2%", up: false }} />
      </div>

      {/* ── Chart + Top Products ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">

        {/* Histórico de Ventas */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-6 flex flex-col gap-4 shadow-xl relative overflow-hidden">
          <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-purple-600/5 blur-3xl" />

          {/* Chart header */}
          <div className="flex items-start sm:items-center justify-between gap-3 relative">
            <div>
              <h2 className="font-black text-lg sm:text-xl text-white">Histórico de Ventas</h2>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">
                {chartPeriod === "semanal" ? "Esta semana" : chartPeriod === "mensual" ? "Este mes" : "Este año"}
                <span className="ml-2 text-purple-400">{fmtARS(chartTotal)}</span>
              </p>
            </div>
            {/* Period tabs — compact on mobile */}
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 gap-0.5 shrink-0">
              {periodTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setChartPeriod(tab.key)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all ${
                    chartPeriod === tab.key
                      ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart area */}
          <div className="relative flex-1 min-h-[180px] sm:min-h-[220px]">
            {[100, 75, 50, 25].map(pct => (
              <div
                key={pct}
                className="absolute left-0 right-0 border-t border-dashed border-zinc-800/70 flex items-center"
                style={{ bottom: `${pct}%` }}
              >
                <span className="absolute left-0 text-[9px] sm:text-[10px] font-bold text-zinc-600 whitespace-nowrap">
                  {fmtChartVal(Math.round(maxChartVal * pct / 100))}
                </span>
              </div>
            ))}
            <div className="absolute inset-0 flex items-end justify-between gap-1 sm:gap-1.5 pl-8 sm:pl-10">
              {chartData.map((d, i) => {
                const style = getBarStyle(d.val, maxChartVal);
                const heightPct = (d.val / maxChartVal) * 100;
                return (
                  <div key={`${chartPeriod}-${i}`} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                    <div className="w-full relative flex flex-col justify-end" style={{ height: "100%" }}>
                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 pointer-events-none">
                        <div
                          className="px-2 py-1 rounded-lg text-[11px] font-black whitespace-nowrap shadow-lg"
                          style={{ background: style.borderColor + "22", border: `1px solid ${style.borderColor}`, color: style.labelColor }}
                        >
                          {fmtChartVal(d.val)}
                        </div>
                      </div>
                      <div
                        className="w-full rounded-t-lg transition-all duration-500 ease-out"
                        style={{
                          height: `${heightPct}%`,
                          background: style.background,
                          borderTop: `2px solid ${style.borderColor}`,
                          boxShadow: `0 -4px 20px ${style.shadowColor}`,
                        }}
                      />
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-bold text-zinc-600 uppercase tracking-widest pb-0.5">{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 pt-1 border-t border-zinc-800/60">
            {[{ color: "bg-purple-400 border-purple-300", label: "Alto" }, { color: "bg-purple-500 border-purple-400", label: "Medio" }, { color: "bg-purple-600 border-purple-500", label: "Bajo" }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-sm border ${l.color}`} />
                <span className="text-[10px] font-bold text-zinc-400">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-6 flex flex-col gap-5 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-lg sm:text-xl text-white">Top Productos</h2>
            <TrendingUp size={16} className="text-orange-500" />
          </div>
          <div className="flex flex-col gap-2.5">
            {[
              { name: "Muzzarella Clásica",   sales: 1240, trend: "+12%", up: true  },
              { name: "Hamburguesa Triple",    sales: 980,  trend: "+8%",  up: true  },
              { name: "Lomo Especial Quadra",  sales: 850,  trend: "-2%",  up: false },
              { name: "Quadra Integral",       sales: 620,  trend: "+15%", up: true  },
              { name: "Papas Rústicas",        sales: 410,  trend: "+5%",  up: true  },
            ].map((p, i) => (
              <div key={i} className="bg-zinc-950 border border-zinc-800 p-3 rounded-2xl flex items-center gap-3 hover:border-zinc-700 transition">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-black text-xs shrink-0">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-100 truncate">{p.name}</p>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{p.sales} ventas</p>
                </div>
                <div className={`flex items-center gap-0.5 text-[10px] font-bold shrink-0 ${p.up ? "text-emerald-400" : "text-red-400"}`}>
                  {p.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {p.trend}
                </div>
              </div>
            ))}
          </div>
          <button className="mt-auto w-full py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-500 hover:text-white hover:border-zinc-700 transition">
            Analizar Menú
          </button>
        </div>
      </div>

      {/* ── Quick Actions — 1 col mobile, 2 md, 3 lg ───────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-purple-600 border border-purple-500 p-5 sm:p-6 rounded-3xl flex flex-col gap-3 shadow-xl shadow-purple-900/20 cursor-pointer group">
          <h3 className="text-white font-black text-lg sm:text-xl tracking-tight leading-tight">Auditoría de<br />Cierre de Caja</h3>
          <p className="text-purple-200 text-xs font-medium leading-relaxed">Genera el reporte de balance del turno actual para conciliación de ingresos.</p>
          <div className="mt-2 flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
            Empezar Auditoría <ChevronRight size={14} />
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-5 sm:p-6 rounded-3xl flex flex-col gap-3 shadow-sm hover:border-zinc-700 transition cursor-pointer group">
          <h3 className="text-white font-black text-lg sm:text-xl tracking-tight leading-tight">Control de<br />Stock Crítico</h3>
          <p className="text-zinc-500 text-xs font-medium leading-relaxed">Visualiza insumos con bajo inventario reportados desde el módulo de cocina.</p>
          <div className="mt-2 flex items-center gap-2 text-zinc-400 font-black text-xs uppercase tracking-widest group-hover:text-white transition">
            Ver Inventario <ChevronRight size={14} />
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-5 sm:p-6 rounded-3xl flex flex-col gap-3 shadow-sm hover:border-zinc-700 transition cursor-pointer group sm:col-span-2 lg:col-span-1">
          <h3 className="text-white font-black text-lg sm:text-xl tracking-tight leading-tight">Gestión de<br />Personal</h3>
          <p className="text-zinc-500 text-xs font-medium leading-relaxed">Administra perfiles de acceso y permisos para receptores, cocineros y repartidores.</p>
          <div className="mt-2 flex items-center gap-2 text-zinc-400 font-black text-xs uppercase tracking-widest group-hover:text-white transition">
            Gestionar Usuarios <ChevronRight size={14} />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
