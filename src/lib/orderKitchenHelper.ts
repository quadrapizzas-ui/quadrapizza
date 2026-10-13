import { MockOrder } from "@/types/models";

// Palabras clave que identifican bebidas, artículos de almacén o envasados que NO requieren cocción
const NON_KITCHEN_KEYWORDS = [
  "coca",
  "pepsi",
  "sprite",
  "fanta",
  "cerveza",
  "quilmes",
  "stella",
  "brahma",
  "heineken",
  "agua",
  "levite",
  "gaseosa",
  "bebida",
  "vino",
  "fernet",
  "paso de los toros",
  "aquarius",
  "speed",
  "monster",
  "red bull",
  "jugo",
  "cepita",
  "chapa",
  "hielo",
  "alfajor",
  "helado",
];

// Palabras clave que identifican alimentos que SÍ requieren cocción o preparación de cocina
const KITCHEN_KEYWORDS = [
  "pizza",
  "empanada",
  "lomo",
  "lomito",
  "hamburguesa",
  "sandwich",
  "sándwich",
  "papas",
  "papa",
  "fritas",
  "horno",
  "muzzarella",
  "napo",
  "fugazz",
  "calabresa",
  "roque",
  "tarta",
  "pasta",
  "ravioles",
  "ñoquis",
  "tallarines",
  "milanesa",
  "suprema",
  "canastita",
  "calzone",
  "focaccia",
];

/**
 * Determina si un producto o ítem individual requiere preparación en cocina.
 */
export function isKitchenItem(item: { name: string; categoryId?: number; category?: string; requiresKitchen?: boolean }): boolean {
  if (typeof item.requiresKitchen === "boolean") {
    return item.requiresKitchen;
  }

  // Si tiene categoryId explícito
  if (item.categoryId !== undefined) {
    // Categoría 4: Bebidas, Categoría 7: Almacén
    if (item.categoryId === 4 || item.categoryId === 7) return false;
    // Categorías 1 (Pizzas), 2 (Empanadas), 3 (Sándwiches), 6 (Menú del día)
    if ([1, 2, 3, 6, 101, 102, 103, 201, 202].includes(item.categoryId)) return true;
  }

  if (item.category) {
    const catLower = item.category.toLowerCase();
    if (catLower.includes("bebida") || catLower.includes("almacén") || catLower.includes("almacen")) {
      return false;
    }
    if (catLower.includes("pizza") || catLower.includes("empanada") || catLower.includes("sándwich") || catLower.includes("sandwich") || catLower.includes("menú")) {
      return true;
    }
  }

  // Detección por nombre
  const nameLower = (item.name || "").toLowerCase();

  // Si contiene palabras explícitas de cocina
  for (const kw of KITCHEN_KEYWORDS) {
    if (nameLower.includes(kw)) return true;
  }

  // Si contiene palabras de bebidas/almacén
  for (const kw of NON_KITCHEN_KEYWORDS) {
    if (nameLower.includes(kw)) return false;
  }

  // Por defecto, si no es una bebida evidente, asumimos que requiere cocina para no omitir un plato
  return true;
}

/**
 * Retorna true si el pedido contiene AL MENOS UN producto que requiere cocina.
 * Si el 100% de los ítems son bebidas o almacén, retorna false.
 */
export function orderRequiresKitchen(order: MockOrder): boolean {
  if (!order || !order.items || order.items.length === 0) return false;
  return order.items.some((item) => isKitchenItem(item));
}

/**
 * Obtiene solo los ítems de cocina de un pedido (ej: Pizzas, Empanadas).
 */
export function getKitchenItems(order: MockOrder) {
  if (!order || !order.items) return [];
  return order.items.filter((item) => isKitchenItem(item));
}

/**
 * Obtiene solo los ítems de mostrador/bebidas de un pedido (ej: Gaseosas, Cervezas).
 */
export function getDrinkItems(order: MockOrder) {
  if (!order || !order.items) return [];
  return order.items.filter((item) => !isKitchenItem(item));
}
