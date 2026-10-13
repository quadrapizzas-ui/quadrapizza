"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MockCustomer } from "@/types/models";
import { useOrdersStore } from "./ordersStore";

export function normalizePhone(rawPhone?: string): string {
  if (!rawPhone) return "";
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.startsWith("549") && digits.length >= 12) {
    return digits.slice(3);
  }
  if (digits.startsWith("54") && digits.length >= 11) {
    return digits.slice(2);
  }
  return digits;
}

interface CustomersState {
  customers: MockCustomer[];
  addCustomer: (customer: Omit<MockCustomer, "id">) => MockCustomer;
  updateCustomer: (id: string, customer: Partial<MockCustomer>) => void;
  updateCanonicalCustomer: (
    id: string,
    data: {
      firstName: string;
      lastName: string;
      phone?: string;
      address?: string;
      neighborhoodId?: number;
      addressDetail?: string;
    }
  ) => MockCustomer | undefined;
  deleteCustomer: (id: string) => void;
  setCustomers: (customers: MockCustomer[]) => void;
  findOrCreateCustomer: (params: {
    phone: string;
    firstName: string;
    lastName: string;
    address?: string;
    neighborhoodId?: number;
    addressDetail?: string;
    orderTotal?: number;
  }) => MockCustomer;
}

const INITIAL_CUSTOMERS: MockCustomer[] = [
  {
    id: "cust-1",
    firstName: "Valeria",
    lastName: "Gómez",
    phone: "3516123456",
    address: "B° Privado La Arboleda, Mz 3 Lote 12",
    neighborhoodId: 2,
    orders: 28,
    total: 385000,
    lastOrder: new Date().toISOString(),
    registeredAt: "2024-01-10T14:30:00.000Z",
    isVerified: true,
  },
  {
    id: "cust-2",
    firstName: "Martín",
    lastName: "López",
    phone: "3512987654",
    address: "Retiro en local",
    orders: 24,
    total: 280000,
    lastOrder: new Date().toISOString(),
    registeredAt: "2024-01-12T16:20:00.000Z",
    isVerified: true,
  },
  {
    id: "cust-3",
    firstName: "Lucía",
    lastName: "Fernández",
    phone: "3513456789",
    address: "Calle Los Tilos 432",
    neighborhoodId: 2,
    orders: 31,
    total: 425000,
    lastOrder: new Date().toISOString(),
    registeredAt: "2024-01-15T18:00:00.000Z",
    isVerified: true,
  },
  {
    id: "cust-4",
    firstName: "Juan",
    lastName: "Pérez",
    phone: "3515112233",
    address: "Av. San Martín 1250, Depto 4A",
    neighborhoodId: 2,
    orders: 35,
    total: 510000,
    lastOrder: new Date().toISOString(),
    registeredAt: "2024-01-20T20:15:00.000Z",
    isVerified: true,
  },
  {
    id: "cust-5",
    firstName: "Sofía",
    lastName: "Martínez",
    phone: "3517998877",
    address: "Retiro en local",
    orders: 19,
    total: 215000,
    lastOrder: new Date().toISOString(),
    registeredAt: "2024-02-01T12:00:00.000Z",
    isVerified: true,
  },
  {
    id: "cust-6",
    firstName: "Carlos",
    lastName: "Benítez",
    phone: "3518223344",
    address: "Belgrano 740, B° Yocsina",
    neighborhoodId: 1,
    orders: 22,
    total: 290000,
    lastOrder: new Date().toISOString(),
    registeredAt: "2024-02-05T19:40:00.000Z",
    isVerified: true,
  },
  {
    id: "cust-7",
    firstName: "Camila",
    lastName: "Díaz",
    phone: "3519334455",
    address: "Calle 9 de Julio 180",
    neighborhoodId: 2,
    orders: 26,
    total: 340000,
    lastOrder: new Date().toISOString(),
    registeredAt: "2024-02-10T21:00:00.000Z",
    isVerified: true,
  },
  {
    id: "cust-8",
    firstName: "Gonzalo",
    lastName: "Torres",
    phone: "3514778899",
    address: "Retiro en local",
    orders: 18,
    total: 205000,
    lastOrder: new Date().toISOString(),
    registeredAt: "2024-02-14T20:30:00.000Z",
    isVerified: true,
  },
  {
    id: "cust-9",
    firstName: "Diego",
    lastName: "Rodríguez",
    phone: "3516554433",
    address: "Calle Falsa 123",
    neighborhoodId: 3,
    orders: 15,
    total: 175000,
    lastOrder: new Date().toISOString(),
    registeredAt: "2024-02-18T13:10:00.000Z",
    isVerified: true,
  },
  {
    id: "cust-10",
    firstName: "Mariano",
    lastName: "Rossi",
    phone: "3513114477",
    address: "Av. Colón 2340",
    neighborhoodId: 2,
    orders: 21,
    total: 265000,
    lastOrder: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    registeredAt: "2024-02-22T19:50:00.000Z",
    isVerified: true,
  },
  {
    id: "cust-11",
    firstName: "Florencia",
    lastName: "Vega",
    phone: "3517332211",
    address: "Rivadavia 560",
    neighborhoodId: 2,
    orders: 17,
    total: 220000,
    lastOrder: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    registeredAt: "2024-02-25T20:10:00.000Z",
    isVerified: true,
  },
  {
    id: "cust-12",
    firstName: "Rodrigo",
    lastName: "Morales",
    phone: "3512449988",
    address: "Retiro en local",
    orders: 14,
    total: 165000,
    lastOrder: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    registeredAt: "2024-03-01T21:45:00.000Z",
    isVerified: true,
  }
];

export const useCustomersStore = create<CustomersState>()(
  persist(
    (set, get) => ({
      customers: INITIAL_CUSTOMERS,

      addCustomer: (customer) => {
        const newCustomer: MockCustomer = {
          ...customer,
          id: `cust-${Date.now()}`,
        };
        set((state) => ({ customers: [newCustomer, ...state.customers] }));
        return newCustomer;
      },

      updateCustomer: (id, updatedFields) => {
        let updatedCust: MockCustomer | undefined = undefined;
        set((state) => ({
          customers: state.customers.map((c) => {
            if (c.id === id) {
              updatedCust = { ...c, ...updatedFields };
              return updatedCust;
            }
            return c;
          }),
        }));

        if (updatedCust && (updatedFields.firstName || updatedFields.lastName || updatedFields.address)) {
          try {
            const cust = updatedCust as MockCustomer;
            useOrdersStore.getState().updateOrdersCustomerInfo({
              customerId: cust.id,
              phone: cust.phone,
              clientFirstName: cust.firstName,
              clientLastName: cust.lastName,
              address: cust.address,
            });
          } catch (e) {
            console.error("Error al sincronizar orden tras actualizar cliente:", e);
          }
        }
      },

      updateCanonicalCustomer: (id, data) => {
        let updatedCust: MockCustomer | undefined = undefined;
        set((state) => ({
          customers: state.customers.map((c) => {
            if (c.id === id) {
              updatedCust = {
                ...c,
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                phone: data.phone !== undefined ? data.phone.trim() : c.phone,
                address: data.address !== undefined ? data.address.trim() : c.address,
                neighborhoodId: data.neighborhoodId !== undefined ? data.neighborhoodId : c.neighborhoodId,
                addressDetail: data.addressDetail !== undefined ? data.addressDetail : c.addressDetail,
                isVerified: true,
              };
              return updatedCust;
            }
            return c;
          }),
        }));

        if (updatedCust) {
          try {
            const cust = updatedCust as MockCustomer;
            useOrdersStore.getState().updateOrdersCustomerInfo({
              customerId: cust.id,
              phone: cust.phone,
              clientFirstName: cust.firstName,
              clientLastName: cust.lastName,
              address: cust.address,
            });
          } catch (e) {
            console.error("Error al sincronizar orden con cliente canónico:", e);
          }
        }

        return updatedCust;
      },

      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
        }));
      },

      setCustomers: (customers) => set({ customers }),

      findOrCreateCustomer: (params) => {
        const clean = normalizePhone(params.phone);
        const existing = clean.length >= 6
          ? get().customers.find((c) => normalizePhone(c.phone) === clean)
          : undefined;

        if (existing) {
          // Mantener nombre canónico registrado original del cliente
          const updated: MockCustomer = {
            ...existing,
            address:
              params.address && params.address !== "Retiro en local"
                ? params.address
                : existing.address,
            neighborhoodId: params.neighborhoodId ?? existing.neighborhoodId,
            addressDetail: params.addressDetail || existing.addressDetail,
            orders: (existing.orders || 0) + 1,
            total: (existing.total || 0) + (params.orderTotal || 0),
            lastOrder: new Date().toISOString(),
          };
          set((state) => ({
            customers: state.customers.map((c) => (c.id === existing.id ? updated : c)),
          }));
          return updated;
        }

        // Cliente primerizo: Se registra su nombre ingresado como "Nombre Original Registrado"
        const formattedFirstName = params.firstName.trim() || "Cliente";
        const formattedLastName = params.lastName.trim() || "";

        const newCustomer: MockCustomer = {
          id: `cust-${Date.now()}`,
          firstName: formattedFirstName,
          lastName: formattedLastName,
          phone: params.phone.trim() || "S/T",
          address: params.address || "Retiro en local",
          neighborhoodId: params.neighborhoodId,
          addressDetail: params.addressDetail,
          orders: 1,
          total: params.orderTotal || 0,
          lastOrder: new Date().toISOString(),
          registeredAt: new Date().toISOString(),
          isVerified: false,
        };

        set((state) => ({ customers: [newCustomer, ...state.customers] }));
        return newCustomer;
      },
    }),
    {
      name: "quadra-mock-customers-v9",
    }
  )
);
