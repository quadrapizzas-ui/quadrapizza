"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MockOrder, OrderStatus } from "@/types/models";
import { generateMockOrders } from "@/lib/mockOrders";

interface OrdersState {
  orders: MockOrder[];
  addOrder: (order: Partial<MockOrder>) => MockOrder;
  updateOrderStatus: (id: string, newStatus: OrderStatus) => void;
  updateOrderPaymentStatus: (id: string, status: "pagado" | "pendiente", paidAmount?: number) => void;
  applyCustomerPayment: (orderIds: string[], amount: number, paymentMethod?: string) => void;
  updateOrdersCustomerInfo: (params: {
    customerId?: string;
    phone?: string;
    clientFirstName: string;
    clientLastName: string;
    address?: string;
  }) => void;
  setOrders: (orders: MockOrder[]) => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: generateMockOrders(),

      addOrder: (order) => {
        const todayStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
        const todaysOrders = get().orders.filter((o) => o.id.startsWith(todayStr));
        const nextSeq = String(todaysOrders.length + 1).padStart(3, "0");

        const newOrder: MockOrder = {
          id: `${todayStr}-${nextSeq}`,
          items: order.items || [],
          paymentMethod: order.paymentMethod || "efectivo",
          paymentStatus: order.paymentStatus || "pendiente",
          paidAmount: order.paymentStatus === "pagado" ? (order.total || 0) : (order.paidAmount || 0),
          clientFirstName: order.clientFirstName || "Cliente",
          clientLastName: order.clientLastName || "",
          phone: order.phone,
          address: order.address || "Local",
          deliveryFee: order.deliveryFee,
          total: order.total || 0,
          createdAt: new Date().toISOString(),
          mockAge: "Justo ahora",
          status: "confirmado",
          cajero_id: order.cajero_id,
          cajero_name: order.cajero_name,
          ...order,
        };

        set((state) => ({ orders: [newOrder, ...state.orders] }));
        return newOrder;
      },

      updateOrderStatus: (id, newStatus) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
        }));
      },

      updateOrderPaymentStatus: (id, status, paidAmount) => {
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id !== id) return o;
            return {
              ...o,
              paymentStatus: status,
              paidAmount: status === "pagado" ? o.total : (paidAmount !== undefined ? paidAmount : 0),
            };
          }),
        }));
      },

      applyCustomerPayment: (orderIds, amount, paymentMethod) => {
        if (amount <= 0) return;
        set((state) => {
          let remaining = amount;
          // Ordenamos las órdenes por fecha (las más antiguas primero para saldar en orden cronológico)
          const targetOrders = state.orders
            .filter((o) => orderIds.includes(o.id) && o.paymentStatus !== "pagado" && o.status !== "cancelado")
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

          const targetIds = new Set(targetOrders.map((o) => o.id));
          const updatedTargetMap = new Map<string, MockOrder>();

          for (const order of targetOrders) {
            if (remaining <= 0) {
              updatedTargetMap.set(order.id, order);
              continue;
            }
            const currentPaid = typeof order.paidAmount === "number" ? order.paidAmount : 0;
            const pending = Math.max(0, order.total - currentPaid);

            if (remaining >= pending) {
              remaining -= pending;
              updatedTargetMap.set(order.id, {
                ...order,
                paidAmount: order.total,
                paymentStatus: "pagado",
                ...(paymentMethod ? { paymentMethod } : {}),
              });
            } else {
              const newPaid = currentPaid + remaining;
              remaining = 0;
              updatedTargetMap.set(order.id, {
                ...order,
                paidAmount: newPaid,
                paymentStatus: "pendiente",
                ...(paymentMethod ? { paymentMethod } : {}),
              });
            }
          }

          return {
            orders: state.orders.map((o) => (targetIds.has(o.id) ? updatedTargetMap.get(o.id)! : o)),
          };
        });
      },

      updateOrdersCustomerInfo: (params) => {
        const cleanPhone = params.phone ? params.phone.replace(/\D/g, "") : "";
        set((state) => ({
          orders: state.orders.map((o) => {
            const orderCleanPhone = o.phone ? o.phone.replace(/\D/g, "") : "";
            const matchesId = Boolean(params.customerId && o.customerId && o.customerId === params.customerId);
            const matchesPhone = Boolean(
              cleanPhone.length >= 6 &&
              orderCleanPhone.length >= 6 &&
              (orderCleanPhone === cleanPhone || orderCleanPhone.endsWith(cleanPhone) || cleanPhone.endsWith(orderCleanPhone))
            );

            if (matchesId || matchesPhone) {
              return {
                ...o,
                customerId: o.customerId || params.customerId,
                clientFirstName: params.clientFirstName,
                clientLastName: params.clientLastName,
                address:
                  params.address && params.address !== "Retiro en local" && params.address !== "Local"
                    ? params.address
                    : o.address,
              };
            }
            return o;
          }),
        }));
      },

      setOrders: (orders) => set({ orders }),
    }),
    {
      name: "quadra-mock-orders-v11",
    }
  )
);
