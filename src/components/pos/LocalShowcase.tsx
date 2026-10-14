"use client";

import Image from "next/image";
import { MapPin, Clock, Flame, Bike, Phone, Star, ExternalLink } from "lucide-react";
import { useProductsStore } from "@/lib/store/productsStore";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { buildWhatsAppUrl } from "@/lib/utils";

export function LocalShowcase() {
  const whatsappNumber = useProductsStore((state) => state.whatsappNumber);
  const cleanPhone = (whatsappNumber || "+54 9 3513 05-9413").replace(/[^0-9]/g, "");
  const waUrl = buildWhatsAppUrl(cleanPhone, "¡Hola Quadra Pizza! Quiero hacer una consulta para retirar");

  return (
    <section className="my-14 sm:my-20 relative">
      {/* Glow ambiental */}
      <div 
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-orange-600/20 blur-[100px] pointer-events-none rounded-full" 
        aria-hidden="true" 
      />

      <div className="relative overflow-hidden rounded-3xl bg-zinc-950/90 border border-orange-500/30 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
          
          {/* Columna Izquierda: Foto Real Calibrada de la Fachada con Cartel Completo */}
          <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[420px] lg:min-h-[480px] overflow-hidden group">
            <Image
              src="/local.webp"
              alt="Fachada del local de Quadra Pizza en Yocsina, Córdoba"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-top origin-top group-hover:scale-105 transition-transform duration-700 ease-out"
              priority={false}
            />
            {/* Gradiente de fusión oscuro en los bordes para integración perfecta */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-zinc-950/40 lg:to-zinc-950 pointer-events-none" />
            
            {/* Badges de Verificación y Calificación ubicados en la parte inferior para no tapar el cartel */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-950/85 backdrop-blur-md border border-orange-500/40 shadow-lg text-[11px] font-black text-orange-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Local Auténtico · Yocsina
              </div>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950/90 backdrop-blur-md border border-zinc-800 text-xs text-zinc-200 shadow-md">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>
                <span className="font-bold">4.9</span>
                <span className="text-zinc-400 font-medium">· +500 vecinos</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Información y Horarios */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-orange-400 mb-3">
              <Flame size={15} className="text-orange-500 fill-orange-500 animate-pulse" />
              Mostrador y Horno en Yocsina
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-display mb-3 leading-tight">
              Retirá por Nuestro Mostrador o <span className="text-orange-500">Pedí a Domicilio</span>
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6 font-medium">
              Masa artesanal de fermentación lenta, mozzarella de primera y cocción crujiente a punto. Pedí online y retirá calentito por el mostrador, o te lo llevamos con envío directo a tu casa.
            </p>

            {/* Puntos Clave */}
            <div className="space-y-3.5 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0 text-orange-400">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs font-black uppercase text-zinc-400 tracking-wider">Punto de Retiro & Ubicación</div>
                  <a 
                    href="https://maps.google.com/?q=Pje.+Blas+Parera+148,+X5101+Yocsina,+C%C3%B3rdoba" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-white hover:text-orange-400 transition inline-flex items-center gap-1 group/map"
                  >
                    <span>Pje. Blas Parera 148, X5101 Yocsina, Córdoba</span>
                    <ExternalLink size={12} className="text-zinc-500 group-hover/map:text-orange-400 transition" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0 text-orange-400">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-xs font-black uppercase text-zinc-400 tracking-wider">Horarios de Atención</div>
                  <div className="text-sm font-bold text-white">Miércoles a Domingos · 20:00 a 00:00 hs</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0 text-orange-400">
                  <Bike size={18} />
                </div>
                <div>
                  <div className="text-xs font-black uppercase text-zinc-400 tracking-wider">Modalidades de Pedido</div>
                  <div className="text-sm font-bold text-white">Envíos a domicilio en Yocsina y zonas cercanas · Retiro por el local</div>
                </div>
              </div>
            </div>

            {/* Botones de acción: WhatsApp e Instagram */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-600/30 active:scale-98 transition duration-200"
              >
                <Phone size={16} />
                Pedir por WhatsApp
              </a>
              <a
                href="https://www.instagram.com/quadra.pizza/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold text-sm border border-white/10 hover:border-pink-500/40 shadow-md active:scale-98 transition duration-200 group"
              >
                <InstagramIcon size={17} className="text-pink-400 group-hover:scale-110 transition-transform" />
                <span>@quadra.pizza</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
