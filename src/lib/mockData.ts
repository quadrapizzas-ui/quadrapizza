import { Category, ExtendedProduct } from "@/types/models";

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Pizzas Especiales", sort_order: 1, created_at: new Date().toISOString() },
  { id: "cat-2", name: "Hamburguesas", sort_order: 2, created_at: new Date().toISOString() },
  { id: "cat-3", name: "Lomos", sort_order: 3, created_at: new Date().toISOString() },
  { id: "cat-4", name: "Bebidas Frías", sort_order: 4, created_at: new Date().toISOString() },
];

export const MOCK_PRODUCTS: ExtendedProduct[] = [
  // Promo Item
  {
    id: "prod-lomo-esp",
    name: "Lomo Especial Quadra",
    description: "Doble carne, cheddar derretido, huevo a la plancha y papas rústicas incluidas.",
    price: 12000,
    category_id: "cat-3",
    image_url: "https://images.unsplash.com/photo-1544982503-9f984c14501a?q=80&w=600",
    is_active: true,
    is_menu_del_dia: false,
    is_promo: true,
    original_price: 15000,
    promo_label: "20% OFF",
    stock: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Menu del Dia & Normal Item
  {
    id: "prod-pizza-int",
    name: "Pizza Quadra Integral",
    description: "Masa madre pura e integral al 100%, con base pomodoro marzano. (Toques a elección).",
    price: 10500,
    category_id: "cat-1",
    image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600",
    is_active: true,
    is_menu_del_dia: true,
    stock: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Normal Item
  {
    id: "prod-pizza-muz",
    name: "Pizza Muzzarella",
    description: "El clásico argentino que no puede fallar. Fina y crocante.",
    price: 7500,
    category_id: "cat-1",
    image_url: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=600",
    is_active: true,
    is_menu_del_dia: false,
    stock: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Additional item to make grid look nice
  {
    id: "prod-burger-quad",
    name: "Hamburguesa Quadra Triple",
    description: "Triple medallón smash, triple cheddar, bacon crocante y salsa mágica.",
    price: 9500,
    category_id: "cat-2",
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600",
    is_active: true,
    is_menu_del_dia: false,
    stock: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Quadra Item
  {
    id: "prod-quadra-2",
    name: "Quadra 2 (2 Variedades)",
    description: "Pizza cuadrada de 9 porciones. 1 fila de Muzzarella y 2 a elección.",
    price: 10500,
    category_id: "cat-1",
    image_url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=600",
    is_active: true,
    is_menu_del_dia: false,
    stock: null,
    is_quadra: true,
    quadra_customizable_rows: 2,
    quadra_fixed_rows_count: 1,
    quadra_fixed_variety: "Muzzarella",
    quadra_available_varieties: ["Jamón y Morrones", "Fugazzeta", "Calabresa", "Palmitos", "Rúcula"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

/** Extrae solo el primer nombre de un nombre completo (e.g. "Juan García" → "Juan") */
export function getFirstName(fullName: string): string {
  return fullName?.trim().split(/\s+/)[0] || "";
}
