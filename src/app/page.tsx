"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, ShoppingBag, Plus, Tag, Filter, ChevronRight, X, Minus, ShoppingCart, Trash2, ArrowLeft, MapPin, Store, CreditCard, ChevronDown } from "lucide-react";
import { useProducts, Product, Neighborhood } from "@/context/ProductsContext";

type Category = {
  id: number;
  name: string;
  parentId: number | null;
};



type CartItem = {
  id: string;
  productId: number;
  name: string;
  quantity: number;
  unitType: 'unidad' | 'media_docena' | 'docena';  // unidad: se pide por pieza, media_docena: por 1/2 doc, docena: se pide por docena
  price: string;           // precio por unidad
  pricePerHalfDozen?: string; // precio especial por media docena
  pricePerDozen?: string;  // precio especial por docena
  originalSaleType: "unidad" | "docena" | "combo"; // tipo original de venta
};

export default function CatalogPage() {
  const categories: Category[] = [
    { id: 1, name: "Pizzas", parentId: null },
    { id: 101, name: "Tradicionales", parentId: 1 },
    { id: 102, name: "Especiales", parentId: 1 },
    { id: 103, name: "Rellenas", parentId: 1 },
    { id: 2, name: "Empanadas", parentId: null },
    { id: 201, name: "Al Horno", parentId: 2 },
    { id: 202, name: "Fritas", parentId: 2 },
    { id: 3, name: "Sándwiches", parentId: null },
    { id: 4, name: "Bebidas", parentId: null },
  ];

  const [selectedPath, setSelectedPath] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectCategory = (categoryId: number | null, depth: number) => {
    if (categoryId === null) {
      setSelectedPath(selectedPath.slice(0, depth));
    } else {
      const newPath = [...selectedPath.slice(0, depth), categoryId];
      setSelectedPath(newPath);
    }
  };

  const { products, neighborhoods } = useProducts();
  const offers = products.filter(p => p.isOffer);

  const getDescendantIds = (catId: number): number[] => {
    const children = categories.filter(c => c.parentId === catId).map(c => c.id);
    return children.reduce((acc, childId) => [...acc, ...getDescendantIds(childId)], children);
  };

  const activeCategoryId = selectedPath.length > 0 ? selectedPath[selectedPath.length - 1] : null;
  
  const filteredOffers = offers.filter(p => {
    if (searchQuery.trim().length >= 3) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !(p.description || '').toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const filteredProducts = products.filter(p => {
    if (searchQuery.trim().length >= 3) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !(p.description || '').toLowerCase().includes(q)) {
        return false;
      }
    }
    if (activeCategoryId === null) return true;
    const validIds = [activeCategoryId, ...getDescendantIds(activeCategoryId)];
    return validIds.includes(p.categoryId || 0);
  });

  const getCategoryBreadcrumbs = (categoryId: number) => {
    const crumbs = [];
    let currentId: number | null = categoryId;
    while (currentId !== null) {
      const cat = categories.find(c => c.id === currentId);
      if (cat) {
        crumbs.unshift(cat.name);
        currentId = cat.parentId;
      } else {
        break;
      }
    }
    return crumbs;
  };

  // --- CART LOGIC ---
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'retiro' | 'envio'>('retiro');
  const [customerAddress, setCustomerAddress] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');

  const [selectedProductForCart, setSelectedProductForCart] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalUnitType, setModalUnitType] = useState<'unidad' | 'media_docena' | 'docena'>('unidad');

  const openAddToCartModal = (product: Product) => {
    setSelectedProductForCart(product);
    setModalQuantity(1);
    // Por defecto: si vende por docena solo → arranca en docena; si no → unidad
    setModalUnitType(product.saleType === 'docena' ? 'docena' : 'unidad');
  };

  const confirmAddToCart = () => {
    if (!selectedProductForCart) return;
    
    const existingItemIndex = cartItems.findIndex(
      item => item.productId === selectedProductForCart.id && item.unitType === modalUnitType
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += modalQuantity;
      setCartItems(updatedCart);
    } else {
      const newItem: CartItem = {
        id: `${selectedProductForCart.id}-${modalUnitType}`,
        productId: selectedProductForCart.id,
        name: selectedProductForCart.name,
        quantity: modalQuantity,
        unitType: modalUnitType,
        price: selectedProductForCart.price,
        pricePerHalfDozen: selectedProductForCart.pricePerHalfDozen,
        pricePerDozen: selectedProductForCart.pricePerDozen,
        originalSaleType: selectedProductForCart.saleType,
      };
      setCartItems([...cartItems, newItem]);
    }
    
    setSelectedProductForCart(null);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateCartItemQuantity = (id: string, delta: number) => {
    setCartItems(current => 
      current.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const parsePrice = (priceStr?: string) => {
    if (!priceStr) return 0;
    const numeric = priceStr.replace(/\./g, '').replace(/[^0-9]/g, '');
    return Number(numeric) || 0;
  };

  const getItemSubtotal = (item: CartItem) => {
    if (item.unitType === 'docena') {
      if (item.originalSaleType === 'docena') {
        return parsePrice(item.price) * item.quantity;
      }
      return item.pricePerDozen ? parsePrice(item.pricePerDozen) * item.quantity : parsePrice(item.price) * 12 * item.quantity;
    }
    if (item.unitType === 'media_docena') {
      return item.pricePerHalfDozen ? parsePrice(item.pricePerHalfDozen) * item.quantity : parsePrice(item.price) * 6 * item.quantity;
    }
    return parsePrice(item.price) * item.quantity;
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + getItemSubtotal(item), 0);
  
  const selectedNeighborhood = neighborhoods.find(n => n.id === selectedNeighborhoodId);
  const deliveryCost = deliveryMethod === 'envio' && selectedNeighborhood ? selectedNeighborhood.deliveryCost : 0;
  const finalTotal = cartTotal + deliveryCost;

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(num);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0 || !customerName.trim()) return;
    if (deliveryMethod === 'envio' && !customerAddress.trim()) return;

    let message = `¡Hola Quadra Pizza! Soy *${customerName.trim()}* y quiero hacer el siguiente pedido:\n\n`;
    cartItems.forEach(item => {
      const subtotal = getItemSubtotal(item);
      const qLabel = item.unitType === 'docena'
        ? `${item.quantity} docena(s)`
        : item.unitType === 'media_docena'
        ? `${item.quantity} media docena(s)`
        : `${item.quantity} unidad(es)`;
      message += `- ${qLabel} de *${item.name}* -> ${formatPrice(subtotal)}\n`;
    });

    message += `\n*TOTAL: ${formatPrice(cartTotal)}*\n`;
    message += `\n*Entrega:*\n`;
    message += `- Método: ${deliveryMethod === 'envio' ? 'Envío a domicilio' : 'Retiro en el local'}\n`;
    if (deliveryMethod === 'envio') {
      message += `- Dirección: ${customerAddress.trim()}\n`;
      if (selectedNeighborhood) message += `- Barrio/Zona: ${selectedNeighborhood.name}\n`;
      if (addressDetails.trim()) message += `- Detalle: ${addressDetails.trim()}\n`;
      if (deliveryCost > 0) message += `- Costo de envío: ${formatPrice(deliveryCost)}\n`;
    }
    message += `- Pago: ${paymentMethod}\n`;
    message += `\n*TOTAL FINAL: ${formatPrice(finalTotal)}*\n`;
    message += `\n¡Muchas gracias!`;

    // El número debería venir de una API en un sistema real. Por ahora está hardcodeado.
    const WHATSAPP_NUMBER = "5493518046223"; 
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-orange-600 selection:text-white pb-20 overflow-x-hidden">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-900">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.jpg" alt="Quadra Pizza Logo" width={32} height={32} className="rounded-lg object-cover shadow-md" />
            <span className="font-black text-xl tracking-tight">Quadra <span className="text-orange-500">Pizza</span></span>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white transition active:scale-95 relative shrink-0 border border-zinc-800"
          >
             <ShoppingBag size={18} className="sm:hidden" />
             <ShoppingBag size={20} className="hidden sm:block" />
             {cartItems.length > 0 && (
               <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[9px] sm:text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-zinc-950">
                 {cartItems.length}
               </span>
             )}
          </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        
        {/* Título Principal y Buscador */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tighter shrink-0">Nuestro Catálogo</h2>
          <div className="relative w-full sm:max-w-sm md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar pizzas, empanadas..." 
              className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition font-medium text-sm text-zinc-100 placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Ofertas Imperdibles */}
        {filteredOffers.length > 0 && (
          <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-orange-500/20 p-2 rounded-full text-orange-500">
              <Tag fill="currentColor" size={20} />
            </div>
            <h2 className="text-2xl font-black tracking-tighter text-orange-500">Ofertas Imperdibles</h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {filteredOffers.map((p) => (
              <div key={p.id} className="shrink-0 w-[280px] bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden flex flex-col relative shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-3 left-3 bg-orange-500 text-white font-black text-[10px] tracking-widest px-3 py-1 rounded-full z-10 animate-pulse">OFERTA</div>
                <div className="aspect-[4/3] bg-zinc-800 relative overflow-hidden">
                  <Image src={p.image} alt={p.name} fill sizes="280px" className="object-cover hover:scale-105 transition duration-500" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between border-t border-zinc-900">
                  <div>
                    <h3 className="font-bold text-[17px] leading-tight mb-1.5 text-zinc-100">{p.name}</h3>
                    <p className="text-[12px] text-zinc-400 line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <span className="text-xs text-red-400/80 line-through font-semibold block mb-0.5">{p.oldPrice}</span>
                      <span className="font-black text-2xl tracking-tight text-orange-500 leading-none">{p.price}</span>
                    </div>
                    <button onClick={() => openAddToCartModal(p)} className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white hover:bg-orange-500 transition active:scale-95 shadow-lg shadow-orange-600/30">
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Filtros Recursivos */}
        <div className="mb-6 space-y-4">
          {[null, ...selectedPath].map((parentId, index) => {
            const children = categories.filter(c => c.parentId === parentId);
            if (children.length === 0) return null;

            const selectedIdAtThisLevel = selectedPath.length > index ? selectedPath[index] : null;

            return (
              <div key={`filter-row-${parentId ?? 'root'}`} className="flex overflow-x-auto gap-2 pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 items-center animate-in fade-in slide-in-from-top-2">
                {index > 0 && (
                  <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-widest mr-2">
                    <Filter size={12} /> Nivel {index + 1}:
                  </div>
                )}
                
                <button 
                  onClick={() => handleSelectCategory(null, index)}
                  className={`shrink-0 px-5 py-2 rounded-full text-sm font-bold border transition ${selectedIdAtThisLevel === null ? (index === 0 ? 'bg-orange-600 text-white border-orange-600' : 'bg-zinc-700 text-white border-zinc-700') : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-orange-500 hover:text-white'}`}
                >
                  {index === 0 ? 'Todos' : 'Todas'}
                </button>
                
                {children.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id, index)}
                    className={`shrink-0 px-5 py-2 rounded-full text-sm font-bold border transition ${selectedIdAtThisLevel === cat.id ? (index === 0 ? 'bg-orange-600 text-white border-orange-600' : 'bg-zinc-700 text-white border-zinc-700') : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-orange-500 hover:text-white'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {/* Grid de Productos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-8 mt-2">
          {filteredProducts.length > 0 ? (
            filteredProducts.filter(p => !p.isOffer && p.stock).map((p) => {
              const breadcrumbs = getCategoryBreadcrumbs(p.categoryId || 0);
              return (
                <div key={p.id} className="group relative bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="aspect-[4/3] bg-zinc-800 relative overflow-hidden">
                    <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover group-hover:scale-105 transition duration-500" />
                    
                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                      {breadcrumbs.map((crumb, idx) => (
                        <div 
                          key={idx} 
                          className={`backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-sm flex items-center gap-1 ${idx === 0 ? 'bg-zinc-950/90 border border-white/50 text-white' : 'bg-zinc-900/80 text-white border-transparent'}`}
                        >
                          {idx > 0 && <ChevronRight size={10} className="opacity-50" />}
                          {crumb}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base leading-tight mb-1.5">{p.name}</h3>
                      <p className="text-[12px] text-zinc-400 line-clamp-2 leading-relaxed">{p.description}</p>
                    </div>
                    
                    <div className="mt-5 flex items-end sm:items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-black text-lg sm:text-xl tracking-tight leading-none">{p.price}</span>
                        {p.saleType === 'combo' && p.pricePerDozen && (
                          <span className="text-[9px] sm:text-[10px] font-bold text-orange-500 mt-1">Docena: {p.pricePerDozen}</span>
                        )}
                        {p.saleType === 'docena' && (
                          <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 mt-1">por docena</span>
                        )}
                      </div>
                      <button 
                        onClick={() => openAddToCartModal(p)}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:bg-orange-600 group-hover:text-white transition active:scale-90 shrink-0"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-zinc-400">
              <Filter size={40} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold text-lg text-zinc-100">No hay productos disponibles</p>
              <p className="text-sm">Intenta seleccionar otra categoría o subcategoría.</p>
            </div>
          )}
        </div>

      </main>

      {/* Modal: Agregar al Carrito */}
      {selectedProductForCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProductForCart(null)}></div>
          <div className="relative bg-zinc-950 rounded-2xl w-full max-w-sm shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 border border-zinc-900">
            <button
              onClick={() => setSelectedProductForCart(null)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 hover:bg-zinc-800 transition text-zinc-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <h2 className="text-xl font-black tracking-tight pr-8 leading-tight mb-1">Agregar al Pedido</h2>
            <p className="text-sm font-semibold text-zinc-400 mb-6">{selectedProductForCart.name}</p>

            <div className="space-y-5">

              {/* Selector Unidad / Media Docena / Docena — solo para saleType 'combo' */}
              {selectedProductForCart.saleType === 'combo' && (
                <div>
                  <label className="block text-sm font-bold mb-2 text-zinc-300">¿Cómo querés pedirlo?</label>
                  <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => { setModalUnitType('unidad'); setModalQuantity(1); }}
                      className={`flex-1 text-xs sm:text-sm font-bold py-2.5 rounded-lg transition ${modalUnitType === 'unidad' ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                    >
                      Por Unidad
                    </button>
                    <button
                      type="button"
                      onClick={() => { setModalUnitType('media_docena'); setModalQuantity(1); }}
                      className={`flex-1 text-xs sm:text-sm font-bold py-2.5 rounded-lg transition ${modalUnitType === 'media_docena' ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                    >
                      1/2 Docena
                    </button>
                    <button
                      type="button"
                      onClick={() => { setModalUnitType('docena'); setModalQuantity(1); }}
                      className={`flex-1 text-xs sm:text-sm font-bold py-2.5 rounded-lg transition ${modalUnitType === 'docena' ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                    >
                      Docena
                    </button>
                  </div>
                  {/* Precio según selección */}
                  <div className="mt-2 px-3 py-2 bg-zinc-900/60 rounded-xl border border-zinc-800">
                    <p className="text-xs text-zinc-500 font-medium">
                      {modalUnitType === 'docena'
                        ? <>Precio docena: <span className="text-orange-400 font-bold">{selectedProductForCart.pricePerDozen || formatPrice(parsePrice(selectedProductForCart.price) * 12)}</span></>
                        : modalUnitType === 'media_docena'
                        ? <>Precio media docena: <span className="text-orange-400 font-bold">{selectedProductForCart.pricePerHalfDozen || formatPrice(parsePrice(selectedProductForCart.price) * 6)}</span></>
                        : <>Precio unidad: <span className="text-zinc-100 font-bold">{selectedProductForCart.price}</span></>
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Cantidad */}
              <div>
                <label className="block text-sm font-bold mb-2 text-zinc-300">
                  Cantidad ({modalUnitType === 'docena' ? 'Docenas' : modalUnitType === 'media_docena' ? 'Medias Docenas' : 'Unidades'})
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
                      {modalUnitType === 'docena' ? 'DOC' : modalUnitType === 'media_docena' ? '1/2 DOC' : 'UN'}
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

              <div className="pt-2">
                <button
                  onClick={confirmAddToCart}
                  className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-500 transition active:scale-95 shadow-lg flex justify-center items-center gap-2 text-sm"
                >
                  <ShoppingCart size={18} /> Agregar al Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Sidebar: Carrito */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-zinc-950 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-zinc-900">
            
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-3">
                {checkoutStep === 'details' ? (
                  <button 
                    onClick={() => setCheckoutStep('cart')}
                    className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 hover:text-white transition border border-zinc-800"
                  >
                    <ArrowLeft size={18} />
                  </button>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-300 border border-zinc-800">
                    <ShoppingCart size={18} />
                  </div>
                )}
                <h2 className="text-xl font-black tracking-tight">{checkoutStep === 'cart' ? 'Tu Pedido' : 'Detalles de Entrega'}</h2>
              </div>
              <button 
                onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 hover:bg-zinc-800 transition text-zinc-400 hover:text-white border border-zinc-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#0a0a0b]">
              {checkoutStep === 'cart' ? (
                <div className="p-6 h-full">
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
                      <ShoppingCart size={48} className="opacity-20" />
                      <p className="font-bold text-lg text-zinc-400">Tu carrito está vacío</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 shadow-sm flex items-start justify-between group">
                          <div className="flex-1 pr-4">
                            <h4 className="font-bold text-zinc-100 leading-tight mb-1">{item.name}</h4>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-md">
                                {item.unitType === 'docena'
                                  ? `${item.quantity} Docena(s)`
                                  : item.unitType === 'media_docena'
                                  ? `${item.quantity} Media Docena(s)`
                                  : `${item.quantity} Unidad(es)`}
                              </span>
                              <span className="text-xs font-medium text-zinc-400">
                                x {item.unitType === 'docena' ? (item.originalSaleType === 'docena' ? item.price : (item.pricePerDozen || formatPrice(parsePrice(item.price) * 12))) : item.unitType === 'media_docena' ? (item.pricePerHalfDozen || formatPrice(parsePrice(item.price) * 6)) : item.price}
                              </span>
                            </div>
                            <p className="font-black text-sm text-zinc-100">
                              {formatPrice(getItemSubtotal(item))}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-zinc-500 hover:text-red-500 p-1.5 rounded-lg hover:bg-zinc-800/80 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 mt-auto">
                              <button
                                onClick={() => updateCartItemQuantity(item.id, -1)}
                                className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-bold text-sm w-4 text-center text-zinc-100">{item.quantity}</span>
                              <button
                                onClick={() => updateCartItemQuantity(item.id, 1)}
                                className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Formulario de Detalles */}
                  <div>
                    <label className="block text-sm font-bold mb-2 text-zinc-300">Nombre y Apellido *</label>
                    <input 
                      type="text" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej. Juan Pérez" 
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition font-medium text-sm text-zinc-100 placeholder:text-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 text-zinc-300">Método de Entrega</label>
                    <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                      <button 
                        type="button"
                        onClick={() => setDeliveryMethod('retiro')}
                        className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-lg transition ${deliveryMethod === 'retiro' ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                      >
                        <Store size={16} /> Retiro en Local
                      </button>
                      <button 
                        type="button"
                        onClick={() => setDeliveryMethod('envio')}
                        className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-lg transition ${deliveryMethod === 'envio' ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                      >
                        <MapPin size={16} /> Envío a Domicilio
                      </button>
                    </div>
                  </div>

                  {deliveryMethod === 'envio' && (
                    <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
                      {neighborhoods.length > 0 && (
                        <div>
                          <label className="block text-sm font-bold mb-2 text-zinc-300">Barrio / Zona de Envío *</label>
                          <select 
                            value={selectedNeighborhoodId || ''}
                            onChange={(e) => setSelectedNeighborhoodId(Number(e.target.value))}
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition font-medium text-sm text-zinc-100 appearance-none"
                          >
                            <option value="" disabled className="bg-zinc-900 text-zinc-500">Seleccioná tu barrio</option>
                            {neighborhoods.map(n => (
                              <option key={n.id} value={n.id} className="bg-zinc-900 text-zinc-100">
                                {n.name} (+{formatPrice(n.deliveryCost)})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-bold mb-2 text-zinc-300">Dirección de Entrega *</label>
                        <input 
                          type="text" 
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value.toUpperCase())}
                          placeholder="CALLE, NÚMERO..." 
                          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition font-medium text-sm uppercase text-zinc-100 placeholder:text-zinc-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2 text-zinc-300">Especificaciones (Opcional)</label>
                        <input 
                          type="text" 
                          value={addressDetails}
                          onChange={(e) => setAddressDetails(e.target.value)}
                          placeholder="Piso, dpto, color de puerta, entre calles..." 
                          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition font-medium text-sm text-zinc-100 placeholder:text-zinc-500"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold mb-2 text-zinc-300">Método de Pago</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                      <select 
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-10 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition font-medium text-sm appearance-none text-zinc-100"
                      >
                        <option value="Efectivo" className="bg-zinc-900 text-zinc-100">Efectivo</option>
                        <option value="Transferencia" className="bg-zinc-900 text-zinc-100">Transferencia</option>
                        <option value="Tarjeta de crédito" className="bg-zinc-900 text-zinc-100">Tarjeta de crédito</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-zinc-950 border-t border-zinc-900 z-10">
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">Subtotal</span>
                  <span className="font-bold text-zinc-300 text-sm">{formatPrice(cartTotal)}</span>
                </div>
                {deliveryCost > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">Envío ({selectedNeighborhood?.name})</span>
                    <span className="font-bold text-zinc-300 text-sm">{formatPrice(deliveryCost)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1.5 border-t border-zinc-900 mt-2">
                  <span className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">Total</span>
                  <span className="font-black text-2xl tracking-tight text-white">{formatPrice(finalTotal)}</span>
                </div>
              </div>
              
              {checkoutStep === 'cart' ? (
                <button 
                  onClick={() => setCheckoutStep('details')}
                  disabled={cartItems.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white font-black py-3 rounded-xl hover:bg-orange-500 transition active:scale-95 shadow-lg disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
                >
                  Continuar con el Pedido
                </button>
              ) : (
                <button 
                  onClick={handleCheckout}
                  disabled={!customerName.trim() || (deliveryMethod === 'envio' && (!customerAddress.trim() || (neighborhoods.length > 0 && !selectedNeighborhoodId)))}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-black py-3 rounded-xl hover:bg-[#20bd5a] transition active:scale-95 shadow-lg shadow-[#25D366]/20 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                  Confirmar por WhatsApp
                </button>
              )}
              
              {checkoutStep === 'details' && (
                <p className="text-[11px] text-center font-semibold text-zinc-400 mt-3 leading-relaxed">
                  Al confirmar, se abrirá un chat de WhatsApp con los detalles de tu pedido para coordinar la entrega.
                </p>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}


