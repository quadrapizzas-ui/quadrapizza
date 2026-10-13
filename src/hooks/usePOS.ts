"use client";

import { useState, useMemo } from "react";
import { useProductsStore, Product } from "@/lib/store/productsStore";
import { MockCustomer } from "@/types/models";
import { useCustomersStore } from "@/lib/store/customersStore";
import { useOrdersStore } from "@/lib/store/ordersStore";
import { useAuthStore } from "@/lib/store/authStore";
import { isKitchenItem } from "@/lib/orderKitchenHelper";
import { normalizeSearch } from "@/lib/utils";

export type UnitType = "unidad" | "media_docena" | "docena";

export interface CartItem {
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
  customVariety?: string;
}

export function parsePrice(str?: string): number {
  if (!str) return 0;
  return Number(str.replace(/\./g, "").replace(/[^0-9]/g, "")) || 0;
}

export function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

export function itemSubtotal(item: CartItem): number { 
  const base = item.price * item.quantity;
  const extrasTotal = item.extras ? item.extras.reduce((acc, e) => acc + e.price, 0) * item.quantity : 0;
  return base + extrasTotal;
}

export function usePOS() {
  const { products, neighborhoods, extras, varieties, categories } = useProductsStore();
  const { customers, updateCustomer, addCustomer, findOrCreateCustomer } = useCustomersStore();
  const addOrder = useOrdersStore((s) => s.addOrder);
  const { activeUser } = useAuthStore();

  const [selectedParent, setSelectedParent] = useState("Todos");
  const [selectedSub, setSelectedSub] = useState("Todas");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [showModal, setShowModal] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"retiro" | "envio">("retiro");
  const [selectedNeighId, setSelectedNeighId] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [payment, setPayment] = useState("Efectivo");
  const [paymentStatus, setPaymentStatus] = useState<"pagado" | "pendiente">("pendiente");
  const [dineroRecibido, setDineroRecibido] = useState("");
  const [sending, setSending] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<{ id: string; phone?: string; firstName: string; lastName: string } | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState("");
  const [selectedProd, setSelectedProd] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [modalUnit, setModalUnit] = useState<UnitType>("unidad");
  const [quadraSelections, setQuadraSelections] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<typeof extras>([]);
  const [selectedCustomVariety, setSelectedCustomVariety] = useState("");
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [customerSearchType, setCustomerSearchType] = useState<"name" | "phone" | null>(null);

  const parentCats = useMemo(() => categories.filter(c => c.parentId === null), [categories]);
  const activeParent = useMemo(() => categories.find(c => c.name === selectedParent), [categories, selectedParent]);
  const subCats = useMemo(() => activeParent ? categories.filter(c => c.parentId === activeParent.id) : [], [categories, activeParent]);
  const hasSubCats = subCats.length > 0;

  const suggestedCustomers = useMemo(() => {
    if (!showCustomerSuggestions || !customerSearchType) return [];
    const queryNorm = normalizeSearch(customerFirstName);
    const queryDigits = customerPhone.replace(/\D/g, "");
    if (customerSearchType === "name" ? queryNorm.length < 2 : queryDigits.length < 2) return [];
    
    return customers.filter(c => {
      if (customerSearchType === "name") {
        return normalizeSearch(c.firstName).includes(queryNorm) || 
               normalizeSearch(c.lastName).includes(queryNorm) ||
               normalizeSearch(c.firstName + ' ' + c.lastName).includes(queryNorm);
      } else {
        return c.phone.replace(/\D/g, "").includes(queryDigits);
      }
    }).slice(0, 4);
  }, [customers, customerFirstName, customerPhone, showCustomerSuggestions, customerSearchType]);

  function selectCustomer(c: MockCustomer) {
    setCustomerId(c.id);
    setCustomerFirstName(c.firstName);
    setCustomerLastName(c.lastName);
    setCustomerPhone(c.phone);
    if (c.address) setAddress(c.address);
    if (c.neighborhoodId) setSelectedNeighId(c.neighborhoodId);
    if (c.addressDetail) setAddressDetail(c.addressDetail);
    setShowCustomerSuggestions(false);
    setCustomerSearchType(null);
  }

  const handleParentSelect = (name: string) => {
    setSelectedParent(name);
    setSelectedSub("Todas");
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (!p.stock) return false;

      if (selectedParent !== "Todos" && activeParent) {
        if (hasSubCats && selectedSub !== "Todas") {
          const subObj = subCats.find(c => c.name === selectedSub);
          if (p.categoryId !== subObj?.id) return false;
        } else if (hasSubCats) {
          const childIds = subCats.map(c => c.id);
          if (p.categoryId !== activeParent.id && !childIds.includes(p.categoryId ?? -1)) return false;
        } else {
          if (p.categoryId !== activeParent.id) return false;
        }
      }

      if (search.trim().length >= 2) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, selectedParent, selectedSub, search, activeParent, hasSubCats, subCats]);

  function getPriceForUnit(p: Product, unit: UnitType): number {
    if (unit === "docena") return p.pricePerDozen ? parsePrice(p.pricePerDozen) : parsePrice(p.price) * 12;
    if (unit === "media_docena") return p.pricePerHalfDozen ? parsePrice(p.pricePerHalfDozen) : parsePrice(p.price) * 6;
    return parsePrice(p.price);
  }

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
    if (p.customVarieties && p.customVarieties.length > 0) {
      setSelectedCustomVariety("");
    } else {
      setSelectedCustomVariety("");
    }
  }

  function handleProductClick(p: Product) {
    if (p.saleType !== "unidad" || (p.customVarieties && p.customVarieties.length > 0)) {
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

  function confirmAdd() {
    if (!selectedProd) return;
    const selectionsKey = quadraSelections.length > 0 ? `-${quadraSelections.join('-')}` : '';
    const extrasKey = selectedExtras.length > 0 ? `-ext-${selectedExtras.map(e => e.id).join('-')}` : '';
    const varietyKey = selectedCustomVariety ? `-var-${selectedCustomVariety}` : '';
    const key = `${selectedProd.id}-${modalUnit}${selectionsKey}${extrasKey}${varietyKey}`;
    const customVarietyData = selectedProd.customVarieties?.find(v => v.name === selectedCustomVariety);
    const unitPriceVal = getPriceForUnit(selectedProd, modalUnit) + (customVarietyData?.price || 0);
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
        extras: selectedExtras.length > 0 ? [...selectedExtras.map(e => ({ name: e.name, price: e.price }))] : undefined,
        customVariety: selectedCustomVariety || undefined
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
    if (!customerFirstName.trim() || cart.length === 0) return;
    setSending(true);

    // Ensure we separate first name and last name even if they typed everything in the first name field
    const combinedName = `${customerFirstName.trim()} ${customerLastName.trim()}`.trim();
    const nameParts = combinedName.split(/\s+/);
    
    const formattedFirstName = (nameParts[0] || "").charAt(0).toUpperCase() + (nameParts[0] || "").slice(1).toLowerCase();
    const formattedLastName = nameParts.slice(1).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');

    const customerRecord = findOrCreateCustomer({
      phone: customerPhone.trim(),
      firstName: formattedFirstName,
      lastName: formattedLastName,
      address: deliveryMethod === "envio" && address ? address : "Retiro en local",
      neighborhoodId: deliveryMethod === "envio" && selectedNeighId ? selectedNeighId : undefined,
      addressDetail: deliveryMethod === "envio" && addressDetail ? addressDetail : "",
      orderTotal: total,
    });

    const finalFirstName = customerRecord.firstName || formattedFirstName;
    const finalLastName = customerRecord.lastName || formattedLastName;
    setCustomerId(customerRecord.id);

    const itemsForStore = cart.map(i => {
      let itemName = `${i.name}${i.unitType !== "unidad" ? ` (${i.unitType === "docena" ? "Docena" : "1/2 Doc"})` : ""}`;
      if (i.quadraSelections && i.quadraSelections.length > 0) {
        itemName += ` [${i.quadraSelections.join(', ')}]`;
      }
      if (i.customVariety) {
        itemName += ` [${i.customVariety}]`;
      }
      if (i.extras && i.extras.length > 0) {
        itemName += ` (+ ${i.extras.map(e => e.name).join(', ')})`;
      }
      if (i.note) itemName += ` - Nota: ${i.note}`;
      const prod = products.find((p) => p.id === i.productId);
      return {
        name: itemName,
        quantity: i.quantity,
        price: i.price,
        requiresKitchen: isKitchenItem({
          name: i.name,
          categoryId: prod?.categoryId,
          category: prod?.category,
          requiresKitchen: prod?.requiresKitchen,
        }),
      };
    });

    const hasKitchenItems = itemsForStore.some(i => i.requiresKitchen);
    const initialStatus = hasKitchenItems ? "confirmado" : "listo";

    const newOrder = addOrder({
      items: itemsForStore,
      clientFirstName: finalFirstName,
      clientLastName: finalLastName,
      phone: customerPhone.trim() || customerRecord.phone || undefined,
      address: deliveryMethod === "retiro" ? "Retiro en local" : `${address}${selectedNeigh ? ` - ${selectedNeigh.name}` : ""}`,
      paymentMethod: payment,
      paymentStatus: paymentStatus,
      deliveryFee: deliveryCost,
      total,
      status: initialStatus,
      cajero_id: activeUser?.id,
      cajero_name: activeUser?.name,
      customerId: customerRecord.id,
    });

    setTimeout(() => {
      setSending(false);
      setCreatedOrder({ id: newOrder.id, phone: customerPhone.trim(), firstName: formattedFirstName, lastName: formattedLastName });
    }, 600);
  }

  function handleNewOrder() {
    setShowModal(false);
    setCreatedOrder(null);
    setCart([]);
    setCustomerId(null); setCustomerFirstName(""); setCustomerLastName(""); setCustomerPhone(""); setAddress(""); setAddressDetail("");
    setDeliveryMethod("retiro"); setSelectedNeighId(null); setPayment("Efectivo"); setPaymentStatus("pendiente"); setDineroRecibido("");
    setCopied(false);
  }

  return {
    products, neighborhoods, extras, varieties, categories,
    cart, setCart,
    search, setSearch,
    selectedParent, setSelectedParent,
    selectedSub, setSelectedSub,
    showModal, setShowModal,
    customerId, setCustomerId,
    customerFirstName, setCustomerFirstName,
    customerLastName, setCustomerLastName,
    customerPhone, setCustomerPhone,
    deliveryMethod, setDeliveryMethod,
    selectedNeighId, setSelectedNeighId,
    address, setAddress,
    addressDetail, setAddressDetail,
    payment, setPayment,
    paymentStatus, setPaymentStatus,
    dineroRecibido, setDineroRecibido,
    sending, setSending,
    createdOrder, setCreatedOrder,
    showMobileCart, setShowMobileCart,
    editingNoteId, setEditingNoteId,
    tempNote, setTempNote,
    selectedProd, setSelectedProd,
    modalQty, setModalQty,
    modalUnit, setModalUnit,
    quadraSelections, setQuadraSelections,
    selectedExtras, setSelectedExtras,
    selectedCustomVariety, setSelectedCustomVariety,
    showCustomerSuggestions, setShowCustomerSuggestions,
    customerSearchType, setCustomerSearchType,
    parentCats, activeParent, subCats, hasSubCats,
    suggestedCustomers, selectCustomer, handleParentSelect,
    filteredProducts, getPriceForUnit, openProdModal, handleProductClick,
    confirmAdd, updateQty, subtotal, deliveryCost, total, handleSend, handleNewOrder,
    copied, setCopied, selectedNeigh, creditCardSurcharge
  };
}
