"use client";

import { useState } from "react";
import { X, ArrowLeft, ShoppingCart, Minus, Plus, Trash2, MapPin, Store, CreditCard, ChevronDown } from "lucide-react";
import type { CartItem } from "@/hooks/useCart";
import { formatPrice, parsePrice, getItemSubtotal } from "@/hooks/useCart";
import type { Neighborhood } from "@/lib/store/productsStore";

interface CartSidebarProps {
  cartItems: CartItem[];
  neighborhoods: Neighborhood[];
  cartTotal: number;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

export function CartSidebar({ cartItems, neighborhoods, cartTotal, onUpdateQuantity, onRemove, onClose }: CartSidebarProps) {
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "details">("cart");
  const [customerName, setCustomerName] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"retiro" | "envio">("retiro");
  const [customerAddress, setCustomerAddress] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");

  const selectedNeighborhood = neighborhoods.find((n) => n.id === selectedNeighborhoodId);
  const deliveryCost = deliveryMethod === "envio" && selectedNeighborhood ? selectedNeighborhood.deliveryCost : 0;
  const finalTotal = cartTotal + deliveryCost;

  const handleCheckout = () => {
    if (cartItems.length === 0 || !customerName.trim()) return;
    if (deliveryMethod === "envio" && !customerAddress.trim()) return;

    let message = `¡Hola Quadra Pizza! Soy *${customerName.trim()}* y quiero hacer el siguiente pedido:\n\n`;
    cartItems.forEach((item) => {
      const subtotal = getItemSubtotal(item);
      const qLabel = item.unitType === "docena"
        ? `${item.quantity} docena(s)`
        : item.unitType === "media_docena"
        ? `${item.quantity} media docena(s)`
        : `${item.quantity} unidad(es)`;
      let itemDetails = "";
      if (item.quadraSelections && item.quadraSelections.length > 0) {
        itemDetails += `\n    (Opciones: ${item.quadraSelections.join(", ")})`;
      }
      if (item.customVariety) {
        itemDetails += `\n    (Variedad: ${item.customVariety})`;
      }
      if (item.extras && item.extras.length > 0) {
        itemDetails += `\n    (Extras: ${item.extras.map((e) => e.name).join(", ")})`;
      }
      message += `- ${qLabel} de *${item.name}* -> ${formatPrice(subtotal)}${itemDetails}\n`;
    });

    message += `\n*TOTAL: ${formatPrice(cartTotal)}*\n`;
    message += `\n*Entrega:*\n`;
    message += `- Método: ${deliveryMethod === "envio" ? "Envío a domicilio" : "Retiro en el local"}\n`;
    if (deliveryMethod === "envio") {
      message += `- Dirección: ${customerAddress.trim()}\n`;
      if (selectedNeighborhood) message += `- Barrio/Zona: ${selectedNeighborhood.name}\n`;
      if (addressDetails.trim()) message += `- Detalle: ${addressDetails.trim()}\n`;
      if (deliveryCost > 0) message += `- Costo de envío: ${formatPrice(deliveryCost)}\n`;
    }
    message += `- Pago: ${paymentMethod}\n`;
    message += `\n*TOTAL FINAL: ${formatPrice(finalTotal)}*\n`;
    message += `\n¡Muchas gracias!`;

    const WHATSAPP_NUMBER = "5493518046223";
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`, "_blank");
  };

  const handleClose = () => {
    setCheckoutStep("cart");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
      <div className="relative w-full max-w-md bg-zinc-950 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-zinc-900">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-3">
            {checkoutStep === "details" ? (
              <button 
                onClick={() => setCheckoutStep("cart")}
                className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 hover:text-white transition border border-zinc-800"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-300 border border-zinc-800">
                <ShoppingCart size={18} />
              </div>
            )}
            <h2 className="text-xl font-black tracking-tight">{checkoutStep === "cart" ? "Tu Pedido" : "Detalles de Entrega"}</h2>
          </div>
          <button 
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 hover:bg-zinc-800 transition text-zinc-400 hover:text-white border border-zinc-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[#0a0a0b]">
          {checkoutStep === "cart" ? (
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
                            {item.unitType === "docena"
                              ? `${item.quantity} Docena(s)`
                              : item.unitType === "media_docena"
                              ? `${item.quantity} Media Docena(s)`
                              : `${item.quantity} Unidad(es)`}
                          </span>
                          <span className="text-xs font-medium text-zinc-400">
                            x {item.unitType === "docena" ? (item.originalSaleType === "docena" ? item.price : (item.pricePerDozen || formatPrice(parsePrice(item.price) * 12))) : item.unitType === "media_docena" ? (item.pricePerHalfDozen || formatPrice(parsePrice(item.price) * 6)) : item.price}
                          </span>
                        </div>
                        {item.quadraSelections && item.quadraSelections.length > 0 && (
                          <p className="text-[11px] text-zinc-400 italic mb-1 leading-tight">
                            Opciones: {item.quadraSelections.join(", ")}
                          </p>
                        )}
                        {item.customVariety && (
                          <p className="text-[11px] text-zinc-400 italic mb-1 leading-tight">
                            Variedad: {item.customVariety}
                          </p>
                        )}
                        {item.extras && item.extras.length > 0 && (
                          <p className="text-[11px] text-orange-400/80 font-medium italic mb-2 leading-tight">
                            Extras: {item.extras.map((e) => e.name).join(", ")}
                          </p>
                        )}
                        <p className="font-black text-sm text-zinc-100 mt-2">
                          {formatPrice(getItemSubtotal(item))}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-zinc-500 hover:text-red-500 p-1.5 rounded-lg hover:bg-zinc-800/80 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 mt-auto">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-sm w-4 text-center text-zinc-100">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
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
                    onClick={() => setDeliveryMethod("retiro")}
                    className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-lg transition ${deliveryMethod === "retiro" ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-400 hover:text-white"}`}
                  >
                    <Store size={16} /> Retiro en Local
                  </button>
                  <button 
                    type="button"
                    onClick={() => setDeliveryMethod("envio")}
                    className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-lg transition ${deliveryMethod === "envio" ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-400 hover:text-white"}`}
                  >
                    <MapPin size={16} /> Envío a Domicilio
                  </button>
                </div>
              </div>

              {deliveryMethod === "envio" && (
                <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
                  {neighborhoods.length > 0 && (
                    <div>
                      <label className="block text-sm font-bold mb-2 text-zinc-300">Barrio / Zona de Envío *</label>
                      <select 
                        value={selectedNeighborhoodId || ""}
                        onChange={(e) => setSelectedNeighborhoodId(Number(e.target.value))}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition font-medium text-sm text-zinc-100 appearance-none"
                      >
                        <option value="" disabled className="bg-zinc-900 text-zinc-500">Seleccioná tu barrio</option>
                        {neighborhoods.map((n) => (
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

        {/* Footer */}
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
          
          {checkoutStep === "cart" ? (
            <button 
              onClick={() => setCheckoutStep("details")}
              disabled={cartItems.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white font-black py-3 rounded-xl hover:bg-orange-500 transition active:scale-95 shadow-lg disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
            >
              Continuar con el Pedido
            </button>
          ) : (
            <button 
              onClick={handleCheckout}
              disabled={!customerName.trim() || (deliveryMethod === "envio" && (!customerAddress.trim() || (neighborhoods.length > 0 && !selectedNeighborhoodId)))}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-black py-3 rounded-xl hover:bg-[#20bd5a] transition active:scale-95 shadow-lg shadow-[#25D366]/20 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
              Confirmar por WhatsApp
            </button>
          )}
          
          {checkoutStep === "details" && (
            <p className="text-[11px] text-center font-semibold text-zinc-400 mt-3 leading-relaxed">
              Al confirmar, se abrirá un chat de WhatsApp con los detalles de tu pedido para coordinar la entrega.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
