"use client"
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/lib/store/cartStore";
import { useUIStore } from "@/lib/store/uiStore";

export default function Header() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const toggleCart = useUIStore((state) => state.toggleCartDrawer);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white mr-2">
            <Image src="/logo.jpg" alt="Quadra Pizza Logo" width={32} height={32} className="rounded-lg object-cover shadow-sm" />
            <span>QUADRA <span className="text-orange-500">PIZZA</span></span>
          </Link>
          <Badge variant="openStatus" className="hidden sm:inline-flex">Abierto</Badge>
        </div>

        <nav className="flex items-center gap-4">

          <button 
            onClick={toggleCart}
            className="relative p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 transition active:scale-95"
            aria-label="Ver carrito"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-100"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 shadow-md text-[11px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
