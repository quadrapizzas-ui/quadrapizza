"use client";

import React, { useState } from "react";
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Key,
  BadgeCheck,
  Circle
} from "lucide-react";

const INITIAL_USERS = [
  { id: 1, name: "Hector Zanier", role: "Gerencia", email: "hector@quadrapizza.com", pin: "****", active: true },
  { id: 2, name: "Ana Maria", role: "Recepción", email: "ana@quadrapizza.com", pin: "1234", active: true },
  { id: 3, name: "Carlos Gomez", role: "Cocina", email: "carlos@quadrapizza.com", pin: "1234", active: true },
  { id: 4, name: "Mario Rossi", role: "Delivery", email: "mario@quadrapizza.com", pin: "1234", active: false },
];

export default function GerenciaUsuariosPage() {
  const [users, setUsers] = useState(INITIAL_USERS);

  const roleColors: Record<string, string> = {
    "Gerencia": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "Recepción": "bg-sky-500/10 text-sky-400 border-sky-500/20",
    "Cocina": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "Delivery": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Gestión de Personal</h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-1">Control de accesos y perfiles</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm font-black rounded-xl shadow-lg shadow-purple-900/20 transition active:scale-95">
          <UserPlus size={18} />
          Nuevo Usuario
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl flex items-center gap-6 shadow-sm">
         <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
            <ShieldCheck size={28} />
         </div>
         <div className="flex-1">
            <h3 className="text-zinc-100 font-bold text-lg leading-tight">Seguridad por PIN</h3>
            <p className="text-zinc-500 text-sm mt-1 max-w-lg">
               Cada usuario tiene un PIN único para acceder a su módulo correspondiente. Recordá gestionar las claves de manera segura.
            </p>
         </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {users.map(u => (
           <div key={u.id} className={`bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col gap-5 shadow-sm transition-all hover:border-zinc-700 relative overflow-hidden ${!u.active ? "opacity-60" : ""}`}>
              <div className="flex justify-between items-start">
                 <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-black text-xl">
                    {u.name.charAt(0)}
                 </div>
                 <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${roleColors[u.role]}`}>
                    {u.role}
                 </div>
              </div>
              
              <div>
                 <h4 className="text-white font-bold text-lg flex items-center gap-2">
                    {u.name}
                    {u.active && <BadgeCheck size={16} className="text-purple-500" />}
                 </h4>
                 <p className="text-zinc-500 text-xs font-medium">{u.email}</p>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Key size={14} className="text-zinc-600" />
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">PIN de acceso</span>
                 </div>
                 <span className="font-mono font-black text-zinc-300 tracking-[4px]">{u.pin}</span>
              </div>

              <div className="flex gap-2 pt-2">
                 <button className="flex-1 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-500 hover:text-white transition flex items-center justify-center gap-2">
                    <Edit3 size={14} /> Editar
                 </button>
                 <button className="w-11 h-11 flex items-center justify-center bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-700 hover:text-red-500 transition">
                    <Trash2 size={14} />
                 </button>
              </div>

              {!u.active && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 bg-zinc-800 rounded-full border border-zinc-700">
                   <Circle size={8} className="fill-zinc-600 text-zinc-600" />
                   <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Inactivo</span>
                </div>
              )}
           </div>
         ))}
      </div>

    </div>
  );
}
