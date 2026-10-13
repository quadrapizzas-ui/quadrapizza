"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type StockItem = {
  id: number;
  name: string;
  unit: string;
  current: number;
  min: number;
  cost: number;
  category: string;
  requiresKitchen?: boolean; // true: materia prima cocina; false: despacho directo / bebidas / almacén
};

const INITIAL_STOCK: StockItem[] = [
  { id: 1,  name: "Masa de Pizza",       unit: "unidades", current: 12,  min: 10, cost: 350,   category: "Bases",    requiresKitchen: true },
  { id: 2,  name: "Muzzarella",          unit: "kg",       current: 3.5, min: 5,  cost: 4200,  category: "Lácteos",  requiresKitchen: true },
  { id: 3,  name: "Salsa de Tomate",     unit: "litros",   current: 8,   min: 4,  cost: 1800,  category: "Salsas",   requiresKitchen: true },
  { id: 4,  name: "Jamón Cocido",        unit: "kg",       current: 1.2, min: 3,  cost: 6500,  category: "Fiambres", requiresKitchen: true },
  { id: 5,  name: "Coca-Cola 1.5L",      unit: "unidades", current: 24,  min: 12, cost: 1200,  category: "Bebidas",  requiresKitchen: false },
  { id: 6,  name: "Pan de Hamburguesa",  unit: "unidades", current: 6,   min: 15, cost: 280,   category: "Bases",    requiresKitchen: true },
  { id: 7,  name: "Cheddar Feteado",     unit: "paquetes", current: 8,   min: 5,  cost: 3200,  category: "Lácteos",  requiresKitchen: true },
  { id: 8,  name: "Huevos",              unit: "docenas",  current: 1,   min: 3,  cost: 3800,  category: "Básicos",  requiresKitchen: true },
  { id: 9,  name: "Aceite de Oliva",     unit: "litros",   current: 4,   min: 2,  cost: 5500,  category: "Básicos",  requiresKitchen: true },
  { id: 10, name: "Bacon",               unit: "kg",       current: 2,   min: 3,  cost: 7800,  category: "Fiambres", requiresKitchen: true },
];

interface StockState {
  stock: StockItem[];
  adjustStock: (id: number, delta: number) => void;
  updateItem: (id: number, updates: Partial<StockItem>) => void;
  addItem: (item: Omit<StockItem, "id">) => void;
  deleteItem: (id: number) => void;
  setStock: (stock: StockItem[]) => void;
}

export const useStockStore = create<StockState>()(
  persist(
    (set, get) => ({
      stock: INITIAL_STOCK,

      adjustStock: (id, delta) => {
        set((state) => ({
          stock: state.stock.map((i) =>
            i.id === id
              ? { ...i, current: Math.max(0, +(i.current + delta).toFixed(1)) }
              : i
          ),
        }));
      },

      updateItem: (id, updates) => {
        set((state) => ({
          stock: state.stock.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }));
      },

      addItem: (item) => {
        set((state) => {
          const newId = Math.max(0, ...state.stock.map((i) => i.id)) + 1;
          return { stock: [...state.stock, { id: newId, ...item }] };
        });
      },

      deleteItem: (id) => {
        set((state) => ({ stock: state.stock.filter((i) => i.id !== id) }));
      },

      setStock: (stock) => set({ stock }),
    }),
    {
      name: "quadra-mock-stock-v2",
    }
  )
);
