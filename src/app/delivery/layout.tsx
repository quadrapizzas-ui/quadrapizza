"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Bike, LogOut, LayoutList, Navigation2 } from "lucide-react";

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (pathname === "/delivery/login") { setIsAuthorized(true); return; }
    const auth = localStorage.getItem("quadra_delivery_auth");
    if (!auth) { router.push("/delivery/login"); return; }
    setIsAuthorized(true);
    document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [pathname, router]);

  if (!isAuthorized) return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <span className="w-6 h-6 border-2 border-zinc-800 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  if (pathname === "/delivery/login") return (
    <div className="min-h-screen bg-black text-zinc-50">
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      {/* Sticky top bar */}
      <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-900 px-4 h-14 flex items-center gap-3">
        <Image src="/logo.jpg" alt="Logo" width={28} height={28} className="rounded-lg object-cover shrink-0" />
        <div className="flex flex-col leading-none">
          <span className="font-black text-xs tracking-tight">Quadra <span className="text-orange-500">Pizza</span></span>
          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Delivery</span>
        </div>
        <div className="flex items-center gap-1.5 ml-3">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">En línea</span>
        </div>
        <div className="flex-1" />
        <button
          onClick={() => { localStorage.removeItem("quadra_delivery_auth"); router.push("/delivery/login"); }}
          className="p-2 rounded-lg text-zinc-600 hover:text-emerald-400 hover:bg-zinc-900 transition"
          title="Cerrar sesión"
        >
          <LogOut size={15} />
        </button>
      </header>
      <main className="flex-1 flex flex-col overflow-hidden pb-[70px]">{children}</main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-[70px] bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-900 flex items-center justify-center px-4 pb-safe z-40">
        <div className="flex gap-2 w-full max-w-sm">
          <Link href="/delivery/mis-viajes"
             className={`flex-1 flex flex-col items-center justify-center gap-1 rounded-xl transition ${
               pathname === "/delivery/mis-viajes" 
                 ? "text-emerald-400 bg-emerald-500/10" 
                 : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
             }`}
          >
            <Navigation2 size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Mis Viajes</span>
          </Link>
          <Link href="/delivery/monitoreo"
             className={`flex-1 flex flex-col items-center justify-center gap-1 rounded-xl transition ${
               pathname === "/delivery/monitoreo" 
                 ? "text-emerald-400 bg-emerald-500/10" 
                 : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
             }`}
          >
            <LayoutList size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Monitoreo</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
