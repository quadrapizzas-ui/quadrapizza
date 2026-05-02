"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

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
    <div className="fixed inset-0 bg-zinc-950 text-zinc-50 flex flex-col overflow-hidden">
      {/* Sticky top bar */}
      <header className="shrink-0 h-14 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-900 px-4 flex items-center gap-4 z-40">
        <div className="flex items-center gap-2.5 shrink-0">
          <Image src="/logo.jpg" alt="Logo" width={30} height={30} className="rounded-lg object-cover" />
          <div className="flex flex-col leading-none">
            <span className="font-black text-sm tracking-tight">Quadra <span className="text-orange-500">Pizza</span></span>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Delivery</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 ml-1">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="hidden sm:block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">En línea</span>
        </div>
        <div className="flex-1" />
        <button
          onClick={() => { localStorage.removeItem("quadra_delivery_auth"); router.push("/delivery/login"); }}
          className="p-2 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-zinc-900 transition"
          title="Cerrar sesión"
        >
          <LogOut size={16} />
        </button>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}
