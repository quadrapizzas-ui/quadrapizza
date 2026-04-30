"use client";

import React, { useState, useEffect, useMemo } from "react";
import { mockOrdersStore, MockOrder } from "@/lib/mockData";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Banknote, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

const MOCK_EXPENSES = [
  { id: 1, concept: "Compra de Insumos — Proveedor A", amount: 45000, date: "Hoy" },
  { id: 2, concept: "Gas y Electricidad", amount: 18000, date: "Ayer" },
  { id: 3, concept: "Servicio de Internet", amount: 8500, date: "Hace 3 días" },
  { id: 4, concept: "Mantenimiento Horno", amount: 25000, date: "Hace 5 días" },
];

export default function FinanzasPage() {
  const [orders, setOrders] = useState<MockOrder[]>(() => mockOrdersStore.getSnapshot());

  useEffect(() => {
    return mockOrdersStore.subscribe(() => setOrders([...mockOrdersStore.getSnapshot()]));
  }, []);

  const totalIngresos = useMemo(() => orders.reduce((s, o) => s + o.total, 0) + 245000, [orders]);
  const totalEgresos  = useMemo(() => MOCK_EXPENSES.reduce((s, e) => s + e.amount, 0), []);
  const balance       = totalIngresos - totalEgresos;

  const efectivoCount = orders.filter(o => o.paymentMethod?.toLowerCase() === "efectivo").length;
  const digitalCount  = orders.length - efectivoCount;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white">Finanzas</h1>
        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-1">Flujo de caja e indicadores financieros</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center"><TrendingUp size={18} className="text-emerald-500" /></div>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Ingresos Brutos</span>
          </div>
          <p className="text-3xl font-black text-emerald-400 tabular-nums">{fmtARS(totalIngresos)}</p>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400"><ArrowUpRight size={12} />+18% vs. semana anterior</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center"><TrendingDown size={18} className="text-red-500" /></div>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Egresos</span>
          </div>
          <p className="text-3xl font-black text-red-400 tabular-nums">{fmtARS(totalEgresos)}</p>
          <div className="flex items-center gap-1 text-[10px] font-bold text-red-400"><ArrowDownRight size={12} />-5% vs. semana anterior</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center"><Wallet size={18} className="text-purple-500" /></div>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Balance Neto</span>
          </div>
          <p className={`text-3xl font-black tabular-nums ${balance >= 0 ? "text-white" : "text-red-400"}`}>{fmtARS(balance)}</p>
          <div className="flex items-center gap-1 text-[10px] font-bold text-purple-400"><ArrowUpRight size={12} />Margen saludable</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Métodos de pago breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
          <h2 className="font-black text-lg text-white mb-6">Métodos de Pago</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center"><Banknote size={18} className="text-yellow-500" /></div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-bold text-zinc-200">Efectivo</span>
                  <span className="text-sm font-black text-white">{efectivoCount}</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full transition-all" style={{ width: `${orders.length > 0 ? (efectivoCount / orders.length) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><CreditCard size={18} className="text-blue-500" /></div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-bold text-zinc-200">Digital</span>
                  <span className="text-sm font-black text-white">{digitalCount}</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${orders.length > 0 ? (digitalCount / orders.length) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Egresos */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-lg text-white">Egresos Recientes</h2>
            <button className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition">+ Nuevo Egreso</button>
          </div>
          <div className="space-y-3">
            {MOCK_EXPENSES.map(e => (
              <div key={e.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between hover:border-zinc-700 transition">
                <div>
                  <p className="text-sm font-bold text-zinc-200">{e.concept}</p>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">{e.date}</p>
                </div>
                <span className="text-sm font-black text-red-400 tabular-nums">-{fmtARS(e.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
