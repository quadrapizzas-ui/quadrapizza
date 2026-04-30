import { create } from 'zustand'

interface UIState {
  // Manejo del cajón lateral/inferior del Carrito
  isCartDrawerOpen: boolean;
  toggleCartDrawer: () => void;
  setCartDrawer: (isOpen: boolean) => void;
  
  // Manejo del menú de navegación Mobile
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  
  // Modal/Drawer obligatorio para armar producto complejo (Ej: "Armá tu pizza")
  activeConfiguratorProductId: string | null;
  openProductConfigurator: (productId: string) => void;
  closeProductConfigurator: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartDrawerOpen: false,
  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
  setCartDrawer: (isOpen) => set({ isCartDrawerOpen: isOpen }),
  
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  
  activeConfiguratorProductId: null,
  openProductConfigurator: (productId) => set({ activeConfiguratorProductId: productId }),
  closeProductConfigurator: () => set({ activeConfiguratorProductId: null }),
}))
