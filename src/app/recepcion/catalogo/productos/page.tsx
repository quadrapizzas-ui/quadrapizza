"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, X, UploadCloud, Link as LinkIcon, ImageIcon, ChevronDown, ArrowLeft } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";

export default function ProductosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOffer, setIsOffer] = useState(false);
  const [imageType, setImageType] = useState("upload");
  const [inStock, setInStock] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saleType, setSaleType] = useState<"unidad" | "docena" | "combo" | "quadra">("unidad");
  const [searchQuery, setSearchQuery] = useState("");

  const [isQuadra, setIsQuadra] = useState(false);
  const [quadraCustomizableRows, setQuadraCustomizableRows] = useState(0);
  const [quadraFixedRowsCount, setQuadraFixedRowsCount] = useState(0);
  const [quadraFixedVariety, setQuadraFixedVariety] = useState("");
  const [selectedParent, setSelectedParent] = useState("Todos");
  const [selectedSub, setSelectedSub] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Formularios de producto
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [price, setPrice] = useState("");
  const [pricePerHalfDozen, setPricePerHalfDozen] = useState("");
  const [pricePerDozen, setPricePerDozen] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [customVarieties, setCustomVarieties] = useState<{name: string; price: number}[]>([]);
  const [customExtras, setCustomExtras] = useState<{name: string; price: number}[]>([]);

  const { products, toggleProductStock, extras, setExtras, varieties, setVarieties } = useProducts();

  // ── Two-level category hierarchy ─────────────────────────────────────────
  type HCat = { id: number; name: string; parentId: number | null };

  const HCATS: HCat[] = [
    { id: 1,   name: "Pizzas",       parentId: null },
    { id: 101, name: "Tradicionales", parentId: 1 },
    { id: 102, name: "Especiales",    parentId: 1 },
    { id: 103, name: "Rellenas",      parentId: 1 },
    { id: 2,   name: "Empanadas",     parentId: null },
    { id: 201, name: "Al Horno",      parentId: 2 },
    { id: 202, name: "Fritas",        parentId: 2 },
    { id: 3,   name: "Sándwiches",    parentId: null },
    { id: 4,   name: "Bebidas",       parentId: null },
    { id: 5,   name: "Postres",       parentId: null },
    { id: 6,   name: "Menú del día",  parentId: null },
    { id: 7,   name: "Almacén",       parentId: null },
  ];

  const parentCats = HCATS.filter(c => c.parentId === null);
  const selectedParentObj = HCATS.find(c => c.name === selectedParent) ?? null;
  const subCats = selectedParentObj ? HCATS.filter(c => c.parentId === selectedParentObj.id) : [];
  const hasSubCats = subCats.length > 0;

  // Matching logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesCategory = true;
    if (selectedParent !== "Todos") {
      if (hasSubCats && selectedSub !== "Todas") {
        // parent selected + specific sub
        const subObj = HCATS.find(c => c.name === selectedSub);
        matchesCategory = p.categoryId === subObj?.id;
      } else if (hasSubCats) {
        // parent selected, show all subs
        const childIds = subCats.map(c => c.id);
        matchesCategory = p.category === selectedParent || childIds.includes(p.categoryId ?? -1);
      } else {
        // parent with no children
        matchesCategory = p.category === selectedParent;
      }
    }

    let matchesStatus = true;
    if (statusFilter === "sin-stock") matchesStatus = !p.stock;
    if (statusFilter === "con-stock") matchesStatus = p.stock;
    if (statusFilter === "ofertas") matchesStatus = p.isOffer;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const counts = {
    todos: products.length,
    "sin-stock": products.filter(p => !p.stock).length,
    "con-stock": products.filter(p => p.stock).length,
    ofertas: products.filter(p => p.isOffer).length,
  };

  const handleParentSelect = (name: string) => {
    setSelectedParent(name);
    setSelectedSub("Todas");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Header ── */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/recepcion/catalogo" className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition shrink-0">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Productos</h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Catálogo general</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              setIsEditing(false);
              setIsOffer(false);
              setInStock(true);
              setImageType("upload");
              setSaleType("unidad");
              setIsQuadra(false);
              setQuadraCustomizableRows(0);
              setQuadraFixedRowsCount(0);
              setQuadraFixedVariety("");
              setName("");
              setDescription("");
              setCategoryId("");
              setPrice("");
              setPricePerHalfDozen("");
              setPricePerDozen("");
              setOldPrice("");
              setImageUrl("");
              setCustomVarieties([]);
              setCustomExtras([]);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-black rounded-xl transition active:scale-95 shadow-lg shadow-sky-900/30 w-full sm:w-auto justify-center"
          >
            <Plus size={14} />
            Nuevo Producto
          </button>

        </div>
      </div>

      {/* ── Búsqueda y Filtro de Categorías ── */}
      <div className="shrink-0 px-5 py-3 border-b border-zinc-800/60 bg-zinc-950/80 flex flex-col gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={15} />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-sky-500/60 transition"
          />
        </div>

        {/* Level 1: parent categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleParentSelect("Todos")}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
              selectedParent === "Todos"
                ? "bg-sky-500 text-white border-sky-500"
                : "bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
            }`}
          >
            Todos
          </button>
          {parentCats.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleParentSelect(cat.name)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
                selectedParent === cat.name
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
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
                  : "bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
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
                    : "bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Filtros Rápidos (Tabs) ── */}
      <div className="shrink-0 px-5 py-3 border-b border-zinc-800/60 bg-zinc-950/80 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { key: "todos", label: "Todos" },
          { key: "con-stock", label: "Con Stock" },
          { key: "sin-stock", label: "Sin Stock" },
          { key: "ofertas", label: "Ofertas" },
        ].map(f => (
          <button key={f.key} onClick={() => setStatusFilter(f.key)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
              statusFilter === f.key
                ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
                : "bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
            }`}>
            {f.label} <span className="ml-1 opacity-60">{counts[f.key as keyof typeof counts]}</span>
          </button>
        ))}
      </div>

      {/* ── Tabla (scrollable) ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-500 font-semibold hidden sm:table-row">
                  <th className="p-4 pl-5 w-16">Imagen</th>
                  <th className="p-4">Producto</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Precio</th>
                  <th className="p-4">Venta</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 pr-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="group hover:bg-zinc-800/40 transition flex flex-col sm:table-row p-4 sm:p-0">
                      {/* Imagen desktop */}
                      <td className="sm:p-4 sm:pl-5 hidden sm:table-cell">
                        <div className="w-11 h-11 rounded-xl bg-zinc-800 overflow-hidden relative border border-zinc-700">
                          <Image src={p.image} alt={p.name} fill sizes="44px" className="object-cover" />
                        </div>
                      </td>
                      {/* Nombre */}
                      <td className="sm:p-4">
                        <div className="flex items-center gap-4 sm:gap-0">
                          <div className="w-12 h-12 rounded-xl bg-zinc-800 overflow-hidden relative border border-zinc-700 sm:hidden shrink-0">
                            <Image src={p.image} alt={p.name} fill sizes="48px" className="object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-zinc-100">{p.name}</p>
                            <div className="sm:hidden flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700 text-zinc-400">{p.category}</span>
                              {p.isOffer && <span className="text-[9px] font-black bg-sky-500/15 text-sky-400 px-2 py-0.5 rounded border border-sky-500/20 uppercase tracking-widest">Oferta</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Categoría */}
                      <td className="sm:p-4 hidden sm:table-cell">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-zinc-800 px-2 py-1 rounded-lg border border-zinc-700 text-zinc-400">{p.category}</span>
                      </td>
                      {/* Precio */}
                      <td className="sm:p-4 hidden sm:table-cell">
                        <div className="flex flex-col">
                          {p.isOffer && <span className="text-[10px] text-zinc-500 line-through font-bold leading-none mb-0.5">{p.oldPrice}</span>}
                          <span className={`font-black text-sm ${p.isOffer ? "text-sky-400" : "text-zinc-100"}`}>{p.price}</span>
                          {p.pricePerHalfDozen && <span className="text-[10px] text-zinc-500 mt-0.5">Media: {p.pricePerHalfDozen}</span>}
                          {p.pricePerDozen && <span className="text-[10px] text-zinc-500 mt-0.5">Docena: {p.pricePerDozen}</span>}
                        </div>
                      </td>
                      {/* Tipo venta */}
                      <td className="sm:p-4 hidden sm:table-cell">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-zinc-800 px-2 py-1 rounded-lg border border-zinc-700 text-zinc-400 capitalize">
                          {p.saleType === "combo" ? "Múltiple" : p.saleType}
                        </span>
                      </td>
                      {/* Estado */}
                      <td className="sm:p-4 mt-3 sm:mt-0">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleProductStock(p.id)}
                            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${p.stock ? "bg-emerald-500" : "bg-red-500/70"}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-zinc-950 shadow-sm transition-transform ${p.stock ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
                          </button>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${p.stock ? "text-emerald-400" : "text-red-400"}`}>
                            {p.stock ? "Disponible" : "Sin Stock"}
                          </span>
                        </div>
                      </td>
                      {/* Acciones */}
                      <td className="sm:p-4 sm:pr-5 mt-3 sm:mt-0 flex sm:table-cell justify-end">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setIsEditing(true);
                              setIsOffer(!!p.isOffer);
                              setInStock(p.stock);
                              setImageType("upload");
                              setSaleType(p.saleType);
                              setIsQuadra(p.saleType === 'quadra');
                              if (p.saleType === 'quadra' && p.quadraConfig) {
                                setQuadraCustomizableRows(p.quadraConfig.customizableRowsCount);
                                setQuadraFixedRowsCount(p.quadraConfig.fixedRows[0]?.rowCount || 0);
                                setQuadraFixedVariety(p.quadraConfig.fixedRows[0]?.variety || "");
                              } else {
                                setQuadraCustomizableRows(0);
                                setQuadraFixedRowsCount(0);
                                setQuadraFixedVariety("");
                              }
                              setName(p.name);
                              setDescription(p.description || "");
                              setCategoryId(p.categoryId || "");
                              setPrice(p.price || "");
                              setPricePerHalfDozen(p.pricePerHalfDozen || "");
                              setPricePerDozen(p.pricePerDozen || "");
                              setOldPrice(p.oldPrice || "");
                              if (p.image) {
                                setImageType("url");
                                setImageUrl(p.image);
                              } else {
                                setImageType("upload");
                                setImageUrl("");
                              }
                              setCustomVarieties(p.customVarieties ? [...p.customVarieties] : []);
                              setCustomExtras(p.customExtras ? [...p.customExtras] : []);
                              setIsModalOpen(true);
                            }}
                            className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-700 transition"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-zinc-700 transition">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-zinc-600 font-bold text-xs uppercase tracking-widest">
                      No se encontraron productos con estos filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Modal: Nuevo / Editar ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 no-scrollbar">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-zinc-700 transition text-zinc-400 hover:text-white z-10"
            >
              <X size={16} />
            </button>

            <h2 className="text-lg font-black mb-6 tracking-tight text-white">
              {isEditing ? "Editar Producto" : "Nuevo Producto"}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Columna Izquierda */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Imagen del Producto</label>
                  <div className="flex bg-zinc-800 p-1 rounded-xl mb-3 border border-zinc-700">
                    <button
                      type="button"
                      onClick={() => setImageType("upload")}
                      className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold py-2 rounded-lg transition ${imageType === "upload" ? "bg-zinc-900 text-white border border-zinc-700" : "text-zinc-400 hover:text-white"}`}
                    >
                      <UploadCloud size={13} /> Subir
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageType("url")}
                      className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold py-2 rounded-lg transition ${imageType === "url" ? "bg-zinc-900 text-white border border-zinc-700" : "text-zinc-400 hover:text-white"}`}
                    >
                      <LinkIcon size={13} /> URL
                    </button>
                  </div>

                  {imageType === "upload" ? (
                    <label className="border-2 border-dashed border-zinc-700 rounded-2xl aspect-[4/3] flex flex-col items-center justify-center bg-zinc-800/50 hover:border-zinc-600 transition cursor-pointer relative overflow-hidden group">
                      <input 
                        type="file" 
                        accept="image/webp, image/jpeg, image/png" 
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // In a real app, you'd upload this file to your server/bucket
                            // and then set the returned URL. For now, we'll create a local object URL
                            const localUrl = URL.createObjectURL(file);
                            setImageUrl(localUrl);
                            setImageType("url"); // Switch to URL view to see the preview
                          }
                        }}
                      />
                      <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center mb-3 border border-zinc-700 group-hover:border-sky-500/50 group-hover:text-sky-400 transition-colors">
                        <UploadCloud size={18} className="text-inherit" />
                      </div>
                      <p className="text-sm font-bold text-zinc-300">Arrastrá una imagen</p>
                      <p className="text-xs text-zinc-600 mt-1 group-hover:text-zinc-400 transition-colors">o hacé clic para explorar</p>
                      <p className="text-[9px] text-zinc-600 mt-2 font-bold uppercase tracking-widest">WEBP, JPG hasta 5MB</p>
                    </label>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                        <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="w-full pl-9 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:border-sky-500/60 transition text-sm font-bold text-zinc-100 placeholder:text-zinc-600" />
                      </div>
                      <div className="border border-zinc-700 rounded-2xl aspect-[4/3] flex flex-col items-center justify-center bg-zinc-800/50 text-zinc-600 overflow-hidden relative">
                        {imageUrl ? (
                          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        ) : (
                          <>
                            <ImageIcon size={28} className="mb-2 opacity-40" />
                            <span className="text-xs font-bold">Vista Previa</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Toggle Stock */}
                <div className="flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                  <div>
                    <p className={`font-bold text-sm ${inStock ? "text-zinc-100" : "text-red-400"}`}>{inStock ? "Disponible" : "Sin Stock"}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">El producto aparece en el catálogo.</p>
                  </div>
                  <button type="button" onClick={() => setInStock(!inStock)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${inStock ? "bg-emerald-500" : "bg-red-500/70"}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${inStock ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>

                {/* Toggle Oferta */}
                <div className="flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                  <div>
                    <p className="font-bold text-sm text-zinc-100">Marcar como Oferta</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Aparece destacado en el catálogo.</p>
                  </div>
                  <button type="button" onClick={() => setIsOffer(!isOffer)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isOffer ? "bg-sky-500" : "bg-zinc-600"}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOffer ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>

              {/* Columna Derecha */}
              <div className="lg:col-span-3 space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Nombre del Producto</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 outline-none focus:border-sky-500/60 transition text-sm font-bold text-zinc-100 placeholder:text-zinc-600" placeholder="Ej. Pizza Muzzarella Grande" />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Descripción</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 outline-none focus:border-sky-500/60 transition text-sm font-bold resize-none h-20 text-zinc-100 placeholder:text-zinc-600" placeholder="Ingredientes y detalles..." />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Variedades Opcionales</label>
                  <div className="space-y-2 mb-2">
                    {customVarieties.map((v, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-zinc-800/50 p-2 rounded-lg border border-zinc-700/50">
                        <input
                          type="text"
                          value={v.name}
                          onChange={(e) => {
                            const newV = [...customVarieties];
                            newV[idx].name = e.target.value;
                            setCustomVarieties(newV);
                          }}
                          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm font-bold text-zinc-100 outline-none focus:border-sky-500"
                          placeholder="Nombre variedad"
                        />
                        <div className="relative w-24">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">$</span>
                          <input
                            type="number"
                            value={v.price}
                            onChange={(e) => {
                              const newV = [...customVarieties];
                              newV[idx].price = Number(e.target.value);
                              setCustomVarieties(newV);
                            }}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-6 pr-2 py-1.5 text-sm font-bold text-zinc-100 outline-none focus:border-sky-500"
                            placeholder="Extra"
                          />
                        </div>
                        <button
                          onClick={() => setCustomVarieties(customVarieties.filter((_, i) => i !== idx))}
                          className="p-1.5 text-zinc-500 hover:text-red-500 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomVarieties([...customVarieties, { name: "", price: 0 }])}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition text-xs font-bold"
                  >
                    <Plus size={14} />
                    Agregar Variedad
                  </button>
                  <p className="text-[10px] text-zinc-500 mt-1.5 font-bold">Si agregás variedades, el cliente deberá elegir una de estas opciones al comprar.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Extras Específicos</label>
                  <div className="space-y-2 mb-2">
                    {customExtras.map((e, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-zinc-800/50 p-2 rounded-lg border border-zinc-700/50">
                        <input
                          type="text"
                          value={e.name}
                          onChange={(ev) => {
                            const newE = [...customExtras];
                            newE[idx].name = ev.target.value;
                            setCustomExtras(newE);
                          }}
                          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm font-bold text-zinc-100 outline-none focus:border-sky-500"
                          placeholder="Ej. Cheddar, Huevo"
                        />
                        <div className="relative w-24">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">$</span>
                          <input
                            type="number"
                            value={e.price}
                            onChange={(ev) => {
                              const newE = [...customExtras];
                              newE[idx].price = Number(ev.target.value);
                              setCustomExtras(newE);
                            }}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-6 pr-2 py-1.5 text-sm font-bold text-zinc-100 outline-none focus:border-sky-500"
                            placeholder="Costo"
                          />
                        </div>
                        <button
                          onClick={() => setCustomExtras(customExtras.filter((_, i) => i !== idx))}
                          className="p-1.5 text-zinc-500 hover:text-red-500 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomExtras([...customExtras, { name: "", price: 0 }])}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition text-xs font-bold"
                  >
                    <Plus size={14} />
                    Agregar Extra
                  </button>
                  <p className="text-[10px] text-zinc-500 mt-1.5 font-bold">Los extras son opcionales y se pueden elegir múltiples. Se sumarán al precio base.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Categoría / Subcategoría</label>
                  <div className="relative">
                    <select value={categoryId} onChange={e => setCategoryId(Number(e.target.value) || "")} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-4 pr-10 py-2.5 appearance-none outline-none focus:border-sky-500/60 transition text-sm font-bold text-zinc-100">
                      <option value="" className="bg-zinc-900 text-zinc-100">Seleccionar categoría...</option>
                      {selectableCategories.map(({ cat, depth }) => (
                        <option key={cat.id} value={cat.id} className="bg-zinc-900 text-zinc-100">
                          {"—".repeat(depth)} {cat.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={14} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Tipo de Venta</label>
                  <div className="flex bg-zinc-800 p-1 rounded-xl border border-zinc-700">
                    {(["unidad", "docena", "combo"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSaleType(type)}
                        className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition capitalize ${saleType === type ? "bg-zinc-900 text-white border border-zinc-700" : "text-zinc-400 hover:text-white"}`}
                      >
                        {type === "combo" ? "Múltiple" : type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1.5 font-bold">
                    {saleType === "unidad" && "↳ El cliente pide por unidad. Ej: 1 pizza, 2 sándwiches."}
                    {saleType === "docena" && "↳ El cliente pide por docena. Ej: 1 docena de empanadas."}
                    {saleType === "combo" && "↳ El cliente puede elegir unidad, media docena o docena."}
                  </p>
                </div>

                <div className={`grid gap-4 ${saleType === "combo" ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1"}`}>
                  <div>
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                      {saleType === "docena" ? "Precio por Docena" : "Precio por Unidad"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">$</span>
                      <input type="text" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-8 pr-4 py-2.5 outline-none focus:border-sky-500/60 transition text-sm font-bold text-zinc-100 placeholder:text-zinc-600" placeholder="0" />
                    </div>
                  </div>
                  {saleType === "combo" && (
                    <>
                      <div>
                        <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Media Docena</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">$</span>
                          <input type="text" value={pricePerHalfDozen} onChange={e => setPricePerHalfDozen(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-8 pr-4 py-2.5 outline-none focus:border-sky-500/60 transition text-sm font-bold text-zinc-100 placeholder:text-zinc-600" placeholder="0" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Docena</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">$</span>
                          <input type="text" value={pricePerDozen} onChange={e => setPricePerDozen(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-8 pr-4 py-2.5 outline-none focus:border-sky-500/60 transition text-sm font-bold text-zinc-100 placeholder:text-zinc-600" placeholder="0" />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {isOffer && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                      Precio Anterior <span className="font-bold text-zinc-600">(aparece tachado)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">$</span>
                      <input type="text" value={oldPrice} onChange={e => setOldPrice(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-8 pr-4 py-2.5 outline-none focus:border-sky-500/60 transition text-sm font-bold text-zinc-100 placeholder:text-zinc-600" placeholder="0" />
                    </div>
                  </div>
                )}

                {/* Configuración Quadra */}
                <div className="flex flex-col gap-3 pt-3 border-t border-zinc-800">
                  <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                    <div>
                      <div className="text-sm font-bold text-zinc-200">Producto Quadra (Filas Editables)</div>
                      <div className="text-[10px] text-zinc-400">Permite al cliente elegir variedades por fila</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !isQuadra;
                        setIsQuadra(next);
                        if (next) setSaleType("quadra");
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isQuadra ? "bg-sky-500" : "bg-zinc-600"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isQuadra ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>

                  {isQuadra && (
                    <div className="grid grid-cols-2 gap-3 bg-zinc-800/30 p-4 rounded-xl border border-sky-500/30 shadow-inner">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Filas Editables</label>
                        <input
                          type="number"
                          value={quadraCustomizableRows}
                          onChange={(e) => setQuadraCustomizableRows(Number(e.target.value))}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500/60 text-zinc-100"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Filas Fijas</label>
                        <input
                          type="number"
                          value={quadraFixedRowsCount}
                          onChange={(e) => setQuadraFixedRowsCount(Number(e.target.value))}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500/60 text-zinc-100"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 col-span-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Sabor de Filas Fijas</label>
                        <input
                          type="text"
                          placeholder="Ej. Muzzarella"
                          value={quadraFixedVariety}
                          onChange={(e) => setQuadraFixedVariety(e.target.value)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500/60 text-zinc-100"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-3 rounded-xl transition active:scale-95 shadow-lg shadow-sky-900/30 text-sm"
                  >
                    {isEditing ? "Guardar Cambios" : "Guardar Producto"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
