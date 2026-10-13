"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useOrdersStore } from "@/lib/store/ordersStore";
import { useGastosStore, GastoCategoria, GastoTipo } from "@/lib/store/gastosStore";
import { useCierresStore } from "@/lib/store/cierresStore";
import { useProductsStore } from "@/lib/store/productsStore";
import { 
  TrendingUp, TrendingDown, DollarSign, Wallet, FileText, 
  Calendar, Plus, X, Pencil, Trash2, ArrowUpRight, ArrowDownRight, PackageOpen, ChevronDown,
  CreditCard, Banknote, QrCode, AlertTriangle, CheckCircle2, ShoppingBag, Receipt, Scale, AlertCircle
} from "lucide-react";

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

const GrowthBadge = ({ value }: { value: number | null }) => {
  if (value === null) return null;
  const isPos = value > 0;
  const isNeg = value < 0;
  if (!isPos && !isNeg) return null;
  const color = isPos ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20";
  const icon = isPos ? "▲" : "▼";
  return (
    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ml-2 shrink-0 ${color}`}>
      {icon} {Math.abs(value).toFixed(1)}%
    </span>
  );
};

const MonthlyEvolutionChart = ({ period, orders, gastos, products }: { period: string, orders: any[], gastos: any[], products: any[] }) => {
  const [yearStr, monthStr] = period.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const daysInMonth = new Date(year, month, 0).getDate();

  const weeks = [
    { name: "Semana 1", label: "Días 1 a 7", range: [1, 7] },
    { name: "Semana 2", label: "Días 8 a 14", range: [8, 14] },
    { name: "Semana 3", label: "Días 15 a 21", range: [15, 21] },
    { name: "Semana 4+", label: `Días 22 a ${daysInMonth}`, range: [22, daysInMonth] },
  ];

  const data = weeks.map(w => {
    const pOrders = orders.filter((o: any) => {
      if (o.status === "cancelado" || !o.createdAt?.startsWith(period)) return false;
      const day = new Date(o.createdAt).getDate();
      return day >= w.range[0] && day <= w.range[1];
    });

    const ingresos = pOrders
      .filter((o: any) => o.paymentStatus === "pagado")
      .reduce((acc: number, o: any) => acc + (o.total || 0), 0);

    let cmv = 0;
    pOrders.forEach((o: any) => {
      o.items?.forEach((it: any) => {
        const prod = products.find((p: any) => p.name?.toLowerCase().includes(it.name?.split(" ")[0]?.toLowerCase()));
        cmv += (prod?.cost || 0) * (it.quantity || 1);
      });
    });

    const pGastos = gastos.filter((g: any) => {
      if (!g.date?.startsWith(period)) return false;
      const day = new Date(g.date).getDate();
      return day >= w.range[0] && day <= w.range[1];
    });

    const egresos = cmv + pGastos.reduce((a: number, g: any) => a + (g.amount || 0), 0);

    return { ...w, ingresos, egresos };
  });

  const maxVal = Math.max(...data.map(d => Math.max(d.ingresos, d.egresos)), 1);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="font-black text-lg text-white flex items-center gap-2">
            <Calendar size={18} className="text-sky-400" />
            Evolución Semanal del Mes
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">Ingresos cobrados frente a egresos (CMV + gastos) por semana del período</p>
        </div>
        <div className="flex items-center gap-4 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-sky-500 rounded-full"></div>
            <span className="text-[11px] text-zinc-300 font-bold">Ingresos Cobrados</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>
            <span className="text-[11px] text-zinc-300 font-bold">Costos y Gastos</span>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-3 h-52 mt-4 border-b border-zinc-800 pb-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end items-center group relative h-full">
            <div className="w-full flex gap-1.5 items-end justify-center h-full pt-4">
              <div 
                className="w-1/2 max-w-[44px] bg-sky-500 rounded-t-lg hover:bg-sky-400 transition-all shadow-lg shadow-sky-950/40" 
                style={{ height: `${(d.ingresos / maxVal) * 100}%`, minHeight: d.ingresos > 0 ? '6px' : '0' }}
              ></div>
              <div 
                className="w-1/2 max-w-[44px] bg-rose-500 rounded-t-lg hover:bg-rose-400 transition-all shadow-lg shadow-rose-950/40" 
                style={{ height: `${(d.egresos / maxVal) * 100}%`, minHeight: d.egresos > 0 ? '6px' : '0' }}
              ></div>
            </div>
            <span className="text-[11px] text-zinc-200 font-bold mt-2">{d.name}</span>
            <span className="text-[9px] text-zinc-500 font-medium">{d.label}</span>
            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-zinc-950 border border-zinc-700 text-white text-xs p-3.5 rounded-2xl shadow-2xl whitespace-nowrap z-20 pointer-events-none transition-all -translate-y-2 group-hover:translate-y-0">
              <p className="font-black text-zinc-200 mb-1.5 border-b border-zinc-800 pb-1">{d.name} &bull; {d.label}</p>
              <p className="text-sky-400 font-bold flex justify-between gap-4"><span>Ingresos:</span> <span>{fmtARS(d.ingresos)}</span></p>
              <p className="text-rose-400 font-bold flex justify-between gap-4"><span>Egresos:</span> <span>{fmtARS(d.egresos)}</span></p>
              <div className="mt-1.5 pt-1.5 border-t border-zinc-800 flex justify-between gap-4">
                <span className="text-zinc-400 font-bold">Resultado Neto:</span>
                <span className={d.ingresos - d.egresos >= 0 ? "text-emerald-400 font-black" : "text-rose-400 font-black"}>
                  {fmtARS(d.ingresos - d.egresos)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnnualChart = ({ year, orders, gastos, products }: { year: string, orders: any[], gastos: any[], products: any[] }) => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  const data = months.map((m, i) => {
    const period = `${year}-${String(i + 1).padStart(2, "0")}`;
    const pOrders = orders.filter(o => o.status !== "cancelado" && o.createdAt.startsWith(period));
    const ingresos = pOrders.filter(o => o.paymentStatus === "pagado").reduce((acc, o) => acc + o.total, 0);
    
    let cmv = 0;
    pOrders.forEach((o: any) => {
      o.items?.forEach((it: any) => {
        const prod = products.find((p: any) => p.name.includes(it.name?.split(" ")[0]));
        cmv += (prod?.cost || 0) * (it.quantity || 1);
      });
    });

    const pGastos = gastos.filter(g => g.date.startsWith(period));
    const egresos = cmv + pGastos.reduce((a, g) => a + g.amount, 0);

    return { name: m, ingresos, egresos };
  });

  const maxVal = Math.max(...data.map(d => Math.max(d.ingresos, d.egresos)), 1);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
      <h2 className="font-black text-lg text-white mb-6">Comparativa Anual {year}</h2>
      <div className="flex items-end gap-2 h-48 mt-4 border-b border-zinc-800">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end items-center group relative h-full">
            {d.ingresos > 0 || d.egresos > 0 ? (
              <div className="w-full flex gap-1 items-end justify-center h-full pt-4">
                <div 
                  className="w-1/2 bg-sky-500 rounded-t-md hover:bg-sky-400 transition-colors" 
                  style={{ height: `${(d.ingresos / maxVal) * 100}%`, minHeight: d.ingresos > 0 ? '4px' : '0' }}
                ></div>
                <div 
                  className="w-1/2 bg-red-500 rounded-t-md hover:bg-red-400 transition-colors" 
                  style={{ height: `${(d.egresos / maxVal) * 100}%`, minHeight: d.egresos > 0 ? '4px' : '0' }}
                ></div>
              </div>
            ) : null}
            <span className="text-[10px] text-zinc-500 font-bold mt-2 absolute -bottom-6">{d.name}</span>
            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-zinc-800 border border-zinc-700 text-white text-xs p-3 rounded-xl shadow-2xl whitespace-nowrap z-10 pointer-events-none transition-all -translate-y-2 group-hover:translate-y-0">
              <p className="font-bold text-zinc-400 mb-1">{d.name} {year}</p>
              <p className="text-sky-400">Ingresos: {fmtARS(d.ingresos)}</p>
              <p className="text-red-400">Egresos: {fmtARS(d.egresos)}</p>
              <div className="mt-1 pt-1 border-t border-zinc-700">
                <p className={d.ingresos - d.egresos >= 0 ? "text-emerald-400 font-black" : "text-red-400 font-black"}>
                  Neto: {fmtARS(d.ingresos - d.egresos)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-6 mt-10 pt-4 border-t border-zinc-800/50">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-sky-500 rounded-full"></div><span className="text-xs text-zinc-400 font-bold">Ingresos Reales</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span className="text-xs text-zinc-400 font-bold">Costos + Gastos</span></div>
      </div>
    </div>
  );
};

export default function FinanzasPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "gastos" | "cierres" | "costos">("dashboard");
  const orders = useOrdersStore(s => s.orders);
  const { gastos, addGasto, updateGasto, deleteGasto } = useGastosStore();
  const cierres = useCierresStore(s => s.cierres);
  const products = useProductsStore(s => s.products);
  const updateProduct = useProductsStore(s => s.updateProduct);

  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editCostValue, setEditCostValue] = useState("");
  const [editPriceValue, setEditPriceValue] = useState("");

  const openEditProduct = (p: any) => {
    setEditingProduct(p);
    setEditCostValue(p.cost !== undefined && p.cost !== null ? String(p.cost) : "");
    setEditPriceValue(p.price || "");
  };

  const saveProductCost = () => {
    if (!editingProduct) return;
    const costNum = editCostValue.trim() ? Number(editCostValue.replace(/\D/g, '')) : 0;
    const priceStr = editPriceValue.startsWith("$") ? editPriceValue : `$${Number(editPriceValue.replace(/\D/g, '') || 0).toLocaleString("es-AR")}`;

    updateProduct(editingProduct.id, {
      cost: costNum,
      price: priceStr || editingProduct.price,
    });
    setEditingProduct(null);
  };

  const [selectedPeriod, setSelectedPeriod] = useState(() => new Date().toISOString().slice(0, 7));

  const filteredGastos = useMemo(() => gastos.filter(g => g.date.startsWith(selectedPeriod)), [gastos, selectedPeriod]);
  const filteredCierres = useMemo(() => cierres.filter(c => c.fecha_cierre.startsWith(selectedPeriod)), [cierres, selectedPeriod]);

  // --- OBTENER PERIODOS DISPONIBLES ---
  const availablePeriods = useMemo(() => {
    const months = new Set<string>();
    const years = new Set<string>();
    
    // Add current month/year
    const now = new Date();
    const currMonth = now.toISOString().slice(0, 7);
    const currYear = currMonth.slice(0, 4);
    months.add(currMonth);
    years.add(currYear);

    orders.forEach(o => {
      const m = o.createdAt.slice(0, 7);
      months.add(m);
      years.add(m.slice(0, 4));
    });
    gastos.forEach(g => {
      const m = g.date.slice(0, 7);
      months.add(m);
      years.add(m.slice(0, 4));
    });

    const sortedMonths = Array.from(months).sort().reverse();
    const sortedYears = Array.from(years).sort().reverse();

    const options: { value: string; label: string }[] = [];
    sortedMonths.forEach(m => {
      const [yy, mm] = m.split("-");
      const date = new Date(Number(yy), Number(mm) - 1, 1);
      const name = date.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
      options.push({ value: m, label: name.charAt(0).toUpperCase() + name.slice(1) });
    });
    sortedYears.forEach(y => {
      options.push({ value: y, label: `Todo el ${y}` });
    });

    return options;
  }, [orders, gastos]);

  // -- Modal para Gastos --
  const [showGastoModal, setShowGastoModal] = useState(false);
  const [editingGasto, setEditingGasto] = useState<any>(null);
  const [gastoForm, setGastoForm] = useState({
    concept: "",
    amount: "",
    type: "fijo" as GastoTipo,
    category: "Proveedores y Mercadería" as GastoCategoria,
    status: "pagado" as "pagado"|"pendiente",
  });

  const handleSaveGasto = () => {
    if (!gastoForm.concept || !gastoForm.amount) return;
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    if (editingGasto) {
      updateGasto(editingGasto.id, {
        concept: gastoForm.concept,
        amount: Number(gastoForm.amount),
        type: gastoForm.type,
        category: gastoForm.category,
        status: gastoForm.status,
      });
    } else {
      addGasto({
        concept: gastoForm.concept,
        amount: Number(gastoForm.amount),
        type: gastoForm.type,
        category: gastoForm.category,
        date: new Date().toISOString(),
        periodMonth: currentMonth,
        status: gastoForm.status,
      });
    }
    setShowGastoModal(false);
    setEditingGasto(null);
  };

  const openNewGasto = () => {
    setGastoForm({ concept: "", amount: "", type: "variable", category: "Proveedores y Mercadería", status: "pagado" });
    setEditingGasto(null);
    setShowGastoModal(true);
  };

  const openEditGasto = (g: any) => {
    setEditingGasto(g);
    setGastoForm({ concept: g.concept, amount: String(g.amount), type: g.type, category: g.category, status: g.status });
    setShowGastoModal(true);
  };

  // --- CALCULO METRICAS PERIODO ---
  const metrics = useMemo(() => {
    const calcForPeriod = (period: string) => {
      const pOrders = orders.filter(o => o.status !== "cancelado" && o.createdAt?.startsWith(period));
      const ingresosBrutos = pOrders.reduce((acc, o) => acc + (o.total || 0), 0);
      const ingresosPagados = pOrders.filter(o => o.paymentStatus === "pagado").reduce((acc, o) => acc + (o.total || 0), 0);
      const pendienteCobro = ingresosBrutos - ingresosPagados;

      let cmvTotal = 0;
      pOrders.forEach(o => {
        o.items?.forEach((it: any) => {
          const prod = products.find(p => p.name?.toLowerCase().includes(it.name?.split(" ")[0]?.toLowerCase())); 
          cmvTotal += (prod?.cost || 0) * (it.quantity || 1);
        });
      });

      const pGastos = gastos.filter(g => g.date?.startsWith(period));
      const gastosFijos = pGastos.filter(g => g.type === "fijo").reduce((a, g) => a + g.amount, 0);
      const gastosVariables = pGastos.filter(g => g.type === "variable").reduce((a, g) => a + g.amount, 0);
      
      const egresosTotales = gastosFijos + gastosVariables + cmvTotal;
      const margenBruto = ingresosPagados - cmvTotal;
      const margenBrutoPorc = ingresosPagados > 0 ? (margenBruto / ingresosPagados) * 100 : 0;
      const gananciaNeta = ingresosPagados - egresosTotales;
      const margenNeto = ingresosPagados > 0 ? (gananciaNeta / ingresosPagados) * 100 : 0;

      // Métodos de pago (Solo pedidos pagados)
      const paymentMethods = {
        efectivo: { label: "Efectivo", amount: 0, count: 0 },
        mercadopago: { label: "Mercado Pago / QR", amount: 0, count: 0 },
        transferencia: { label: "Transferencia Bancaria", amount: 0, count: 0 },
        otros: { label: "Otros / Tarjetas", amount: 0, count: 0 },
      };

      pOrders.forEach(o => {
        if (o.paymentStatus === "pagado") {
          const m = (o.paymentMethod || "efectivo").toLowerCase();
          if (m.includes("efectivo")) {
            paymentMethods.efectivo.amount += o.total;
            paymentMethods.efectivo.count++;
          } else if (m.includes("mp") || m.includes("mercado") || m.includes("qr")) {
            paymentMethods.mercadopago.amount += o.total;
            paymentMethods.mercadopago.count++;
          } else if (m.includes("transf")) {
            paymentMethods.transferencia.amount += o.total;
            paymentMethods.transferencia.count++;
          } else {
            paymentMethods.otros.amount += o.total;
            paymentMethods.otros.count++;
          }
        }
      });

      const totalPedidos = pOrders.length;
      const ticketPromedio = totalPedidos > 0 ? Math.round(ingresosBrutos / totalPedidos) : 0;
      const tasaCobro = ingresosBrutos > 0 ? (ingresosPagados / ingresosBrutos) * 100 : 0;

      // Porcentajes de egresos sobre el total de egresos
      const cmvPorc = egresosTotales > 0 ? (cmvTotal / egresosTotales) * 100 : 0;
      const fijosPorc = egresosTotales > 0 ? (gastosFijos / egresosTotales) * 100 : 0;
      const variablesPorc = egresosTotales > 0 ? (gastosVariables / egresosTotales) * 100 : 0;
      const tasaAbsorcion = ingresosPagados > 0 ? (egresosTotales / ingresosPagados) * 100 : 0;

      // Punto de equilibrio
      const puntoEquilibrio = margenBrutoPorc > 0 ? Math.round(gastosFijos / (margenBrutoPorc / 100)) : (gastosFijos + cmvTotal);
      const avanceEquilibrio = puntoEquilibrio > 0 ? Math.min(Math.round((ingresosPagados / puntoEquilibrio) * 100), 200) : 0;

      return { 
        ingresosBrutos, 
        ingresosPagados, 
        pendienteCobro,
        cmvTotal, 
        gastosFijos, 
        gastosVariables, 
        egresosTotales, 
        margenBruto,
        margenBrutoPorc,
        gananciaNeta, 
        margenNeto,
        paymentMethods,
        totalPedidos,
        ticketPromedio,
        tasaCobro,
        cmvPorc,
        fijosPorc,
        variablesPorc,
        tasaAbsorcion,
        puntoEquilibrio,
        avanceEquilibrio
      };
    };

    const current = calcForPeriod(selectedPeriod);
    
    const getPrevPeriod = (p: string) => {
      if (p.length === 4) return String(Number(p) - 1);
      const [y, m] = p.split("-").map(Number);
      if (m === 1) return `${y - 1}-12`;
      return `${y}-${String(m - 1).padStart(2, "0")}`;
    };
    const prev = calcForPeriod(getPrevPeriod(selectedPeriod));

    const getGrowth = (curr: number, prev: number) => {
      if (prev === 0) return null;
      return ((curr - prev) / Math.abs(prev)) * 100;
    };

    return { 
      ...current, 
      growth: {
        ingresosBrutos: getGrowth(current.ingresosBrutos, prev.ingresosBrutos),
        ingresosPagados: getGrowth(current.ingresosPagados, prev.ingresosPagados),
        gananciaNeta: getGrowth(current.gananciaNeta, prev.gananciaNeta)
      }
    };
  }, [orders, gastos, products, selectedPeriod]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#09090b]">
      {/* Header */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 relative">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Wallet size={20} className="text-emerald-500" /> Finanzas
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Control económico y rentabilidad</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href="/gerencia/deudores"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30 text-xs font-black transition"
          >
            <AlertCircle size={14} /> Cuentas por Cobrar (Deudores)
          </Link>
          <div className="relative">
            <select 
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-zinc-900 border border-zinc-700 text-white font-bold text-sm px-4 py-2 pr-10 rounded-xl focus:outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              {availablePeriods.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 px-5 border-b border-zinc-800/60 bg-zinc-950/80 flex gap-6 overflow-x-auto no-scrollbar">
        {[
          { id: "dashboard", label: "Resumen del Período" },
          { id: "gastos", label: "Gastos y Egresos" },
          { id: "costos", label: "Costos de Producto (CMV)" },
          { id: "cierres", label: "Cierres de Caja" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`py-3 text-sm font-black transition whitespace-nowrap border-b-2 ${
              activeTab === t.id ? "border-emerald-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5">
        
        {/* --- TAB: DASHBOARD --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* 5 KPIs Superiores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Ingresos Brutos */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={48} /></div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Facturación Bruta (Devengada)</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-black text-white">{fmtARS(metrics.ingresosBrutos)}</p>
                    <GrowthBadge value={metrics.growth.ingresosBrutos} />
                  </div>
                </div>
                <div className="mt-2 text-[11px] font-medium">
                  {metrics.pendienteCobro > 0 ? (
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      ⚠️ Fiado / Por cobrar: {fmtARS(metrics.pendienteCobro)}
                    </span>
                  ) : (
                    <span className="text-emerald-500 font-bold">100% Cobrado</span>
                  )}
                </div>
              </div>

              {/* Ingresos Pagados */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl relative overflow-hidden border-sky-900/30 flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-sky-500"><Wallet size={48} /></div>
                <div>
                  <p className="text-[10px] font-bold text-sky-400/80 uppercase tracking-widest mb-1">Efectivo Ingresado (Cobrado)</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-black text-sky-400">{fmtARS(metrics.ingresosPagados)}</p>
                    <GrowthBadge value={metrics.growth.ingresosPagados} />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] font-bold bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded border border-sky-500/20">
                    {metrics.tasaCobro.toFixed(1)}% efectividad cobro
                  </span>
                </div>
              </div>

              {/* Costos + Gastos */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingDown size={48} /></div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Costos + Gastos (Total)</p>
                  <p className="text-2xl font-black text-rose-400">{fmtARS(metrics.egresosTotales)}</p>
                </div>
                <div className="mt-2 text-[11px] text-zinc-500 font-medium">
                  CMV + Gastos Fijos y Variables
                </div>
              </div>

              {/* Margen Bruto */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={48} /></div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Margen Bruto (Mercadería)</p>
                  <p className="text-2xl font-black text-amber-400">{fmtARS(metrics.margenBruto)}</p>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[10px] font-black bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                    {metrics.margenBrutoPorc.toFixed(1)}% margen
                  </span>
                  <span className="text-[10px] text-zinc-500 font-medium">Cobrado - CMV</span>
                </div>
              </div>

              {/* Resultado Neto (Déficit / Superávit) */}
              <div className={`border rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between ${
                metrics.gananciaNeta >= 0 
                  ? "bg-zinc-900 border-emerald-900/40" 
                  : "bg-rose-950/20 border-rose-900/40"
              }`}>
                <div className={`absolute top-0 right-0 p-4 opacity-10 ${metrics.gananciaNeta >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  <Wallet size={48} />
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                    metrics.gananciaNeta >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}>
                    {metrics.gananciaNeta >= 0 ? "Ganancia Neta (Superávit)" : "Resultado Neto (Déficit)"}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className={`text-2xl font-black ${
                      metrics.gananciaNeta >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {fmtARS(metrics.gananciaNeta)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full shrink-0 border ${
                    metrics.gananciaNeta >= 0
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                  }`}>
                    {metrics.gananciaNeta >= 0 ? "+" : ""}{metrics.margenNeto.toFixed(1)}%
                  </span>
                  <GrowthBadge value={metrics.growth.gananciaNeta} />
                </div>
              </div>
            </div>

            {/* Grilla 50/50: Egresos a la Izquierda vs Ingresos por Canal a la Derecha */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* COLUMNA 1: Estructura de Egresos y Costos */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-black text-lg text-white flex items-center gap-2">
                      <PackageOpen size={18} className="text-amber-500"/> Estructura de Egresos
                    </h2>
                    <span className="text-xs font-black text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-xl border border-rose-500/20">
                      Total: {fmtARS(metrics.egresosTotales)}
                    </span>
                  </div>

                  {/* Barra Segmentada de Egresos */}
                  <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden flex mb-6 p-0.5 border border-zinc-800">
                    <div 
                      style={{ width: `${metrics.cmvPorc}%` }} 
                      className="bg-amber-500 h-full rounded-l-full transition-all" 
                      title={`CMV: ${metrics.cmvPorc.toFixed(1)}%`}
                    />
                    <div 
                      style={{ width: `${metrics.fijosPorc}%` }} 
                      className="bg-blue-500 h-full transition-all" 
                      title={`Gastos Fijos: ${metrics.fijosPorc.toFixed(1)}%`}
                    />
                    <div 
                      style={{ width: `${metrics.variablesPorc}%` }} 
                      className="bg-purple-500 h-full rounded-r-full transition-all" 
                      title={`Gastos Variables: ${metrics.variablesPorc.toFixed(1)}%`}
                    />
                  </div>

                  {/* Lista Detallada con Porcentajes */}
                  <div className="space-y-4">
                    {/* CMV */}
                    <div className="p-3.5 bg-zinc-950/60 rounded-2xl border border-zinc-800/80">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Costo Mercadería (CMV)
                        </span>
                        <div className="text-right">
                          <span className="font-black text-white text-sm">{fmtARS(metrics.cmvTotal)}</span>
                          <span className="text-[10px] text-zinc-500 font-bold ml-2">({metrics.cmvPorc.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${metrics.cmvPorc}%` }}></div>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-1.5">Insumos y materia prima directa de las ventas</p>
                    </div>

                    {/* Gastos Fijos */}
                    <div className="p-3.5 bg-zinc-950/60 rounded-2xl border border-zinc-800/80">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Gastos Fijos (Alquiler, Sueldos)
                        </span>
                        <div className="text-right">
                          <span className="font-black text-white text-sm">{fmtARS(metrics.gastosFijos)}</span>
                          <span className="text-[10px] text-zinc-500 font-bold ml-2">({metrics.fijosPorc.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${metrics.fijosPorc}%` }}></div>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-1.5">Estructura base, personal, servicios e impuestos</p>
                    </div>

                    {/* Gastos Variables */}
                    <div className="p-3.5 bg-zinc-950/60 rounded-2xl border border-zinc-800/80">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Gastos Variables (Eventuales)
                        </span>
                        <div className="text-right">
                          <span className="font-black text-white text-sm">{fmtARS(metrics.gastosVariables)}</span>
                          <span className="text-[10px] text-zinc-500 font-bold ml-2">({metrics.variablesPorc.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: `${metrics.variablesPorc}%` }}></div>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-1.5">Mantenimiento, equipamiento y compras esporádicas</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-medium">Tasa de absorción de ingresos:</span>
                  <span className={`font-black ${metrics.tasaAbsorcion > 100 ? "text-rose-400" : "text-emerald-400"}`}>
                    {metrics.tasaAbsorcion.toFixed(1)}% de lo cobrado
                  </span>
                </div>
              </div>

              {/* COLUMNA 2: Composición de Ingresos y Canales de Cobro */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-black text-lg text-white flex items-center gap-2">
                      <Wallet size={18} className="text-sky-400"/> Canales de Cobro
                    </h2>
                    <span className="text-xs font-black text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-xl border border-sky-500/20">
                      Cobrado: {fmtARS(metrics.ingresosPagados)}
                    </span>
                  </div>

                  {/* Barra Segmentada de Métodos de Pago */}
                  <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden flex mb-6 p-0.5 border border-zinc-800">
                    <div 
                      style={{ width: `${metrics.ingresosPagados > 0 ? (metrics.paymentMethods.efectivo.amount / metrics.ingresosPagados) * 100 : 0}%` }} 
                      className="bg-emerald-500 h-full rounded-l-full transition-all" 
                      title={`Efectivo: ${fmtARS(metrics.paymentMethods.efectivo.amount)}`}
                    />
                    <div 
                      style={{ width: `${metrics.ingresosPagados > 0 ? (metrics.paymentMethods.mercadopago.amount / metrics.ingresosPagados) * 100 : 0}%` }} 
                      className="bg-sky-500 h-full transition-all" 
                      title={`Mercado Pago: ${fmtARS(metrics.paymentMethods.mercadopago.amount)}`}
                    />
                    <div 
                      style={{ width: `${metrics.ingresosPagados > 0 ? (metrics.paymentMethods.transferencia.amount / metrics.ingresosPagados) * 100 : 0}%` }} 
                      className="bg-violet-500 h-full transition-all" 
                      title={`Transferencia: ${fmtARS(metrics.paymentMethods.transferencia.amount)}`}
                    />
                    <div 
                      style={{ width: `${metrics.ingresosPagados > 0 ? (metrics.paymentMethods.otros.amount / metrics.ingresosPagados) * 100 : 0}%` }} 
                      className="bg-zinc-600 h-full rounded-r-full transition-all" 
                      title={`Otros: ${fmtARS(metrics.paymentMethods.otros.amount)}`}
                    />
                  </div>

                  {/* Desglose por Método */}
                  <div className="space-y-3">
                    {/* Efectivo */}
                    <div className="p-3 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <Banknote size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Efectivo Físico</p>
                          <p className="text-[10px] text-zinc-500">{metrics.paymentMethods.efectivo.count} pedidos cobrados</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-emerald-400">{fmtARS(metrics.paymentMethods.efectivo.amount)}</p>
                        <p className="text-[10px] text-zinc-500 font-bold">
                          {metrics.ingresosPagados > 0 ? ((metrics.paymentMethods.efectivo.amount / metrics.ingresosPagados) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                    </div>

                    {/* Mercado Pago */}
                    <div className="p-3 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                          <QrCode size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Mercado Pago / QR</p>
                          <p className="text-[10px] text-zinc-500">{metrics.paymentMethods.mercadopago.count} pedidos cobrados</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-sky-400">{fmtARS(metrics.paymentMethods.mercadopago.amount)}</p>
                        <p className="text-[10px] text-zinc-500 font-bold">
                          {metrics.ingresosPagados > 0 ? ((metrics.paymentMethods.mercadopago.amount / metrics.ingresosPagados) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                    </div>

                    {/* Transferencias */}
                    <div className="p-3 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Transferencias / Tarjetas</p>
                          <p className="text-[10px] text-zinc-500">{metrics.paymentMethods.transferencia.count + metrics.paymentMethods.otros.count} pedidos cobrados</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-violet-400">
                          {fmtARS(metrics.paymentMethods.transferencia.amount + metrics.paymentMethods.otros.amount)}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-bold">
                          {metrics.ingresosPagados > 0 ? (((metrics.paymentMethods.transferencia.amount + metrics.paymentMethods.otros.amount) / metrics.ingresosPagados) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Métricas Rápidas Operativas */}
                <div className="mt-5 pt-4 border-t border-zinc-800/80 grid grid-cols-2 gap-3">
                  <div className="bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400 font-medium">Ticket Promedio:</span>
                    <span className="text-xs font-black text-white">{fmtARS(metrics.ticketPromedio)}</span>
                  </div>
                  <div className="bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400 font-medium">Total Pedidos:</span>
                    <span className="text-xs font-black text-sky-400">{metrics.totalPedidos} ped.</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Gráfico Evolutivo: Mensual Semanal si es mes puntual, Anual si es año completo */}
            {selectedPeriod.length === 4 ? (
              <AnnualChart year={selectedPeriod} orders={orders} gastos={gastos} products={products} />
            ) : (
              <MonthlyEvolutionChart period={selectedPeriod} orders={orders} gastos={gastos} products={products} />
            )}

            {/* Diagnóstico Ejecutivo & Punto de Equilibrio (Break-Even) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Scale size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-white flex items-center gap-2">
                      Punto de Equilibrio Operativo: {fmtARS(metrics.puntoEquilibrio)}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                      Facturación mínima estimada para que Quadra Pizza cubra la totalidad de los costos fijos y variables del período sin generar déficit.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Avance sobre Equilibrio</p>
                    <p className={`text-xl font-black ${metrics.ingresosPagados >= metrics.puntoEquilibrio ? "text-emerald-400" : "text-amber-400"}`}>
                      {metrics.avanceEquilibrio}% alcanzado
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-xs font-black border ${
                    metrics.ingresosPagados >= metrics.puntoEquilibrio
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {metrics.ingresosPagados >= metrics.puntoEquilibrio
                      ? "✓ En Zona de Superávit"
                      : `Faltan ${fmtARS(Math.max(metrics.puntoEquilibrio - metrics.ingresosPagados, 0))}`
                    }
                  </div>
                </div>
              </div>

              {/* Barra de progreso de Break-even */}
              <div className="w-full bg-zinc-950 rounded-full h-2 mt-5 overflow-hidden p-0.5 border border-zinc-800">
                <div 
                  className={`h-full rounded-full transition-all ${
                    metrics.ingresosPagados >= metrics.puntoEquilibrio ? "bg-emerald-500" : "bg-amber-500"
                  }`} 
                  style={{ width: `${Math.min(metrics.avanceEquilibrio, 100)}%` }}
                ></div>
              </div>
            </div>

          </div>
        )}

        {/* --- TAB: GASTOS --- */}
        {activeTab === "gastos" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-white">Registro de Gastos</h2>
              {selectedPeriod.length !== 4 && (
                <button onClick={openNewGasto} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition">
                  <Plus size={14} /> Nuevo Gasto
                </button>
              )}
            </div>
            
            {selectedPeriod.length === 4 ? (
              // VISTA ANUAL: Agrupado por categoría
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                {filteredGastos.length === 0 ? (
                  <div className="text-center text-zinc-600 font-bold text-sm py-4">No hay gastos en este año.</div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(
                      filteredGastos.reduce((acc, g) => {
                        acc[g.category] = (acc[g.category] || 0) + g.amount;
                        return acc;
                      }, {} as Record<string, number>)
                    ).sort(([,a], [,b]) => b - a).map(([cat, amount]) => (
                      <div key={cat} className="flex justify-between items-center border-b border-zinc-800/50 pb-3 last:border-0 last:pb-0">
                        <span className="text-sm font-bold text-zinc-400">{cat}</span>
                        <span className="font-black text-red-400">{fmtARS(amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // VISTA MENSUAL: Tabla detallada
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                {filteredGastos.length === 0 ? (
                  <div className="p-10 text-center text-zinc-600 font-bold text-sm">No hay gastos registrados en este período.</div>
                ) : (
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-950/50 border-b border-zinc-800">
                        <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fecha</th>
                        <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Concepto</th>
                        <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Categoría</th>
                        <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Monto</th>
                        <th className="px-5 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {filteredGastos.map(g => (
                        <tr key={g.id} className="hover:bg-zinc-800/30 transition">
                          <td className="px-5 py-4 text-xs font-bold text-zinc-400">
                            {new Date(g.date).toLocaleDateString("es-AR")}
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-bold text-zinc-200">{g.concept}</p>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${g.type === 'fijo' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
                              {g.type}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs font-medium text-zinc-400">{g.category}</td>
                          <td className="px-5 py-4 text-sm font-black text-red-400 tabular-nums">-{fmtARS(g.amount)}</td>
                          <td className="px-5 py-4 text-right">
                            <button onClick={() => openEditGasto(g)} className="p-1.5 text-zinc-600 hover:text-sky-400 transition"><Pencil size={14}/></button>
                            <button onClick={() => deleteGasto(g.id)} className="p-1.5 text-zinc-600 hover:text-red-400 transition ml-2"><Trash2 size={14}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- TAB: COSTOS --- */}
        {activeTab === "costos" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div>
                <h2 className="text-lg font-black text-white">Costos por Producto (CMV)</h2>
                <p className="text-sm text-zinc-400 font-medium mt-0.5">
                  Podés editar el costo de cualquier producto haciendo clic en su lápiz <span className="inline-flex items-center text-amber-400 font-bold mx-0.5"><Pencil size={12} className="inline mr-0.5" /></span> o gestionarlo desde el{" "}
                  <a href="/gerencia/catalogo/productos" className="text-emerald-400 underline underline-offset-4 hover:text-emerald-300">
                    Catálogo completo
                  </a>.
                </p>
              </div>
              <a
                href="/gerencia/catalogo/productos"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white hover:border-zinc-700 transition shrink-0 w-fit"
              >
                Catálogo de Productos
                <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(p => {
                const priceNum = Number(p.price.replace(/\D/g, '')) || 0;
                const costNum = p.cost || 0;
                const profit = priceNum - costNum;
                const margin = priceNum > 0 ? (profit / priceNum) * 100 : 0;
                
                return (
                  <div key={p.id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl flex flex-col justify-between group transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-sm truncate">{p.name}</h3>
                        <p className="text-xs text-zinc-500 font-medium">{p.category}</p>
                      </div>
                      <button
                        onClick={() => openEditProduct(p)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition shrink-0"
                        title="Editar costo y precio"
                      >
                        <Pencil size={15} />
                      </button>
                    </div>
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Precio Venta:</span>
                        <span className="font-bold text-white">{p.price}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Costo (CMV):</span>
                        <span className="font-bold text-amber-400">{costNum > 0 ? fmtARS(costNum) : <span className="text-zinc-600 font-normal italic">Sin costo</span>}</span>
                      </div>
                      <div className="flex justify-between text-xs pt-1 border-t border-zinc-800">
                        <span className="text-zinc-400">Margen:</span>
                        <span className={`font-black ${margin >= 40 ? 'text-emerald-400' : 'text-orange-400'}`}>{margin.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- TAB: CIERRES --- */}
        {activeTab === "cierres" && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-white">Historial de Cierres de Caja</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              {filteredCierres.length === 0 ? (
                <div className="p-10 text-center text-zinc-600 font-bold text-sm">No hay cierres de caja en este período.</div>
              ) : (
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-950/50 border-b border-zinc-800">
                      <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fecha/Hora</th>
                      <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Cajero</th>
                      <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Ventas Totales</th>
                      <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Efectivo Físico</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {filteredCierres.sort((a,b) => new Date(b.fecha_cierre).getTime() - new Date(a.fecha_cierre).getTime()).map(c => (
                      <tr key={c.id} className="hover:bg-zinc-800/30 transition">
                        <td className="px-5 py-4 text-xs font-bold text-zinc-400">
                          {new Date(c.fecha_cierre).toLocaleString("es-AR")}
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-bold text-zinc-200">{c.cajero_name || 'Admin'}</p>
                        </td>
                        <td className="px-5 py-4 text-sm font-black text-white text-right tabular-nums">{fmtARS(c.monto_total)}</td>
                        <td className="px-5 py-4 text-sm font-black text-emerald-400 text-right tabular-nums">
                          {fmtARS(c.efectivo_total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- Modal Nuevo Gasto --- */}
      {showGastoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-md max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 shrink-0">
              <h2 className="text-lg font-black text-white">{editingGasto ? "Editar Gasto" : "Registrar Gasto"}</h2>
              <button onClick={() => setShowGastoModal(false)} className="text-zinc-500 hover:text-white transition"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto no-scrollbar flex-1">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Concepto</label>
                <input value={gastoForm.concept} onChange={e=>setGastoForm({...gastoForm, concept: e.target.value})} placeholder="Ej. Alquiler Agosto" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Monto ($)</label>
                  <input type="number" value={gastoForm.amount} onChange={e=>setGastoForm({...gastoForm, amount: e.target.value})} placeholder="Ej. 15000" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Tipo</label>
                  <select value={gastoForm.type} onChange={e=>setGastoForm({...gastoForm, type: e.target.value as GastoTipo})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-emerald-500 appearance-none">
                    <option value="fijo">Fijo (recurrente)</option>
                    <option value="variable">Variable (eventual)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Categoría</label>
                <select value={gastoForm.category} onChange={e=>setGastoForm({...gastoForm, category: e.target.value as GastoCategoria})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-emerald-500 appearance-none">
                  <option value="Alquiler">Alquiler</option>
                  <option value="Sueldos y Personal">Sueldos y Personal</option>
                  <option value="Servicios: Gas">Servicios: Gas</option>
                  <option value="Servicios: Agua">Servicios: Agua</option>
                  <option value="Servicios: Electricidad e Internet">Servicios: Electricidad e Internet</option>
                  <option value="Impuestos y Tasas">Impuestos y Tasas</option>
                  <option value="Proveedores y Mercadería">Proveedores y Mercadería</option>
                  <option value="Inversiones y Eventuales">Inversiones y Eventuales</option>
                  <option value="Mantenimiento y Varios">Mantenimiento y Varios</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-zinc-800 bg-zinc-900/30 flex gap-3">
              <button onClick={() => setShowGastoModal(false)} className="flex-1 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold hover:text-white transition">Cancelar</button>
              <button onClick={handleSaveGasto} disabled={!gastoForm.concept || !gastoForm.amount} className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black transition shadow-lg shadow-emerald-900/20">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR COSTO DIRECTO */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Pencil size={16} className="text-amber-400" />
                  Editar Costo del Producto
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {editingProduct.name} &bull; <span className="text-zinc-500">{editingProduct.category}</span>
                </p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                  Precio de Venta
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">$</span>
                  <input
                    type="text"
                    value={editPriceValue}
                    onChange={(e) => setEditPriceValue(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-sky-500 transition"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-amber-400 uppercase tracking-widest mb-1.5">
                  Costo de Elaboración / CMV
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">$</span>
                  <input
                    type="text"
                    value={editCostValue}
                    onChange={(e) => setEditCostValue(e.target.value)}
                    className="w-full bg-zinc-900 border border-amber-500/40 rounded-xl pl-8 pr-4 py-2.5 text-sm font-black text-amber-300 focus:outline-none focus:border-amber-400 transition"
                    placeholder="0"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-zinc-500 mt-1 font-medium">
                  Insumos, materia prima y empaque asociados a este producto.
                </p>
              </div>

              {/* Cálculo en vivo de margen */}
              {(() => {
                const pNum = Number(editPriceValue.replace(/\D/g, "")) || 0;
                const cNum = Number(editCostValue.replace(/\D/g, "")) || 0;
                const ganancia = pNum - cNum;
                const margen = pNum > 0 ? ((ganancia / pNum) * 100).toFixed(1) : "0";
                return (
                  <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400 font-medium">Margen estimado:</span>
                      <span className={`font-black ${Number(margen) >= 40 ? "text-emerald-400" : "text-amber-400"}`}>
                        {margen}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400 font-medium">Ganancia por unidad:</span>
                      <span className={`font-bold ${ganancia >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {fmtARS(ganancia)}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              <a
                href="/gerencia/catalogo/productos"
                className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 underline underline-offset-4"
              >
                Catálogo completo <ArrowUpRight size={12} />
              </a>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveProductCost}
                  className="px-5 py-2 rounded-xl text-xs font-black text-black bg-amber-400 hover:bg-amber-300 transition shadow-lg shadow-amber-400/20"
                >
                  Guardar Costo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
