"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { formatBusinessDay, getBusinessDay } from "@/lib/businessDay";
import {
  CalendarClock, DollarSign, Wallet, CreditCard, Smartphone,
  CheckCircle2, AlertTriangle, ClipboardList, Banknote, X,
  ReceiptText, ChevronDown, ChevronUp, Printer, AlertCircle
} from "lucide-react";
import { MockOrder } from "@/types/models";
import { useOrdersStore } from "@/lib/store/ordersStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useCierresStore } from "@/lib/store/cierresStore";

const fmtARS = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

type ShiftStatus = "open" | "confirming" | "closed";

export default function CierreCajaPage() {
  const [now, setNow] = useState(new Date());
  const [fondoFijo, setFondoFijo] = useState(20000);
  const [notas, setNotas] = useState("");
  const [shiftStatus, setShiftStatus] = useState<ShiftStatus>("open");
  const [showOrders, setShowOrders] = useState(false);
  const [visibleOrders, setVisibleOrders] = useState(20);
  const [closedAt, setClosedAt] = useState<Date | null>(null);

  const allOrdersStore = useOrdersStore((s) => s.orders);
  const { activeUser } = useAuthStore();
  const { addCierre } = useCierresStore();
  
  // Filtrar solo los pedidos de este cajero del día actual
  const todayBusinessDay = getBusinessDay(now).getTime();
  
  const allOrders = allOrdersStore.filter(o => {
    const isToday = getBusinessDay(o.createdAt).getTime() === todayBusinessDay;
    const isMyShift = activeUser ? (activeUser.role === "Gerencia" || o.cajero_id === activeUser.id) : true;
    return isToday && isMyShift;
  });

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // Un turno incluye todo pedido (excluye cancelados).
  const shiftOrders = allOrders.filter(o => o.status !== "cancelado");
  const paidOrders = shiftOrders.filter(o => o.paymentStatus === "pagado");
  const pendingPaymentOrders = shiftOrders.filter(o => o.paymentStatus === "pendiente");

  const completedOrders = allOrders.filter(o => o.status === "completado");
  const canceledOrders  = allOrders.filter(o => o.status === "cancelado");
  const pendingOrders   = allOrders.filter(o => !["completado","cancelado"].includes(o.status));

  // Payment breakdown - Contabilizar solo pedidos PAGADOS
  const byMethod = paidOrders.reduce<Record<string, number>>((acc, o) => {
    const key = o.paymentMethod || "Efectivo";
    acc[key] = (acc[key] || 0) + o.total;
    return acc;
  }, {});

  const totalVentas    = shiftOrders.reduce((s, o) => s + o.total, 0);
  const totalCobrado   = paidOrders.reduce((s, o) => s + o.total, 0);
  const totalPendiente = pendingPaymentOrders.reduce((s, o) => s + o.total, 0);

  const totalEfectivo  = Object.entries(byMethod)
    .filter(([k]) => k.toLowerCase().includes("efectivo"))
    .reduce((s, [,v]) => s + v, 0);
  const totalDigital   = totalCobrado - totalEfectivo;
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
    if (!activeUser) return;
    
    addCierre({
      cajero_id: activeUser.id,
      cajero_name: activeUser.name,
      monto_total: totalVentas,
      efectivo_total: totalEfectivo,
      otros_medios_total: totalDigital,
      cantidad_pedidos: shiftOrders.length,
      deuda_pendiente_total: totalPendiente,
    });

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
              <span className="text-sm text-zinc-400">Pedidos procesados</span>
              <span className="font-black text-white">{shiftOrders.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Total ventas brutas</span>
              <span className="font-black text-emerald-400 text-lg">{fmtARS(totalVentas)}</span>
            </div>
            <div className="border-t border-zinc-800 pt-3 flex justify-between items-center">
              <span className="text-sm text-zinc-400">Efectivo en caja (con fondo)</span>
              <span className="font-black text-orange-400">{fmtARS(efectivoEnCaja)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Digital / Transferencias</span>
              <span className="font-black text-sky-400">{fmtARS(totalDigital)}</span>
            </div>
            <div className="border-t border-zinc-800 pt-3 flex justify-between items-center">
              <span className="text-sm text-red-400 font-bold">Fiado / A Cobrar (Deuda)</span>
              <span className="font-black text-red-400">{fmtARS(totalPendiente)}</span>
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
              <div className="flex justify-between border-t border-zinc-800 pt-1.5"><span className="text-red-400 font-bold">Fiado / A Cobrar</span><span className="font-black text-red-400">{fmtARS(totalPendiente)}</span></div>
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
          <p className="text-zinc-500 text-sm mt-0.5">Resumen y balance del turno actual para <strong>{activeUser?.name || 'Usuario'}</strong>.</p>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Ventas Brutas",  value: fmtARS(totalVentas),    sub: `${shiftOrders.length} pedidos`,     icon: <DollarSign size={16}/>, color: "text-zinc-300",    bg: "bg-zinc-800/50" },
            { label: "Cobrado",        value: fmtARS(totalCobrado),   sub: "Efectivo + Digital",                icon: <CheckCircle2 size={16}/>, color: "text-emerald-400",bg: "bg-emerald-500/10" },
            { label: "Fiado / A Cobrar", value: fmtARS(totalPendiente), sub: `${pendingPaymentOrders.length} impagos`, icon: <AlertCircle size={16}/>, color: "text-red-400",  bg: "bg-red-500/10"  },
            { label: "Efectivo Caja",  value: fmtARS(efectivoEnCaja), sub: `Fondo: ${fmtARS(fondoFijo)}`,     icon: <Wallet size={16}/>,     color: "text-amber-400",   bg: "bg-amber-500/10"  },
            { label: "Digital",        value: fmtARS(totalDigital),   sub: "MP / Transferencia",                icon: <Smartphone size={16}/>, color: "text-sky-400",     bg: "bg-sky-500/10"     },
          ].map((card, idx) => (
            <div key={card.label} className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-4 ${idx === 4 ? "col-span-2 sm:col-span-1" : ""}`}>
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
            <p className="text-zinc-600 text-sm text-center py-4">Sin ventas procesadas aún.</p>
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

        {/* Deuda / Fiado del Turno */}
        <div className="bg-gradient-to-b from-red-950/30 to-zinc-900 border-2 border-red-800/60 rounded-2xl overflow-hidden shadow-lg shadow-red-950/20">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-400">
                <AlertCircle size={16} />
              </span>
              <div>
                <h2 className="text-sm font-black text-red-200 uppercase tracking-widest">
                  Fiado / A Cobrar del Turno ({pendingPaymentOrders.length})
                </h2>
                <p className="text-xs text-red-400/80 mt-0.5">
                  Pedidos entregados o despachados sin cobrar. No suman al efectivo en cajón y pasan a Cuentas Corrientes.
                </p>
              </div>
            </div>
            <span className="font-black text-xl text-red-400 tabular-nums">
              {fmtARS(totalPendiente)}
            </span>
          </div>

          {pendingPaymentOrders.length > 0 && (
            <div className="border-t border-red-900/40 divide-y divide-red-900/30 bg-zinc-950/40">
              {pendingPaymentOrders.map(order => (
                <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-white">#{order.id}</span>
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-600 text-white animate-pulse">
                        IMPAGO
                      </span>
                      <span className="text-[10px] text-zinc-400">{order.status}</span>
                    </div>
                    <p className="text-sm font-bold text-red-200 mt-0.5">{order.clientFirstName} {order.clientLastName}</p>
                    <p className="text-[11px] text-zinc-500">{order.phone || "Sin tel"} • {order.address}</p>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="font-black text-red-400 tabular-nums text-sm">{fmtARS(order.total)}</span>
                    <button
                      onClick={() => useOrdersStore.getState().updateOrderPaymentStatus(order.id, "pagado")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-black transition flex items-center gap-1"
                    >
                      <CheckCircle2 size={13} /> Cobrar ahora
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders Detail Accordion — solo completados */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowOrders(v => !v)}
            className="w-full flex items-center justify-between p-5 hover:bg-zinc-800/50 transition"
          >
            <div className="flex items-center gap-2">
              <ClipboardList size={16} className="text-zinc-400" />
              <span className="text-sm font-black text-zinc-200 uppercase tracking-widest">
                Pedidos Completados ({completedOrders.length})
              </span>
            </div>
            {showOrders ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
          </button>

          {showOrders && (
            <div className="border-t border-zinc-800 divide-y divide-zinc-800/60 max-h-72 overflow-y-auto no-scrollbar">
              {completedOrders.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-zinc-600">
                  <CheckCircle2 size={24} strokeWidth={1.5} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Sin pedidos completados aún</p>
                </div>
              ) : (
                <>
                  {completedOrders.slice(0, visibleOrders).map(order => (
                    <div key={order.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-zinc-500">#{order.id}</span>
                          <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full text-emerald-400 bg-emerald-500/10">Completado</span>
                        </div>
                        <p className="text-sm font-bold text-zinc-200 mt-0.5">{order.clientFirstName} {order.clientLastName}</p>
                        <p className="text-[11px] text-zinc-500">{order.paymentMethod}</p>
                      </div>
                      <span className="font-black text-white text-sm tabular-nums">{fmtARS(order.total)}</span>
                    </div>
                  ))}
                  {visibleOrders < completedOrders.length && (
                    <div className="py-4 flex flex-col items-center gap-2">
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        Mostrando {Math.min(visibleOrders, completedOrders.length)} de {completedOrders.length} pedidos
                      </p>
                      <button 
                        onClick={() => setVisibleOrders(prev => prev + 20)}
                        className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition active:scale-95"
                      >
                        Cargar más
                      </button>
                    </div>
                  )}
                </>
              )}
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
