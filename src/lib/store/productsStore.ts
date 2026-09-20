"use client";

import { create } from "zustand";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Product = {
  id: number;
  name: string;
  description?: string;
  price: string;           // Precio principal (unidad o precio base)
  oldPrice?: string;       // Precio anterior tachado (cuando es oferta)
  pricePerHalfDozen?: string; // Precio por media docena (cuando aplica)
  pricePerDozen?: string;  // Precio por docena (cuando aplica)
  category: string;
  categoryId?: number;
  stock: boolean;
  image: string;
  isOffer: boolean;
  saleType: "unidad" | "docena" | "combo" | "quadra";
  customVarieties?: { name: string; price: number }[];
  customExtras?: { name: string; price: number }[];
  extraIds?: string[];
  quadraConfig?: {
    totalRows: number;
    fixedRows: { variety: string; rowCount: number }[];
    customizableRowsCount: number;
  };
};

export type Extra = {
  id: string;
  name: string;
  price: number;
  available: boolean;
  applyToCategories: number[];
};

export type Variety = {
  id: string;
  name: string;
  available: boolean;
};

export type Neighborhood = {
  id: number;
  name: string;
  deliveryCost: number;
};

export type Category = {
  id: number;
  name: string;
  parentId: number | null;
};

// ─── Initial Data ─────────────────────────────────────────────────────────────

const INITIAL_NEIGHBORHOODS: Neighborhood[] = [
  { id: 1, name: "Yocsina", deliveryCost: 500 },
  { id: 2, name: "Malagueño", deliveryCost: 1000 },
  { id: 3, name: "La Perla", deliveryCost: 1500 },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: "Pizzas", parentId: null },
  { id: 101, name: "Tradicionales", parentId: 1 },
  { id: 102, name: "Especiales", parentId: 1 },
  { id: 103, name: "Rellenas", parentId: 1 },
  { id: 2, name: "Empanadas", parentId: null },
  { id: 201, name: "Al Horno", parentId: 2 },
  { id: 202, name: "Fritas", parentId: 2 },
  { id: 3, name: "Sándwiches", parentId: null },
  { id: 4, name: "Bebidas", parentId: null },
  { id: 5, name: "Postres", parentId: null },
  { id: 6, name: "Menú del día", parentId: null },
  { id: 7, name: "Almacén", parentId: null },
];

const INITIAL_EXTRAS: Extra[] = [
  { id: 'huevo', name: 'Huevo duro picado', price: 800, available: true, applyToCategories: [1, 101, 102, 103] },
  { id: 'queso', name: 'Extra Muzzarella', price: 1200, available: true, applyToCategories: [1, 101, 102, 103] },
  { id: 'aceitunas', name: 'Aceitunas extras', price: 600, available: true, applyToCategories: [1, 101, 102, 103] },
  { id: 'roquefort', name: 'Roquefort', price: 1500, available: true, applyToCategories: [1, 101, 102, 103] },
  { id: 'anchoas', name: 'Anchoas', price: 1500, available: true, applyToCategories: [1, 101, 102, 103] },
  { id: 'cheddar', name: 'Bañado en Cheddar', price: 1500, available: true, applyToCategories: [] },
];

const INITIAL_VARIETIES: Variety[] = [
  { id: 'muzza', name: 'Muzzarella', available: true },
  { id: 'napo', name: 'Napolitana', available: true },
  { id: 'espe', name: 'Especial', available: true },
  { id: 'fugazzeta', name: 'Fugazzeta', available: true },
  { id: 'calabresa', name: 'Calabresa', available: true },
  { id: 'roque', name: 'Roquefort', available: true },
];

const INITIAL_PRODUCTS: Product[] = [
  // --- PIZZAS ---
  {
    id: 1,
    name: "Muzzarella Clásica",
    description: "Salsa de tomate casera, abundante muzzarella, orégano y aceitunas negras.",
    price: "$6.500",
    category: "Pizzas",
    categoryId: 101,
    stock: true,
    image: "/1.webp",
    isOffer: false,
    saleType: "unidad"
  },
  {
    id: 3,
    name: "Pizza Napolitana",
    description: "Muzzarella, rodajas de tomate natural, ajo fileteado y perejil fresco.",
    price: "$7.800",
    category: "Pizzas",
    categoryId: 101,
    stock: false,
    image: "/3.webp",
    isOffer: false,
    saleType: "unidad"
  },
  {
    id: 5,
    name: "Pizza de Jamón y Morrones",
    description: "Muzzarella, jamón cocido natural y morrones asados.",
    price: "$8.200",
    category: "Pizzas",
    categoryId: 102,
    stock: true,
    image: "/5.webp",
    isOffer: false,
    saleType: "unidad"
  },
  {
    id: 8,
    name: "Fainá",
    description: "Porción de fainá clásica de garbanzo, esponjosa por dentro y crocante por fuera.",
    price: "$1.200",
    category: "Pizzas",
    categoryId: 103,
    stock: true,
    image: "/3.webp",
    isOffer: false,
    saleType: "unidad"
  },
  {
    id: 13,
    name: "Quadra 1 (1 Variedad Extra)",
    description: "Pizza cuadrada de 9 porciones en 3 filas. 2 filas de Muzzarella y 1 fila a elección.",
    price: "$9.000",
    category: "Pizzas",
    categoryId: 102,
    stock: true,
    image: "/5.webp",
    isOffer: false,
    saleType: "quadra",
    quadraConfig: {
      totalRows: 3,
      fixedRows: [{ variety: "Muzzarella", rowCount: 2 }],
      customizableRowsCount: 1,
    }
  },
  {
    id: 14,
    name: "Quadra 2 (2 Variedades Extra)",
    description: "Pizza cuadrada de 9 porciones en 3 filas. 1 fila de Muzzarella y 2 filas a elección.",
    price: "$10.500",
    category: "Pizzas",
    categoryId: 102,
    stock: true,
    image: "/1.webp",
    isOffer: false,
    saleType: "quadra",
    quadraConfig: {
      totalRows: 3,
      fixedRows: [{ variety: "Muzzarella", rowCount: 1 }],
      customizableRowsCount: 2,
    }
  },
  {
    id: 15,
    name: "Quadra 3 (3 Variedades)",
    description: "Pizza cuadrada de 9 porciones en 3 filas. Elegí las 3 variedades que más te gusten.",
    price: "$12.000",
    category: "Pizzas",
    categoryId: 102,
    stock: true,
    image: "/5.webp",
    isOffer: false,
    saleType: "quadra",
    quadraConfig: {
      totalRows: 3,
      fixedRows: [],
      customizableRowsCount: 3,
    }
  },
  // --- EMPANADAS ---
  {
    id: 2,
    name: "Empanada de Carne a Cuchillo",
    description: "Carne seleccionada cortada a cuchillo, cebolla, morrón, aceitunas y huevo duro.",
    price: "$950",
    pricePerHalfDozen: "$5.500",
    pricePerDozen: "$10.500",
    category: "Empanadas",
    categoryId: 201,
    stock: true,
    image: "/2.webp",
    isOffer: false,
    saleType: "combo",
    customVarieties: [{ name: "Dulce", price: 0 }, { name: "Salada", price: 0 }]
  },
  {
    id: 6,
    name: "Empanada de Jamón y Queso",
    description: "El clásico de siempre, jugosa y llena de sabor. Disponible al horno o frita.",
    price: "$850",
    pricePerHalfDozen: "$5.000",
    pricePerDozen: "$9.500",
    category: "Empanadas",
    categoryId: 201,
    stock: true,
    image: "/2.webp",
    isOffer: false,
    saleType: "combo",
    customVarieties: [{ name: "Al Horno", price: 0 }, { name: "Frita", price: 0 }]
  },
  {
    id: 9,
    name: "Empanada de Pollo",
    description: "Pollo desmenuzado con verduras, pimentón dulce y cebolla dorada.",
    price: "$850",
    pricePerHalfDozen: "$5.000",
    pricePerDozen: "$9.500",
    category: "Empanadas",
    categoryId: 202,
    stock: true,
    image: "/2.webp",
    isOffer: false,
    saleType: "combo"
  },
  // --- SÁNDWICHES ---
  {
    id: 7,
    name: "Sándwich de Milanesa Completo",
    description: "Milanesa de ternera apanada, lechuga, tomate, jamón, queso y huevo frito. ¡Gigante!",
    price: "$7.000",
    category: "Sándwiches",
    categoryId: 3,
    stock: true,
    image: "/4.webp",
    isOffer: false,
    saleType: "unidad",
    customVarieties: [{ name: "Pan Árabe", price: 0 }, { name: "Pan Francés", price: 0 }],
    extraIds: ['cheddar']
  },
  {
    id: 10,
    name: "Sándwich de Pollo Crocante",
    description: "Pechuga rebozada, mayonesa de ajo, lechuga y tomate en pan de campo.",
    price: "$5.800",
    category: "Sándwiches",
    categoryId: 3,
    stock: true,
    image: "/4.webp",
    isOffer: false,
    saleType: "unidad"
  },
  // --- BEBIDAS ---
  {
    id: 11,
    name: "Coca-Cola 1.5L",
    description: "Gaseosa línea Coca-Cola de litro y medio.",
    price: "$2.500",
    category: "Bebidas",
    categoryId: 4,
    stock: true,
    image: "/coca.webp",
    isOffer: false,
    saleType: "unidad"
  },
  {
    id: 12,
    name: "Cerveza Quilmes 1L",
    description: "Cerveza rubia clásica bien fría.",
    price: "$3.200",
    category: "Bebidas",
    categoryId: 4,
    stock: true,
    image: "/cerveza.webp",
    isOffer: false,
    saleType: "unidad"
  },
  // --- POSTRES ---
  {
    id: 20,
    name: "Flan con Dulce de Leche",
    description: "Flan casero con una generosa porción de dulce de leche.",
    price: "$1.500",
    category: "Postres",
    categoryId: 5,
    stock: true,
    image: "/postre.png",
    isOffer: false,
    saleType: "unidad"
  },
  {
    id: 21,
    name: "Tiramisú",
    description: "Clásico postre italiano con mascarpone, café y cacao.",
    price: "$2.200",
    category: "Postres",
    categoryId: 5,
    stock: true,
    image: "/tiramisu.png",
    isOffer: false,
    saleType: "unidad"
  },
  // --- MENÚ DEL DÍA ---
  {
    id: 22,
    name: "Suprema de Pollo con Puré",
    description: "Suprema tierna con puré de papas cremoso.",
    price: "$4.500",
    category: "Menú del día",
    categoryId: 6,
    stock: true,
    image: "/menu.png",
    isOffer: false,
    saleType: "unidad"
  },
  // --- ALMACÉN ---
  {
    id: 23,
    name: "Alfajor Jorgito Chocolate",
    description: "Clásico alfajor de chocolate relleno con dulce de leche.",
    price: "$800",
    category: "Almacén",
    categoryId: 7,
    stock: true,
    image: "/alfajor.png",
    isOffer: false,
    saleType: "unidad"
  },
  // --- OFERTAS ---
  {
    id: 101,
    name: "Pizza Calabresa",
    description: "Muzzarella y rodajas de longaniza calabresa picante. ¡Irresistible!",
    price: "$7.500",
    oldPrice: "$8.900",
    category: "Pizzas",
    categoryId: 102,
    stock: true,
    image: "/1.webp",
    isOffer: true,
    saleType: "unidad"
  },
  {
    id: 102,
    name: "Promo 2 Muzzarellas",
    description: "2 pizzas muzzarella grandes para compartir en familia. ¡No te las pierdas!",
    price: "$11.000",
    oldPrice: "$13.000",
    category: "Pizzas",
    categoryId: 1,
    stock: true,
    image: "/3.webp",
    isOffer: true,
    saleType: "unidad"
  },
  {
    id: 103,
    name: "Docena de Empanadas Variadas",
    description: "Elegí los sabores. Carne, jamón y queso, pollo o caprese.",
    price: "$9.500",
    oldPrice: "$11.500",
    category: "Empanadas",
    categoryId: 2,
    stock: true,
    image: "/2.webp",
    isOffer: true,
    saleType: "docena"
  },
];

// ─── Store Interface ──────────────────────────────────────────────────────────

interface ProductsState {
  products: Product[];
  categories: Category[];
  neighborhoods: Neighborhood[];
  extras: Extra[];
  varieties: Variety[];
  toggleProductStock: (id: number) => void;
  setNeighborhoods: (neighborhoods: Neighborhood[]) => void;
  setExtras: (extras: Extra[]) => void;
  setVarieties: (varieties: Variety[]) => void;
  setCategories: (categories: Category[]) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useProductsStore = create<ProductsState>((set) => ({
  products: INITIAL_PRODUCTS,
  categories: INITIAL_CATEGORIES,
  neighborhoods: INITIAL_NEIGHBORHOODS,
  extras: INITIAL_EXTRAS,
  varieties: INITIAL_VARIETIES,

  toggleProductStock: (id) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, stock: !p.stock } : p
      ),
    })),

  setNeighborhoods: (neighborhoods) => set({ neighborhoods }),
  setExtras: (extras) => set({ extras }),
  setVarieties: (varieties) => set({ varieties }),
  setCategories: (categories) => set({ categories }),
}));
