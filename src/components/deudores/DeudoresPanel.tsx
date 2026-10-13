"use client";

import React, { useState, useMemo } from "react";
import { useOrdersStore } from "@/lib/store/ordersStore";
import { useCustomersStore, normalizePhone } from "@/lib/store/customersStore";
import { MockOrder, MockCustomer } from "@/types/models";
import {
  AlertCircle,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Receipt,
  ArrowUpDown,
  ExternalLink,
  Pencil,
  X,
  Info,
} from "lucide-react";
import { normalizeSearch } from "@/lib/utils";

function fmtARS(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

interface DebtorRecord {
  key: string;
  customerId?: string;
  name: string;
  phone: string;
  address: string;
  orders: MockOrder[];
  totalDebt: number;
  oldestDate: string;
  latestDate: string;
  isVerified?: boolean;
  registeredAt?: string;
}

export default function DeudoresPanel({ moduleTitle = "Recepción" }: { moduleTitle?: string }) {
  const orders = useOrdersStore((s) => s.orders);
  const updateOrderPaymentStatus = useOrdersStore((s) => s.updateOrderPaymentStatus);
  const applyCustomerPayment = useOrdersStore((s) => s.applyCustomerPayment);
  const customers = useCustomersStore((s) => s.customers);
  const updateCanonicalCustomer = useCustomersStore((s) => s.updateCanonicalCustomer);
  const findOrCreateCustomer = useCustomersStore((s) => s.findOrCreateCustomer);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"debt-desc" | "debt-asc" | "date-oldest" | "name-asc">("debt-desc");
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});
  const [settlingKey, setSettlingKey] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Efectivo");

  // Estado para Pago Parcial / Entrega a Cuenta
  const [partialPaymentDebtor, setPartialPaymentDebtor] = useState<DebtorRecord | null>(null);
  const [partialAmount, setPartialAmount] = useState<string>("");
  const [partialMethod, setPartialMethod] = useState<string>("Efectivo");

  const handleOpenPartialPayment = (debtor: DebtorRecord) => {
    setPartialPaymentDebtor(debtor);
    setPartialAmount("");
    setPartialMethod("Efectivo");
  };

  const handleConfirmPartialPayment = () => {
    if (!partialPaymentDebtor) return;
    const amountNum = parseFloat(partialAmount.replace(/[^0-9.]/g, ""));
    if (isNaN(amountNum) || amountNum <= 0) return;

    // Imputar el monto pagado a las órdenes del cliente (las más antiguas primero)
    const orderIds = partialPaymentDebtor.orders.map((o) => o.id);
    applyCustomerPayment(orderIds, amountNum, partialMethod);

    setPartialPaymentDebtor(null);
    setPartialAmount("");
  };

  // Edición rápida de datos canónicos del cliente deudor
  const [editingDebtor, setEditingDebtor] = useState<DebtorRecord | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  const handleOpenEdit = (debtor: DebtorRecord) => {
    setEditingDebtor(debtor);
    const parts = debtor.name.split(" ");
    const first = parts[0] || "";
    const last = parts.slice(1).join(" ") || "";
    setEditForm({
      firstName: first,
      lastName: last,
      phone: debtor.phone !== "Sin teléfono" ? debtor.phone : "",
      address: debtor.address !== "Retiro en local" && debtor.address !== "Local" ? debtor.address : "",
    });
  };

  const handleSaveEdit = () => {
    if (!editingDebtor) return;
    const cleanPhone = editForm.phone.trim();
    const fName = editForm.firstName.trim() || "Cliente";
    const lName = editForm.lastName.trim();

    if (editingDebtor.customerId) {
      updateCanonicalCustomer(editingDebtor.customerId, {
        firstName: fName,
        lastName: lName,
        phone: cleanPhone || undefined,
        address: editForm.address.trim() || undefined,
      });
    } else {
      const created = findOrCreateCustomer({
        phone: cleanPhone || "S/T",
        firstName: fName,
        lastName: lName,
        address: editForm.address.trim() || "Retiro en local",
      });
      if (created) {
        updateCanonicalCustomer(created.id, {
          firstName: fName,
          lastName: lName,
          phone: cleanPhone || undefined,
          address: editForm.address.trim() || undefined,
        });
      }
    }

    setEditingDebtor(null);
  };

  // ── Agrupar pedidos impagos o con saldo pendiente por cliente canónico ─────────
  const debtorsList: DebtorRecord[] = useMemo(() => {
    const unpaid = orders.filter((o) => {
      if (o.status === "cancelado") return false;
      if (o.paymentStatus === "pagado") return false;
      const paid = typeof o.paidAmount === "number" ? o.paidAmount : 0;
      return o.total - paid > 0;
    });

    const map = new Map<string, DebtorRecord>();

    for (const order of unpaid) {
      // Clave única: customerId si existe, o teléfono normalizado, o nombre
      const cleanPhone = normalizePhone(order.phone);
      let groupKey = order.customerId
        ? `id_${order.customerId}`
        : cleanPhone.length >= 6
        ? `ph_${cleanPhone}`
        : `name_${(order.clientFirstName + "_" + order.clientLastName).toLowerCase().trim()}`;

      // Buscar si hay cliente registrado en customersStore para obtener datos canónicos
      let matchingCustomer: MockCustomer | undefined = undefined;
      if (order.customerId) {
        matchingCustomer = customers.find((c) => c.id === order.customerId);
      } else if (cleanPhone.length >= 6) {
        matchingCustomer = customers.find(
          (c) => normalizePhone(c.phone) === cleanPhone
        );
      }

      const canonicalName = matchingCustomer
        ? `${matchingCustomer.firstName} ${matchingCustomer.lastName}`.trim()
        : `${order.clientFirstName} ${order.clientLastName}`.trim();

      const canonicalPhone = matchingCustomer?.phone || order.phone || "Sin teléfono";
      const canonicalAddress =
        order.address && order.address !== "Retiro en local" && order.address !== "Local"
          ? order.address
          : matchingCustomer?.address || "Retiro en local";

      const orderPaid = typeof order.paidAmount === "number" ? order.paidAmount : 0;
      const orderPendingDebt = Math.max(0, order.total - orderPaid);

      if (!map.has(groupKey)) {
        map.set(groupKey, {
          key: groupKey,
          customerId: matchingCustomer?.id || order.customerId,
          name: canonicalName,
          phone: canonicalPhone,
          address: canonicalAddress,
          orders: [order],
          totalDebt: orderPendingDebt,
          oldestDate: order.createdAt,
          latestDate: order.createdAt,
          isVerified: matchingCustomer?.isVerified,
          registeredAt: matchingCustomer?.registeredAt,
        });
      } else {
        const record = map.get(groupKey)!;
        record.orders.push(order);
        record.totalDebt += orderPendingDebt;
        if (matchingCustomer?.isVerified) record.isVerified = true;
        if (matchingCustomer?.registeredAt && !record.registeredAt) {
          record.registeredAt = matchingCustomer.registeredAt;
        }
        if (new Date(order.createdAt) < new Date(record.oldestDate)) {
          record.oldestDate = order.createdAt;
        }
        if (new Date(order.createdAt) > new Date(record.latestDate)) {
          record.latestDate = order.createdAt;
        }
      }
    }

    return Array.from(map.values()).filter((d) => d.totalDebt > 0);
  }, [orders, customers]);

  // ── Filtrado y ordenamiento ──────────────────────────────────────────────────
  const filteredDebtors = useMemo(() => {
    const qNorm = normalizeSearch(search);
    const qLower = search.toLowerCase().trim();
    let result = debtorsList.filter(
      (d) =>
        normalizeSearch(d.name).includes(qNorm) ||
        d.phone.includes(qLower) ||
        normalizeSearch(d.address).includes(qNorm) ||
        d.orders.some((o) => o.id.toLowerCase().includes(qLower))
    );

    result.sort((a, b) => {
      if (sortBy === "debt-desc") return b.totalDebt - a.totalDebt;
      if (sortBy === "debt-asc") return a.totalDebt - b.totalDebt;
      if (sortBy === "date-oldest")
        return new Date(a.oldestDate).getTime() - new Date(b.oldestDate).getTime();
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [debtorsList, search, sortBy]);

  // ── Métricas globales ────────────────────────────────────────────────────────
  const totalDebtSum = debtorsList.reduce((acc, d) => acc + d.totalDebt, 0);
  const totalUnpaidOrdersCount = debtorsList.reduce((acc, d) => acc + d.orders.length, 0);

  // ── Acciones ─────────────────────────────────────────────────────────────────
  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSettleSingleOrder = (orderId: string) => {
    updateOrderPaymentStatus(orderId, "pagado");
  };

  const handleSettleAllForDebtor = (debtor: DebtorRecord) => {
    debtor.orders.forEach((o) => {
      updateOrderPaymentStatus(o.id, "pagado");
    });
    setSettlingKey(null);
  };

  const sendWhatsAppReminder = (debtor: DebtorRecord) => {
    const clean = debtor.phone.replace(/\D/g, "");
    if (!clean || clean.length < 6) {
      alert("Este cliente no tiene un teléfono válido registrado.");
      return;
    }
    const orderIds = debtor.orders.map((o) => `#${o.id}`).join(", ");
    const text = `¡Hola ${debtor.name}! Te escribimos de *Quadra Pizza* para recordarte que tenés un saldo pendiente de *${fmtARS(
      debtor.totalDebt
    )}* correspondiente a ${
      debtor.orders.length === 1 ? `tu pedido ${orderIds}` : `tus pedidos ${orderIds}`
    }.\n\nPodés abonarlo por transferencia bancaria / Mercado Pago al alias: *quadra.pizza.mp*\n\n¡Muchas gracias y que disfrutes! 🍕`;

    const url = `https://wa.me/549${clean}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-zinc-950">
      {/* ── Encabezado ── */}
      <div className="shrink-0 px-5 py-4 border-b border-zinc-800/60 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-500">
              <AlertCircle size={18} />
            </span>
            Clientes Deudores & Cuentas Corrientes
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
            Gestión de pedidos entregados o activos sin abonar • Módulo de {moduleTitle}
          </p>
        </div>
      </div>

      {/* ── Cuerpo con Scroll ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        {/* ── KPIs Principales ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-red-950/40 to-zinc-900 border border-red-800/50 rounded-2xl p-4 shadow-lg shadow-red-950/20">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
              <DollarSign size={13} /> Total Deuda Activa
            </p>
            <p className="font-black text-2xl sm:text-3xl text-red-400 tabular-nums leading-tight mt-1">
              {fmtARS(totalDebtSum)}
            </p>
            <p className="text-[10px] text-zinc-500 mt-1">Cuentas por cobrar en el negocio</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <Users size={13} /> Clientes con Deuda
            </p>
            <p className="font-black text-2xl sm:text-3xl text-white tabular-nums leading-tight mt-1">
              {debtorsList.length}
            </p>
            <p className="text-[10px] text-zinc-500 mt-1">Perfiles asociados por teléfono</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <Receipt size={13} /> Pedidos con Saldo Pendiente
            </p>
            <p className="font-black text-2xl sm:text-3xl text-orange-400 tabular-nums leading-tight mt-1">
              {totalUnpaidOrdersCount}
            </p>
            <p className="text-[10px] text-zinc-500 mt-1">Órdenes sin saldar por completo</p>
          </div>
        </div>

        {/* ── Barra de Búsqueda y Ordenamiento ── */}
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              placeholder="Buscar por cliente, teléfono, dirección o #ID de pedido..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-zinc-100 placeholder:text-zinc-700 outline-none focus:border-red-500/50 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <ArrowUpDown size={14} className="text-zinc-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-bold rounded-xl px-3 py-2.5 outline-none focus:border-zinc-700 w-full sm:w-auto"
            >
              <option value="debt-desc">Mayor deuda primero</option>
              <option value="debt-asc">Menor deuda primero</option>
              <option value="date-oldest">Más antiguos primero</option>
              <option value="name-asc">Nombre (A - Z)</option>
            </select>
          </div>
        </div>

        {/* ── Lista de Deudores ── */}
        {filteredDebtors.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-black text-white">¡No hay deudas pendientes!</h3>
            <p className="text-xs text-zinc-500 max-w-sm">
              {search
                ? "No se encontraron clientes o pedidos impagos que coincidan con la búsqueda."
                : "Todos los pedidos han sido cobrados correctamente. No existen saldos deudores registrados."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDebtors.map((debtor) => {
              const isExpanded = !!expandedKeys[debtor.key];

              return (
                <div
                  key={debtor.key}
                  className="bg-zinc-900 border-2 border-red-600/70 rounded-2xl overflow-hidden shadow-lg shadow-red-950/20 transition-all hover:border-red-500"
                >
                  {/* Fila Principal del Deudor */}
                  <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-red-950/20 via-zinc-900 to-zinc-900">
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-600/30 text-red-400 flex items-center justify-center font-black text-lg shrink-0">
                        {debtor.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-base text-white truncate">{debtor.name}</h3>
                          <button
                            onClick={() => handleOpenEdit(debtor)}
                            title="Editar nombre oficial registrado y datos de contacto"
                            className="p-1 px-2 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white transition flex items-center gap-1 text-[11px] font-bold border border-zinc-700/60 shadow-sm"
                          >
                            <Pencil size={11} className="text-amber-400" />
                            <span>Editar</span>
                          </button>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-600 text-white animate-pulse">
                            ⚠️ Saldo Deudor
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-zinc-400 mt-1">
                          <span className="flex items-center gap-1 font-mono text-zinc-300">
                            <Phone size={12} className="text-zinc-500" />
                            {debtor.phone}
                          </span>
                          <span className="flex items-center gap-1 text-zinc-400 truncate max-w-xs">
                            <MapPin size={12} className="text-zinc-500 shrink-0" />
                            {debtor.address}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-bold">
                            {debtor.orders.length} {debtor.orders.length === 1 ? "pedido pendiente" : "pedidos pendientes"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Lado derecho: Monto y botones de acción */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-zinc-800/80">
                      <div className="text-left lg:text-right">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                          Deuda Total
                        </p>
                        <p className="font-black text-xl sm:text-2xl text-red-400 tabular-nums">
                          {fmtARS(debtor.totalDebt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        {/* Botón Registrar Entrega a Cuenta */}
                        <button
                          onClick={() => handleOpenPartialPayment(debtor)}
                          title="Registrar una entrega de dinero o pago parcial a cuenta"
                          className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95"
                        >
                          <DollarSign size={14} className="text-amber-400" />
                          <span>Registrar Entrega</span>
                        </button>

                        {/* Botón WhatsApp */}
                        <button
                          onClick={() => sendWhatsAppReminder(debtor)}
                          title="Enviar recordatorio de cobro por WhatsApp"
                          className="px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-black transition flex items-center gap-1.5"
                        >
                          <MessageCircle size={14} />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </button>

                        {/* Botón Cobrar Todo */}
                        <button
                          onClick={() => setSettlingKey(debtor.key)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-emerald-950/40 active:scale-95"
                        >
                          <CheckCircle2 size={14} />
                          <span>Cobrar Todo</span>
                        </button>

                        {/* Botón Expandir Acordeón */}
                        <button
                          onClick={() => toggleExpand(debtor.key)}
                          className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ── Acordeón Desplegable con los Pedidos ── */}
                  {isExpanded && (
                    <div className="border-t border-zinc-800/80 bg-zinc-950/60 p-4 sm:p-5 space-y-3">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        Desglose de pedidos que conforman la deuda:
                      </p>
                      <div className="space-y-2">
                        {debtor.orders.map((order) => {
                          const orderPaid = typeof order.paidAmount === "number" ? order.paidAmount : 0;
                          const orderPending = Math.max(0, order.total - orderPaid);

                          return (
                            <div
                              key={order.id}
                              className={`border rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                orderPaid > 0
                                  ? "bg-zinc-900 border-amber-800/40"
                                  : "bg-zinc-900 border-red-900/40"
                              }`}
                            >
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono font-black text-white text-xs">
                                    #{order.id}
                                  </span>
                                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                                    {order.status}
                                  </span>
                                  {orderPaid > 0 ? (
                                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                      Entrega realizada: {fmtARS(orderPaid)}
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                                      Sin abonar
                                    </span>
                                  )}
                                  <span className="text-[10px] text-zinc-500">
                                    {new Date(order.createdAt).toLocaleDateString("es-AR")} -{" "}
                                    {new Date(order.createdAt).toLocaleTimeString("es-AR", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}{" "}
                                    hs
                                  </span>
                                </div>

                                <div className="text-xs text-zinc-400 line-clamp-1">
                                  {order.items.map((it) => `${it.quantity}x ${it.name}`).join(", ")}
                                </div>

                                <p className="text-[11px] text-zinc-500">
                                  Medio registrado: <span className="text-zinc-300 font-bold">{order.paymentMethod}</span>
                                  {orderPaid > 0 && (
                                    <span className="text-zinc-400 ml-2 font-medium">
                                      (Total: <span className="text-zinc-300 font-bold">{fmtARS(order.total)}</span> • Resta: <span className="text-red-400 font-bold">{fmtARS(orderPending)}</span>)
                                    </span>
                                  )}
                                </p>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                                <div className="text-right">
                                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                                    {orderPaid > 0 ? "Saldo Pendiente" : "Total Pedido"}
                                  </p>
                                  <span className="font-black text-base text-red-400 tabular-nums">
                                    {fmtARS(orderPending)}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleSettleSingleOrder(order.id)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-black transition flex items-center gap-1 active:scale-95"
                                >
                                  <CheckCircle2 size={13} />
                                  {orderPaid > 0 ? "Saldar Restante" : "Saldar Pedido"}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modal Confirmación Cobrar Todo ── */}
      {settlingKey && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          {(() => {
            const debtor = debtorsList.find((d) => d.key === settlingKey);
            if (!debtor) return null;

            return (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-black text-xl text-white text-center mb-1">
                  Saldar Deuda Completa
                </h3>
                <p className="text-zinc-400 text-xs text-center mb-4">
                  Cliente: <span className="font-bold text-white">{debtor.name}</span>
                </p>

                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-center mb-5">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Monto total a cobrar
                  </p>
                  <p className="font-black text-3xl text-emerald-400 tabular-nums mt-1">
                    {fmtARS(debtor.totalDebt)}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Se marcarán como pagados {debtor.orders.length} pedidos.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSettlingKey(null)}
                    className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleSettleAllForDebtor(debtor)}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/40"
                  >
                    Confirmar Cobro
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Modal Pago Parcial / Entrega a Cuenta ── */}
      {partialPaymentDebtor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">Registrar Entrega a Cuenta</h3>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Pago parcial de deuda
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPartialPaymentDebtor(null)}
                className="p-1.5 text-zinc-500 hover:text-white bg-zinc-900 rounded-xl transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Información del Cliente */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cliente</p>
                  <p className="font-black text-sm text-white">{partialPaymentDebtor.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Deuda Actual</p>
                  <p className="font-black text-base text-red-400 tabular-nums">
                    {fmtARS(partialPaymentDebtor.totalDebt)}
                  </p>
                </div>
              </div>

              {/* Input Monto Entregado */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Monto entregado por el cliente
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-black text-zinc-500">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    autoFocus
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="Ej: 3000"
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-500 rounded-2xl pl-8 pr-4 py-3 text-xl font-black text-white outline-none transition placeholder:text-zinc-700"
                  />
                </div>
                
                {/* Botones de montos rápidos */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[1000, 2000, 3000, 5000].map((quick) => (
                    quick < partialPaymentDebtor.totalDebt && (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => setPartialAmount(String(quick))}
                        className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-bold text-zinc-300 transition"
                      >
                        +{fmtARS(quick)}
                      </button>
                    )
                  ))}
                  <button
                    type="button"
                    onClick={() => setPartialAmount(String(partialPaymentDebtor.totalDebt))}
                    className="px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 text-[11px] font-black text-emerald-400 transition"
                  >
                    Total ({fmtARS(partialPaymentDebtor.totalDebt)})
                  </button>
                </div>
              </div>

              {/* Medio de Pago */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Medio de Pago
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Efectivo", "Transferencia", "Débito", "Mercado Pago"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPartialMethod(method)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        partialMethod === method
                          ? "bg-amber-500/20 border-amber-500/60 text-amber-300 font-black shadow-sm"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vista Previa del Saldo Restante */}
              {(() => {
                const entered = parseFloat(partialAmount) || 0;
                const newBalance = Math.max(0, partialPaymentDebtor.totalDebt - entered);
                return (
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-medium">Saldo restante tras la entrega:</span>
                    <span className={`font-black tabular-nums ${newBalance === 0 ? "text-emerald-400" : "text-amber-400"}`}>
                      {fmtARS(newBalance)} {newBalance === 0 && "(¡Deuda Saldada!)"}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2.5 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setPartialPaymentDebtor(null)}
                className="flex-1 py-3 rounded-xl bg-zinc-900 text-zinc-400 font-bold text-xs hover:text-white transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!partialAmount || parseFloat(partialAmount) <= 0}
                onClick={handleConfirmPartialPayment}
                className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:hover:bg-amber-600 text-white font-black text-xs transition shadow-lg shadow-amber-900/30"
              >
                Confirmar Entrega {partialAmount && parseFloat(partialAmount) > 0 ? `(${fmtARS(parseFloat(partialAmount))})` : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Edición Rápida de Cliente Canónico ── */}
      {editingDebtor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Pencil size={18} />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">Editar Datos Oficiales</h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Nombre Original Registrado & Contacto
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingDebtor(null)}
                className="p-1.5 text-zinc-500 hover:text-white bg-zinc-900 rounded-xl transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="py-4 space-y-3.5">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-400 flex items-start gap-2.5">
                <Info size={16} className="text-sky-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Modificar este perfil rectificará el <strong className="text-zinc-200">Nombre Oficial Registrado</strong> asociado a este teléfono y actualizará automáticamente todas sus comandas y deudas.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Nombre</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-100 outline-none focus:border-amber-500/60 transition"
                    placeholder="Ej: Juan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">Apellido</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-100 outline-none focus:border-amber-500/60 transition"
                    placeholder="Ej: Pérez"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Teléfono (Identificador canónico)</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-zinc-100 outline-none focus:border-amber-500/60 transition"
                  placeholder="Ej: 3515112233"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Dirección habitual</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-100 outline-none focus:border-amber-500/60 transition"
                  placeholder="Ej: Av. San Martín 1250"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-zinc-800">
              <button
                onClick={() => setEditingDebtor(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 font-bold text-xs hover:text-white transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs transition shadow-lg shadow-amber-900/30"
              >
                Guardar Modificación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
