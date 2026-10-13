"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export type GastoCategoria =
  | "Alquiler"
  | "Sueldos y Personal"
  | "Servicios: Gas"
  | "Servicios: Agua"
  | "Servicios: Electricidad e Internet"
  | "Impuestos y Tasas"
  | "Proveedores y Mercadería"
  | "Inversiones y Eventuales"
  | "Mantenimiento y Varios";

export type GastoTipo = "fijo" | "variable";

export interface Gasto {
  id: string;
  concept: string;
  amount: number;
  type: GastoTipo;
  category: GastoCategoria;
  date: string;
  periodMonth: string; // Formato "YYYY-MM"
  status: "pagado" | "pendiente";
  notes?: string;
  createdAt: string;
}

interface GastosState {
  gastos: Gasto[];
  addGasto: (gasto: Omit<Gasto, "id" | "createdAt">) => Gasto;
  updateGasto: (id: string, gasto: Partial<Gasto>) => void;
  deleteGasto: (id: string) => void;
  getGastosByMonth: (yearMonth: string) => Gasto[];
  setGastos: (gastos: Gasto[]) => void;
}

const generateMockGastos = (): Gasto[] => {
  const now = new Date();
  const gastosList: Gasto[] = [];

  // Meses: actual (mes 0), anterior (mes 1), hace 2 meses (mes 2), hace 3 meses (mes 3)
  for (let m = 0; m <= 3; m++) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 10);
    const period = d.toISOString().slice(0, 7);

    gastosList.push(
      {
        id: uuidv4(),
        concept: "Alquiler Local Principal",
        amount: 450000,
        type: "fijo",
        category: "Alquiler",
        date: new Date(d.getFullYear(), d.getMonth(), 5).toISOString(),
        periodMonth: period,
        status: "pagado",
        createdAt: new Date(d.getFullYear(), d.getMonth(), 5).toISOString(),
      },
      {
        id: uuidv4(),
        concept: "Sueldos y Personal",
        amount: 850000,
        type: "fijo",
        category: "Sueldos y Personal",
        date: new Date(d.getFullYear(), d.getMonth(), 10).toISOString(),
        periodMonth: period,
        status: "pagado",
        createdAt: new Date(d.getFullYear(), d.getMonth(), 10).toISOString(),
      },
      {
        id: uuidv4(),
        concept: "Factura EPEC (Luz e Internet)",
        amount: 55000,
        type: "fijo",
        category: "Servicios: Electricidad e Internet",
        date: new Date(d.getFullYear(), d.getMonth(), 12).toISOString(),
        periodMonth: period,
        status: "pagado",
        createdAt: new Date(d.getFullYear(), d.getMonth(), 12).toISOString(),
      },
      {
        id: uuidv4(),
        concept: "Servicio de Gas Natural",
        amount: 32000,
        type: "fijo",
        category: "Servicios: Gas",
        date: new Date(d.getFullYear(), d.getMonth(), 14).toISOString(),
        periodMonth: period,
        status: "pagado",
        createdAt: new Date(d.getFullYear(), d.getMonth(), 14).toISOString(),
      },
      {
        id: uuidv4(),
        concept: "Harina 0000 y Quesos (Molino Cañuelas / La Lácteo)",
        amount: 125000,
        type: "variable",
        category: "Proveedores y Mercadería",
        date: new Date(d.getFullYear(), d.getMonth(), 18).toISOString(),
        periodMonth: period,
        status: "pagado",
        createdAt: new Date(d.getFullYear(), d.getMonth(), 18).toISOString(),
      },
      {
        id: uuidv4(),
        concept: "Mantenimiento Hornos y Equipamiento",
        amount: 38000,
        type: "variable",
        category: "Mantenimiento y Varios",
        date: new Date(d.getFullYear(), d.getMonth(), 22).toISOString(),
        periodMonth: period,
        status: "pagado",
        createdAt: new Date(d.getFullYear(), d.getMonth(), 22).toISOString(),
      }
    );
  }

  return gastosList;
};

export const useGastosStore = create<GastosState>()(
  persist(
    (set, get) => ({
      gastos: [],

      addGasto: (gasto) => {
        const newGasto: Gasto = {
          ...gasto,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ gastos: [newGasto, ...state.gastos] }));
        return newGasto;
      },

      updateGasto: (id, updatedFields) => {
        set((state) => ({
          gastos: state.gastos.map((g) => (g.id === id ? { ...g, ...updatedFields } : g)),
        }));
      },

      deleteGasto: (id) => {
        set((state) => ({
          gastos: state.gastos.filter((g) => g.id !== id),
        }));
      },

      getGastosByMonth: (yearMonth) => {
        return get().gastos.filter((g) => g.periodMonth === yearMonth);
      },

      setGastos: (gastos) => set({ gastos }),
    }),
    {
      name: "quadra-gastos-storage-v2",
    }
  )
);

export { generateMockGastos };
