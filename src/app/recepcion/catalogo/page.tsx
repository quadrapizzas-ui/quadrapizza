"use client";

import Link from "next/link";
import { Package, Tag, ArrowRight, Plus, AlertTriangle, Settings, PieChart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useProducts } from "@/context/ProductsContext";

export default function AdminDashboardPage() {
  const { products } = useProducts();

  const totalProducts = products.length;
  const offerProducts = products.filter(p => p.isOffer);
  const activeOffers = offerProducts.length;
  const outOfStockProducts = products.filter(p => !p.stock);
  
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getPercentage = (category: string) => {
    if (totalProducts === 0) return 0;
    return Math.round(((categoryCounts[category] || 0) / totalProducts) * 100);
  };

  const categoriesDef = [
    { name: "Pizzas", color: "bg-sky-500" },
    { name: "Empanadas", color: "bg-sky-400" },
    { name: "Sándwiches", color: "bg-zinc-400" },
    { name: "Promos", color: "bg-zinc-500" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      
      {/* Header */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Catálogo General</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Gestión de menú y ofertas</p>
        </div>
        <Link 
          href="/recepcion/catalogo/productos"
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-black rounded-xl transition active:scale-95 shadow-lg shadow-sky-900/30"
        >
          <Plus size={14} />
          Nuevo Producto
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        
        {/* Enlaces de Gestión Rápida */}
        <div className="grid grid-cols-3 gap-4">
          <Link href="/recepcion/catalogo/productos" className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 hover:border-zinc-700 hover:bg-zinc-800/50 transition group">
             <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
               <Package size={18} />
             </div>
             <div className="text-center sm:text-left">
               <p className="text-sm font-black text-white">Productos</p>
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden sm:block">Gestión de stock y precios</p>
             </div>
          </Link>
          
          <Link href="/recepcion/catalogo/categorias" className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 hover:border-zinc-700 hover:bg-zinc-800/50 transition group">
             <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
               <PieChart size={18} />
             </div>
             <div className="text-center sm:text-left">
               <p className="text-sm font-black text-white">Categorías</p>
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden sm:block">Estructura del menú</p>
             </div>
          </Link>

          <Link href="/recepcion/catalogo/envios" className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 hover:border-zinc-700 hover:bg-zinc-800/50 transition group">
             <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
               <Settings size={18} />
             </div>
             <div className="text-center sm:text-left">
               <p className="text-sm font-black text-white">Zonas de Envío</p>
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hidden sm:block">Barrios y costos de delivery</p>
             </div>
          </Link>
        </div>

        {/* Top KPIs Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 hover:border-zinc-700 transition group">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 group-hover:bg-zinc-700 transition">
              <Package size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Productos</p>
              <h3 className="text-2xl font-black text-zinc-100 leading-none mt-1">{totalProducts}</h3>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 hover:border-zinc-700 transition">
            <div className="w-12 h-12 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400 border border-sky-500/20 shrink-0">
              <Tag size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ofertas Activas</p>
              <h3 className="text-2xl font-black text-sky-400 leading-none mt-1">{activeOffers}</h3>
            </div>
          </div>
        </div>

        {/* Middle Section: Distribution & Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Distribución */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <PieChart size={16} className="text-zinc-500" /> Distribución
              </h3>
              <span className="text-[9px] font-black uppercase tracking-widest bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700 text-zinc-400">Top 4</span>
            </div>
            <div className="flex flex-col gap-3">
              {categoriesDef.map(cat => {
                const pct = getPercentage(cat.name);
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <span className="text-zinc-300">{cat.name}</span>
                      <span className="text-zinc-500">{pct}%</span>
                    </div>
                    <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                      <div className={`${cat.color} h-1.5 rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Configuración */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Settings size={16} className="text-zinc-500" /> Configuración de Tienda
            </h3>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">WhatsApp de Pedidos</label>
                <input 
                  type="text" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 outline-none focus:border-sky-500/60 transition font-bold text-sm text-zinc-100 placeholder:text-zinc-600" 
                  defaultValue="+5493518046223" 
                  placeholder="+54 9 3518..." 
                />
                <p className="text-[10px] font-bold text-zinc-600 mt-1.5 leading-tight">Los carritos armados se enviarán como mensaje a este número.</p>
              </div>
              <button className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-white font-black py-2.5 rounded-xl transition active:scale-95 text-xs shadow-sm">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Offer List & Out of Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Ofertas */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Tag size={16} className="text-sky-500" /> Productos en Oferta
              </h3>
              <Link href="/recepcion/catalogo/productos" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-sky-400 flex items-center gap-1 transition">
                Ver todos <ArrowRight size={10} />
              </Link>
            </div>
            
            <div className="space-y-2">
              {offerProducts.length > 0 ? (
                offerProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition group">
                    <div className="w-12 h-12 rounded-lg overflow-hidden relative bg-zinc-900 shrink-0">
                      <Image src={p.image} alt={p.name} fill sizes="48px" className="object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-bold text-xs text-zinc-100 truncate">{p.name}</h4>
                        <span className="bg-sky-500/15 text-sky-400 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shrink-0 border border-sky-500/20">
                          Oferta
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{p.category}</span>
                        <span className="font-black text-xs text-white">{p.price}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-zinc-600 bg-zinc-950 rounded-xl border border-dashed border-zinc-800">
                   <ShoppingBag size={24} strokeWidth={1.5} />
                   <p className="text-[10px] font-bold uppercase tracking-widest">Sin ofertas activas</p>
                </div>
              )}
            </div>
          </div>

          {/* Sin Stock */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <AlertTriangle size={16} className="text-orange-500" /> Sin Stock
              </h3>
              <Link href="/recepcion/catalogo/productos" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-orange-400 flex items-center gap-1 transition">
                Gestionar <ArrowRight size={10} />
              </Link>
            </div>
            
            <div className="space-y-2">
              {outOfStockProducts.length > 0 ? (
                outOfStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 transition group">
                    <div className="w-12 h-12 rounded-lg overflow-hidden relative bg-zinc-950 shrink-0 opacity-60 grayscale">
                      <Image src={p.image} alt={p.name} fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-bold text-xs text-zinc-100 truncate">{p.name}</h4>
                        <span className="bg-orange-500/15 text-orange-400 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shrink-0 border border-orange-500/20">
                          Agotado
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{p.category}</span>
                        <span className="font-black text-xs text-zinc-500 line-through">{p.price}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-emerald-500/60 bg-emerald-500/5 rounded-xl border border-dashed border-emerald-500/20">
                   <Package size={24} strokeWidth={1.5} />
                   <p className="text-[10px] font-bold uppercase tracking-widest">Stock completo</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
