"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Edit2, Trash2, X, CornerDownRight, ChevronDown, ArrowLeft, ChefHat, Package } from "lucide-react";
import { useProductsStore, type Category } from "@/lib/store/productsStore";

const CategoryNode = ({
  category,
  allCategories,
  onEdit,
  onDelete,
  depth = 0,
}: {
  category: Category;
  allCategories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (id: number) => void;
  depth?: number;
}) => {
  const children = allCategories.filter((c) => c.parentId === category.id);
  const isKitchen = category.requiresKitchen !== false;

  return (
    <div className="group">
      <div className={`flex items-center justify-between border transition rounded-xl ${depth === 0 ? "border-zinc-800 bg-zinc-900/60 p-4 hover:border-zinc-700" : "bg-zinc-950 border-zinc-800 p-3 hover:border-zinc-700"}`}>
        <div className="flex items-center gap-3">
          {depth > 0 && <CornerDownRight size={13} className="text-zinc-600" />}
          <span className={`font-bold ${depth > 0 ? "text-sm text-zinc-300" : "text-sm text-zinc-100"}`}>{category.name}</span>
          
          {isKitchen ? (
            <span className="text-[9px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <ChefHat size={10} /> Cocina
            </span>
          ) : (
            <span className="text-[9px] font-black uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <Package size={10} /> Despacho Directo
            </span>
          )}

          {children.length > 0 && depth === 0 && (
            <span className="text-[9px] font-black uppercase tracking-widest bg-zinc-800 text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded-full">
              {children.length} sub
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(category)} className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-700 transition">
            <Edit2 size={13} />
          </button>
          <button onClick={() => onDelete(category.id)} className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-700 transition">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {children.length > 0 && (
        <div className="pl-6 ml-4 border-l border-zinc-800 mt-2 space-y-2 py-1">
          {children.map((child) => (
            <CategoryNode key={child.id} category={child} allCategories={allCategories} onEdit={onEdit} onDelete={onDelete} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CategoriesPage() {
  const pathname = usePathname();
  const basePath = pathname.replace(/\/categorias$/, "");
  const { categories, setCategories } = useProductsStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<number | null>(null);
  const [requiresKitchen, setRequiresKitchen] = useState<boolean>(true);

  const mainCategories = categories.filter((c) => c.parentId === null);

  const openCreateModal = () => {
    setModalMode("create");
    setCurrentId(null);
    setName("");
    setParentId(null);
    setRequiresKitchen(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setModalMode("edit");
    setCurrentId(cat.id);
    setName(cat.name);
    setParentId(cat.parentId);
    setRequiresKitchen(cat.requiresKitchen !== false);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const getDescendants = (catId: number): number[] => {
      const ch = categories.filter((c) => c.parentId === catId).map((c) => c.id);
      return ch.reduce((acc: number[], childId) => [...acc, ...getDescendants(childId)], ch);
    };
    setCategories(categories.filter((c) => ![id, ...getDescendants(id)].includes(c.id)));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (modalMode === "create") {
      const newId = Math.max(...categories.map((c) => c.id), 0) + 1;
      setCategories([...categories, { id: newId, name, parentId, requiresKitchen }]);
    } else {
      setCategories(categories.map((c) => (c.id === currentId ? { ...c, name, parentId, requiresKitchen } : c)));
    }
    setIsModalOpen(false);
  };

  const getDescendants = (id: number): number[] => {
    const ch = categories.filter((c) => c.parentId === id).map((c) => c.id);
    return ch.reduce((acc: number[], childId) => [...acc, ...getDescendants(childId)], ch);
  };

  const invalidParentIds = currentId ? [currentId, ...getDescendants(currentId)] : [];

  const getFlattenedCategories = (parentIdFilter: number | null, depth = 0): { cat: Category; depth: number }[] => {
    const children = categories.filter((c) => c.parentId === parentIdFilter);
    let result: { cat: Category; depth: number }[] = [];
    for (const child of children) {
      if (!invalidParentIds.includes(child.id)) {
        result.push({ cat: child, depth });
        result = [...result, ...getFlattenedCategories(child.id, depth + 1)];
      }
    }
    return result;
  };

  const selectableParents = getFlattenedCategories(null);

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Header ── */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={basePath} className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition shrink-0">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Categorías</h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Clasificación de catálogo</p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-black rounded-xl transition active:scale-95 shadow-lg shadow-sky-900/30 w-full sm:w-auto"
        >
          <Plus size={14} />
          Nueva Categoría
        </button>
      </div>

      {/* ── Árbol (scrollable) ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
          <div className="space-y-3">
            {mainCategories.map((mainCat) => (
              <CategoryNode key={mainCat.id} category={mainCat} allCategories={categories} onEdit={openEditModal} onDelete={handleDelete} />
            ))}
            {mainCategories.length === 0 && (
              <div className="py-12 text-center text-zinc-600 font-bold text-xs uppercase tracking-widest">
                No hay categorías creadas aún.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-zinc-700 transition text-zinc-400 hover:text-white">
              <X size={16} />
            </button>
            <h2 className="text-lg font-black mb-5 tracking-tight text-white">
              {modalMode === "create" ? "Nueva Categoría" : "Editar Categoría"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 outline-none focus:border-sky-500/60 transition text-sm font-bold text-zinc-100 placeholder:text-zinc-600"
                  placeholder="Ej. Hamburguesas"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Categoría Padre</label>
                <div className="relative">
                  <select
                    value={parentId === null ? "" : parentId}
                    onChange={(e) => {
                      const pid = e.target.value === "" ? null : Number(e.target.value);
                      setParentId(pid);
                      if (pid !== null && modalMode === "create") {
                        const parentCat = categories.find((c) => c.id === pid);
                        if (parentCat && typeof parentCat.requiresKitchen === "boolean") {
                          setRequiresKitchen(parentCat.requiresKitchen);
                        }
                      }
                    }}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-4 pr-10 py-2.5 outline-none focus:border-sky-500/60 transition text-sm font-bold appearance-none text-zinc-100"
                  >
                    <option value="" className="bg-zinc-900 text-zinc-100">Ninguna (Es categoría principal)</option>
                    {selectableParents.map(({ cat, depth }) => (
                      <option key={cat.id} value={cat.id} className="bg-zinc-900 text-zinc-100">
                        {"—".repeat(depth)} {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={14} />
                </div>
              </div>

              {/* Selector Destino Operativo (Cocina vs Despacho Directo) */}
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                  Destino Operativo
                </label>
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/80">
                  <div className="flex items-center gap-2.5">
                    {requiresKitchen ? (
                      <ChefHat size={16} className="text-orange-400 shrink-0" />
                    ) : (
                      <Package size={16} className="text-sky-400 shrink-0" />
                    )}
                    <div>
                      <p className={`font-bold text-xs ${requiresKitchen ? "text-orange-400" : "text-sky-400"}`}>
                        {requiresKitchen ? "Sector Cocina" : "Despacho Directo"}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-medium">
                        {requiresKitchen
                          ? "Pasa a comanda táctil de cocina (KDS)"
                          : "Bebidas / Almacén (sin cocción)"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRequiresKitchen(!requiresKitchen)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      requiresKitchen ? "bg-orange-500" : "bg-sky-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        requiresKitchen ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={handleSave}
                  disabled={!name.trim()}
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-3 rounded-xl transition active:scale-95 shadow-lg shadow-sky-900/30 disabled:opacity-40 disabled:active:scale-100 text-sm"
                >
                  {modalMode === "create" ? "Crear Categoría" : "Guardar Cambios"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
