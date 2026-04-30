"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBasket, ClipboardList, Users, Package, BookOpen, LogOut, Menu, X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/recepcion/nueva-venta",   label: "Nueva Venta",      icon: ShoppingBasket },
  { href: "/recepcion/estado-pedidos",label: "Estado Pedidos",   icon: ClipboardList  },
  { href: "/recepcion/clientes",      label: "Clientes",         icon: Users          },
  { href: "/recepcion/stock-rapido",  label: "Stock Rápido",     icon: Package        },
  { href: "/recepcion/catalogo",      label: "Catálogo",         icon: BookOpen       },
];

export default function RecepcionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clock, setClock] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Auth guard — excepto en /recepcion/login
  useEffect(() => {
    if (pathname === "/recepcion/login") {
      setIsAuthorized(true);
      return;
    }
    const auth = localStorage.getItem("quadra_recepcion_auth");
    if (!auth) {
      router.push("/recepcion/login");
    } else {
      setIsAuthorized(true);
    }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("quadra_recepcion_auth");
    router.push("/recepcion/login");
  };

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-zinc-700 border-t-sky-400 rounded-full animate-spin" />
      </div>
    );
  }

  // En /login no mostramos el nav
  const isLoginPage = pathname === "/recepcion/login";

  if (isLoginPage) {
    return (
      <div className="fixed-layout bg-zinc-950 text-zinc-50">
        <main className="flex-1 w-full overflow-hidden flex flex-col">{children}</main>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-zinc-950 text-zinc-50 flex flex-col overflow-hidden">

      {/* ─── TOP NAV BAR ─────────────────────────────────────────────── */}
      <header className="shrink-0 h-14 bg-zinc-950 border-b border-zinc-800/70 flex items-center px-4 gap-4 z-40">

        {/* Logo + módulo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Image src="/logo.jpg" alt="Logo" width={30} height={30} className="rounded-lg object-cover" />
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-black text-sm tracking-tight">Quadra <span className="text-orange-500">Pizza</span></span>
            <span className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">Recepción</span>
          </div>
        </div>

        <div className="w-px h-6 bg-zinc-800 shrink-0" />

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  active
                    ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent"
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1 md:hidden" />

        {/* Reloj */}
        <span className="hidden sm:block font-mono text-sm font-bold text-zinc-300 shrink-0 tabular-nums">
          {clock}
        </span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="shrink-0 p-2 rounded-lg text-zinc-500 hover:text-orange-400 hover:bg-zinc-800 transition"
        >
          <LogOut size={16} />
        </button>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="md:hidden p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* ─── MOBILE NAV DRAWER ───────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 z-50 bg-zinc-950 border-b border-zinc-800 p-3 flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  active
                    ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </div>
      )}

      {/* ─── PAGE CONTENT ─────────────────────────────────────────────── */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
}
