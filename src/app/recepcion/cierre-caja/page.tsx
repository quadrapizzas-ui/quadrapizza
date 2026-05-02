"use client";

import { useState, useEffect } from "react";
import { formatBusinessDay } from "@/lib/businessDay";
import { Calculator, DollarSign, Wallet, CalendarClock, Printer, History } from "lucide-react";

export default function CierreCajaPage() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000); // update every minute
    return () => clearInterval(t);
  }, []);

  const businessDateString = formatBusinessDay(now);

  const fmtARS = (n: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto bg-zinc-950">
      <div className="max-w-4xl mx-auto w-full space-y-6 pb-20">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-zinc-100 tracking-tight">Cierre de Caja</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Resumen de ventas y balance del turno.
          </p>
        </div>

        {/* Info del Turno Comercial */}
        <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <CalendarClock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-0.5">Día Comercial Activo</p>
              <p className="text-lg font-black text-zinc-100 capitalize">{businessDateString}</p>
              <p className="text-xs font-medium text-zinc-400 mt-0.5">
                Las ventas después de las 00:00 se asignan a este turno (hasta las 06:00 AM).
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Hora Actual</p>
            <p className="text-2xl font-black text-white font-mono tabular-nums tracking-tighter">
              {now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        {/* Resumen Numerico */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <DollarSign size={18} />
              </div>
              <p className="text-sm font-bold text-zinc-400">Total Ventas</p>
            </div>
            <p className="text-3xl font-black text-white">{fmtARS(345500)}</p>
            <p className="text-xs text-emerald-400 font-bold mt-2">+ 24 pedidos hoy</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <Wallet size={18} />
              </div>
              <p className="text-sm font-bold text-zinc-400">Efectivo en Caja</p>
            </div>
            <p className="text-3xl font-black text-white">{fmtARS(215000)}</p>
            <p className="text-xs text-zinc-500 mt-2 font-medium">Incluye fondo fijo</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Calculator size={18} />
              </div>
              <p className="text-sm font-bold text-zinc-400">Transferencias</p>
            </div>
            <p className="text-3xl font-black text-white">{fmtARS(130500)}</p>
            <p className="text-xs text-zinc-500 mt-2 font-medium">Mercado Pago / Banco</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <button className="flex items-center justify-center gap-3 py-4 rounded-xl font-black text-zinc-300 bg-zinc-900 border border-zinc-800 hover:text-white hover:bg-zinc-800 transition active:scale-[0.98]">
            <Printer size={20} />
            Imprimir Reporte (Z)
          </button>
          <button className="flex items-center justify-center gap-3 py-4 rounded-xl font-black text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-900/20 transition active:scale-[0.98]">
            <History size={20} />
            Confirmar y Cerrar Turno
          </button>
        </div>

      </div>
    </div>
  );
}
