import React from "react";
import { MockOrder } from "@/types/models";
import { getBusinessDay } from "@/lib/businessDay";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export type Timeframe = "Hoy" | "Semanal" | "Mensual" | "Anual";

export function filterOrdersByTimeframe(orders: MockOrder[], tf: Timeframe) {
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

export function KpiCard({ title, value, icon: Icon, color, trend }: {
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

export function getBarStyle(val: number, max: number) {
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

export function TimeframeSelector({ value, onChange }: { value: Timeframe, onChange: (v: Timeframe) => void }) {
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
