"use client";

import React, { useState, useEffect } from "react";
import { Search, AlertTriangle, CheckCircle2, Minus, Plus, ArrowUpDown, TrendingDown, Package, Save, RotateCcw, MessageCircle, Settings } from "lucide-react";

const MOCK_STOCK = [
  { id: 1, name: "Masa de Pizza",       unit: "unidades", current: 12,  min: 10, category: "Bases"    },
  { id: 2, name: "Muzzarella",          unit: "kg",       current: 3.5, min: 5,  category: "Lácteos"  },
  { id: 3, name: "Salsa de Tomate",     unit: "litros",   current: 8,   min: 4,  category: "Salsas"   },
  { id: 4, name: "Jamón Cocido",        unit: "kg",       current: 1.2, min: 3,  category: "Fiambres" },
  { id: 5, name: "Coca-Cola 1.5L",      unit: "unidades", current: 24,  min: 12, category: "Bebidas"  },
  { id: 6, name: "Pan de Hamburguesa",  unit: "unidades", current: 6,   min: 15, category: "Bases"    },
  { id: 7, name: "Cheddar Feteado",     unit: "paquetes", current: 8,   min: 5,  category: "Lácteos"  },
  { id: 8, name: "Huevos",              unit: "docenas",  current: 1,   min: 3,  category: "Básicos"  },
];

type SortKey = "name" | "status" | "category";

export default function StockRapidoPage() {
  const [stock, setStock] = useState(MOCK_STOCK);
  const [pendingChanges, setPendingChanges] = useState<Record<number, string | number>>({});
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("status");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [managerPhone, setManagerPhone] = useState("+5493513517493");
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [showPhoneConfirm, setShowPhoneConfirm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("quadra_manager_phone");
    if (saved) setManagerPhone(saved);
  }, []);

  const categories = [...new Set(stock.map(s => s.category))];

  const filtered = stock
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    .filter(s => !activeCategory || s.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === "status") return (a.current / a.min) - (b.current / b.min);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return a.category.localeCompare(b.category);
    });

  const criticalCount = stock.filter(s => s.current <= s.min).length;
  const totalItems = stock.length;
  const healthyCount = totalItems - criticalCount;
  const pendingCount = Object.keys(pendingChanges).length;

  function getEffectiveValue(item: typeof MOCK_STOCK[0]) {
    return pendingChanges[item.id] !== undefined ? pendingChanges[item.id] : item.current;
  }

  function getEffectiveValueNum(val: string | number | undefined, current: number) {
    if (val === undefined || val === "") return current;
    const parsed = Number(String(val).replace(",", "."));
    return isNaN(parsed) ? current : parsed;
  }

  function adjustPending(id: number, sign: number) {
    setPendingChanges(prev => {
      const item = stock.find(s => s.id === id)!;
      const step = ["kg", "litros"].includes(item.unit.toLowerCase()) ? 0.1 : 1;
      const delta = sign * step;
      const currentVal = getEffectiveValueNum(prev[id], item.current);
      const newVal = Math.max(0, +(currentVal + delta).toFixed(3));
      if (newVal === item.current) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newVal };
    });
  }

  function setPendingValue(id: number, val: string) {
    setPendingChanges(prev => {
      // Allow raw string state so users can freely type "0." or "0,2"
      return { ...prev, [id]: val };
    });
  }

  function applyChanges() {
    setStock(prev => prev.map(s => {
      if (pendingChanges[s.id] !== undefined) {
        return { ...s, current: getEffectiveValueNum(pendingChanges[s.id], s.current) };
      }
      return s;
    }));
    setPendingChanges({});
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  }

  function discardChanges() {
    setPendingChanges({});
  }

  const handleReportCritical = () => {
    const criticalItems = stock.filter(s => s.current <= s.min);
    if (criticalItems.length === 0) return;

    const message = `Hola Hector, te paso el reporte de stock critico actual:\n\n${criticalItems.map(item => `• ${item.name}: ${item.current} ${item.unit} (Min: ${item.min})`).join("\n")}\n\nPor favor, revisar para reposicion.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${managerPhone.replace(/\D/g, "")}?text=${encodedMessage}`, "_blank");
  };

  const getPercentage = (current: number, min: number) => Math.min(100, (current / (min * 2)) * 100);

  const getStatusColor = (current: number, min: number) => {
    const ratio = current / min;
    if (ratio <= 0.5) return { text: "text-red-400", bg: "bg-red-500", badge: "bg-red-500/15 text-red-400 border-red-500/20" };
    if (ratio <= 1) return { text: "text-amber-400", bg: "bg-amber-500", badge: "bg-amber-500/15 text-amber-400 border-amber-500/20" };
    return { text: "text-emerald-400", bg: "bg-emerald-500", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" };
  };

  const getStatusLabel = (current: number, min: number) => {
    if (current / min <= 0.5) return "Urgente";
    if (current <= min) return "Bajo";
    return "OK";
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">

      {/* Success Toast */}
      <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-lg shadow-emerald-900/40 transition-all duration-500 ${showSuccess ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
        <CheckCircle2 size={16} />
        Stock actualizado correctamente
      </div>

      {/* Header */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Stock Rápido</h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Consulta y ajuste de inventario</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {criticalCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle size={14} className="text-red-400" />
                <span className="text-xs font-black text-red-400 hidden sm:inline">{criticalCount} critico{criticalCount > 1 ? "s" : ""}</span>
                <span className="text-xs font-black text-red-400 sm:hidden">{criticalCount}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1 bg-zinc-900 rounded-xl p-1 border border-zinc-800">
              <button 
                onClick={handleReportCritical}
                disabled={criticalCount === 0}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest transition"
              >
                <MessageCircle size={12} className="sm:w-[14px] sm:h-[14px]" />
                <span className="hidden sm:inline">Reportar</span>
                <span className="sm:hidden">Wsp</span>
              </button>
              <button
                onClick={() => setIsEditingPhone(true)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition"
                title="Editar número destino"
              >
                <Settings size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-2.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/15 flex items-center justify-center">
              <Package size={16} className="text-sky-400" />
            </div>
            <div>
              <p className="text-lg font-black text-white leading-none tabular-nums">{totalItems}</p>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Insumos</p>
            </div>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-2.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-lg font-black text-emerald-400 leading-none tabular-nums">{healthyCount}</p>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">En Stock</p>
            </div>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-2.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/15 flex items-center justify-center">
              <TrendingDown size={16} className="text-red-400" />
            </div>
            <div>
              <p className="text-lg font-black text-red-400 leading-none tabular-nums">{criticalCount}</p>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Críticos</p>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar insumo..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-orange-500/60 transition" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${!activeCategory ? "bg-orange-600 text-white border-orange-600" : "bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"}`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${activeCategory === cat ? "bg-zinc-700 text-white border-zinc-700" : "bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table/List */}
      <div className={`flex-1 overflow-y-auto no-scrollbar ${pendingCount > 0 ? "pb-20" : ""}`}>
        {/* Table Header */}
        <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/60 px-5 py-2 hidden sm:grid sm:grid-cols-[1fr_100px_160px_80px_140px] gap-4 items-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Insumo</span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Categoria</span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nivel</span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Estado</span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Ajustar</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-zinc-800/50">
          {filtered.map(item => {
            const isCritical = item.current <= item.min;
            const status = getStatusColor(item.current, item.min);
            const pct = getPercentage(item.current, item.min);
            const effectiveVal = getEffectiveValue(item);
            const effectiveValNum = getEffectiveValueNum(pendingChanges[item.id], item.current);
            const hasPending = pendingChanges[item.id] !== undefined;
            const diff = hasPending ? +(effectiveValNum - item.current).toFixed(3) : 0;

            return (
              <div key={item.id} className={`group px-5 py-3.5 transition-colors hover:bg-zinc-900/50 ${isCritical ? "bg-red-950/10" : ""} ${hasPending ? "!bg-orange-950/10 border-l-2 border-l-orange-500" : ""}`}>
                {/* Desktop Row */}
                <div className="hidden sm:grid sm:grid-cols-[1fr_100px_160px_80px_140px] gap-4 items-center">
                  {/* Name */}
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-8 rounded-full ${status.bg} shrink-0`} />
                    <div>
                      <h3 className="font-bold text-sm text-white leading-tight">{item.name}</h3>
                      <p className="text-[10px] text-zinc-500 font-medium mt-0.5">mín. {item.min} {item.unit}</p>
                    </div>
                  </div>
                  {/* Category */}
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.category}</span>
                  {/* Level Bar */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${status.bg}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex flex-col items-end justify-center w-[55px] shrink-0">
                      <span className={`text-sm font-black tabular-nums leading-none ${status.text}`}>{item.current}</span>
                      <span className="text-[9px] text-zinc-500 font-bold mt-1 leading-none">{item.unit}</span>
                    </div>
                  </div>
                  {/* Status Badge */}
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${status.badge}`}>
                      {getStatusLabel(item.current, item.min)}
                    </span>
                  </div>
                  {/* Adjust */}
                  <div className="flex items-center justify-end gap-2">
                    {hasPending && (
                      <span className={`text-[10px] font-black shrink-0 ${diff > 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {diff > 0 ? `+${diff}` : diff}
                      </span>
                    )}
                    <div className={`flex items-center rounded-lg border transition-colors shrink-0 ${hasPending ? "bg-orange-950/30 border-orange-500/40" : "bg-zinc-800/80 border-zinc-700/50"}`}>
                      <button onClick={() => adjustPending(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-l-lg transition active:scale-90">
                        <Minus size={13} />
                      </button>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={effectiveVal}
                        onChange={(e) => setPendingValue(item.id, e.target.value.replace(/[^0-9.,]/g, ""))}
                        className={`w-16 bg-transparent text-center text-sm font-black outline-none tabular-nums border-x ${hasPending ? "text-orange-400 border-orange-500/30" : "text-white border-zinc-700/50"}`}
                      />
                      <button onClick={() => adjustPending(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-r-lg transition active:scale-90">
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Card */}
                <div className="sm:hidden">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-1 h-10 rounded-full ${status.bg} shrink-0`} />
                      <div>
                        <h3 className="font-bold text-sm text-white leading-tight">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{item.category}</span>
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${status.badge}`}>
                            {getStatusLabel(item.current, item.min)}
                          </span>
                          {hasPending && (
                            <span className={`text-[9px] font-black ${diff > 0 ? "text-emerald-400" : "text-red-400"}`}>
                              {diff > 0 ? `+${diff}` : diff}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-zinc-500 font-medium">{item.unit} · mín. {item.min}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${status.bg}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                    <div className={`flex items-center rounded-lg border ${hasPending ? "bg-orange-950/30 border-orange-500/40" : "bg-zinc-800/80 border-zinc-700/50"}`}>
                      <button onClick={() => adjustPending(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-l-lg transition active:scale-90">
                        <Minus size={13} />
                      </button>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={effectiveVal}
                        onChange={(e) => setPendingValue(item.id, e.target.value.replace(/[^0-9.,]/g, ""))}
                        className={`w-14 bg-transparent text-center text-sm font-black outline-none tabular-nums border-x ${hasPending ? "text-orange-400 border-orange-500/30" : "text-white border-zinc-700/50"}`}
                      />
                      <button onClick={() => adjustPending(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-r-lg transition active:scale-90">
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-700 gap-2">
            <Package size={32} className="opacity-20" />
            <p className="font-bold text-xs uppercase tracking-widest">Sin resultados</p>
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar - Apply Changes */}
      <div className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-400 ${pendingCount > 0 ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}`}>
        <div className="mx-3 mb-3 px-4 py-3 bg-zinc-900/95 backdrop-blur-md border border-orange-500/30 rounded-2xl shadow-xl shadow-black/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0">
              <Save size={16} className="text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{pendingCount} cambio{pendingCount > 1 ? "s" : ""} pendiente{pendingCount > 1 ? "s" : ""}</p>
              <p className="text-[10px] text-zinc-500 font-medium">Revisá y confirmá los ajustes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={discardChanges}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 bg-zinc-800/50 transition active:scale-95"
            >
              <RotateCcw size={12} />
              Descartar
            </button>
            <button
              onClick={applyChanges}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-orange-600 hover:bg-orange-500 border border-orange-500 transition active:scale-95 shadow-lg shadow-orange-900/30"
            >
              <CheckCircle2 size={13} />
              Actualizar Stock
            </button>
          </div>
        </div>
      </div>
      {/* Phone Settings Modal */}
      {isEditingPhone && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-zinc-800/60 bg-zinc-900/50">
              <h3 className="font-black text-white text-lg">Número de Reportes</h3>
              <p className="text-xs font-medium text-zinc-400 mt-1">Telefono de Hector para solicitar insumos.</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowPhoneConfirm(true); }} className="p-5 space-y-4">
              <label className="block">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">WhatsApp Destino</span>
                <input
                  type="text"
                  value={managerPhone}
                  onChange={e => setManagerPhone(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-green-500 transition-colors"
                  placeholder="+549..."
                  required
                />
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsEditingPhone(false)} className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition">Cancelar</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-white bg-green-600 hover:bg-green-500 transition">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Phone Confirmation Modal */}
      {showPhoneConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xs shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-white font-black text-lg mb-2">¿Confirmar número?</h3>
              <p className="text-zinc-500 text-xs font-bold leading-relaxed">
                Los reportes de stock se enviarán al número <span className="text-zinc-300">{managerPhone}</span>.
              </p>
            </div>
            <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 flex gap-2">
              <button 
                onClick={() => setShowPhoneConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-zinc-900 text-zinc-400 font-bold text-xs hover:text-white transition"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  localStorage.setItem("quadra_manager_phone", managerPhone);
                  setIsEditingPhone(false);
                  setShowPhoneConfirm(false);
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/20"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
