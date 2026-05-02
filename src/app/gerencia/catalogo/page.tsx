"use client";

import { useState } from "react";
import { useProducts, Product } from "@/context/ProductsContext";
import { Search, BookOpen } from "lucide-react";

// ── Category hierarchy ────────────────────────────────────────────────────────
type HCat = { id: number; name: string; parentId: number | null };

const HCATS: HCat[] = [
  { id: 1,   name: "Pizzas",        parentId: null },
  { id: 101, name: "Tradicionales",  parentId: 1 },
  { id: 102, name: "Especiales",     parentId: 1 },
  { id: 103, name: "Rellenas",       parentId: 1 },
  { id: 2,   name: "Empanadas",      parentId: null },
  { id: 201, name: "Al Horno",       parentId: 2 },
  { id: 202, name: "Fritas",         parentId: 2 },
  { id: 3,   name: "Sándwiches",     parentId: null },
  { id: 4,   name: "Bebidas",        parentId: null },
  { id: 5,   name: "Postres",        parentId: null },
  { id: 6,   name: "Menú del día",   parentId: null },
  { id: 7,   name: "Almacén",        parentId: null },
];

const PARENT_CATS = HCATS.filter(c => c.parentId === null);

function getSubCats(parentName: string): HCat[] {
  const parent = HCATS.find(c => c.name === parentName);
  return parent ? HCATS.filter(c => c.parentId === parent.id) : [];
}

function matchesCategoryFilter(p: Product, selectedParent: string, selectedSub: string): boolean {
  if (selectedParent === "Todos") return true;
  const subCats = getSubCats(selectedParent);
  const hasSubCats = subCats.length > 0;
  if (hasSubCats && selectedSub !== "Todas") {
    const subObj = HCATS.find(c => c.name === selectedSub);
    return p.categoryId === subObj?.id;
  } else if (hasSubCats) {
    const childIds = subCats.map(c => c.id);
    return p.category === selectedParent || childIds.includes(p.categoryId ?? -1);
  } else {
    return p.category === selectedParent;
  }
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CatalogAdminPage() {
  const { products, toggleProductStock } = useProducts();
  const [search, setSearch]               = useState("");
  const [selectedParent, setSelectedParent] = useState("Todos");
  const [selectedSub, setSelectedSub]       = useState("Todas");

  const subCats    = getSubCats(selectedParent);
  const hasSubCats = subCats.length > 0;

  const handleParentSelect = (name: string) => {
    setSelectedParent(name);
    setSelectedSub("Todas");
  };

  const filtered = products.filter(p => {
    if (!matchesCategoryFilter(p, selectedParent, selectedSub)) return false;
    if (search.trim()) return p.name.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Header ── */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen size={20} className="text-purple-400" /> Catálogo
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Gestión de productos, precios y visibilidad</p>
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
        {/* ── Toolbox ── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex flex-col gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-zinc-100 placeholder:text-zinc-700 outline-none focus:border-purple-500/50 transition"
          />
        </div>

        {/* Level 1: parent categories */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <button
            onClick={() => handleParentSelect("Todos")}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
              selectedParent === "Todos"
                ? "bg-purple-500 text-white border-purple-500"
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
            }`}
          >
            Todos
          </button>
          {PARENT_CATS.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleParentSelect(cat.name)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
                selectedParent === cat.name
                  ? "bg-orange-500 text-white border-orange-500"
                  : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Level 2: subcategories (only when parent has children) */}
        {hasSubCats && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="shrink-0 text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Nivel 2:
            </span>
            <button
              onClick={() => setSelectedSub("Todas")}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
                selectedSub === "Todas"
                  ? "bg-zinc-700 text-white border-zinc-600"
                  : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
              }`}
            >
              Todas
            </button>
            {subCats.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedSub(cat.name)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
                  selectedSub === cat.name
                    ? "bg-zinc-700 text-white border-zinc-600"
                    : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick stats ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Mostrando", value: filtered.length,                        color: "text-white" },
          { label: "Con stock",  value: filtered.filter(p => p.stock).length,  color: "text-emerald-400" },
          { label: "Sin stock",  value: filtered.filter(p => !p.stock).length, color: "text-red-400" },
          { label: "Ofertas",    value: filtered.filter(p => p.isOffer).length, color: "text-orange-400" },
        ].map(s => (
          <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 sm:p-4">
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{s.label}</p>
            <p className={`font-black text-lg sm:text-xl tabular-nums leading-tight mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Mobile cards ───────────────────────────────────────── */}
      <div className="md:hidden space-y-2.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-700 gap-2">
            <BookOpen size={32} strokeWidth={1.5} />
            <p className="font-bold text-sm uppercase tracking-widest">Sin productos</p>
          </div>
        ) : filtered.map(p => (
          <div key={p.id} className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-4 ${!p.stock ? "opacity-60" : ""}`}>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0">
                {p.image
                  ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-zinc-600">IMG</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-white truncate">{p.name}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-bold">
                    {p.category}
                  </span>
                  <span className="font-black text-sm text-orange-400">{p.price}</span>
                  {p.isOffer && p.oldPrice && (
                    <span className="text-[10px] text-zinc-500 line-through font-bold">{p.oldPrice}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-800/60">
              <div className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => toggleProductStock(p.id)}
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${p.stock ? "bg-emerald-500" : "bg-red-500/70"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-zinc-950 shadow-sm transition-transform ${p.stock ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
                </button>
                <span className={`text-[10px] font-black uppercase tracking-widest ${p.stock ? "text-emerald-400" : "text-red-400"}`}>
                  {p.stock ? "Disponible" : "Sin Stock"}
                </span>
              </div>
              {p.isOffer && (
                <span className="text-[9px] font-black bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20 uppercase tracking-widest">Oferta</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop table ──────────────────────────────────────── */}
      <div className="hidden md:block bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-zinc-950/60 border-b border-zinc-800">
                {["Producto", "Categoría", "Precio", "Tipo", "Estado", ""].map(h => (
                  <th key={h} className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map(p => (
                <tr key={p.id} className={`group hover:bg-zinc-800/30 transition ${!p.stock ? "opacity-50" : ""}`}>
                  {/* Product */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 shrink-0 overflow-hidden">
                        {p.image
                          ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-zinc-600">IMG</div>}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">{p.name}</p>
                        {p.description && <p className="text-[10px] text-zinc-600 font-bold truncate max-w-[240px]">{p.description}</p>}
                      </div>
                    </div>
                  </td>
                  {/* Category */}
                  <td className="px-5 py-3.5">
                    <span className="bg-zinc-800 px-2.5 py-1 rounded-full text-[10px] font-bold text-zinc-400">
                      {p.category}
                    </span>
                  </td>
                  {/* Price */}
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col">
                      {p.isOffer && p.oldPrice && (
                        <span className="text-[10px] text-zinc-500 line-through font-bold leading-none mb-0.5">{p.oldPrice}</span>
                      )}
                      <span className={`font-black text-sm ${p.isOffer ? "text-orange-400" : "text-zinc-100"}`}>{p.price}</span>
                      {p.pricePerHalfDozen && <span className="text-[10px] text-zinc-500 mt-0.5">Media: {p.pricePerHalfDozen}</span>}
                      {p.pricePerDozen && <span className="text-[10px] text-zinc-500 mt-0.5">Docena: {p.pricePerDozen}</span>}
                    </div>
                  </td>
                  {/* Sale type */}
                  <td className="px-5 py-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-zinc-800 px-2 py-1 rounded-lg text-zinc-400 capitalize">
                      {p.saleType === "combo" ? "Múltiple" : p.saleType}
                    </span>
                  </td>
                  {/* Status toggle */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleProductStock(p.id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${p.stock ? "bg-emerald-500" : "bg-red-500/70"}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-zinc-950 shadow-sm transition-transform ${p.stock ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
                      </button>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${p.stock ? "text-emerald-400" : "text-red-400"}`}>
                        {p.stock ? "OK" : "Sin Stock"}
                      </span>
                    </div>
                  </td>
                  {/* Badges */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {p.isOffer && (
                        <span className="text-[9px] font-black bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20 uppercase tracking-widest">
                          Oferta
                        </span>
                      )}
                      {p.saleType === "quadra" && (
                        <span className="text-[9px] font-black bg-purple-500/15 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 uppercase tracking-widest">
                          Quadra
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-zinc-700 font-bold uppercase tracking-widest text-sm">
                    Sin productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950/30">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            Mostrando {filtered.length} de {products.length} productos
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
