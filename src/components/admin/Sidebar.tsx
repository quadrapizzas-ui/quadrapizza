"use client"
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Panel de control", href: "/dashboard", icon: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" },
  { name: "Catálogo", href: "/catalog", icon: "M4 6h16M4 12h16M4 18h16" },
];

export default function Sidebar({ isOpen = false, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "fixed left-0 top-0 w-64 h-screen border-r border-zinc-900 bg-zinc-950 p-6 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 overflow-y-auto",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
       <div className="mb-10 flex items-center justify-between">
         <div className="flex items-center gap-2">
           <Image src="/logo.jpg" alt="Quadra Pizza Logo" width={32} height={32} className="rounded-lg object-cover shadow-md" />
           <span className="font-black text-xl tracking-tight">Quadra <span className="text-orange-500">Pizza</span></span>
         </div>
         {/* Boton Cerrar solo visible en mobil */}
         <button className="lg:hidden p-2 text-zinc-400 hover:text-white" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
         </button>
       </div>

       <nav className="flex-1 flex flex-col gap-2">
         {navItems.map((item) => {
           const isActive = pathname.startsWith(item.href);
           return (
             <Link 
               key={item.href} 
               href={item.href}
               onClick={onClose} // Auto cierra en celulares
               className={cn(
                 "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-sm",
                 isActive 
                   ? "bg-zinc-800/80 text-white shadow-sm border border-zinc-700/50" 
                   : "text-zinc-400 hover:text-white hover:bg-zinc-900"
               )}
             >
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
               {item.name}
             </Link>
           )
         })}
       </nav>

       {/* Usuario Sesión */}
       <div className="pt-6 border-t border-zinc-900 mt-auto">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-orange-600 shadow-inner flex items-center justify-center text-white font-black text-lg">
               H
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-bold text-white">Hector Zanier</span>
               <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest mt-0.5">Dueño</span>
             </div>
           </div>
           <button title="Cerrar Sesión" className="p-2 text-zinc-500 hover:text-orange-500 hover:bg-zinc-900 rounded-lg transition-colors">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
           </button>
         </div>
       </div>
    </aside>
  )
}
