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
  cost?: number;           // Costo de elaboración/insumos por unidad
  costPerHalfDozen?: number;
  costPerDozen?: number;
  category: string;
  categoryId?: number;
  stock: boolean;
  requiresKitchen?: boolean; // true: cocina/KDS para hornear; false: despacho directo sin cocción
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
  requiresKitchen?: boolean; // true: sector cocina/elaboración (KDS); false: despacho directo / bebidas / almacén
};

// ─── Initial Data ─────────────────────────────────────────────────────────────

const INITIAL_NEIGHBORHOODS: Neighborhood[] = [
  { id: 1, name: "Yocsina", deliveryCost: 500 },
  { id: 2, name: "Malagueño", deliveryCost: 1000 },
  { id: 3, name: "La Perla", deliveryCost: 1500 },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: "Pizzas", parentId: null, requiresKitchen: true },
  { id: 3, name: "Sándwiches", parentId: null, requiresKitchen: true },
  { id: 4, name: "Bebidas", parentId: null, requiresKitchen: false },
  { id: 5, name: "Postres", parentId: null, requiresKitchen: false },
];

const INITIAL_EXTRAS: Extra[] = [
  { id: 'huevo', name: 'Huevo duro picado', price: 800, available: true, applyToCategories: [1] },
  { id: 'queso', name: 'Extra Muzzarella', price: 1200, available: true, applyToCategories: [1] },
  { id: 'aceitunas', name: 'Aceitunas extras', price: 600, available: true, applyToCategories: [1] },
  { id: 'roquefort', name: 'Roquefort', price: 1500, available: true, applyToCategories: [1] },
  { id: 'anchoas', name: 'Anchoas', price: 1500, available: true, applyToCategories: [1] },
  { id: 'cheddar', name: 'Bañado en Cheddar', price: 1500, available: true, applyToCategories: [3] },
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
  // --- PIZZAS QUADRA (Exclusivas por Filas) ---
  {
    id: 13,
    name: "Quadra 1 (1 Variedad Extra)",
    description: "Pizza rectangular de 9 porciones en 3 filas. 2 filas de Muzzarella y 1 fila a elección.",
    price: "$9.000",
    cost: 3100,
    category: "Pizzas",
    categoryId: 1,
    stock: true,
    image: "/products/quadra-pizza-signature.webp",
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
    description: "Pizza rectangular de 9 porciones en 3 filas. 1 fila de Muzzarella y 2 filas a elección.",
    price: "$10.500",
    oldPrice: "$12.000",
    cost: 3600,
    category: "Pizzas",
    categoryId: 1,
    stock: true,
    image: "/products/quadra-pizza-signature.webp",
    isOffer: true,
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
    description: "Pizza rectangular de 9 porciones en 3 filas. Elegí las 3 variedades que más te gusten.",
    price: "$12.000",
    cost: 4200,
    category: "Pizzas",
    categoryId: 1,
    stock: true,
    image: "/products/quadra-pizza-signature.webp",
    isOffer: false,
    saleType: "quadra",
    quadraConfig: {
      totalRows: 3,
      fixedRows: [],
      customizableRowsCount: 3,
    }
  },

  // --- BURGERS & SÁNDWICHES REALES QUADRA ---
  {
    id: 30,
    name: "Burger Quadra Egg Special",
    description: "Medallón smash artesanal, huevo frito a la chapa con yema tierna, queso cheddar fundido y aderezo especial en pan brioche.",
    price: "$7.200",
    cost: 2600,
    category: "Sándwiches",
    categoryId: 3,
    stock: true,
    image: "/products/burger-quadra-egg.webp",
    isOffer: false,
    saleType: "unidad"
  },
  {
    id: 31,
    name: "Burger Doble Bacon Beast",
    description: "Doble carne seleccionada smash, doble cheddar, doble capa de panceta crocante y salsa barbacoa ahumada en pan brioche dorado.",
    price: "$8.600",
    cost: 3100,
    category: "Sándwiches",
    categoryId: 3,
    stock: true,
    image: "/products/burger-doble-bacon.webp",
    isOffer: false,
    saleType: "unidad"
  },
  {
    id: 7,
    name: "Sándwich de Milanesa Completo",
    description: "Milanesa de ternera apanada crocante en baguette recién horneado, lechuga, tomate, jamón, queso y huevo. ¡Gigante!",
    price: "$7.500",
    cost: 2700,
    category: "Sándwiches",
    categoryId: 3,
    stock: true,
    image: "/products/sandwich-milanesa.webp",
    isOffer: false,
    saleType: "unidad",
    customVarieties: [{ name: "Pan Baguette", price: 0 }, { name: "Pan Árabe", price: 0 }],
    extraIds: ['cheddar']
  },
  {
    id: 32,
    name: "Lomito Cordobés en Pan Árabe",
    description: "Tiras de bife de lomo tierno a la chapa, huevo a la plancha, jamón cocido, queso derretido, lechuga y tomate en pan pita tostado.",
    price: "$8.400",
    cost: 3000,
    category: "Sándwiches",
    categoryId: 3,
    stock: true,
    image: "/products/lomito-cordobes-arabe.webp",
    isOffer: false,
    saleType: "unidad"
  },

  {
    id: 34,
    name: "Copa Quadra Mini Burgers (x4)",
    description: "Vaso degustación con 4 mini burgers artesanales con queso cheddar, palillos y aderezo especial de la casa. ¡Ideal para compartir!",
    price: "$6.800",
    cost: 2400,
    category: "Sándwiches",
    categoryId: 3,
    stock: true,
    requiresKitchen: true,
    image: "/products/vaso-mini-burgers.webp",
    isOffer: false,
    saleType: "unidad"
  },

  // --- BEBIDAS ---
  {
    id: 11,
    name: "Coca-Cola 1.5L",
    description: "Gaseosa línea Coca-Cola de litro y medio bien fría.",
    price: "$2.500",
    cost: 1300,
    category: "Bebidas",
    categoryId: 4,
    stock: true,
    requiresKitchen: false,
    image: "/products/coca-cola.webp",
    isOffer: false,
    saleType: "unidad"
  },
  {
    id: 12,
    name: "Cerveza Quilmes 1L",
    description: "Cerveza rubia clásica bien helada con vaso.",
    price: "$3.200",
    cost: 1600,
    category: "Bebidas",
    categoryId: 4,
    stock: true,
    requiresKitchen: false,
    image: "/products/cerveza-quilmes.webp",
    isOffer: false,
    saleType: "unidad"
  },

  // --- POSTRES ---
  {
    id: 21,
    name: "Tiramisú Artesanal",
    description: "Clásico postre italiano con mascarpone, café expreso y cacao amargo.",
    price: "$2.400",
    cost: 900,
    category: "Postres",
    categoryId: 5,
    stock: true,
    requiresKitchen: false,
    image: "/products/tiramisu-artesanal.webp",
    isOffer: false,
    saleType: "unidad"
  },

  // --- OFERTAS IMPERDIBLES ---
  {
    id: 33,
    name: "Súper Lomito Quadra con Papas",
    description: "Lomito artesanal completo con bife premium a la chapa, huevo, jamón, queso y vegetales, acompañado con abundantes papas bastón.",
    price: "$9.200",
    oldPrice: "$10.800",
    cost: 3400,
    category: "Sándwiches",
    categoryId: 3,
    stock: true,
    image: "/products/super-lomito-papas.webp",
    isOffer: true,
    saleType: "unidad"
  },
];

// ─── Store Interface ──────────────────────────────────────────────────────────

import { persist } from "zustand/middleware";

export const DEFAULT_CATALOG_PHONE = "+54 9 3513 05-9413";

interface ProductsState {
  products: Product[];
  categories: Category[];
  neighborhoods: Neighborhood[];
  extras: Extra[];
  varieties: Variety[];
  whatsappNumber: string;
  setWhatsappNumber: (phone: string) => void;
  toggleProductStock: (id: number) => void;
  updateProduct: (id: number, data: Partial<Product>) => void;
  addProduct: (product: Omit<Product, "id">) => Product;
  deleteProduct: (id: number) => void;
  setProducts: (products: Product[]) => void;
  setNeighborhoods: (neighborhoods: Neighborhood[]) => void;
  setExtras: (extras: Extra[]) => void;
  setVarieties: (varieties: Variety[]) => void;
  setCategories: (categories: Category[]) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      neighborhoods: INITIAL_NEIGHBORHOODS,
      extras: INITIAL_EXTRAS,
      varieties: INITIAL_VARIETIES,
      whatsappNumber: DEFAULT_CATALOG_PHONE,

      setWhatsappNumber: (whatsappNumber) => set({ whatsappNumber }),

      toggleProductStock: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stock: !p.stock } : p
          ),
        })),

      updateProduct: (id, data) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      addProduct: (productData) => {
        const nextId = Math.max(0, ...get().products.map((p) => p.id)) + 1;
        const newProduct: Product = { ...productData, id: nextId } as Product;
        set((state) => ({ products: [...state.products, newProduct] }));
        return newProduct;
      },

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      setProducts: (products) => set({ products }),
      setNeighborhoods: (neighborhoods) => set({ neighborhoods }),
      setExtras: (extras) => set({ extras }),
      setVarieties: (varieties) => set({ varieties }),
      setCategories: (categories) => set({ categories }),
    }),
    {
      name: "quadra-products-storage-v6",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!state.whatsappNumber || state.whatsappNumber.includes("8046223")) {
          state.whatsappNumber = DEFAULT_CATALOG_PHONE;
        }
        if (state.products) {
          state.products = state.products
            .map((p) => {
              if (p.id === 34) {
                return { ...p, category: "Sándwiches", categoryId: 3 };
              }
              return p;
            })
            .filter((p) => {
              const isEmpanada = p.category === "Empanadas" || p.name.toLowerCase().includes("empanada");
              const isNonQuadraPizza = p.category === "Pizzas" && !p.name.startsWith("Quadra ");
              const isFlan = p.id === 20 || p.name.toLowerCase().includes("flan");
              return !isEmpanada && !isNonQuadraPizza && !isFlan;
            });
        }
        if (state.categories) {
          state.categories = state.categories.filter((c) => [1, 3, 4, 5].includes(c.id));
        }
      },
    }
  )
);

