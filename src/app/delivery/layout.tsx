"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [clock, setClock]               = useState("");
  const { activeUser, logout } = useAuthStore();

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (pathname === "/delivery/login") {
      if (activeUser) {
        router.push("/delivery/mis-viajes");
        return;
      }
      setIsAuthorized(true); 
      return; 
    }
    if (!activeUser) { router.push("/delivery/login"); return; }
    setIsAuthorized(true);
    document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [pathname, router, activeUser]);

  if (!isAuthorized) return (
    <>
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
        <span className="w-6 h-6 border-2 border-zinc-800 border-t-emerald-500 rounded-full animate-spin" />
      </div>
      <div className="hidden">{children}</div>
    </>
  );

  return (
    <div className={pathname === "/delivery/login" ? "min-h-screen bg-black text-zinc-50" : "fixed inset-0 bg-zinc-950 text-zinc-50 flex flex-col overflow-hidden"}>
      {/* Sticky top bar */}
      {pathname !== "/delivery/login" && (
        <header className="shrink-0 h-14 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-900 px-4 flex items-center gap-4 z-40">
          <div className="flex items-center gap-2.5 shrink-0">
            <Image src="/logo.jpg" alt="Logo" width={30} height={30} className="rounded-lg object-cover" />
            <div className="flex flex-col leading-none">
              <span className="font-black text-sm tracking-tight">Quadra <span className="text-orange-500">Pizza</span></span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Delivery</span>
            </div>
          </div>

          <div className="flex-1" />

          {/* Live clock */}
          <span className="hidden sm:block font-mono text-sm font-bold text-zinc-300 tabular-nums shrink-0">{clock}</span>

          {/* Active User Indicator */}
          {activeUser && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full shrink-0">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-black">
                {activeUser.name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-zinc-300">{activeUser.name}</span>
            </div>
          )}

          <button
            onClick={() => { logout(); router.push("/delivery/login"); }}
            className="p-2 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-zinc-900 transition"
            title="Cerrar sesión"
          >
            <LogOut size={16} />
          </button>
        </header>
      )}

      <main className={pathname === "/delivery/login" ? "" : "flex-1 flex flex-col overflow-hidden"}>
        {children}
      </main>
    </div>
  );
}
