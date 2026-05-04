"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { formatBusinessDay } from "@/lib/businessDay";
import {
  CalendarClock, DollarSign, Wallet, CreditCard, Smartphone,
  CheckCircle2, AlertTriangle, ClipboardList, Banknote, X,
  ReceiptText, ChevronDown, ChevronUp, Printer
} from "lucide-react";
import { mockOrdersStore, MockOrder } from "@/lib/mockData";

const fmtARS = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

type ShiftStatus = "open" | "confirming" | "closed";

export default function CierreCajaPage() {
  const [now, setNow] = useState(new Date());
  const [fondoFijo, setFondoFijo] = useState(20000);
  const [notas, setNotas] = useState("");
  const [shiftStatus, setShiftStatus] = useState<ShiftStatus>("open");
  const [showOrders, setShowOrders] = useState(false);
  const [closedAt, setClosedAt] = useState<Date | null>(null);

  const allOrders = useSyncExternalStore(mockOrdersStore.subscribe, mockOrdersStore.getSnapshot);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const completedOrders = allOrders.filter(o => o.status === "completado");
  const canceledOrders  = allOrders.filter(o => o.status === "cancelado");
  const pendingOrders   = allOrders.filter(o => !["completado","cancelado"].includes(o.status));

  // Payment breakdown
  const byMethod = completedOrders.reduce<Record<string, number>>((acc, o) => {
    const key = o.paymentMethod;
    acc[key] = (acc[key] || 0) + o.total;
    return acc;
  }, {});

  const totalVentas    = completedOrders.reduce((s, o) => s + o.total, 0);
  const totalEfectivo  = Object.entries(byMethod)
    .filter(([k]) => k.toLowerCase().includes("efectivo"))
    .reduce((s, [,v]) => s + v, 0);
  const totalDigital   = totalVentas - totalEfectivo;
  const efectivoEnCaja = totalEfectivo + fondoFijo;

  const businessDateString = formatBusinessDay(now);

  const paymentIcons: Record<string, React.ReactNode> = {
    "Efectivo":           <Banknote size={14} />,
    "Mercado Pago":       <Smartphone size={14} />,
    "Tarjeta de crédito": <CreditCard size={14} />,
    "Tarjeta de débito":  <CreditCard size={14} />,
  };

  function handleCerrarTurno() {
    setShiftStatus("confirming");
  }

  function handleConfirmar() {
    setClosedAt(new Date());
    setShiftStatus("closed");
  }

  // ── CLOSED SCREEN ────────────────────────────────────────────────────────────
  if (shiftStatus === "closed") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-950">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Turno Cerrado</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Cierre registrado el {closedAt?.toLocaleDateString("es-AR")} a las{" "}
              {closedAt?.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-left space-y-3">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Resumen del Turno</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Pedidos completados</span>
              <span className="font-black text-white">{completedOrders.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Total vendido</span>
              <span className="font-black text-emerald-400 text-lg">{fmtARS(totalVentas)}</span>
            </div>
            <div className="border-t border-zinc-800 pt-3 flex justify-between items-center">
              <span className="text-sm text-zinc-400">Efectivo en caja</span>
              <span className="font-black text-orange-400">{fmtARS(efectivoEnCaja)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Digital / Transferencias</span>
              <span className="font-black text-sky-400">{fmtARS(totalDigital)}</span>
            </div>
            {notas && (
              <div className="border-t border-zinc-800 pt-3">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Notas</p>
                <p className="text-sm text-zinc-300">{notas}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-zinc-400 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:text-white transition"
          >
            <Printer size={16} /> Imprimir Cierre
          </button>
        </div>
      </div>
    );
  }

  // ── CONFIRMATION MODAL ───────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-zinc-950">
      {/* Confirmation overlay */}
      {shiftStatus === "confirming" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white">¿Confirmar cierre de turno?</h2>
              <button onClick={() => setShiftStatus("open")} className="text-zinc-500 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3">
              <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-300">Atención</p>
                {pendingOrders.length > 0 ? (
                  <p className="text-xs text-amber-400/80 mt-0.5">
                    Hay <strong>{pendingOrders.length} pedido(s) activos</strong> sin completar. ¿Estás seguro de cerrar el turno?
                  </p>
                ) : (
                  <p className="text-xs text-amber-400/80 mt-0.5">Esta acción registrará el cierre del turno actual.</p>
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-zinc-400">Total ventas</span><span className="font-black text-white">{fmtARS(totalVentas)}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Pedidos completados</span><span className="font-black text-white">{completedOrders.length}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Efectivo en caja</span><span className="font-black text-orange-400">{fmtARS(efectivoEnCaja)}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Digital</span><span className="font-black text-sky-400">{fmtARS(totalDigital)}</span></div>
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={() => setShiftStatus("open")} className="flex-1 py-3 rounded-xl font-bold text-zinc-400 bg-zinc-800 hover:bg-zinc-700 transition">
                Cancelar
              </button>
              <button onClick={handleConfirmar} className="flex-1 py-3 rounded-xl font-black text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/30">
                Confirmar Cierre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-5 pb-24">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-zinc-100 tracking-tight">Cierre de Caja</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Resumen y balance del turno actual.</p>
        </div>

        {/* Turno Banner */}
        <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <CalendarClock size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Día Comercial Activo</p>
              <p className="text-base font-black text-zinc-100 capitalize mt-0.5">{businessDateString}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Ventas nocturnas asignadas a este turno hasta las 06:00 AM.</p>
            </div>
          </div>
          <div className="text-right shrink-0 sm:text-right">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Hora</p>
            <p className="text-2xl font-black text-white tabular-nums tracking-tighter font-mono">
              {now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Ventas",   value: fmtARS(totalVentas),    sub: `${completedOrders.length} pedidos`, icon: <DollarSign size={16}/>, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Efectivo Caja",  value: fmtARS(efectivoEnCaja), sub: `Fondo: ${fmtARS(fondoFijo)}`,     icon: <Wallet size={16}/>,     color: "text-orange-400",  bg: "bg-orange-500/10"  },
            { label: "Digital",        value: fmtARS(totalDigital),   sub: "MP / Transferencia",                icon: <Smartphone size={16}/>, color: "text-sky-400",     bg: "bg-sky-500/10"     },
            { label: "Cancelados",     value: String(canceledOrders.length), sub: "pedidos",                   icon: <X size={16}/>,          color: "text-red-400",     bg: "bg-red-500/10"     },
          ].map(card => (
            <div key={card.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className={`w-8 h-8 rounded-lg ${card.bg} ${card.color} flex items-center justify-center mb-3`}>
                {card.icon}
              </div>
              <p className={`text-xl font-black ${card.color} tabular-nums leading-none`}>{card.value}</p>
              <p className="text-[10px] text-zinc-500 font-medium mt-1">{card.label}</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Payment Breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <ReceiptText size={16} className="text-zinc-400" />
            <h2 className="text-sm font-black text-zinc-200 uppercase tracking-widest">Desglose por Método de Pago</h2>
          </div>
          {Object.keys(byMethod).length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-4">Sin ventas completadas aún.</p>
          ) : (
            <div className="divide-y divide-zinc-800">
              {Object.entries(byMethod).map(([method, amount]) => (
                <div key={method} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                      {paymentIcons[method] ?? <Wallet size={14}/>}
                    </div>
                    <span className="text-sm font-bold text-zinc-300">{method}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-white text-base">{fmtARS(amount)}</span>
                    <span className="text-[10px] text-zinc-500 ml-2">
                      {((amount / totalVentas) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3">
                <span className="text-sm font-black text-zinc-200">Total</span>
                <span className="font-black text-emerald-400 text-lg">{fmtARS(totalVentas)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Fondo Fijo */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Banknote size={16} className="text-zinc-400" />
            <h2 className="text-sm font-black text-zinc-200 uppercase tracking-widest">Fondo Fijo de Caja</h2>
          </div>
          <p className="text-xs text-zinc-500 mb-3">Monto inicial con el que arrancó el turno. No se cuenta como venta.</p>
          <div className="flex items-center gap-3">
            <span className="text-zinc-500 font-bold">$</span>
            <input
              type="number"
              value={fondoFijo}
              onChange={e => setFondoFijo(Number(e.target.value))}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white font-black text-lg outline-none focus:border-orange-500/60 transition tabular-nums [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            Efectivo total a retirar de caja: <strong className="text-orange-400">{fmtARS(totalEfectivo)}</strong>
            {" "}(ventas) + <strong className="text-orange-400">{fmtARS(fondoFijo)}</strong> (fondo) = <strong className="text-white">{fmtARS(efectivoEnCaja)}</strong>
          </p>
        </div>

        {/* Orders Detail Accordion */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowOrders(v => !v)}
            className="w-full flex items-center justify-between p-5 hover:bg-zinc-800/50 transition"
          >
            <div className="flex items-center gap-2">
              <ClipboardList size={16} className="text-zinc-400" />
              <span className="text-sm font-black text-zinc-200 uppercase tracking-widest">
                Pedidos del Turno ({allOrders.length})
              </span>
            </div>
            {showOrders ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
          </button>

          {showOrders && (
            <div className="border-t border-zinc-800 divide-y divide-zinc-800/60 max-h-72 overflow-y-auto no-scrollbar">
              {allOrders.map(order => {
                const statusMap: Record<string, { label: string; color: string }> = {
                  "completado":  { label: "Completado",  color: "text-emerald-400 bg-emerald-500/10" },
                  "cancelado":   { label: "Cancelado",   color: "text-red-400 bg-red-500/10" },
                  "confirmado":  { label: "Confirmado",  color: "text-orange-400 bg-orange-500/10" },
                  "en-cocina":   { label: "En Cocina",   color: "text-yellow-400 bg-yellow-500/10" },
                  "listo":       { label: "Listo",       color: "text-indigo-400 bg-indigo-500/10" },
                  "en-camino":   { label: "En Camino",   color: "text-sky-400 bg-sky-500/10" },
                };
                const st = statusMap[order.status] ?? { label: order.status, color: "text-zinc-400 bg-zinc-800" };
                return (
                  <div key={order.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-zinc-500">#{order.id}</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                      </div>
                      <p className="text-sm font-bold text-zinc-200 mt-0.5">{order.clientName}</p>
                      <p className="text-[11px] text-zinc-500">{order.paymentMethod}</p>
                    </div>
                    <span className="font-black text-white text-sm tabular-nums">{fmtARS(order.total)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Notas */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h2 className="text-sm font-black text-zinc-200 uppercase tracking-widest mb-3">Notas del Turno</h2>
          <textarea
            value={notas}
            onChange={e => setNotas(e.target.value)}
            rows={3}
            placeholder="Ej: Faltó cambio, problemas con POS, novedades del día..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-orange-500/60 transition resize-none"
          />
        </div>

        {/* Pending warning */}
        {pendingOrders.length > 0 && (
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <AlertTriangle size={18} className="text-amber-400 shrink-0" />
            <p className="text-sm text-amber-300">
              <strong>{pendingOrders.length} pedido(s)</strong> están todavía activos. Completalos antes de cerrar el turno.
            </p>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={handleCerrarTurno}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black text-white text-base bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/30 transition active:scale-[0.98]"
        >
          <CheckCircle2 size={20} />
          Cerrar Turno
        </button>

      </div>
    </div>
  );
}
