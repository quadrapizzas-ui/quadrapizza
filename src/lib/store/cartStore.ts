import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  cartItemId: string; // ID único para el producto en el carrito (ej. uuidv4)
  productId: string;
  name: string;
  price: number; // Precio base calculado + extras
  quantity: number;
  modifiers: Record<string, any>; // Guarda opciones como { "Sabores": ["Rúcula", "Jamón"], "Masa": "Integral" }
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => set((state) => {
        // Validación heurística: si el producto y los modificadores exactos ya están, sumamos 1 a la cantidad en vez de agregar fila nueva
        const existingItemIndex = state.items.findIndex(
          i => i.productId === newItem.productId && JSON.stringify(i.modifiers) === JSON.stringify(newItem.modifiers)
        );

        if (existingItemIndex > -1) {
          const newItems = [...state.items];
          newItems[existingItemIndex].quantity += newItem.quantity;
          return { items: newItems };
        }

        return { items: [...state.items, newItem] };
      }),
      
      removeItem: (cartItemId) => set((state) => ({
        items: state.items.filter(i => i.cartItemId !== cartItemId)
      })),
      
      updateQuantity: (cartItemId, quantity) => set((state) => ({
        items: state.items.map(i => i.cartItemId === cartItemId ? { ...i, quantity } : i)
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'quadra-pizza-cart', // Permite preservar el carrito aunque el usuario refresque la PWA
    }
  )
)
