"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Plus, Minus, Trash2, Search, ChevronDown, Send, ShoppingBasket, ShoppingCart, X, MessageSquare, User, Check } from "lucide-react";
import { useProducts, Product } from "@/context/ProductsContext";
import { mockOrdersStore, mockCustomersStore, MockCustomer } from "@/lib/mockData";
import { useSyncExternalStore } from "react";

type UnitType = "unidad" | "media_docena" | "docena";

interface CartItem {
  key: string;
  productId: number;
  name: string;
  image: string;
  unitType: UnitType;
  price: number;
  quantity: number;
  note?: string;
  quadraSelections?: string[];
  extras?: { name: string; price: number }[];
}

const CATS = [
  { id: null,  label: "Todos"       },
  { id: 1,     label: "Pizzas"      },
  { id: 2,     label: "Empanadas"   },
  { id: 3,     label: "Sándwiches"  },
  { id: 4,     label: "Bebidas"     },
];

function parsePrice(str?: string): number {
  if (!str) return 0;
  return Number(str.replace(/\./g, "").replace(/[^0-9]/g, "")) || 0;
}

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

function itemSubtotal(item: CartItem): number { 
  const base = item.price * item.quantity;
  const extrasTotal = item.extras ? item.extras.reduce((acc, e) => acc + e.price, 0) * item.quantity : 0;
  return base + extrasTotal;
}

export default function NuevaVentaPage() {
  const { products, neighborhoods, extras, varieties } = useProducts();

  const [activeCat, setActiveCat] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  const customers = useSyncExternalStore(mockCustomersStore.subscribe, mockCustomersStore.getSnapshot);

  // Modal confirm
  const [showModal, setShowModal] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"retiro" | "envio">("retiro");
  const [selectedNeighId, setSelectedNeighId] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [payment, setPayment] = useState("Efectivo");
  const [dineroRecibido, setDineroRecibido] = useState("");
  const [sending, setSending] = useState(false);

  // Item note modal
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState("");

  // Product selector modal
  const [selectedProd, setSelectedProd] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [modalUnit, setModalUnit] = useState<UnitType>("unidad");
  const [quadraSelections, setQuadraSelections] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<typeof extras>([]);

  // Autocomplete states
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [customerSearchType, setCustomerSearchType] = useState<"name" | "phone" | null>(null);

  const suggestedCustomers = useMemo(() => {
    if (!showCustomerSuggestions || !customerSearchType) return [];
    const query = customerSearchType === "name" ? customerName.toLowerCase() : customerPhone.replace(/\D/g, "");
    if (query.length < 2) return [];
    
    return customers.filter(c => {
      if (customerSearchType === "name") {
        return c.name.toLowerCase().includes(query);
      } else {
        return c.phone.replace(/\D/g, "").includes(query);
      }
    }).slice(0, 4);
  }, [customers, customerName, customerPhone, showCustomerSuggestions, customerSearchType]);

  function selectCustomer(c: MockCustomer) {
    setCustomerId(c.id);
    setCustomerName(c.name);
    setCustomerPhone(c.phone);
    if (c.address || c.neighborhoodId) {
      setDeliveryMethod("envio");
      setAddress(c.address || "");
      setAddressDetail(c.addressDetail || "");
      setSelectedNeighId(c.neighborhoodId || null);
    }
    setShowCustomerSuggestions(false);
    setCustomerSearchType(null);
  }

  // --- Filtered products ---
  const filtered = useMemo(() => {
    return products.filter(p => {
      if (!p.stock) return false;
      if (activeCat !== null && p.categoryId !== activeCat) return false;
      if (search.trim().length >= 2) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, activeCat, search]);

  // --- Cart helpers ---
  function openProdModal(p: Product) {
    setSelectedProd(p);
    setModalQty(1);
    setSelectedExtras([]);
    setModalUnit(p.saleType === "docena" ? "docena" : "unidad");
    if (p.saleType === "quadra" && p.quadraConfig) {
      setQuadraSelections(Array(p.quadraConfig.customizableRowsCount).fill(""));
    } else {
      setQuadraSelections([]);
    }
  }

  function handleProductClick(p: Product) {
    if (p.saleType !== "unidad") {
      openProdModal(p);
    } else {
      const unit: UnitType = "unidad";
      const key = `${p.id}-${unit}`;
      const unitPriceVal = getPriceForUnit(p, unit);
      setCart(prev => {
        const idx = prev.findIndex(i => i.key === key);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
          return next;
        }
        return [...prev, { key, productId: p.id, name: p.name, image: p.image, unitType: unit, price: unitPriceVal, quantity: 1 }];
      });
    }
  }

  function getPriceForUnit(p: Product, unit: UnitType): number {
    if (unit === "docena") return p.pricePerDozen ? parsePrice(p.pricePerDozen) : parsePrice(p.price) * 12;
    if (unit === "media_docena") return p.pricePerHalfDozen ? parsePrice(p.pricePerHalfDozen) : parsePrice(p.price) * 6;
    return parsePrice(p.price);
  }

  function confirmAdd() {
    if (!selectedProd) return;
    const selectionsKey = quadraSelections.length > 0 ? `-${quadraSelections.join('-')}` : '';
    const extrasKey = selectedExtras.length > 0 ? `-ext-${selectedExtras.map(e => e.id).join('-')}` : '';
    const key = `${selectedProd.id}-${modalUnit}${selectionsKey}${extrasKey}`;
    const unitPriceVal = getPriceForUnit(selectedProd, modalUnit);
    setCart(prev => {
      const idx = prev.findIndex(i => i.key === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + modalQty };
        return next;
      }
      return [...prev, { 
        key, 
        productId: selectedProd.id, 
        name: selectedProd.name, 
        image: selectedProd.image, 
        unitType: modalUnit, 
        price: unitPriceVal, 
        quantity: modalQty,
        quadraSelections: selectedProd.saleType === 'quadra' ? [...quadraSelections] : undefined,
        extras: selectedExtras.length > 0 ? [...selectedExtras.map(e => ({ name: e.name, price: e.price }))] : undefined
      }];
    });
    setSelectedProd(null);
  }

  function updateQty(key: string, delta: number) {
    setCart(prev => prev.map(i => i.key === key ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
  }

  const subtotal = cart.reduce((s, i) => s + itemSubtotal(i), 0);
  const selectedNeigh = neighborhoods.find(n => n.id === selectedNeighId);
  const deliveryCost = deliveryMethod === "envio" && selectedNeigh ? selectedNeigh.deliveryCost : 0;
  const baseTotal = subtotal + deliveryCost;
  const creditCardSurcharge = payment === "Tarjeta de crédito" ? baseTotal * 0.15 : 0;
  const total = baseTotal + creditCardSurcharge;

  function handleSend() {
    if (!customerName.trim() || cart.length === 0) return;
    setSending(true);

    const formattedCustomerName = customerName.trim().split(/\s+/).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');

    mockCustomersStore.addOrUpdateCustomer({
      id: customerId || undefined,
      name: formattedCustomerName,
      phone: customerPhone.trim(),
      address: deliveryMethod === "envio" ? address : "",
      neighborhoodId: deliveryMethod === "envio" && selectedNeighId ? selectedNeighId : undefined,
      addressDetail: deliveryMethod === "envio" ? addressDetail : "",
      orders: 1,
      total,
    });

    const itemsForStore = cart.map(i => {
      let itemName = `${i.name}${i.unitType !== "unidad" ? ` (${i.unitType === "docena" ? "Docena" : "1/2 Doc"})` : ""}`;
      if (i.quadraSelections && i.quadraSelections.length > 0) {
        itemName += ` [${i.quadraSelections.join(', ')}]`;
      }
      if (i.extras && i.extras.length > 0) {
        itemName += ` (+ ${i.extras.map(e => e.name).join(', ')})`;
      }
      if (i.note) itemName += ` - Nota: ${i.note}`;
      return {
        name: itemName,
        quantity: i.quantity,
        price: i.price,
      };
    });

    mockOrdersStore.addOrder({
      items: itemsForStore,
      clientName: formattedCustomerName,
      phone: customerPhone.trim() || undefined,
      address: deliveryMethod === "retiro" ? "Retiro en local" : `${address}${selectedNeigh ? ` - ${selectedNeigh.name}` : ""}`,
      paymentMethod: payment,
      deliveryFee: deliveryCost,
      total,
    });

    setTimeout(() => {
      setSending(false);
      setShowModal(false);
      setCart([]);
      setCustomerId(null); setCustomerName(""); setCustomerPhone(""); setAddress(""); setAddressDetail("");
      setDeliveryMethod("retiro"); setSelectedNeighId(null); setPayment("Efectivo"); setDineroRecibido("");
    }, 600);
  }

  const unitLabel: Record<UnitType, string> = { unidad: "Unidad", media_docena: "Media Docena", docena: "Docena" };

  return (
    <div className="flex h-full overflow-hidden bg-[#09090b] gap-2 p-2">

      {/* ═══ LEFT: CATALOG ═══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950 border border-zinc-800/60 rounded-2xl overflow-hidden">

        {/* Search + category bar */}
        <div className="shrink-0 p-3 border-b border-zinc-800/60 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={15} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-medium text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-sky-500/60 transition"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {CATS.map(c => (
              <button
                key={String(c.id)}
                onClick={() => setActiveCat(c.id)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold border transition ${
                  activeCat === c.id
                    ? "bg-sky-500/20 border-sky-500/50 text-sky-400"
                    : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                }`}
              >{c.label}</button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-3">
          {filtered.length === 0 ? (
            <div className="h-full flex items-center justify-center text-zinc-600 text-sm font-bold">Sin productos</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
              {filtered.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleProductClick(p)}
                  className="group bg-zinc-900 border border-zinc-800/80 rounded-xl overflow-hidden text-left hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-900/10 active:scale-[.97] transition-all"
                >
                  <div className="aspect-[4/3] bg-zinc-800 relative overflow-hidden">
                    <Image src={p.image} alt={p.name} fill sizes="200px" className="object-cover group-hover:scale-105 transition duration-500" />
                    {p.isOffer && (
                      <span className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">OFERTA</span>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="font-bold text-xs text-zinc-200 leading-tight line-clamp-2 mb-1.5 group-hover:text-white">{p.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-orange-400">{p.price}</span>
                    </div>
                    {p.saleType !== "unidad" && (
                      <p className="text-[9px] text-zinc-600 font-bold mt-0.5 uppercase tracking-wide">
                        {p.saleType === "docena" ? "por docena" : "unidad / doc"}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ RIGHT: ORDER PANEL ══════════════════════════════════════ */}
      <div className="w-80 xl:w-96 shrink-0 flex flex-col bg-zinc-950 border border-zinc-800/60 rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="shrink-0 px-4 py-3 border-b border-zinc-800/60 flex items-center gap-2">
          <ShoppingBasket size={16} className="text-sky-400" />
          <span className="font-black text-sm text-zinc-100 tracking-wide">Pedido Actual</span>
          {cart.length > 0 && (
            <span className="ml-auto bg-sky-500/20 text-sky-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-sky-500/30">
              {cart.length} ítem{cart.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-zinc-700">
              <ShoppingBasket size={36} strokeWidth={1.5} />
              <p className="text-xs font-bold uppercase tracking-widest">Carrito vacío</p>
            </div>
          ) : cart.map(item => (
            <div key={item.key} className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-3.5 flex flex-col gap-3">
              {/* Name & Actions */}
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-zinc-200 leading-tight flex-1 min-w-0 pr-1">{item.name}</p>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => { setEditingNoteId(item.key); setTempNote(item.note || ""); }} className={`p-1.5 rounded-lg transition ${item.note ? "bg-sky-500/20 text-sky-400" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-sky-400"}`}>
                    <MessageSquare size={14} />
                  </button>
                  <button onClick={() => setCart(c => c.filter(i => i.key !== item.key))} className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-red-500/20 hover:text-red-500 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Details & Controls */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                  <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">{unitLabel[item.unitType]}</p>
                  <p className="text-base font-black text-orange-400 leading-none mt-1">{fmtARS(itemSubtotal(item))}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg p-1 shrink-0">
                  <button onClick={() => updateQty(item.key, -1)} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white rounded-md transition hover:bg-zinc-800 active:scale-95"><Minus size={14} /></button>
                  <span className="text-sm font-black text-zinc-100 w-5 text-center tabular-nums">{item.quantity}</span>
                  <button onClick={() => updateQty(item.key, 1)} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white rounded-md transition hover:bg-zinc-800 active:scale-95"><Plus size={14} /></button>
                </div>
              </div>
              {item.quadraSelections && item.quadraSelections.length > 0 && (
                <div className="text-[11px] text-zinc-400 font-bold italic mt-1 leading-tight">
                  Sabores: {item.quadraSelections.join(', ')}
                </div>
              )}
              {item.extras && item.extras.length > 0 && (
                <div className="text-[11px] text-orange-400 font-bold italic mt-1 leading-tight">
                  Extras: {item.extras.map(e => e.name).join(', ')}
                </div>
              )}
              {item.note && (
                <div className="bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold rounded-lg p-2.5 w-full flex items-start gap-2 leading-tight mt-1">
                  <MessageSquare size={14} className="shrink-0 mt-0.5" />
                  <span>{item.note}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="shrink-0 p-3 border-t border-zinc-800/60 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Subtotal</span>
            <span className="font-black text-lg text-zinc-100 tabular-nums">{fmtARS(subtotal)}</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            disabled={cart.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-black py-3 rounded-xl transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-sky-900/30 text-sm"
          >
            <Send size={15} />
            Confirmar Pedido
          </button>
        </div>
      </div>

      {/* ═══ PRODUCT UNIT MODAL ══════════════════════════════════════ */}
      {selectedProd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 pb-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-black text-xl text-white tracking-tight">Agregar al Pedido</h2>
                  <p className="text-sm font-bold text-zinc-400 mt-1">{selectedProd.name}</p>
                </div>
                <button onClick={() => setSelectedProd(null)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-6">
              {/* Opciones (Para combo o cualquier empanada) */}
              {(selectedProd.saleType === "combo" || selectedProd.category === "Empanadas") && (
                <div>
                  <p className="font-black text-white text-sm mb-3">¿Cómo querés pedirlo?</p>
                  <div className="flex bg-zinc-900 rounded-xl border border-zinc-800 p-1 mb-3">
                    {(["unidad", "media_docena", "docena"] as UnitType[]).map(u => (
                      <button key={u} onClick={() => setModalUnit(u)}
                        className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition ${modalUnit === u ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}>
                        {u === "unidad" ? "Por Unidad" : u === "media_docena" ? "1/2 Docena" : "Docena"}
                      </button>
                    ))}
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl px-4 py-3 flex items-center">
                    <span className="text-xs font-bold text-zinc-500">
                      Precio {modalUnit === "unidad" ? "unidad" : modalUnit === "media_docena" ? "media docena" : "docena"}: 
                      <span className="text-white ml-1">{fmtARS(getPriceForUnit(selectedProd, modalUnit))}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Selector Quadra */}
              {selectedProd.saleType === "quadra" && selectedProd.quadraConfig && (
                <div>
                  <p className="font-black text-white text-sm mb-3">Elegí los sabores</p>
                  <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-4 space-y-3">
                    {selectedProd.quadraConfig.fixedRows.length > 0 && (
                      <p className="text-xs text-zinc-400 mb-2">
                        Fijas: {selectedProd.quadraConfig.fixedRows.map(f => `${f.rowCount}x ${f.variety}`).join(', ')}
                      </p>
                    )}
                    {Array.from({ length: selectedProd.quadraConfig.customizableRowsCount }).map((_, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-500">Fila #{idx + 1}</label>
                        <select
                          value={quadraSelections[idx] || ""}
                          onChange={e => {
                            const newSels = [...quadraSelections];
                            newSels[idx] = e.target.value;
                            setQuadraSelections(newSels);
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none focus:border-sky-500/60 transition"
                        >
                          <option value="" disabled>Seleccionar variedad</option>
                          {varieties.filter(v => v.available).map(v => (
                            <option key={v.id} value={v.name}>{v.name}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extras (para Pizzas) */}
              {selectedProd.categoryId && [1, 101, 102, 103].includes(selectedProd.categoryId) && (
                <div>
                  <p className="font-black text-white text-sm mb-3">Extras</p>
                  <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-3 grid grid-cols-1 gap-2">
                    {extras.filter(e => e.available).map(extra => {
                      const isSelected = selectedExtras.some(e => e.id === extra.id);
                      return (
                        <label key={extra.id} className={`flex items-center justify-between p-2.5 rounded-lg border transition cursor-pointer select-none ${isSelected ? 'bg-orange-500/10 border-orange-500/50' : 'bg-zinc-900 border-zinc-800'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-sm flex items-center justify-center shrink-0 border ${isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'bg-zinc-950 border-zinc-700 text-transparent'}`}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={isSelected ? 'opacity-100' : 'opacity-0'}><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <span className={`text-sm font-bold ${isSelected ? 'text-zinc-100' : 'text-zinc-300'}`}>{extra.name}</span>
                          </div>
                          <span className="text-xs font-black text-orange-400">+{fmtARS(extra.price)}</span>
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedExtras([...selectedExtras, extra]);
                              else setSelectedExtras(selectedExtras.filter(e => e.id !== extra.id));
                            }} 
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cantidad */}
              <div>
                <p className="font-black text-white text-sm mb-3">
                  Cantidad ({modalUnit === "unidad" ? "Unidades" : modalUnit === "media_docena" ? "Medias Docenas" : "Docenas"})
                </p>
                <div className="flex items-center justify-between">
                  <button onClick={() => setModalQty(Math.max(1, modalQty - 1))} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition active:scale-95">
                    <Minus size={20} />
                  </button>
                  <div className="flex items-end gap-2">
                    <span className="font-black text-4xl text-white tabular-nums leading-none">{modalQty}</span>
                    <span className="font-black text-zinc-500 text-sm mb-1">{modalUnit === "unidad" ? "UN" : modalUnit === "media_docena" ? "MD" : "DOC"}</span>
                  </div>
                  <button onClick={() => setModalQty(modalQty + 1)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition active:scale-95">
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Botón */}
              <button 
                onClick={confirmAdd} 
                disabled={selectedProd.saleType === 'quadra' && quadraSelections.some(s => !s)}
                className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm transition active:scale-95 shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
              >
                <ShoppingCart size={16} />
                Agregar al Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CONFIRM ORDER MODAL ═════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

            {/* Header */}
            <div className="shrink-0 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="font-black text-lg text-zinc-100">Detalles del Pedido</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl bg-zinc-900 text-zinc-500 hover:text-white transition"><Minus size={16} /></button>
            </div>

            {/* Resumen */}
            <div className="shrink-0 px-6 py-3 bg-zinc-900/50 border-b border-zinc-800">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-bold">{cart.length} producto{cart.length > 1 ? "s" : ""}</span>
                <span className="font-black text-zinc-100">{fmtARS(subtotal)}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
              {/* Nombre y Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                <div className="relative">
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Nombre del cliente *</label>
                  <input value={customerName} 
                    onChange={e => {
                      setCustomerName(e.target.value);
                      setCustomerId(null);
                      setCustomerSearchType("name");
                      setShowCustomerSuggestions(true);
                    }}
                    onFocus={() => {
                      if (customerName.length >= 2) {
                        setCustomerSearchType("name");
                        setShowCustomerSuggestions(true);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowCustomerSuggestions(false), 200)}
                    autoFocus
                    placeholder="Ej. Juan García"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-sky-500/60 transition" />
                </div>
                <div className="relative">
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Teléfono *</label>
                  <input value={customerPhone} 
                    onChange={e => {
                      setCustomerPhone(e.target.value);
                      setCustomerId(null);
                      setCustomerSearchType("phone");
                      setShowCustomerSuggestions(true);
                    }}
                    onFocus={() => {
                      if (customerPhone.length >= 2) {
                        setCustomerSearchType("phone");
                        setShowCustomerSuggestions(true);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowCustomerSuggestions(false), 200)}
                    type="tel"
                    placeholder="Ej. 3514567890"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-sky-500/60 transition" />
                </div>

                {/* Autocomplete Dropdown */}
                {showCustomerSuggestions && suggestedCustomers.length > 0 && (
                  <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-[60]">
                    <div className="px-3 py-2 bg-zinc-900 border-b border-zinc-700">
                      <p className="text-xs font-bold text-zinc-400">Clientes registrados sugeridos</p>
                    </div>
                    {suggestedCustomers.map(c => (
                      <button key={c.id} onMouseDown={(e) => { e.preventDefault(); selectCustomer(c); }}
                        className="w-full text-left px-4 py-3 hover:bg-zinc-700 transition flex flex-col gap-1 border-b border-zinc-700/50 last:border-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">{c.name}</span>
                          <span className="text-xs font-bold text-sky-400">{c.phone}</span>
                        </div>
                        {c.address && (
                          <span className="text-[11px] text-zinc-400 font-medium truncate">{c.address} {c.addressDetail ? `- ${c.addressDetail}` : ""}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Entrega */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Método de entrega</label>
                <div className="flex gap-2">
                  {(["retiro", "envio"] as const).map(m => (
                    <button key={m} onClick={() => setDeliveryMethod(m)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition ${deliveryMethod === m ? "bg-sky-500/15 border-sky-500/40 text-sky-400" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"}`}>
                      {m === "retiro" ? "🏠 Retiro en local" : "🛵 Envío a domicilio"}
                    </button>
                  ))}
                </div>
              </div>

              {deliveryMethod === "envio" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                  {neighborhoods.length > 0 && (
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1.5">Barrio / Zona *</label>
                      <div className="relative">
                        <select value={selectedNeighId ?? ""} onChange={e => setSelectedNeighId(Number(e.target.value))}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-100 outline-none focus:border-sky-500/60 appearance-none transition">
                          <option value="" disabled className="bg-zinc-900 text-zinc-500">Seleccioná el barrio</option>
                          {neighborhoods.map(n => (
                            <option key={n.id} value={n.id} className="bg-zinc-900">{n.name} (+{fmtARS(n.deliveryCost)})</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5">Dirección *</label>
                    <input value={address} onChange={e => setAddress(e.target.value.toUpperCase())}
                      placeholder="CALLE, NÚMERO..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-bold uppercase text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-sky-500/60 transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5">Detalles (opcional)</label>
                    <input value={addressDetail} onChange={e => setAddressDetail(e.target.value)}
                      placeholder="Piso, depto, referencias..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-sky-500/60 transition" />
                  </div>
                </div>
              )}

              {/* Pago */}
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Método de pago</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                  {["Efectivo", "Transferencia", "Tarjeta de crédito"].map(m => (
                    <button key={m} onClick={() => setPayment(m)}
                      className={`py-2.5 text-xs font-bold rounded-xl border transition ${payment === m ? "bg-sky-500/15 border-sky-500/40 text-sky-400" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"}`}>
                      {m}
                    </button>
                  ))}
                </div>
                {payment === "Efectivo" && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1.5">Dinero recibido</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
                        <input 
                          type="number"
                          value={dineroRecibido} 
                          onChange={e => setDineroRecibido(e.target.value)}
                          placeholder="Ej. 10000"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-4 py-2.5 text-sm font-black text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-sky-500/60 transition" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1.5">Vuelto a entregar</label>
                      <div className={`w-full bg-zinc-900 border ${Number(dineroRecibido) >= total ? "border-emerald-500/40 text-emerald-400" : "border-zinc-800 text-zinc-500"} rounded-xl px-4 py-2.5 text-sm font-black flex items-center h-[42px]`}>
                        {dineroRecibido && Number(dineroRecibido) >= total 
                          ? fmtARS(Number(dineroRecibido) - total) 
                          : "---"}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500 font-bold uppercase tracking-wide">Subtotal</span>
                  <span className="text-zinc-300 font-bold">{fmtARS(subtotal)}</span>
                </div>
                {deliveryCost > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500 font-bold uppercase tracking-wide">Envío ({selectedNeigh?.name})</span>
                    <span className="text-zinc-300 font-bold">{fmtARS(deliveryCost)}</span>
                  </div>
                )}
                {creditCardSurcharge > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500 font-bold uppercase tracking-wide">Recargo TC (15%)</span>
                    <span className="text-red-400 font-bold">+{fmtARS(creditCardSurcharge)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1.5 border-t border-zinc-800">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Total</span>
                  <span className="font-black text-xl text-white tabular-nums">{fmtARS(total)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="shrink-0 px-6 py-4 border-t border-zinc-800 flex gap-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-sm hover:text-white transition">
                Cancelar
              </button>
              <button
                onClick={handleSend}
                disabled={sending || !customerName.trim() || !customerPhone.trim() || (deliveryMethod === "envio" && (!address.trim() || !selectedNeighId))}
                className="flex-2 flex-[2] flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-sm transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-sky-900/30"
              >
                <Send size={15} />
                {sending ? "Enviando..." : "Enviar a Cocina"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ITEM NOTE MODAL ═════════════════════════════════════════ */}
      {editingNoteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xs shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 p-5">
            <h3 className="font-black text-white text-lg mb-1">Nota para Cocina</h3>
            <p className="text-xs text-zinc-400 mb-4">Aclaraciones sobre este producto en particular.</p>
            <textarea autoFocus value={tempNote} onChange={e => setTempNote(e.target.value)} rows={3}
              placeholder="Ej: Sin aceitunas, bien cocida..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-medium text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-sky-500/60 transition resize-none mb-4" />
            <div className="flex gap-2">
              <button onClick={() => setEditingNoteId(null)} className="flex-1 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-xs hover:text-white transition">Cancelar</button>
              <button onClick={() => {
                setCart(c => c.map(i => i.key === editingNoteId ? { ...i, note: tempNote.trim() } : i));
                setEditingNoteId(null);
              }} className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs transition active:scale-95">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
