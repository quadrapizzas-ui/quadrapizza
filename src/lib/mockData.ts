import { Database } from "@/types/database.types";
import { v4 as uuidv4 } from "uuid";

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

// Extendemos producto temporalmente para manejar atributos promocionales
// que luego se moverán a una tabla de campañas o se agregarán al esquema
export interface ExtendedProduct extends Product {
  is_promo?: boolean;
  original_price?: number;
  promo_label?: string;
  is_quadra?: boolean;
  quadra_customizable_rows?: number;
  quadra_fixed_rows_count?: number;
  quadra_fixed_variety?: string;
  quadra_available_varieties?: string[];
}

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

// Simulamos una suscripción RxJS o un store global simple para las órdenes activas,
// ya que deben ser compartidas entre el flujo del cliente (enviar) y el admin (ver).
// Por ahora usaremos eventos de window o simplemente un objeto de memoria mutable accesible (estamos en el cliente para el prototipo).

export type OrderStatus = "confirmado" | "en-cocina" | "listo" | "en-camino" | "completado" | "cancelado";

/** Extrae solo el primer nombre de un nombre completo (e.g. "Juan García" → "Juan") */
export function getFirstName(fullName: string): string {
  return fullName?.trim().split(/\s+/)[0] || "";
}

export interface MockOrder {
  id: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  paymentMethod: string;
  clientName: string;
  phone?: string;
  address: string;
  total: number;
  deliveryFee?: number;
  createdAt: string;
  mockAge: string;
  status: OrderStatus;
  cajero_id?: number;
  cajero_name?: string;
}

const generateMockOrders = (): MockOrder[] => {
  return [];
};
 
 class OrdersStore {
   private orders: MockOrder[] = generateMockOrders();
 
   private listeners: Set<() => void> = new Set();
 
   constructor() {
     this.loadFromStorage();
   }
 
   private loadFromStorage() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("quadra_mock_orders_v8");
      if (stored) {
        try {
          let orders = JSON.parse(stored);
          this.orders = orders;
        } catch (e) {
          localStorage.setItem("quadra_mock_orders_v8", JSON.stringify(this.orders));
        }
      } else {
          localStorage.setItem("quadra_mock_orders_v8", JSON.stringify(this.orders));
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("quadra_mock_orders_v8", JSON.stringify(this.orders));
    }
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  getSnapshot = () => {
    return this.orders;
  }

  addOrder(order: Partial<MockOrder>) {
    const todayStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const todaysOrders = this.orders.filter(o => o.id.startsWith(todayStr));
    const nextSeq = String(todaysOrders.length + 1).padStart(3, '0');
    
    const newOrder: MockOrder = {
      id: `${todayStr}-${nextSeq}`,
      items: order.items || [],
      paymentMethod: order.paymentMethod || "efectivo",
      clientName: order.clientName || "Cliente",
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
    this.orders = [newOrder, ...this.orders];
    this.saveToStorage();
    this.notify();
    return newOrder;
  }

  updateOrderStatus(id: string, newStatus: OrderStatus) {
    this.orders = this.orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    this.saveToStorage();
    this.notify();
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const mockOrdersStore = new OrdersStore();

export interface MockCustomer {
  id: string;
  name: string;
  phone: string;
  address: string;
  neighborhoodId?: number;
  addressDetail?: string;
  orders: number;
  lastOrder: string;
  total: number;
}

const generateMockCustomers = (): MockCustomer[] => {
  return [];
};

class CustomersStore {
  private customers: MockCustomer[] = generateMockCustomers();

  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("quadra_mock_customers_v4");
      if (stored) {
        try {
          let customers = JSON.parse(stored);
          this.customers = customers;
        } catch (e) {
          console.error("Error parsing stored customers", e);
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("quadra_mock_customers_v4", JSON.stringify(this.customers));
    }
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  getSnapshot = () => {
    return this.customers;
  }

  addOrUpdateCustomer(data: Partial<MockCustomer>) {
    // Format name to Title Case (safe for accented characters)
    const formattedName = data.name
      ? data.name.trim().split(/\s+/).map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ')
      : undefined;

    const processedData = {
      ...data,
      ...(formattedName ? { name: formattedName } : {})
    };

    // Only search by phone if provided, otherwise fallback to exact name
    const existingIdx = this.customers.findIndex(c => {
      if (processedData.id && c.id === processedData.id) return true;
      if (processedData.phone && c.phone === processedData.phone) return true;
      return false;
    });

    if (existingIdx >= 0) {
      this.customers[existingIdx] = {
        ...this.customers[existingIdx],
        ...processedData,
        orders: this.customers[existingIdx].orders + (processedData.orders || 0), // Use 0 here because we update orders below
        total: this.customers[existingIdx].total + (processedData.total || 0),
        lastOrder: "Justo ahora"
      };
      if (processedData.orders) {
          this.customers[existingIdx].orders = this.customers[existingIdx].orders + 1;
      }
    } else {
      const newCustomer: MockCustomer = {
        id: "C-" + Math.floor(1000 + Math.random() * 9000),
        name: processedData.name || "Cliente",
        phone: processedData.phone || "",
        address: processedData.address || "",
        neighborhoodId: processedData.neighborhoodId,
        addressDetail: processedData.addressDetail || "",
        orders: 1,
        lastOrder: "Justo ahora",
        total: processedData.total || 0,
      };
      this.customers = [newCustomer, ...this.customers];
    }
    
    this.saveToStorage();
    this.notify();
  }

  deleteCustomer(id: string) {
    this.customers = this.customers.filter(c => c.id !== id);
    this.saveToStorage();
    this.notify();
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const mockCustomersStore = new CustomersStore();

export type StockItem = {
  id: number;
  name: string;
  unit: string;
  current: number;
  min: number;
  cost: number;
  category: string;
};

const INITIAL_STOCK: StockItem[] = [
  { id: 1,  name: "Masa de Pizza",       unit: "unidades", current: 12,  min: 10, cost: 350,   category: "Bases"    },
  { id: 2,  name: "Muzzarella",          unit: "kg",       current: 3.5, min: 5,  cost: 4200,  category: "Lácteos"  },
  { id: 3,  name: "Salsa de Tomate",     unit: "litros",   current: 8,   min: 4,  cost: 1800,  category: "Salsas"   },
  { id: 4,  name: "Jamón Cocido",        unit: "kg",       current: 1.2, min: 3,  cost: 6500,  category: "Fiambres" },
  { id: 5,  name: "Coca-Cola 1.5L",      unit: "unidades", current: 24,  min: 12, cost: 1200,  category: "Bebidas"  },
  { id: 6,  name: "Pan de Hamburguesa",  unit: "unidades", current: 6,   min: 15, cost: 280,   category: "Bases"    },
  { id: 7,  name: "Cheddar Feteado",     unit: "paquetes", current: 8,   min: 5,  cost: 3200,  category: "Lácteos"  },
  { id: 8,  name: "Huevos",              unit: "docenas",  current: 1,   min: 3,  cost: 3800,  category: "Básicos"  },
  { id: 9,  name: "Aceite de Oliva",     unit: "litros",   current: 4,   min: 2,  cost: 5500,  category: "Básicos"  },
  { id: 10, name: "Bacon",               unit: "kg",       current: 2,   min: 3,  cost: 7800,  category: "Fiambres" },
];

class StockStore {
  private stock: StockItem[] = INITIAL_STOCK;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("quadra_mock_stock_v1");
      if (stored) {
        try {
          this.stock = JSON.parse(stored);
        } catch (e) {
          console.error("Error parsing stored stock", e);
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("quadra_mock_stock_v1", JSON.stringify(this.stock));
    }
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  getSnapshot = () => {
    return this.stock;
  }

  adjustStock(id: number, delta: number) {
    this.stock = this.stock.map(i => 
      i.id === id ? { ...i, current: Math.max(0, +(i.current + delta).toFixed(1)) } : i
    );
    this.saveToStorage();
    this.notify();
  }

  updateItem(id: number, updates: Partial<StockItem>) {
    this.stock = this.stock.map(i => 
      i.id === id ? { ...i, ...updates } : i
    );
    this.saveToStorage();
    this.notify();
  }

  addItem(item: Omit<StockItem, 'id'>) {
    const newId = Math.max(0, ...this.stock.map(i => i.id)) + 1;
    this.stock = [...this.stock, { id: newId, ...item }];
    this.saveToStorage();
    this.notify();
  }

  deleteItem(id: number) {
    this.stock = this.stock.filter(i => i.id !== id);
    this.saveToStorage();
    this.notify();
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const mockStockStore = new StockStore();
