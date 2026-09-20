"use client";

import React from "react";
import {
  ShieldCheck, UserPlus, Trash2, Edit3, Key, BadgeCheck, Circle, Users, X, AlertTriangle
} from "lucide-react";
import { useAuthStore, MockUser } from "@/lib/store/authStore";

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
  const { users, setUsers } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<MockUser | null>(null);
  
  // Form state
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("Recepción");
  const [pin, setPin] = React.useState("");
  const [active, setActive] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState("");

  const activeCount   = users.filter(u => u.active).length;
  const inactiveCount = users.filter(u => !u.active).length;

  const openModal = (user?: MockUser) => {
    setErrorMsg("");
    if (user) {
      setEditingUser(user);
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setPin(user.pin);
      setActive(user.active);
    } else {
      setEditingUser(null);
      setName("");
      setEmail("");
      setRole("Recepción");
      setPin("");
      setActive(true);
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name || !email || !pin || pin.length !== 4) {
      setErrorMsg("Completa los datos y asegúrate que el PIN tenga 4 dígitos.");
      return;
    }

    // Validar PIN único
    const pinExists = users.find(u => u.pin === pin && u.id !== editingUser?.id);
    if (pinExists) {
      setErrorMsg("El PIN ingresado ya está en uso por otro usuario. Debe ser único.");
      return;
    }

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, name, email, role, pin, active } : u));
    } else {
      const newId = Math.max(...users.map(u => u.id), 0) + 1;
      setUsers([...users, { id: newId, name, email, role, pin, active }]);
    }
    setIsModalOpen(false);
  };

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
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-black rounded-xl shadow-lg shadow-purple-900/20 transition active:scale-95 w-full sm:w-auto"
        >
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
              <button 
                onClick={() => openModal(u)}
                className="flex-1 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-500 hover:text-white hover:border-zinc-700 transition flex items-center justify-center gap-1.5 active:scale-95"
              >
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

      {/* ── Modal Crear/Editar ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-black text-white">{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex gap-2 items-start">
                <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-red-400">{errorMsg}</p>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Nombre</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-purple-500/50" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-purple-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Rol</label>
                  <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-purple-500/50">
                    <option value="Recepción">Recepción</option>
                    <option value="Cocina">Cocina</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Gerencia">Gerencia</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">PIN (4 dígitos)</label>
                  <input type="text" maxLength={4} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white outline-none focus:border-purple-500/50 font-mono tracking-widest" />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="active" checked={active} onChange={e => setActive(e.target.checked)} className="rounded bg-zinc-950 border-zinc-800 text-purple-500" />
                <label htmlFor="active" className="text-sm font-bold text-zinc-300">Usuario Activo</label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl font-bold text-zinc-400 bg-zinc-800 hover:bg-zinc-700 transition">Cancelar</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl font-black text-white bg-purple-600 hover:bg-purple-500 transition shadow-lg shadow-purple-900/30">Guardar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
