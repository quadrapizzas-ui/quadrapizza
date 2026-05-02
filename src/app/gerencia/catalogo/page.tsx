"use client"
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, ExtendedProduct } from "@/lib/mockData";
import { v4 as uuidv4 } from "uuid";
import { useProducts } from "@/context/ProductsContext";
import { Trash2, Plus, X } from "lucide-react";

export default function CatalogAdminPage() {
  const [products, setProducts] = useState<ExtendedProduct[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(MOCK_CATEGORIES.map(c => c.name));
  const [isCatManagerOpen, setIsCatManagerOpen] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<ExtendedProduct> | null>(null);

  const { extras, setExtras } = useProducts();
  const [isExtrasManagerOpen, setIsExtrasManagerOpen] = useState(false);
  const [newExtraName, setNewExtraName] = useState("");
  const [newExtraPrice, setNewExtraPrice] = useState("");
  const [editingExtraId, setEditingExtraId] = useState<string | null>(null);

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
      image_url: '',
      is_quadra: false,
      quadra_customizable_rows: 0,
      quadra_fixed_rows_count: 0,
      quadra_fixed_variety: '',
      quadra_available_varieties: []
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

              <button 
                onClick={() => setIsExtrasManagerOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-800 hover:text-white transition-colors text-sm font-bold shadow-sm whitespace-nowrap"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Extras
              </button>
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

                 {/* Configuración Quadra */}
                 <div className="flex flex-col gap-3 pt-3 border-t border-zinc-800">
                    <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                      <div>
                        <div className="text-sm font-bold text-zinc-200">Producto Quadra (Filas Editables)</div>
                        <div className="text-[10px] text-zinc-400">Permite al cliente elegir variedades por fila</div>
                      </div>
                      <div onClick={() => setEditingProduct({...editingProduct, is_quadra: !editingProduct.is_quadra})} className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors shadow-inner ${editingProduct.is_quadra ? 'bg-orange-500' : 'bg-zinc-800 border-zinc-700 border'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${editingProduct.is_quadra ? 'translate-x-5 shadow-sm' : 'translate-x-0'}`} />
                      </div>
                    </div>
                    
                    {editingProduct.is_quadra && (
                      <div className="grid grid-cols-2 gap-3 bg-zinc-900 p-4 rounded-xl border border-orange-500/30 shadow-inner">
                         <div className="flex flex-col gap-1.5">
                           <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Filas Editables</label>
                           <input 
                             type="number" 
                             value={editingProduct.quadra_customizable_rows || 0}
                             onChange={(e) => setEditingProduct({...editingProduct, quadra_customizable_rows: Number(e.target.value)})}
                             className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500" 
                           />
                         </div>
                         <div className="flex flex-col gap-1.5">
                           <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Filas Fijas</label>
                           <input 
                             type="number" 
                             value={editingProduct.quadra_fixed_rows_count || 0}
                             onChange={(e) => setEditingProduct({...editingProduct, quadra_fixed_rows_count: Number(e.target.value)})}
                             className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500" 
                           />
                         </div>
                         <div className="flex flex-col gap-1.5 col-span-2">
                           <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1">Sabor de Filas Fijas</label>
                           <input 
                             type="text" 
                             placeholder="Ej. Muzzarella"
                             value={editingProduct.quadra_fixed_variety || ''}
                             onChange={(e) => setEditingProduct({...editingProduct, quadra_fixed_variety: e.target.value})}
                             className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500" 
                           />
                         </div>
                       </div>
                    )}
                 </div>
              </div>

              <div className="flex gap-3 mt-2">
                <Button variant="outline" className="flex-1 w-full border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 h-12 rounded-xl" onClick={() => setEditingProduct(null)}>Cancelar</Button>
                <Button className="flex-1 w-full h-12 shadow-[0_0_20px_rgba(234,88,12,0.3)] shadow-orange-500/20 rounded-xl font-bold" onClick={handleSaveEdit}>Guardar</Button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: Administrador de Extras */}
      {isExtrasManagerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsExtrasManagerOpen(false)} />
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-zinc-100 tracking-tight">Administrar Extras</h2>
                <p className="text-xs text-zinc-500 mt-1">Configurá los extras adicionales para las pizzas</p>
              </div>
              <button 
                onClick={() => setIsExtrasManagerOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 rounded-xl transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Listado de Extras */}
            <div className="overflow-y-auto pr-2 no-scrollbar mb-6 flex-1 min-h-0 space-y-2">
              {extras.map(extra => (
                <div key={extra.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${extra.available ? 'bg-zinc-900/50 border-zinc-800/50' : 'bg-zinc-900/20 border-zinc-800/30 opacity-60'}`}>
                  
                  {editingExtraId === extra.id ? (
                    <div className="flex-1 flex items-center gap-2 mr-2">
                      <input 
                        type="text" 
                        value={newExtraName} 
                        onChange={(e) => setNewExtraName(e.target.value)}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-orange-500"
                        autoFocus
                      />
                      <input 
                        type="number" 
                        value={newExtraPrice} 
                        onChange={(e) => setNewExtraPrice(e.target.value)}
                        className="w-24 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <span className="font-bold text-zinc-200 text-sm">{extra.name}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-black text-orange-400">${extra.price}</span>
                        {!extra.available && <span className="text-[10px] uppercase font-bold text-red-500 bg-red-500/10 px-1.5 rounded-md">Oculto</span>}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1 shrink-0">
                    {editingExtraId === extra.id ? (
                      <button 
                        onClick={() => {
                          setExtras(extras.map(e => e.id === extra.id ? { ...e, name: newExtraName, price: Number(newExtraPrice) } : e));
                          setEditingExtraId(null);
                        }}
                        className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => {
                            setExtras(extras.map(e => e.id === extra.id ? { ...e, available: !e.available } : e));
                          }}
                          className={`p-2 rounded-lg transition ${extra.available ? 'text-zinc-500 hover:text-orange-500 hover:bg-zinc-800' : 'text-green-500 hover:bg-green-500/10'}`}
                          title={extra.available ? "Ocultar extra" : "Mostrar extra"}
                        >
                          {extra.available ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                        </button>
                        <button 
                          onClick={() => {
                            setNewExtraName(extra.name);
                            setNewExtraPrice(extra.price.toString());
                            setEditingExtraId(extra.id);
                          }}
                          className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        </button>
                        <button 
                          onClick={() => setExtras(extras.filter(e => e.id !== extra.id))}
                          className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Crear nuevo */}
            <div className="flex gap-2 border-t border-zinc-800 pt-6 mt-auto">
              <input 
                type="text" 
                placeholder="Nombre del extra..."
                id="addExtraName"
                className="flex-[2] bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-orange-500 text-zinc-100 transition placeholder:text-zinc-600 placeholder:font-normal"
              />
              <input 
                type="number" 
                placeholder="$ Precio"
                id="addExtraPrice"
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-orange-500 text-zinc-100 transition placeholder:text-zinc-600 placeholder:font-normal"
              />
              <button 
                onClick={() => {
                  const nameEl = document.getElementById('addExtraName') as HTMLInputElement;
                  const priceEl = document.getElementById('addExtraPrice') as HTMLInputElement;
                  if (nameEl.value && priceEl.value) {
                    setExtras([...extras, { id: uuidv4(), name: nameEl.value, price: Number(priceEl.value), available: true }]);
                    nameEl.value = '';
                    priceEl.value = '';
                  }
                }}
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-orange-900/20 active:scale-95 shrink-0"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
