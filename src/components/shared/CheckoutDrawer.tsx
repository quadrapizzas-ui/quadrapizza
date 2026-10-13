"use client"
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useUIStore } from "@/lib/store/uiStore";
import { useCartStore } from "@/lib/store/cartStore";
import { useRouter } from "next/navigation";

export function CheckoutDrawer() {
  const { isCartDrawerOpen, setCartDrawer } = useUIStore();
  const { items, getTotal, removeItem } = useCartStore();
  const router = useRouter();

  const handleCheckout = () => {
    setCartDrawer(false);
    router.push('/checkout');
  };

  return (
    <Drawer isOpen={isCartDrawerOpen} onClose={() => setCartDrawer(false)}>
      <div className="flex flex-col h-full">
        <div className="mb-6 border-b border-zinc-800 pb-4">
          <h2 className="text-2xl font-bold">Tu Pedido</h2>
          <p className="text-sm text-zinc-400">Revisa tus productos antes de pagar</p>
        </div>
        
        <div className="flex-1 overflow-y-auto w-full flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 opacity-60">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-4"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              <p>Tu carrito está vacío.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartItemId} className="flex justify-between items-start border-b border-zinc-900 pb-4">
                <div className="flex-1 pr-4">
                  <h4 className="font-bold text-zinc-100">{item.quantity}x {item.name}</h4>
                  {Object.entries(item.modifiers).map(([key, val]) => (
                     <p key={key} className="text-[12px] leading-tight text-zinc-400 mt-1">
                       <span className="font-medium text-zinc-300">{key}:</span> {Array.isArray(val) ? val.join(", ") : String(val)}
                     </p>
                  ))}
                  <p className="text-orange-500 font-bold text-sm mt-2">${item.price}</p>
                </div>
                <button 
                  onClick={() => removeItem(item.cartItemId)} 
                  className="bg-zinc-900 rounded p-1.5 text-zinc-500 hover:text-red-500 hover:bg-zinc-800 transition"
                  aria-label="Eliminar item"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="pt-6 mt-4 sticky bottom-0 bg-zinc-950 pb-2">
            <div className="flex justify-between items-center mb-4 text-xl font-black">
              <span>Total Estimado</span>
              <span className="text-orange-500">${getTotal()}</span>
            </div>
            <Button fullWidth size="lg" onClick={handleCheckout}>
              Proceder al Pago
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  )
}
