"use client"
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export const Drawer = ({ 
  isOpen, 
  onClose, 
  children,
  className 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  children: React.ReactNode,
  className?: string
}) => {
  // Evitar scroll del body cuando está abierto
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
        <>
          {/* Overlay oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />
          {/* Panel inferior (Bottom Sheet) */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 flex max-h-[90vh] flex-col rounded-t-[32px] bg-zinc-950 p-6 shadow-2xl border-t border-zinc-800",
              className
            )}
          >
            {/* Grabber para indicar que se puede arrastrar (visual) */}
            <div className="mx-auto mb-6 h-1.5 w-12 shrink-0 rounded-full bg-zinc-800" />
            <div className="relative flex-1 overflow-y-auto w-full no-scrollbar">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
