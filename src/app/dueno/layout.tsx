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
  { href: "/dueno/dashboard", label: "Dashboard",   icon: LayoutDashboard },
  { href: "/dueno/ventas",    label: "Ventas",      icon: History         },
  { href: "/dueno/finanzas",  label: "Finanzas",    icon: TrendingUp      },
  { href: "/dueno/inventario",label: "Inventario",  icon: Box             },
  { href: "/dueno/usuarios",  label: "Usuarios",    icon: Users           },
  { href: "/dueno/catalogo",  label: "Catálogo",    icon: BookOpen        },
];

export default function DuenoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (pathname === "/dueno/login") {
      setIsAuthorized(true);
      return;
    }
    const auth = localStorage.getItem("quadra_dueno_auth");
    if (!auth) {
      router.push("/dueno/login");
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("quadra_dueno_auth");
    router.push("/dueno/login");
  };

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-zinc-700 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (pathname === "/dueno/login") {
    return (
      <div className="fixed-layout bg-zinc-950 text-zinc-50">
        <main className="flex-1 w-full overflow-hidden flex flex-col">{children}</main>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-zinc-950 text-zinc-50 flex flex-col lg:flex-row overflow-hidden">
      
      {/* ─── SIDEBAR ─────────────────────────────────────────────────── */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-zinc-950 border-r border-zinc-900 z-50 transition-transform duration-300 transform ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex flex-col h-full p-6">
          
          {/* Logo */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <Image src="/logo.jpg" alt="Logo" width={34} height={34} className="rounded-xl object-cover" />
              <div className="flex flex-col leading-none">
                <span className="font-black text-lg tracking-tight">Quadra <span className="text-orange-500">Pizza</span></span>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Dirección</span>
              </div>
            </div>
            <button onClick={() => setMobileOpen(false)} className="lg:hidden p-2 text-zinc-500">
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-1.5">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    active
                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                      : "text-zinc-500 hover:text-white hover:bg-zinc-900 border border-transparent"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Profile & Logout */}
          <div className="mt-auto pt-6 border-t border-zinc-900">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-black">
                    D
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white leading-none">Dueño</span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Administrador</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-orange-500 transition">
                  <LogOut size={18} />
                </button>
             </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header */}
        <header className="lg:hidden h-14 bg-zinc-950 border-b border-zinc-900 flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="Logo" width={28} height={28} className="rounded-lg object-cover" />
            <span className="font-black text-sm tracking-tight">Quadra <span className="text-orange-500">Pizza</span></span>
          </div>
          <button onClick={() => setMobileOpen(true)} className="p-2 bg-zinc-900 rounded-lg text-zinc-400">
            <Menu size={20} />
          </button>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto bg-[#09090b] relative no-scrollbar">
           {children}
        </main>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </div>
  );
}
