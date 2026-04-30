"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { MonitorCheck, Package, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/cocina/monitor-pedidos", label: "Monitor",      icon: MonitorCheck },
  { href: "/cocina/stock-critico",   label: "Stock Crítico", icon: Package      },
];

export default function CocinaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [clock, setClock]           = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (pathname === "/cocina/login") { setIsAuthorized(true); return; }
    const auth = localStorage.getItem("quadra_cocina_auth");
    if (!auth) { router.push("/cocina/login"); return; }
    setIsAuthorized(true);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, [pathname, router]);

  if (!isAuthorized) return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <span className="w-6 h-6 border-2 border-zinc-800 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );

  if (pathname === "/cocina/login") return (
    <div className="fixed-layout bg-black text-zinc-50">
      <main className="flex-1 w-full overflow-hidden flex flex-col">{children}</main>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black text-zinc-50 flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="shrink-0 h-12 bg-black border-b border-zinc-900 flex items-center px-4 gap-4 z-40">
        <div className="flex items-center gap-2.5 shrink-0">
          <Image src="/logo.jpg" alt="Logo" width={28} height={28} className="rounded-lg object-cover" />
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-black text-xs tracking-tight">Quadra <span className="text-orange-500">Pizza</span></span>
            <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest">Cocina</span>
          </div>
        </div>
        <div className="w-px h-5 bg-zinc-800 shrink-0" />
        <nav className="flex items-center gap-1 flex-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${active ? "bg-orange-500/15 text-orange-400 border border-orange-500/30" : "text-zinc-500 hover:text-white hover:bg-zinc-900 border border-transparent"}`}>
                <Icon size={13} />{label}
              </Link>
            );
          })}
        </nav>
        {/* Live clock — prominent in kitchen */}
        <span className="font-mono text-sm font-black text-zinc-200 tabular-nums tracking-widest shrink-0">{clock}</span>
        <button onClick={() => { localStorage.removeItem("quadra_cocina_auth"); router.push("/cocina/login"); }}
          title="Cerrar sesión"
          className="shrink-0 p-2 rounded-lg text-zinc-600 hover:text-orange-400 hover:bg-zinc-900 transition">
          <LogOut size={15} />
        </button>
      </header>
      <main className="flex-1 overflow-hidden flex flex-col">{children}</main>
    </div>
  );
}
