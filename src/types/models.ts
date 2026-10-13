import { Database } from "./database.types";

export type Product = Database['public']['Tables']['products']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];

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

export type OrderStatus = "confirmado" | "en-cocina" | "listo" | "en-camino" | "completado" | "cancelado";

export interface MockOrderItem {
  name: string;
  quantity: number;
  price: number;
  requiresKitchen?: boolean;
  categoryId?: number;
  category?: string;
}

export interface MockOrder {
  id: string;
  items: MockOrderItem[];
  paymentMethod: string;
  paymentStatus?: "pagado" | "pendiente";
  paidAmount?: number; // Monto efectivamente abonado (para pagos parciales/entregas a cuenta)
  clientFirstName: string;
  clientLastName: string;
  phone?: string;
  address: string;
  total: number;
  deliveryFee?: number;
  createdAt: string;
  mockAge: string;
  status: OrderStatus;
  cajero_id?: number;
  cajero_name?: string;
  customerId?: string;
}

export interface MockCustomer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  neighborhoodId?: number;
  addressDetail?: string;
  orders: number;
  lastOrder: string;
  total: number;
  registeredAt?: string;
  isVerified?: boolean;
}

export interface MockUser {
  id: number;
  name: string;
  role: string;
  email: string;
  pin: string;
  active: boolean;
}
