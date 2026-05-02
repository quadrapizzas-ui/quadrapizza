"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Box,
  BookOpen,
  LogOut,
  Menu,
  X,
  History,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/gerencia/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { href: "/gerencia/ventas",     label: "Ventas",     icon: History         },
  { href: "/gerencia/finanzas",   label: "Finanzas",   icon: TrendingUp      },
  { href: "/gerencia/inventario", label: "Inventario", icon: Box             },
  { href: "/gerencia/usuarios",   label: "Usuarios",   icon: Users           },
  { href: "/gerencia/catalogo",   label: "Catálogo",   icon: BookOpen        },
];

export default function GerenciaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Auth guard
  useEffect(() => {
    if (pathname === "/gerencia/login") { setIsAuthorized(true); return; }
    const auth = localStorage.getItem("quadra_gerencia_auth");
    if (!auth) { router.push("/gerencia/login"); }
    else { setIsAuthorized(true); }
  }, [pathname, router]);

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("quadra_gerencia_auth");
    router.push("/gerencia/login");
  };

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-zinc-700 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (pathname === "/gerencia/login") {
    return (
      <div className="fixed inset-0 bg-zinc-950 text-zinc-50 flex flex-col overflow-hidden">
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
          <div className="flex flex-col leading-none">
            <span className="font-black text-sm tracking-tight">Quadra <span className="text-orange-500">Pizza</span></span>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Gerencia</span>
          </div>
        </div>

        <div className="hidden md:block w-px h-6 bg-zinc-800 shrink-0" />

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
                    ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent"
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer mobile */}
        <div className="flex-1 md:hidden" />

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
                    ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
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
      <main className="flex-1 overflow-hidden flex flex-col bg-[#09090b]">
        {children}
      </main>
    </div>
  );
}
