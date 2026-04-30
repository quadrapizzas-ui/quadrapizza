"use client"
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, ExtendedProduct } from "@/lib/mockData";
import { v4 as uuidv4 } from "uuid";

export default function CatalogAdminPage() {
  const [products, setProducts] = useState<ExtendedProduct[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(MOCK_CATEGORIES.map(c => c.name));
  const [isCatManagerOpen, setIsCatManagerOpen] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<ExtendedProduct> | null>(null);

  // Utilidad de formateo
  const formatCategory = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getCategoryName = (id: string | null) => {
     const cat = MOCK_CATEGORIES.find(c => c.id === id);
     return cat ? cat.name : "Sin Categoría";
  };

  const handleAddCategory = () => {
    if (newCat.trim()) {
      const formatted = newCat.trim().toUpperCase();
      if (!categories.includes(formatted)) {
        setCategories([...categories, formatted]);
      }
      setNewCat('');
    }
  };

  const removeCategory = (catToRemove: string) => {
    setCategories(categories.filter(c => c !== catToRemove));
  };

  const handleEditClick = (product: ExtendedProduct) => {
    setEditingProduct({ ...product });
  };

  const handleNewProduct = () => {
    setEditingProduct({
      id: '',
      name: '',
      category_id: MOCK_CATEGORIES[0]?.id || '',
      price: 0,
      stock: null,
      is_menu_del_dia: false,
      is_promo: false,
      is_active: true,
      image_url: ''
    });
  };

  const toggleFlag = (id: string, field: keyof ExtendedProduct) => {
    setProducts(curr => curr.map(p => {
       if (p.id === id) {
          const updated = { ...p, [field]: !p[field] };
          // Apply to the mock array directly
          const index = MOCK_PRODUCTS.findIndex(mp => mp.id === id);
          if(index > -1) MOCK_PRODUCTS[index] = updated as ExtendedProduct;
          return updated as ExtendedProduct;
       }
       return p;
    }));
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${name}" permanentemente?`)) {
      setProducts(curr => curr.filter(p => p.id !== id));
      const index = MOCK_PRODUCTS.findIndex(mp => mp.id === id);
      if(index > -1) MOCK_PRODUCTS.splice(index, 1);
    }
  };

  const handleSaveEdit = () => {
    if (editingProduct && editingProduct.name?.trim() !== '') {
      if (editingProduct.id === '') {
         // Create new
         const newProduct = {
           ...editingProduct,
           id: "prod-" + uuidv4(),
           created_at: new Date().toISOString(),
           updated_at: new Date().toISOString(),
         } as ExtendedProduct;
         setProducts(curr => [newProduct, ...curr]);
         MOCK_PRODUCTS.unshift(newProduct);
      } else {
         // Update existing
         setProducts(curr => curr.map(p => p.id === editingProduct.id ? (editingProduct as ExtendedProduct) : p));
         const index = MOCK_PRODUCTS.findIndex(mp => mp.id === editingProduct.id);
         if(index > -1) MOCK_PRODUCTS[index] = editingProduct as ExtendedProduct;
      }
      setEditingProduct(null);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-10 relative z-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b gap-4 border-zinc-800 pb-6">
           <div>
             <h1 className="text-2xl md:text-3xl font-black mb-1">Catálogo</h1>
             <p className="text-zinc-400 text-sm md:text-base">Gestioná tus productos, precios, stock interactuando con switches.</p>
           </div>
           <Button onClick={handleNewProduct} className="shadow-[0_0_20px_rgba(234,88,12,0.3)] w-full md:w-auto mt-2 md:mt-0">+ Nuevo Producto</Button>
        </header>

        {/* Caja de Herramientas de tabla */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-sm">
           <div className="relative w-full lg:w-auto">
             <svg className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             <input type="text" placeholder="Buscar por nombre..." className="bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 w-full lg:w-72 transition" />
           </div>
           <div className="flex gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar pb-1 lg:pb-0">
              <div className="flex items-center w-full lg:w-auto min-w-max gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-1">
                <select className="bg-transparent border-none px-3 py-2.5 text-sm focus:outline-none font-medium cursor-pointer text-zinc-300 w-full md:w-48">
                  <option className="bg-zinc-900 text-zinc-100">Todas las categorías</option>
                  {categories.map(c => (
                     <option key={c} value={c} className="bg-zinc-900 text-zinc-100">{formatCategory(c)}</option>
                  ))}
                </select>
                <button 
                  onClick={() => setIsCatManagerOpen(true)}
                  title="Administrador de Categorías"
                  className="px-3 border-l border-zinc-800 text-zinc-500 hover:text-orange-500 transition-colors h-full flex items-center"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </button>
              </div>
           </div>
        </div>

        {/* Tabla Base de Datos (DataGrid) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
            <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider text-[11px] font-black">
              <tr>
                <th className="px-6 py-5">Producto (Nombre)</th>
                <th className="px-6 py-5">Categoría</th>
                <th className="px-6 py-5">Precio</th>
                <th className="px-6 py-5 text-center">Menú del Día</th>
                <th className="px-6 py-5 text-center">Promo Activa</th>
                <th className="px-6 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {products.map(p => (
                <tr key={p.id} className={`hover:bg-zinc-800/40 transition group cursor-default ${!p.is_active ? 'opacity-40' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex-shrink-0 overflow-hidden">
                        {p.image_url ? (
                           <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full opacity-20 flex items-center justify-center text-[8px] font-bold">Sin IMG</div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-zinc-100 text-base">{p.name}</div>
                        <span className="text-[10px] text-zinc-500 mt-1 inline-block">Ref: {p.id.split('-').pop()?.substring(0,6)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="bg-zinc-800 px-3 py-1 rounded-full text-xs font-medium text-zinc-300">{formatCategory(getCategoryName(p.category_id!))}</span></td>
                  <td className="px-6 py-4 font-black text-orange-500 text-base">${p.price}</td>
                  
                  {/* Toggles Interactivas */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <div onClick={() => toggleFlag(p.id, 'is_menu_del_dia')} className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors shadow-inner ${p.is_menu_del_dia ? 'bg-orange-500' : 'bg-zinc-800 border-zinc-700 border'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${p.is_menu_del_dia ? 'translate-x-5 shadow-sm' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <div onClick={() => toggleFlag(p.id, 'is_promo')} className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors shadow-inner ${p.is_promo ? 'bg-orange-500' : 'bg-zinc-800 border-zinc-700 border'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${p.is_promo ? 'translate-x-5 shadow-sm' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                     <button onClick={() => handleEditClick(p)} className="text-blue-500/80 hover:text-blue-400 mr-3 font-medium transition">Editar</button>
                     <button onClick={() => toggleFlag(p.id, 'is_active')} className={p.is_active ? "text-orange-500/80 hover:text-orange-400 mr-3 font-medium transition" : "text-green-500/80 hover:text-green-400 mr-3 font-medium transition"}>
                       {p.is_active ? 'Ocultar' : 'Activar'}
                     </button>
                     <button onClick={() => handleDeleteProduct(p.id, p.name)} className="text-red-500/80 hover:text-red-400 font-medium transition">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Gestor de Categorias */}
      {isCatManagerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Overlay */}
           <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCatManagerOpen(false)} />
           
           {/* Panel Flotante */}
           <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Gestor de Categorías</h2>
                <button onClick={() => setIsCatManagerOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              {/* Input Añadir */}
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ej. Postres" 
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500" 
                />
                <Button onClick={handleAddCategory} className="shadow-lg h-auto">Agregar</Button>
              </div>

              {/* Lista Existente */}
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                {categories.map((c) => (
                  <div key={c} className="flex justify-between items-center bg-zinc-900 p-3 rounded-xl border border-zinc-800/80">
                    <div>
                      <span className="font-bold text-sm block">{formatCategory(c)}</span>
                      <span className="text-[10px] font-mono text-zinc-500">[{c}]</span>
                    </div>
                    <button onClick={() => removeCategory(c)} className="text-red-500/50 hover:text-red-500 p-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                ))}
              </div>
           </div>
        </div>
      )}

      {/* Modal Editor de Producto */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Overlay */}
           <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditingProduct(null)} />
           
           {/* Panel Flotante */}
           <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-md p-5 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center px-1">
                <h2 className="text-xl font-bold">{editingProduct.id === '' ? 'Nuevo Producto' : 'Editar Producto'}</h2>
                <button onClick={() => setEditingProduct(null)} className="text-zinc-500 hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <div className="flex flex-col gap-4">
                 <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Nombre</label>
                   <input 
                     type="text" 
                     value={editingProduct.name}
                     onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                     className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors shadow-inner" 
                   />
                 </div>
                 
                 <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Categoría</label>
                   <select 
                     value={editingProduct.category_id || ""}
                     onChange={(e) => setEditingProduct({...editingProduct, category_id: e.target.value})}
                     className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors cursor-pointer shadow-inner appearance-none text-zinc-300"
                   >
                     {MOCK_CATEGORIES.map(c => (
                        <option key={c.id} value={c.id} className="bg-zinc-900 text-zinc-100">{formatCategory(c.name)}</option>
                     ))}
                   </select>
                 </div>

                 <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Precio ($)</label>
                   <input 
                     type="number" 
                     value={editingProduct.price}
                     onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                     className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors shadow-inner" 
                   />
                 </div>

                 <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Imagen del Producto</label>
                   <div className="flex items-center gap-3">
                     <div className="w-20 h-20 rounded-lg bg-zinc-800 border border-zinc-700 flex-shrink-0 overflow-hidden shadow-inner relative">
                        {editingProduct.image_url ? (
                           <img src={editingProduct.image_url} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-zinc-500 text-[10px] uppercase font-bold bg-zinc-900/50">Vacio</div>
                        )}
                     </div>
                     <div className="flex flex-col gap-2 flex-1 w-full">
                        <label className="w-full flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-orange-500 hover:text-orange-500 rounded-xl px-4 py-2 text-xs font-medium transition-colors cursor-pointer text-zinc-400 shadow-inner group">
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:scale-110 transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                           <span className="truncate">Cargar desde PC</span>
                           <input 
                             type="file" 
                             accept="image/*"
                             className="hidden"
                             onChange={(e) => {
                               if (e.target.files && e.target.files[0]) {
                                 const localUrl = URL.createObjectURL(e.target.files[0]);
                                 setEditingProduct({...editingProduct, image_url: localUrl});
                               }
                             }}
                           />
                        </label>
                        <input 
                          type="text" 
                          placeholder="O pega link (https://..)" 
                          value={editingProduct.image_url || ''}
                          onChange={(e) => setEditingProduct({...editingProduct, image_url: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-orange-500 transition-colors shadow-inner" 
                        />
                     </div>
                   </div>
                 </div>
              </div>

              <div className="flex gap-3 mt-2">
                <Button variant="outline" className="flex-1 w-full border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 h-12 rounded-xl" onClick={() => setEditingProduct(null)}>Cancelar</Button>
                <Button className="flex-1 w-full h-12 shadow-[0_0_20px_rgba(234,88,12,0.3)] shadow-orange-500/20 rounded-xl font-bold" onClick={handleSaveEdit}>Guardar</Button>
              </div>
           </div>
        </div>
      )}
    </>
  )
}
