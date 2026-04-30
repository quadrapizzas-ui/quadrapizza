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
  }
];

// Simulamos una suscripción RxJS o un store global simple para las órdenes activas,
// ya que deben ser compartidas entre el flujo del cliente (enviar) y el admin (ver).
// Por ahora usaremos eventos de window o simplemente un objeto de memoria mutable accesible (estamos en el cliente para el prototipo).

export type OrderStatus = "confirmado" | "en-cocina" | "listo" | "en-camino" | "completado" | "cancelado";

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
}

class OrdersStore {
  private orders: MockOrder[] = [
    {
      id: "W-1024", items: [{ name: "Quadra Integral", quantity: 2, price: 10500 }, { name: "Lomo Especial", quantity: 1, price: 12000 }],
      paymentMethod: "Efectivo", clientName: "Juan García", phone: "3514567890", address: "AV. COLÓN 1200 · Centro", total: 33000,
      createdAt: new Date(Date.now() - 5 * 60000).toISOString(), mockAge: "Hace 5 min", status: "confirmado"
    },
    {
      id: "W-1025", items: [{ name: "Pizza Muzzarella", quantity: 1, price: 7500 }, { name: "Coca-Cola 1.5L", quantity: 1, price: 2500 }],
      paymentMethod: "Mercado Pago", clientName: "María López", phone: "3512345678", address: "BV. SAN JUAN 800 · Güemes", total: 10000, deliveryFee: 800,
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(), mockAge: "Hace 15 min", status: "en-cocina"
    },
    {
      id: "W-1026", items: [{ name: "Hamburguesa Quadra Triple", quantity: 2, price: 9500 }],
      paymentMethod: "Tarjeta de crédito", clientName: "Carlos Pérez", phone: "3519876543", address: "AV. VÉLEZ SÁRSFIELD 500", total: 21850,
      createdAt: new Date(Date.now() - 25 * 60000).toISOString(), mockAge: "Hace 25 min", status: "listo"
    },
    {
      id: "W-1027", items: [{ name: "Lomo Especial", quantity: 2, price: 12000 }, { name: "Pizza Muzzarella", quantity: 1, price: 7500 }],
      paymentMethod: "Efectivo", clientName: "Roberto Silva", phone: "3513334444", address: "DUARTE QUIRÓS 1500 · Alberdi", total: 31500, deliveryFee: 1500,
      createdAt: new Date(Date.now() - 40 * 60000).toISOString(), mockAge: "Hace 40 min", status: "en-camino"
    },
    {
      id: "W-1028", items: [{ name: "Quadra Integral", quantity: 1, price: 10500 }],
      paymentMethod: "Mercado Pago", clientName: "Laura Fernández", phone: "3511112222", address: "CALLE OBISPO TREJO 300", total: 10500,
      createdAt: new Date(Date.now() - 60 * 60000).toISOString(), mockAge: "Hace 1 hora", status: "completado"
    },
    {
      id: "W-1029", items: [{ name: "Pizza Muzzarella", quantity: 3, price: 7500 }],
      paymentMethod: "Efectivo", clientName: "Javier Gómez", phone: "3515556666", address: "Retiro en local", total: 22500,
      createdAt: new Date(Date.now() - 2 * 60000).toISOString(), mockAge: "Justo ahora", status: "confirmado"
    },
    {
      id: "W-1030", items: [{ name: "Hamburguesa Quadra Triple", quantity: 1, price: 9500 }, { name: "Coca-Cola 1.5L", quantity: 1, price: 2500 }],
      paymentMethod: "Efectivo", clientName: "Ana Martínez", phone: "3517778888", address: "Retiro en local", total: 12000,
      createdAt: new Date(Date.now() - 20 * 60000).toISOString(), mockAge: "Hace 20 min", status: "en-cocina"
    }
  ];

  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("quadra_mock_orders");
      if (stored) {
        try {
          let orders = JSON.parse(stored);
          if (orders.length < 5) throw new Error("Force seed for simulation");
          // Filtro temporal para limpiar registros viejos
          const forbiddenNames = ["angel salazar", "app web"];
          orders = orders.filter((o: any) => !forbiddenNames.includes(o.clientName?.toLowerCase()));
          this.orders = orders;
          localStorage.setItem("quadra_mock_orders", JSON.stringify(orders));
        } catch (e) {
          // If JSON parse fails or force seed triggers, fallback to injected simulation array and save it
          localStorage.setItem("quadra_mock_orders", JSON.stringify(this.orders));
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("quadra_mock_orders", JSON.stringify(this.orders));
    }
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot = () => {
    return this.orders;
  }

  addOrder(order: Partial<MockOrder>) {
    const newOrder: MockOrder = {
      id: "W-" + Math.floor(1000 + Math.random() * 9000),
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

class CustomersStore {
  private customers: MockCustomer[] = [
    { id: "1", name: "Juan García", phone: "3514567890", address: "AV. COLÓN 1200", addressDetail: "Centro", orders: 14, lastOrder: "Hace 2 días", total: 42000 },
    { id: "2", name: "María López", phone: "3512345678", address: "BV. SAN JUAN 800", addressDetail: "Güemes", orders: 8, lastOrder: "Hace 1 semana", total: 28000 },
    { id: "3", name: "Carlos Pérez", phone: "3519876543", address: "AV. VÉLEZ SÁRSFIELD 500", orders: 22, lastOrder: "Hoy", total: 67500 },
    { id: "4", name: "Laura Fernández", phone: "3511112222", address: "CALLE OBISPO TREJO 300", orders: 5, lastOrder: "Hace 3 días", total: 15000 },
    { id: "5", name: "Roberto Silva", phone: "3513334444", address: "DUARTE QUIRÓS 1500", addressDetail: "Alberdi", orders: 31, lastOrder: "Ayer", total: 102000 },
  ];

  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("quadra_mock_customers");
      if (stored) {
        try {
          let customers = JSON.parse(stored);
          // Filtro temporal para limpiar registros viejos
          const forbiddenNames = ["angel salazar", "app web"];
          customers = customers.filter((c: any) => !forbiddenNames.includes(c.name?.toLowerCase()));
          this.customers = customers;
          localStorage.setItem("quadra_mock_customers", JSON.stringify(customers));
        } catch (e) {
          console.error("Error parsing stored customers", e);
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("quadra_mock_customers", JSON.stringify(this.customers));
    }
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
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
