"use client"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

type OrderItem = {
  id: string
  name: string
  price: number
  quantity: number
}

// Catálogo base veloz
const QUICK_CATALOG = [
  { id: "p-muzza", name: "Muzzarella", price: 7500 },
  { id: "p-esp", name: "Especial", price: 9000 },
  { id: "p-int", name: "Integral", price: 10500 },
  { id: "l-comp", name: "Lomo Completo", price: 12000 },
  { id: "b-coca", name: "Coca Cola 1.5L", price: 3000 },
]

export const AdminPOSPanel = ({
  isOpen,
  onClose,
  onConfirm
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: (order: any) => void
}) => {
  const [items, setItems] = useState<OrderItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia'>('efectivo')
  const [clientName, setClientName] = useState('')
  const [address, setAddress] = useState('')

  const addToBody = (product: any) => {
    setItems((curr) => {
      const exists = curr.find((i) => i.id === product.id)
      if (exists) {
        return curr.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...curr, { id: product.id, name: product.name, price: product.price, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems((curr) => curr.filter((i) => i.id !== id))
  }

  const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0)

  const handleSubmit = () => {
    if (items.length === 0) return alert("Agrega al menos un producto")
    
    onConfirm({
      id: "M-" + Math.floor(Math.random() * 10000), // ID manual simulado
      items,
      paymentMethod,
      clientName: clientName || "Mostrador",
      address: address || "Local",
      total,
      createdAt: new Date().toISOString()
    })

    // Resetear formulario
    setItems([])
    setClientName('')
    setAddress('')
    setPaymentMethod('efectivo')
  }

  // Prevenir scroll de body 
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel Lateral Desktop / Fill Mobile */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full md:w-[450px] bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col h-full"
          >
            {/* Header del Panel */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur pb-4">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-orange-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Nuevo Pedido
              </h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 transition text-zinc-400 hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto w-full no-scrollbar flex flex-col p-5 gap-6">
              
              {/* Botones Carga Rapida */}
              <div className="shrink-0">
                <h3 className="text-xs uppercase tracking-widest font-black text-zinc-500 mb-3 block">Catálogo Rápido</h3>
                <div className="flex flex-wrap gap-2">
                  {QUICK_CATALOG.map(prod => (
                    <button 
                      key={prod.id}
                      onClick={() => addToBody(prod)}
                      className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:border-orange-500 hover:bg-orange-500/10 active:scale-95 transition-all text-left flex flex-col"
                    >
                      <span>{prod.name}</span>
                      <span className="text-orange-500 text-xs">${prod.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista Detalle Carrito */}
              <div className="flex flex-col gap-3 min-h-[100px] shrink-0 border-t mx-[-1.25rem] px-5 pt-6 border-zinc-900 border-b pb-6">
                 <h3 className="text-xs uppercase tracking-widest font-black text-zinc-500 mb-2">Detalle del Ticket</h3>
                 {items.length === 0 ? (
                   <div className="text-center text-zinc-600 text-sm py-8 font-medium">No has agregado nada aún.</div>
                 ) : (
                   items.map(item => (
                     <div key={item.id} className="flex justify-between items-center group bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-900/50">
                       <span className="font-medium text-sm flex gap-3 text-zinc-200">
                         <span className="text-orange-500 font-bold bg-orange-500/20 px-2 rounded-md">{item.quantity}x</span> {item.name}
                       </span>
                       <div className="flex items-center gap-3">
                         <span className="text-zinc-400 font-bold text-sm drop-shadow-sm">${item.price * item.quantity}</span>
                         <button onClick={() => removeItem(item.id)} className="text-zinc-600 hover:text-red-500 transition">
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                         </button>
                       </div>
                     </div>
                   ))
                 )}
              </div>

              {/* Formulario Cliente */}
              <div className="flex flex-col gap-4 shrink-0">
                 <div>
                   <label className="text-xs uppercase tracking-widest font-black text-zinc-500 mb-2 block">Nombre Cliente (Opc.)</label>
                   <Input placeholder="Ej. Juan Pérez" value={clientName} onChange={(e) => setClientName(e.target.value)} className="bg-zinc-900 border-zinc-800" />
                 </div>
                 <div>
                   <label className="text-xs uppercase tracking-widest font-black text-zinc-500 mb-2 block">Domicilio (Vacio = Mostrador)</label>
                   <Input placeholder="Ej. B° Centro, Calle Falsa 123" value={address} onChange={(e) => setAddress(e.target.value)} className="bg-zinc-900 border-zinc-800" />
                 </div>
              </div>

              {/* Metodo de Pago */}
              <div className="pb-8 shrink-0">
                <label className="text-xs uppercase tracking-widest font-black text-zinc-500 mb-2 block">Forma de Pago</label>
                <div className="grid grid-cols-2 gap-3">
                   <Button 
                     variant={paymentMethod === 'efectivo' ? 'default' : 'outline'} 
                     onClick={() => setPaymentMethod('efectivo')}
                     className={paymentMethod === 'efectivo' ? 'bg-orange-600 hover:bg-orange-500 h-12 shadow-md hover:-translate-y-1' : 'border-zinc-800 text-zinc-400 bg-zinc-900 h-12 hover:border-zinc-700'}
                   >
                     Efectivo
                   </Button>
                   <Button 
                     variant={paymentMethod === 'transferencia' ? 'default' : 'outline'} 
                     onClick={() => setPaymentMethod('transferencia')}
                     className={paymentMethod === 'transferencia' ? 'bg-orange-600 hover:bg-orange-500 h-12 shadow-md hover:-translate-y-1' : 'border-zinc-800 text-zinc-400 bg-zinc-900 h-12 hover:border-zinc-700'}
                   >
                     Transferencia
                   </Button>
                </div>
              </div>
            </div>

            {/* Sticky Footer Total y Registrar */}
            <div className="border-t border-zinc-900 bg-zinc-950 p-5 mt-auto flex flex-col gap-4 shadow-[0_-15px_30px_rgba(0,0,0,0.4)] relative z-20">
               <div className="flex justify-between items-end px-1">
                 <span className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Total</span>
                 <span className="text-3xl font-black text-orange-500 leading-none">${total}</span>
               </div>
               <Button onClick={handleSubmit} size="lg" fullWidth className="h-14 text-lg font-bold shadow-[0_0_20px_rgba(234,88,12,0.3)] active:scale-95 transition-all">
                 Registrar Pedido Ahora
               </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
