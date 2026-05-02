"use client";

import React, { useState } from "react";
import {
  ShieldCheck, UserPlus, Trash2, Edit3, Key, BadgeCheck, Circle, Users,
} from "lucide-react";

const INITIAL_USERS = [
  { id: 1, name: "Hector Zanier", role: "Gerencia",  email: "hector@quadrapizza.com", pin: "****", active: true  },
  { id: 2, name: "Ana Maria",     role: "Recepción", email: "ana@quadrapizza.com",    pin: "1234", active: true  },
  { id: 3, name: "Carlos Gomez", role: "Cocina",    email: "carlos@quadrapizza.com", pin: "1234", active: true  },
  { id: 4, name: "Mario Rossi",  role: "Delivery",  email: "mario@quadrapizza.com",  pin: "1234", active: false },
];

const roleColors: Record<string, string> = {
  "Gerencia":  "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Recepción": "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "Cocina":    "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Delivery":  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const roleInitialBg: Record<string, string> = {
  "Gerencia":  "bg-purple-600",
  "Recepción": "bg-sky-600",
  "Cocina":    "bg-orange-600",
  "Delivery":  "bg-emerald-600",
};

export default function GerenciaUsuariosPage() {
  const [users, setUsers] = useState(INITIAL_USERS);

  const activeCount   = users.filter(u => u.active).length;
  const inactiveCount = users.filter(u => !u.active).length;

  return (
  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Header ── */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Users size={20} className="text-purple-400" /> Gestión de Personal
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Control de accesos y perfiles</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-black rounded-xl shadow-lg shadow-purple-900/20 transition active:scale-95 w-full sm:w-auto">
          <UserPlus size={16} />
          Nuevo Usuario
        </button>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5 sm:space-y-6">

      {/* ── Stats strip ────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 sm:p-4 text-center">
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Total</p>
          <p className="font-black text-xl text-white tabular-nums">{users.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 sm:p-4 text-center">
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Activos</p>
          <p className="font-black text-xl text-emerald-400 tabular-nums">{activeCount}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 sm:p-4 text-center">
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Inactivos</p>
          <p className="font-black text-xl text-zinc-500 tabular-nums">{inactiveCount}</p>
        </div>
      </div>

      {/* ── Security notice ────────────────────────────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-5 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-100 leading-tight">Seguridad por PIN</h3>
          <p className="text-zinc-500 text-xs font-medium mt-0.5 leading-snug">
            Cada usuario tiene un PIN único para acceder a su módulo correspondiente.
          </p>
        </div>
      </div>

      {/* ── User cards grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {users.map(u => (
          <div
            key={u.id}
            className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:border-zinc-700 transition relative overflow-hidden ${!u.active ? "opacity-55" : ""}`}
          >
            {/* Status badge */}
            {!u.active && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-zinc-800 rounded-full border border-zinc-700">
                <Circle size={7} className="fill-zinc-600 text-zinc-600" />
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Inactivo</span>
              </div>
            )}

            {/* Avatar + role */}
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-2xl ${roleInitialBg[u.role] || "bg-zinc-700"} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                {u.name.charAt(0)}
              </div>
              <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${roleColors[u.role] || "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
                {u.role}
              </div>
            </div>

            {/* Info */}
            <div>
              <h4 className="text-white font-bold text-base flex items-center gap-1.5 leading-tight">
                {u.name}
                {u.active && <BadgeCheck size={15} className="text-purple-400 shrink-0" />}
              </h4>
              <p className="text-zinc-500 text-xs font-medium mt-0.5 truncate">{u.email}</p>
            </div>

            {/* PIN */}
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key size={13} className="text-zinc-600" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">PIN</span>
              </div>
              <span className="font-mono font-black text-zinc-300 tracking-[4px] text-sm">{u.pin}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
              <button className="flex-1 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-500 hover:text-white hover:border-zinc-700 transition flex items-center justify-center gap-1.5 active:scale-95">
                <Edit3 size={13} /> Editar
              </button>
              <button className="w-11 h-10 flex items-center justify-center bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-700 hover:text-red-500 hover:border-red-500/30 transition active:scale-95">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      </div>
    </div>
  );
}
