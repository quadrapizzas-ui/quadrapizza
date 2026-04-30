"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, X, MapPin, ArrowLeft } from "lucide-react";
import { useProducts, Neighborhood } from "@/context/ProductsContext";

export default function EnviosPage() {
  const { neighborhoods, setNeighborhoods } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [deliveryCost, setDeliveryCost] = useState("");

  const filteredNeighborhoods = neighborhoods.filter((n) =>
    n.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openNewModal = () => { setEditingId(null); setName(""); setDeliveryCost(""); setIsEditing(false); setIsModalOpen(true); };
  const openEditModal = (n: Neighborhood) => { setEditingId(n.id); setName(n.name); setDeliveryCost(n.deliveryCost.toString()); setIsEditing(true); setIsModalOpen(true); };

  const handleSave = () => {
    if (!name.trim() || !deliveryCost.trim()) return;
    const costNumber = parseInt(deliveryCost.replace(/\D/g, ""), 10) || 0;
    if (isEditing && editingId) {
      setNeighborhoods(neighborhoods.map((n) => n.id === editingId ? { ...n, name, deliveryCost: costNumber } : n));
    } else {
      const newId = Math.max(0, ...neighborhoods.map((n) => n.id)) + 1;
      setNeighborhoods([...neighborhoods, { id: newId, name, deliveryCost: costNumber }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta zona de envío?")) {
      setNeighborhoods(neighborhoods.filter((n) => n.id !== id));
    }
  };

  const formatPrice = (num: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(num);

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Header ── */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/recepcion/catalogo" className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition shrink-0">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Zonas de Envío</h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Gestión de delivery</p>
          </div>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-black rounded-xl transition active:scale-95 shadow-lg shadow-sky-900/30 w-full sm:w-auto"
        >
          <Plus size={14} /> Nueva Zona
        </button>
      </div>

      {/* ── Búsqueda ── */}
      <div className="shrink-0 px-5 py-3 border-b border-zinc-800/60 bg-zinc-950/80">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={15} />
          <input
            type="text"
            placeholder="Buscar zona o barrio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 outline-none focus:border-sky-500/60 transition font-bold text-sm text-zinc-100 placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* ── Grid (scrollable) ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNeighborhoods.map((n) => (
            <div key={n.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between group hover:border-zinc-700 transition">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                    <MapPin size={16} />
                  </div>
                  <h3 className="font-black text-sm text-zinc-100">{n.name}</h3>
                </div>
                <p className="text-2xl font-black text-white mb-3">{formatPrice(n.deliveryCost)}</p>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-zinc-800 mt-auto">
                <button onClick={() => openEditModal(n)} className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-xl text-xs font-bold transition">
                  <Edit2 size={13} /> Editar
                </button>
                <button onClick={() => handleDelete(n.id)} className="w-9 h-9 flex items-center justify-center bg-zinc-800 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 rounded-xl transition">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {filteredNeighborhoods.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-zinc-600 bg-zinc-900 rounded-2xl border border-dashed border-zinc-800">
              <MapPin size={32} className="mb-3 opacity-40" />
              <p className="text-[10px] font-black uppercase tracking-widest">No hay zonas configuradas</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
              <h2 className="text-lg font-black text-white tracking-tight">{isEditing ? "Editar Zona" : "Nueva Zona de Envío"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition">
                <X size={15} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Nombre del Barrio / Zona</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={15} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-sky-500/60 transition text-sm font-bold text-zinc-100 placeholder:text-zinc-600"
                    placeholder="Ej: Nueva Córdoba"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Costo de Envío</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">$</span>
                  <input
                    type="text"
                    value={deliveryCost}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setDeliveryCost(val ? new Intl.NumberFormat("es-AR").format(parseInt(val)) : "");
                    }}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-sky-500/60 transition text-sm font-bold text-zinc-100 placeholder:text-zinc-600"
                    placeholder="1500"
                  />
                </div>
                <p className="text-[10px] font-bold text-zinc-600 mt-1.5">Este monto se suma automáticamente al total del pedido.</p>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button onClick={handleSave} className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-3 rounded-xl transition active:scale-95 shadow-lg shadow-sky-900/30 text-sm">
                {isEditing ? "Guardar Cambios" : "Crear Zona"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
