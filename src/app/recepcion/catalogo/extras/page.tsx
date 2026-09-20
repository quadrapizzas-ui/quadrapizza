"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProductsStore, type Extra } from "@/lib/store/productsStore";
import { PlusCircle, Edit3, Trash2, Check, X, Search, Plus, ArrowLeft } from "lucide-react";

export default function ExtrasAdminPage() {
  const pathname = usePathname();
  const basePath = pathname.replace(/\/extras$/, "");
  const { extras, setExtras } = useProductsStore();
  const [search, setSearch] = useState("");
  
  // States for editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  // States for creating new
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const filtered = extras.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  const handleEdit = (e: Extra) => {
    setEditingId(e.id);
    setEditName(e.name);
    setEditPrice(e.price.toString());
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) return;
    setExtras(extras.map(e => e.id === id ? { ...e, name: editName, price: Number(editPrice) || 0 } : e));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este extra?")) {
      setExtras(extras.filter(e => e.id !== id));
    }
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const newExtra: Extra = {
      id: newName.toLowerCase().replace(/\s+/g, '-'),
      name: newName,
      price: Number(newPrice) || 0,
      available: true,
      applyToCategories: []
    };
    setExtras([...extras, newExtra]);
    setIsCreating(false);
    setNewName("");
    setNewPrice("");
  };

  const toggleAvailable = (id: string) => {
    setExtras(extras.map(e => e.id === id ? { ...e, available: !e.available } : e));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Header ── */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={basePath} className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition shrink-0">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <PlusCircle size={20} className="text-pink-400" /> Extras
            </h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Gestión de extras y agregados</p>
          </div>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition"
        >
          <Plus size={14} /> Nuevo Extra
        </button>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            type="text"
            placeholder="Buscar extra..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-zinc-100 placeholder:text-zinc-700 outline-none focus:border-pink-500/50 transition"
          />
        </div>

        {/* Creation Form */}
        {isCreating && (
          <div className="bg-zinc-900 border border-pink-500/30 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Nombre del Extra</label>
              <input 
                type="text" 
                value={newName} 
                onChange={e => setNewName(e.target.value)}
                autoFocus
                placeholder="Ej. Huevo frito"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 outline-none focus:border-pink-500/50 transition"
              />
            </div>
            <div className="flex-1 w-full sm:max-w-[150px]">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Precio ($)</label>
              <input 
                type="number" 
                value={newPrice} 
                onChange={e => setNewPrice(e.target.value)}
                placeholder="0"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 outline-none focus:border-pink-500/50 transition"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <button onClick={() => setIsCreating(false)} className="flex-1 sm:flex-none p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition flex items-center justify-center">
                <X size={18} />
              </button>
              <button onClick={handleCreate} className="flex-1 sm:flex-none p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white transition flex items-center justify-center">
                <Check size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Desktop Table & Mobile Cards */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse whitespace-nowrap hidden md:table">
              <thead>
                <tr className="bg-zinc-950/60 border-b border-zinc-800">
                  <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nombre</th>
                  <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Precio</th>
                  <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estado</th>
                  <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filtered.map(e => (
                  <tr key={e.id} className="group hover:bg-zinc-800/30 transition">
                    <td className="px-5 py-3.5">
                      {editingId === e.id ? (
                        <input 
                          type="text" 
                          value={editName} 
                          onChange={(ev) => setEditName(ev.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-pink-500"
                        />
                      ) : (
                        <p className="font-bold text-sm text-white">{e.name}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {editingId === e.id ? (
                        <div className="flex items-center gap-1">
                          <span className="text-zinc-500 font-bold">$</span>
                          <input 
                            type="number" 
                            value={editPrice} 
                            onChange={(ev) => setEditPrice(ev.target.value)}
                            className="w-24 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-pink-500"
                          />
                        </div>
                      ) : (
                        <span className="font-black text-sm text-zinc-100 tabular-nums">${e.price}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {editingId === e.id ? null : (
                        <button
                          onClick={() => toggleAvailable(e.id)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${e.available ? "bg-emerald-500" : "bg-red-500/70"}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-zinc-950 shadow-sm transition-transform ${e.available ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {editingId === e.id ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={cancelEdit} className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition"><X size={16} /></button>
                          <button onClick={() => saveEdit(e.id)} className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 transition"><Check size={16} /></button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(e)} className="p-1.5 rounded-lg bg-zinc-800/0 hover:bg-zinc-800 text-zinc-500 hover:text-sky-400 transition"><Edit3 size={16} /></button>
                          <button onClick={() => handleDelete(e.id)} className="p-1.5 rounded-lg bg-zinc-800/0 hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition"><Trash2 size={16} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile View */}
            <div className="md:hidden flex flex-col divide-y divide-zinc-800/50">
              {filtered.map(e => (
                <div key={e.id} className="p-4 flex flex-col gap-3">
                  {editingId === e.id ? (
                    <div className="flex flex-col gap-2">
                      <input type="text" value={editName} onChange={(ev) => setEditName(ev.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm text-zinc-100 outline-none" />
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500 font-bold">$</span>
                        <input type="number" value={editPrice} onChange={(ev) => setEditPrice(ev.target.value)} className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm text-zinc-100 outline-none" />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button onClick={cancelEdit} className="flex-1 py-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition flex justify-center"><X size={16} /></button>
                        <button onClick={() => saveEdit(e.id)} className="flex-1 py-2 rounded-lg bg-emerald-500/20 text-emerald-500 transition flex justify-center"><Check size={16} /></button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-sm text-white">{e.name}</p>
                        <span className="font-black text-sm text-zinc-100 tabular-nums">${e.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <button onClick={() => toggleAvailable(e.id)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${e.available ? "bg-emerald-500" : "bg-red-500/70"}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-zinc-950 transition-transform ${e.available ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
                        </button>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(e)} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-sky-400 transition"><Edit3 size={16} /></button>
                          <button onClick={() => handleDelete(e.id)} className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 transition"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="p-10 text-center text-zinc-500 text-sm font-bold uppercase tracking-widest">
                No hay extras registrados
              </div>
            )}
          </div>
          <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950/30">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Mostrando {filtered.length} de {extras.length} extras
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
