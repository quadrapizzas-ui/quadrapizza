import React from 'react';
import { getBarStyle } from './DashboardComponents';

function fmtChartVal(v: number) {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000)    return `$${Math.round(v / 1000)}k`;
  return `$${v}`;
}

export function CustomPieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
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
        {data.map(d => (
          <div key={d.label} className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: d.color }} />
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{d.label}</p>
              <p className="text-lg font-black text-white leading-tight">{((d.value/total)*100).toFixed(1)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CustomBarChart({ data, maxValue }: { data: { label: string; value: number }[], maxValue: number }) {
  const safeMax = Math.max(maxValue, 1);

  return (
    <div className="w-full flex flex-col h-60 sm:h-64 mt-4">
      {/* Bars area with explicit flex-1 height */}
      <div className="flex-1 flex items-end gap-2 sm:gap-3 px-1 pb-1 border-b border-zinc-800/80">
        {data.map((d, idx) => {
          const pct = Math.min(Math.max((d.value / safeMax) * 100, 0), 100);
          const style = getBarStyle(d.value, safeMax);
          const hasVal = d.value > 0;

          return (
            <div key={`${d.label}-${idx}`} className="flex-1 h-full flex items-end justify-center group relative min-w-0">
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-8 z-30 transition-all duration-150 -translate-y-1 group-hover:translate-y-0 bg-zinc-900 border border-zinc-700 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-xl whitespace-nowrap">
                <span className="text-zinc-400 mr-1">{d.label}:</span>
                <span className="text-purple-300 font-bold">{fmtChartVal(d.value)}</span>
              </div>

              {/* Bar with calculated height */}
              <div 
                className={`w-full max-w-[44px] rounded-t-lg transition-all duration-500 ease-out border-t border-l border-r group-hover:brightness-125 cursor-pointer ${
                  hasVal ? "opacity-95 group-hover:opacity-100" : "opacity-30"
                }`}
                style={{ 
                  height: hasVal ? `${Math.max(pct, 8)}%` : "4px", 
                  background: hasVal ? style.background : "rgba(39, 39, 42, 0.4)",
                  borderColor: hasVal ? style.borderColor : "rgba(63, 63, 70, 0.4)",
                  boxShadow: hasVal ? `0 -4px 14px ${style.shadowColor}` : "none"
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Labels row */}
      <div className="flex gap-2 sm:gap-3 px-1 pt-2.5 shrink-0">
        {data.map((d, idx) => (
          <div key={`lbl-${d.label}-${idx}`} className="flex-1 text-center min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider block truncate">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}