"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  ArrowLeft,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  MapPin,
  Store,
  CreditCard,
  ChevronDown,
  Phone,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Sparkles
} from "lucide-react";
import type { CartItem } from "@/hooks/useCart";
import { formatPrice, parsePrice, getItemSubtotal } from "@/hooks/useCart";
import { isKitchenItem } from "@/lib/orderKitchenHelper";
import { useProductsStore, type Neighborhood } from "@/lib/store/productsStore";
import { useOrdersStore } from "@/lib/store/ordersStore";
import { useCustomersStore } from "@/lib/store/customersStore";
import { getTrackingUrl } from "@/lib/trackingHelper";

interface CartSidebarProps {
  cartItems: CartItem[];
  neighborhoods: Neighborhood[];
  cartTotal: number;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
  onClearCart?: () => void;
}

export function CartSidebar({
  cartItems,
  neighborhoods,
  cartTotal,
  onUpdateQuantity,
  onRemove,
  onClose,
  onClearCart,
}: CartSidebarProps) {
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "details" | "confirmed">("cart");
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"retiro" | "envio">("retiro");
  const [customerAddress, setCustomerAddress] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");

  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [createdTrackingUrl, setCreatedTrackingUrl] = useState<string>("");
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);

  const addOrder = useOrdersStore((s) => s.addOrder);
  const { customers, addCustomer, updateCustomer } = useCustomersStore();

  const selectedNeighborhood = neighborhoods.find((n) => n.id === selectedNeighborhoodId);
  const deliveryCost = deliveryMethod === "envio" && selectedNeighborhood ? selectedNeighborhood.deliveryCost : 0;
  const baseTotal = cartTotal + deliveryCost;
  const creditCardSurcharge = paymentMethod === "Tarjeta de crédito" ? baseTotal * 0.15 : 0;
  const finalTotal = baseTotal + creditCardSurcharge;

  const handleCheckout = () => {
    if (cartItems.length === 0 || !customerFirstName.trim()) return;
    if (deliveryMethod === "envio" && !customerAddress.trim()) return;

    const formattedFirstName = customerFirstName.trim();
    const formattedLastName = customerLastName.trim();
    const fullName = `${formattedFirstName} ${formattedLastName}`.trim();

    // 1. Mapear productos para el store central de órdenes (KDS / Recepción / Gerencia)
    const itemsForStore = cartItems.map((item) => {
      const subtotal = getItemSubtotal(item);
      const qLabel =
        item.unitType === "docena"
          ? " (Docena)"
          : item.unitType === "media_docena"
          ? " (1/2 Doc)"
          : "";
      let itemName = `${item.name}${qLabel}`;
      if (item.quadraSelections && item.quadraSelections.length > 0) {
        itemName += ` [${item.quadraSelections.join(", ")}]`;
      }
      if (item.customVariety) {
        itemName += ` [${item.customVariety}]`;
      }
      if (item.extras && item.extras.length > 0) {
        itemName += ` (+ ${item.extras.map((e) => e.name).join(", ")})`;
      }
      const allProducts = useProductsStore.getState().products;
      const prod = allProducts.find((p) => p.id === item.productId);
      return {
        name: itemName,
        quantity: item.quantity,
        price: Math.round(subtotal / item.quantity),
        requiresKitchen: isKitchenItem({
          name: item.name,
          categoryId: prod?.categoryId,
          category: prod?.category,
          requiresKitchen: prod?.requiresKitchen,
        }),
      };
    });

    const formattedAddress =
      deliveryMethod === "envio"
        ? `${customerAddress.trim()}${
            selectedNeighborhood ? ` - ${selectedNeighborhood.name}` : ""
          }${addressDetails.trim() ? ` (${addressDetails.trim()})` : ""}`
        : "Retiro en local";

    // 2. Registrar o buscar cliente por teléfono (asociación canónica unívoca)
    let finalFirstName = formattedFirstName;
    let finalLastName = formattedLastName;
    let assignedCustomerId: string | undefined = undefined;

    try {
      const customerRecord = useCustomersStore.getState().findOrCreateCustomer({
        phone: customerPhone.trim(),
        firstName: formattedFirstName,
        lastName: formattedLastName,
        address: deliveryMethod === "envio" ? customerAddress.trim() : "Retiro en local",
        neighborhoodId: deliveryMethod === "envio" && selectedNeighborhoodId ? selectedNeighborhoodId : undefined,
        addressDetail: deliveryMethod === "envio" ? addressDetails.trim() : "",
        orderTotal: finalTotal,
      });

      if (customerRecord) {
        assignedCustomerId = customerRecord.id;
        finalFirstName = customerRecord.firstName || formattedFirstName;
        finalLastName = customerRecord.lastName || formattedLastName;
      }
    } catch (e) {
      console.error("Error al registrar o asociar cliente desde catálogo:", e);
    }

    // 3. Determinar estado inicial: si el pedido es 100% bebidas/almacén, salta directamente a "listo"
    const hasKitchenItems = itemsForStore.some((i) => i.requiresKitchen);
    const initialStatus = hasKitchenItems ? "confirmado" : "listo";

    // Crear y agregar la orden automáticamente
    const newOrder = addOrder({
      items: itemsForStore,
      clientFirstName: finalFirstName,
      clientLastName: finalLastName,
      phone: customerPhone.trim() || undefined,
      address: formattedAddress,
      paymentMethod: paymentMethod,
      paymentStatus: "pendiente",
      deliveryFee: deliveryCost,
      total: finalTotal,
      cajero_name: "Catálogo Online (Web)",
      status: initialStatus,
      customerId: assignedCustomerId,
    });

    // 4. Armar mensaje de WhatsApp con enlace de seguimiento en vivo
    const trackingUrl = getTrackingUrl(newOrder);
    setCreatedTrackingUrl(trackingUrl);

    let message = `¡Hola Quadra Pizza! 🍕 Soy *${fullName}* y quiero hacer el siguiente pedido:\n\n`;
    message += `📋 *Detalle del pedido:*\n`;
    cartItems.forEach((item) => {
      const subtotal = getItemSubtotal(item);
      const qLabel =
        item.unitType === "docena"
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

    if (deliveryCost > 0 || creditCardSurcharge > 0) {
      message += `\n*Subtotal productos:* ${formatPrice(cartTotal)}\n`;
    }

    message += `\n📍 *Entrega:*\n`;
    message += `- Tipo: ${deliveryMethod === "envio" ? "Envío a domicilio" : "Retiro en el local"}\n`;
    if (deliveryMethod === "envio") {
      message += `- Dirección: ${customerAddress.trim()}\n`;
      if (selectedNeighborhood) message += `- Barrio/Zona: ${selectedNeighborhood.name}\n`;
      if (addressDetails.trim()) message += `- Detalle: ${addressDetails.trim()}\n`;
      if (deliveryCost > 0) message += `- Costo de envío: ${formatPrice(deliveryCost)}\n`;
    }
    if (customerPhone.trim()) {
      message += `- Teléfono: ${customerPhone.trim()}\n`;
    }

    message += `\n💳 *Forma de pago:*\n`;
    message += `- ${paymentMethod}\n`;
    if (creditCardSurcharge > 0) {
      message += `- Recargo tarjeta (15%): ${formatPrice(creditCardSurcharge)}\n`;
    }

    message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *TOTAL A PAGAR: ${formatPrice(finalTotal)}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `\n🔖 *Pedido Nº:* #${newOrder.id}\n`;
    message += `📍 *Seguí tu pedido en vivo aquí:*\n${trackingUrl}\n`;
    message += `\n¡Muchas gracias!`;

    const storedPhone = useProductsStore.getState().whatsappNumber;
    const savedPhone = typeof window !== "undefined" ? localStorage.getItem("quadra_catalog_phone") : null;
    const rawPhone = storedPhone || savedPhone || "5493513059413";
    const cleanNumber = rawPhone.replace(/\D/g, "");
    const WHATSAPP_NUMBER = cleanNumber.startsWith("54") ? cleanNumber : `549${cleanNumber}`;
    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;
    setLastWhatsAppUrl(waUrl);
    window.open(waUrl, "_blank");

    // 5. Pasar a pantalla de confirmación exitosa y limpiar carrito
    setCreatedOrderId(newOrder.id);
    setCheckoutStep("confirmed");
    if (onClearCart) {
      onClearCart();
    }
  };

  const handleClose = () => {
    setCheckoutStep("cart");
    setCreatedOrderId(null);
    setCreatedTrackingUrl("");
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
            ) : checkoutStep === "confirmed" ? (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 size={18} />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-300 border border-zinc-800">
                <ShoppingCart size={18} />
              </div>
            )}
            <h2 className="text-xl font-black tracking-tight">
              {checkoutStep === "cart"
                ? "Tu Pedido"
                : checkoutStep === "details"
                ? "Detalles de Entrega"
                : "¡Pedido Confirmado!"}
            </h2>
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
          {checkoutStep === "confirmed" ? (
            <div className="p-6 h-full flex flex-col items-center justify-center text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950/40">
                <CheckCircle2 size={42} />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5">
                  <Sparkles size={11} /> Cargado Automáticamente
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  ¡Pedido Ingresado!
                </h3>
                <p className="text-xs font-bold text-zinc-400 max-w-xs leading-relaxed">
                  Tu orden <span className="text-white font-black">#{createdOrderId}</span> fue registrada y agregada a <span className="text-emerald-400 font-bold">Pedidos Confirmados</span> en el sistema.
                </p>
              </div>

              <div className="w-full space-y-2.5 pt-2">
                {createdOrderId && (
                  <a
                    href={createdTrackingUrl || `/estado-pedido?id=${encodeURIComponent(createdOrderId)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm transition shadow-lg shadow-orange-950/40 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <ExternalLink size={16} />
                    <span>Seguir Estado en Vivo</span>
                  </a>
                )}

                {createdOrderId && (
                  <button
                    onClick={() => {
                      const url = createdTrackingUrl || `${window.location.origin}/estado-pedido?id=${encodeURIComponent(createdOrderId)}`;
                      navigator.clipboard.writeText(url);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs border border-zinc-800 transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedLink ? "¡Enlace copiado al portapapeles!" : "Copiar enlace de seguimiento"}</span>
                  </button>
                )}

                {lastWhatsAppUrl && (
                  <button
                    onClick={() => window.open(lastWhatsAppUrl, "_blank")}
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] font-bold text-xs border border-[#25D366]/30 transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    <MessageSquare size={14} />
                    <span>Reabrir chat de WhatsApp</span>
                  </button>
                )}

                <div className="h-px bg-zinc-900 my-2" />

                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold transition active:scale-95"
                >
                  Hacer otro Pedido
                </button>
              </div>
            </div>
          ) : checkoutStep === "cart" ? (
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
                          <p className="text-[11px] text-zinc-400 font-medium italic mb-1 leading-tight">
                            Sabores: {item.quadraSelections.join(", ")}
                          </p>
                        )}
                        {item.customVariety && (
                          <p className="text-[11px] text-zinc-400 font-medium italic mb-1 leading-tight">
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
            <div className="p-6 space-y-5">
              {/* Formulario de Detalles */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-zinc-300">Nombre *</label>
                  <input 
                    type="text" 
                    value={customerFirstName}
                    onChange={(e) => setCustomerFirstName(e.target.value)}
                    placeholder="Ej. Juan" 
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition font-medium text-sm text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-zinc-300">Apellido</label>
                  <input 
                    type="text" 
                    value={customerLastName}
                    onChange={(e) => setCustomerLastName(e.target.value)}
                    placeholder="Ej. Pérez" 
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition font-medium text-sm text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-zinc-300">Teléfono / WhatsApp *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input 
                    type="tel" 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ej. 3514567890" 
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition font-medium text-sm text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>
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

        {/* Footer (solo visible durante cart o details) */}
        {checkoutStep !== "confirmed" && (
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
              {creditCardSurcharge > 0 && (
                <div className="flex items-center justify-between text-orange-400/90">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Recargo Tarjeta (15%)</span>
                  <span className="font-bold text-sm">+{formatPrice(creditCardSurcharge)}</span>
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
                className="w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm transition shadow-lg shadow-orange-900/30 disabled:opacity-50 disabled:pointer-events-none mt-2"
              >
                Continuar con el Pedido
              </button>
            ) : (
              <button 
                onClick={handleCheckout}
                disabled={
                  cartItems.length === 0 ||
                  !customerFirstName.trim() ||
                  (deliveryMethod === "envio" && !customerAddress.trim())
                }
                className="w-full py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm transition shadow-lg shadow-[#25D366]/30 disabled:opacity-50 disabled:pointer-events-none mt-2 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} /> Confirmar y Enviar por WhatsApp
              </button>
            )}
            
            {checkoutStep === "details" && (
              <p className="text-[11px] text-center font-semibold text-zinc-400 mt-3 leading-relaxed">
                Al confirmar, se registrará el pedido automáticamente en el sistema y se abrirá WhatsApp con el resumen y enlace de seguimiento.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
