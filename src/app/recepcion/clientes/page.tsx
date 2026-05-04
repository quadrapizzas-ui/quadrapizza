"use client";

import React, { useState } from "react";
import { Search, UserPlus, Phone, MapPin, ShoppingBag, Trash2, Pencil, X, ChevronDown, AlertTriangle } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";

import { mockCustomersStore, mockOrdersStore } from "@/lib/mockData";
import { useSyncExternalStore } from "react";

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

export default function ClientesPage() {
  const { neighborhoods } = useProducts();
  const [search, setSearch] = useState("");
  const customers = useSyncExternalStore(mockCustomersStore.subscribe, mockCustomersStore.getSnapshot);

  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [editData, setEditData] = useState({ name: "", phone: "", address: "", neighborhoodId: "", addressDetail: "" });
  const [deleteModal, setDeleteModal] = useState<{ customer: any; error?: string } | null>(null);

  const handleEditClick = (c: any) => {
    setEditingCustomer(c);
    setEditData({
      name: c.name || "",
      phone: c.phone || "",
      address: c.address || "",
      neighborhoodId: c.neighborhoodId ? String(c.neighborhoodId) : "",
      addressDetail: c.addressDetail || ""
    });
  };

  const handleSave = () => {
    mockCustomersStore.addOrUpdateCustomer({
      id: editingCustomer.id,
      name: editData.name,
      phone: editData.phone,
      address: editData.address,
      neighborhoodId: editData.neighborhoodId ? Number(editData.neighborhoodId) : undefined,
      addressDetail: editData.addressDetail,
      orders: editingCustomer.orders,
      total: editingCustomer.total,
    });
    setEditingCustomer(null);
  };

  const handleDelete = (c: any) => {
    const activeOrders = mockOrdersStore.getSnapshot().filter(
      o => o.clientName.toLowerCase() === c.name.toLowerCase() && 
      ["confirmado", "en-cocina", "en-camino"].includes(o.status)
    );
    if (activeOrders.length > 0) {
      setDeleteModal({ customer: c, error: "No se puede borrar este cliente porque tiene pedidos activos en curso." });
      return;
    }
    setDeleteModal({ customer: c });
  };

  const confirmDelete = () => {
    if (deleteModal?.customer) {
      mockCustomersStore.deleteCustomer(deleteModal.customer.id);
    }
    setDeleteModal(null);
  };

  const filtered = customers.filter(c => {
    const searchStr = search.toLowerCase();
    const searchDigits = search.replace(/\D/g, "");
    const phoneDigits = c.phone.replace(/\D/g, "");
    
    return c.name.toLowerCase().includes(searchStr) || 
           (searchDigits.length > 0 && phoneDigits.includes(searchDigits));
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Base de Clientes</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{customers.length} clientes registrados</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-black rounded-xl transition active:scale-95 shadow-lg shadow-sky-900/30">
          <UserPlus size={14} />
          Nuevo
        </button>
      </div>

      {/* Search */}
      <div className="shrink-0 px-5 py-3 border-b border-zinc-800/60 bg-zinc-950/80">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o teléfono..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-sky-500/60 transition" />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-700">
            <Search size={36} strokeWidth={1.5} />
            <p className="font-bold text-sm uppercase tracking-widest">Sin resultados</p>
          </div>
        ) : filtered.map(c => (
          <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-start gap-4 hover:border-zinc-700 transition group">
            <div className="w-11 h-11 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-black text-lg shrink-0 group-hover:bg-sky-500/15 group-hover:text-sky-400 transition">
              {c.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-sm text-white truncate">{c.name}</h3>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEditClick(c)} className="p-1.5 text-zinc-700 hover:text-sky-500 transition shrink-0" title="Editar Cliente">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(c)} className="p-1.5 text-zinc-700 hover:text-red-500 transition shrink-0" title="Borrar Cliente">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                  <Phone size={12} className="text-zinc-500" />
                  {c.phone || "Sin teléfono"}
                </span>
                {(c.address || c.addressDetail || c.neighborhoodId) && (
                  <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                    <MapPin size={12} className="text-zinc-500 shrink-0" />
                    <span className="truncate">
                      {c.address || "Retiro en local"}
                      {c.neighborhoodId && neighborhoods.find((n: any) => n.id === c.neighborhoodId) ? ` · ${neighborhoods.find((n: any) => n.id === c.neighborhoodId)?.name}` : ""}
                      {c.addressDetail ? ` · ${c.addressDetail}` : ""}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-zinc-800 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-black text-white">Editar Cliente</h2>
              <button onClick={() => setEditingCustomer(null)} className="p-1.5 text-zinc-500 hover:text-white bg-zinc-900 rounded-xl transition">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto no-scrollbar space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Nombre</label>
                <input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-100 outline-none focus:border-sky-500/60" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Teléfono</label>
                <input value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-100 outline-none focus:border-sky-500/60" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Barrio</label>
                <div className="relative">
                  <select value={editData.neighborhoodId} onChange={e => setEditData({...editData, neighborhoodId: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-100 outline-none focus:border-sky-500/60 appearance-none">
                    <option value="">Seleccionar barrio...</option>
                    {neighborhoods.map((n: any) => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Dirección</label>
                <input value={editData.address} onChange={e => setEditData({...editData, address: e.target.value.toUpperCase()})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-bold uppercase text-zinc-100 outline-none focus:border-sky-500/60" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Detalles (piso, depto...)</label>
                <input value={editData.addressDetail} onChange={e => setEditData({...editData, addressDetail: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-100 outline-none focus:border-sky-500/60" />
              </div>
            </div>
            <div className="p-5 border-t border-zinc-800 shrink-0 flex gap-2">
              <button onClick={() => setEditingCustomer(null)} className="flex-1 py-3 rounded-xl bg-zinc-900 text-zinc-400 font-bold text-sm hover:text-white transition">Cancelar</button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-sky-600 text-white font-black text-sm hover:bg-sky-500 transition">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteModal(null)}>
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="p-6 flex flex-col items-center text-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${deleteModal.error ? "bg-amber-500/15" : "bg-red-500/15"}`}>
                <AlertTriangle size={24} className={deleteModal.error ? "text-amber-400" : "text-red-400"} />
              </div>
              <h3 className="text-lg font-black text-white mb-1">
                {deleteModal.error ? "Acción no permitida" : "Eliminar cliente"}
              </h3>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                {deleteModal.error
                  ? deleteModal.error
                  : <span>¿Estás seguro de que deseas eliminar a <strong className="text-white">{deleteModal.customer.name}</strong>? Esta acción no se puede deshacer.</span>
                }
              </p>
            </div>
            <div className="px-5 pb-5 flex gap-2">
              {deleteModal.error ? (
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 py-3 rounded-xl bg-zinc-800 text-white font-bold text-sm hover:bg-zinc-700 transition active:scale-[0.98]"
                >
                  Entendido
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setDeleteModal(null)}
                    className="flex-1 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-sm hover:text-white hover:border-zinc-600 transition active:scale-[0.98]"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 py-3 rounded-xl bg-red-600 text-white font-black text-sm hover:bg-red-500 transition active:scale-[0.98] shadow-lg shadow-red-900/30"
                  >
                    Sí, eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
