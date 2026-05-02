"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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
  saleType: "unidad" | "docena" | "combo" | "quadra";  // unidad: se vende x unidad, docena: se vende x docena, combo: opciones combinadas, quadra: personalizable por filas
  customVarieties?: string[]; // Variedades específicas del producto (ej: ["Dulce", "Salada"], ["Pan Árabe", "Pan Francés"])
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

type ProductsContextType = {
  products: Product[];
  toggleProductStock: (id: number) => void;
  neighborhoods: Neighborhood[];
  setNeighborhoods: (neighborhoods: Neighborhood[]) => void;
  extras: Extra[];
  setExtras: (extras: Extra[]) => void;
  varieties: Variety[];
  setVarieties: (varieties: Variety[]) => void;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([
    { id: 1, name: "Yocsina", deliveryCost: 500 },
    { id: 2, name: "Malagueño", deliveryCost: 1000 },
    { id: 3, name: "La Perla", deliveryCost: 1500 },
  ]);

  const [extras, setExtras] = useState<Extra[]>([
    { id: 'huevo', name: 'Huevo duro picado', price: 800, available: true },
    { id: 'queso', name: 'Extra Muzzarella', price: 1200, available: true },
    { id: 'aceitunas', name: 'Aceitunas extras', price: 600, available: true },
    { id: 'roquefort', name: 'Roquefort', price: 1500, available: true },
    { id: 'anchoas', name: 'Anchoas', price: 1500, available: true },
  ]);

  const [varieties, setVarieties] = useState<Variety[]>([
    { id: 'muzza', name: 'Muzzarella', available: true },
    { id: 'napo', name: 'Napolitana', available: true },
    { id: 'espe', name: 'Especial', available: true },
    { id: 'fugazzeta', name: 'Fugazzeta', available: true },
    { id: 'calabresa', name: 'Calabresa', available: true },
    { id: 'roque', name: 'Roquefort', available: true },
  ]);

  const [products, setProducts] = useState<Product[]>([
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
      customVarieties: ["Dulce", "Salada"]
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
      customVarieties: ["Al Horno", "Frita"]
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
      customVarieties: ["Pan Árabe", "Pan Francés"]
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
  ]);

  const toggleProductStock = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: !p.stock } : p));
  };

  return (
    <ProductsContext.Provider value={{ products, toggleProductStock, neighborhoods, setNeighborhoods, extras, setExtras, varieties, setVarieties }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
