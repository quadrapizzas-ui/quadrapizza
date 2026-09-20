"use client";

import { useState } from "react";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import type { Product, Extra, Variety } from "@/lib/store/productsStore";
import { formatPrice, parsePrice } from "@/hooks/useCart";

interface AddToCartModalProps {
  product: Product;
  extras: Extra[];
  varieties: Variety[];
  onConfirm: (
    product: Product,
    quantity: number,
    unitType: "unidad" | "media_docena" | "docena",
    quadraSelections: string[],
    selectedExtras: Extra[],
    selectedCustomVariety: string
  ) => void;
  onClose: () => void;
}

export function AddToCartModal({ product, extras, varieties, onConfirm, onClose }: AddToCartModalProps) {
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalUnitType, setModalUnitType] = useState<"unidad" | "media_docena" | "docena">(
    product.saleType === "docena" ? "docena" : "unidad"
  );
  const [quadraSelections, setQuadraSelections] = useState<string[]>(
    product.saleType === "quadra" && product.quadraConfig
      ? Array(product.quadraConfig.customizableRowsCount).fill("")
      : []
  );
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [selectedCustomVariety, setSelectedCustomVariety] = useState("");

  const handleConfirm = () => {
    onConfirm(product, modalQuantity, modalUnitType, quadraSelections, selectedExtras, selectedCustomVariety);
  };

  const isDisabled =
    (product.saleType === "quadra" && quadraSelections.some((s) => !s)) ||
    (product.customVarieties && product.customVarieties.length > 0 && !selectedCustomVariety);

  // Compute available extras for this product
  const isPizza = product.categoryId && [1, 101, 102, 103].includes(product.categoryId);
  const globalExtras = isPizza ? extras.filter((e) => e.available) : [];
  const customExtrasMapped = (product.customExtras || []).map((ce) => ({
    id: `custom-${ce.name}`,
    name: ce.name,
    price: ce.price,
    available: true,
    applyToCategories: [],
  }));
  const allExtras = [...customExtrasMapped, ...globalExtras];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-zinc-950 rounded-2xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-zinc-900 flex flex-col max-h-[90vh]">
        <div className="px-6 pt-6 sm:px-8 sm:pt-8 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 hover:bg-zinc-800 transition text-zinc-400 hover:text-white"
          >
            <X size={18} />
          </button>
          <h2 className="text-xl font-black tracking-tight pr-8 leading-tight mb-1">Agregar al Pedido</h2>
          <p className="text-sm font-semibold text-zinc-400 mb-4">{product.name}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 sm:px-8 space-y-5 no-scrollbar min-h-0">
          {/* Selector Quadra (Filas personalizables) */}
          {product.saleType === "quadra" && product.quadraConfig && (
            <div className="space-y-4 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800">
              <div className="mb-2">
                <h3 className="font-bold text-zinc-200">Personalizá tu Quadra</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {product.quadraConfig.fixedRows.length > 0 &&
                    `Incluye ${product.quadraConfig.fixedRows.map((f) => `${f.rowCount} fila(s) de ${f.variety}`).join(", ")}. `}
                  Elegí el sabor para {product.quadraConfig.customizableRowsCount} fila(s) a continuación:
                </p>
              </div>
              
              {Array.from({ length: product.quadraConfig.customizableRowsCount }).map((_, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-bold mb-1.5 text-zinc-300">Fila a elección #{idx + 1}</label>
                  <select
                    value={quadraSelections[idx] || ""}
                    onChange={(e) => {
                      const newSelections = [...quadraSelections];
                      newSelections[idx] = e.target.value;
                      setQuadraSelections(newSelections);
                    }}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 text-zinc-200 appearance-none"
                  >
                    <option value="" disabled>Seleccionar variedad</option>
                    {varieties.filter((v) => v.available).map((v) => (
                      <option key={v.id} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Extras */}
          {allExtras.length > 0 && (
            <div className="space-y-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800">
              <div className="mb-2">
                <h3 className="font-bold text-zinc-200">¿Querés agregar extras?</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Podés seleccionar todos los que quieras.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allExtras.map((extra) => {
                  const isSelected = selectedExtras.some((e) => e.id === extra.id);
                  return (
                    <label key={extra.id} className={`flex items-center gap-3 p-3 rounded-lg border transition cursor-pointer select-none ${isSelected ? "bg-orange-500/10 border-orange-500/50" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"}`}>
                      <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${isSelected ? "bg-orange-500 border-orange-500 text-white" : "bg-zinc-950 border-zinc-700 text-transparent"}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={isSelected ? "opacity-100" : "opacity-0"}><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${isSelected ? "text-zinc-100" : "text-zinc-300"}`}>{extra.name}</span>
                        <span className="text-[11px] font-black text-orange-400">+{formatPrice(extra.price)}</span>
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedExtras([...selectedExtras, extra]);
                          else setSelectedExtras(selectedExtras.filter((se) => se.id !== extra.id));
                        }} 
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selector de Variedades Custom */}
          {product.customVarieties && product.customVarieties.length > 0 && (
            <div className="space-y-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800">
              <div className="mb-2">
                <h3 className="font-bold text-zinc-200">Elegí la variedad</h3>
              </div>
              <select
                value={selectedCustomVariety}
                onChange={(e) => setSelectedCustomVariety(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 text-zinc-200 appearance-none"
              >
                <option value="" disabled>Seleccionar variedad</option>
                {product.customVarieties.map((v) => (
                  <option key={v.name} value={v.name}>{v.name}{v.price ? ` (+$${v.price})` : ""}</option>
                ))}
              </select>
            </div>
          )}

          {/* Selector Unidad / Media Docena / Docena — solo para saleType 'combo' */}
          {product.saleType === "combo" && (
            <div>
              <label className="block text-sm font-bold mb-2 text-zinc-300">¿Cómo querés pedirlo?</label>
              <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => { setModalUnitType("unidad"); setModalQuantity(1); }}
                  className={`flex-1 text-xs sm:text-sm font-bold py-2.5 rounded-lg transition ${modalUnitType === "unidad" ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-400 hover:text-white"}`}
                >
                  Por Unidad
                </button>
                <button
                  type="button"
                  onClick={() => { setModalUnitType("media_docena"); setModalQuantity(1); }}
                  className={`flex-1 text-xs sm:text-sm font-bold py-2.5 rounded-lg transition ${modalUnitType === "media_docena" ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-400 hover:text-white"}`}
                >
                  1/2 Docena
                </button>
                <button
                  type="button"
                  onClick={() => { setModalUnitType("docena"); setModalQuantity(1); }}
                  className={`flex-1 text-xs sm:text-sm font-bold py-2.5 rounded-lg transition ${modalUnitType === "docena" ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-400 hover:text-white"}`}
                >
                  Docena
                </button>
              </div>
              {/* Precio según selección */}
              <div className="mt-2 px-3 py-2 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <p className="text-xs text-zinc-500 font-medium">
                  {modalUnitType === "docena"
                    ? <>Precio docena: <span className="text-orange-400 font-bold">{product.pricePerDozen || formatPrice(parsePrice(product.price) * 12)}</span></>
                    : modalUnitType === "media_docena"
                    ? <>Precio media docena: <span className="text-orange-400 font-bold">{product.pricePerHalfDozen || formatPrice(parsePrice(product.price) * 6)}</span></>
                    : <>Precio unidad: <span className="text-zinc-100 font-bold">{product.price}</span></>
                  }
                </p>
              </div>
            </div>
          )}

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-bold mb-2 text-zinc-300">
              Cantidad ({modalUnitType === "docena" ? "Docenas" : modalUnitType === "media_docena" ? "Medias Docenas" : "Unidades"})
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white transition active:scale-95 shrink-0 border border-zinc-800"
              >
                <Minus size={20} />
              </button>
              <div className="flex-1 flex items-center justify-center gap-1">
                <input
                  type="number"
                  value={modalQuantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setModalQuantity(isNaN(val) || val < 1 ? 1 : val);
                  }}
                  step="1"
                  min="1"
                  className="text-right font-black text-4xl w-24 bg-transparent border-none outline-none focus:ring-0 p-0 m-0 text-zinc-100"
                />
                <span className="font-black text-base text-zinc-400 mt-2">
                  {modalUnitType === "docena" ? "DOC" : modalUnitType === "media_docena" ? "1/2 DOC" : "UN"}
                </span>
              </div>
              <button
                onClick={() => setModalQuantity(modalQuantity + 1)}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white transition active:scale-95 shrink-0 border border-zinc-800"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="shrink-0 px-6 pb-6 sm:px-8 sm:pb-8 pt-4 border-t border-zinc-900 mt-auto">
          <button
            onClick={handleConfirm}
            disabled={!!isDisabled}
            className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-500 transition active:scale-95 shadow-lg flex justify-center items-center gap-2 text-sm disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
          >
            <ShoppingCart size={18} /> Agregar al Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
