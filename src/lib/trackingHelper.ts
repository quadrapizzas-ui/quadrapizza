import { MockOrder } from "@/types/models";

/**
 * Codifica un resumen mínimo del pedido en Base64 seguro para URLs con soporte UTF-8 completo
 */
export function encodeOrderSnapshot(order: {
  id?: string;
  clientFirstName?: string;
  clientLastName?: string;
  phone?: string;
  address?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  status?: string;
  total?: number;
  deliveryFee?: number;
  items?: Array<{ name: string; quantity: number; price: number }>;
  createdAt?: string;
}): string {
  try {
    const minPayload = {
      id: order.id,
      c: order.clientFirstName,
      l: order.clientLastName,
      p: order.phone,
      a: order.address,
      m: order.paymentMethod,
      ps: order.paymentStatus,
      s: order.status,
      t: order.total,
      d: order.deliveryFee,
      i: (order.items || []).map((it) => ({
        n: it.name,
        q: it.quantity,
        p: it.price,
      })),
      ts: order.createdAt,
    };
    const json = JSON.stringify(minPayload);
    let base64 = "";
    if (typeof TextEncoder !== "undefined" && typeof window !== "undefined" && typeof window.btoa === "function") {
      const bytes = new TextEncoder().encode(json);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      base64 = window.btoa(binary);
    } else if (typeof Buffer !== "undefined") {
      base64 = Buffer.from(json).toString("base64");
    }
    return encodeURIComponent(base64);
  } catch {
    return "";
  }
}

/**
 * Decodifica el snapshot del pedido enviado en la URL de forma segura
 */
export function decodeOrderSnapshot(encoded: string): MockOrder | null {
  try {
    if (!encoded) return null;
    let clean = encoded.trim();
    // Decodificar URI si viene con %
    if (clean.includes("%")) {
      try { clean = decodeURIComponent(clean); } catch {}
    }
    // Reemplazar espacios por + en caso de conversión por query parser
    clean = clean.replace(/ /g, "+");

    let binaryStr = "";
    if (typeof window !== "undefined" && typeof window.atob === "function") {
      binaryStr = window.atob(clean);
    } else if (typeof Buffer !== "undefined") {
      binaryStr = Buffer.from(clean, "base64").toString("binary");
    }

    if (!binaryStr) return null;

    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const json = typeof TextDecoder !== "undefined"
      ? new TextDecoder().decode(bytes)
      : decodeURIComponent(escape(binaryStr));

    const p = JSON.parse(json);
    if (!p || !p.id) return null;

    return {
      id: p.id,
      clientFirstName: p.c || "Cliente",
      clientLastName: p.l || "",
      phone: p.p || "",
      address: p.a || "Retiro en local",
      paymentMethod: p.m || "Efectivo",
      paymentStatus: p.ps || "pendiente",
      status: p.s || "confirmado",
      total: typeof p.t === "number" ? p.t : 0,
      deliveryFee: typeof p.d === "number" ? p.d : 0,
      items: Array.isArray(p.i)
        ? p.i.map((it: any) => ({
            name: it.n || "Ítem",
            quantity: it.q || 1,
            price: it.p || 0,
          }))
        : [],
      createdAt: p.ts || new Date().toISOString(),
      mockAge: "Reciente",
    };
  } catch (err) {
    console.error("decodeOrderSnapshot error:", err);
    return null;
  }
}

/**
 * Obtiene la URL completa y segura para el seguimiento del cliente
 * Usamos /estado-pedido?id=... para garantizar compatibilidad estática perfecta
 * tanto en local como en Cloudflare Pages sin depender de rewrites dinámicos
 */
export function getTrackingUrl(order: {
  id: string;
  clientFirstName?: string;
  clientLastName?: string;
  phone?: string;
  address?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  status?: string;
  total?: number;
  deliveryFee?: number;
  items?: Array<{ name: string; quantity: number; price: number }>;
  createdAt?: string;
}): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const data = encodeOrderSnapshot(order);
  const dataQuery = data ? `&data=${data}` : "";
  return `${origin}/estado-pedido?id=${encodeURIComponent(order.id)}${dataQuery}`;
}

/**
 * Extrae el ID real de la orden desde search params, hash o pathname
 * resolviendo la limitación de exportación estática en Cloudflare Pages
 */
export function extractOrderIdFromUrl(paramsId?: string | string[]): string {
  if (typeof window === "undefined") {
    const raw = Array.isArray(paramsId) ? paramsId[0] : paramsId;
    return raw && raw !== "demo" ? raw : "";
  }

  // 1. URL search params: ?id=... o ?pedido=...
  const sp = new URLSearchParams(window.location.search);
  const qId = sp.get("id") || sp.get("pedido") || sp.get("orderId");
  if (qId && qId.trim() && qId.trim().toLowerCase() !== "demo") {
    return decodeURIComponent(qId.trim()).replace(/^#/, "");
  }

  // 2. Hash: #...
  const hash = window.location.hash.replace(/^#/, "").trim();
  if (hash) {
    const hashClean = hash.split("/").filter(Boolean).pop();
    if (hashClean && hashClean.toLowerCase() !== "demo") {
      return decodeURIComponent(hashClean).trim();
    }
  }

  // 3. Pathname: /estado-pedido/261013-012 o /ticket/261013-012
  const parts = window.location.pathname.split("/").filter(Boolean);
  const lastPart = parts[parts.length - 1];
  if (
    lastPart &&
    lastPart !== "estado-pedido" &&
    lastPart !== "ticket" &&
    lastPart.toLowerCase() !== "demo" &&
    lastPart.toLowerCase() !== "demo.html"
  ) {
    const cleaned = decodeURIComponent(lastPart).replace(/\.html$/, "").trim();
    if (cleaned && cleaned.toLowerCase() !== "demo") {
      return cleaned;
    }
  }

  // 4. paramsId fallback
  const raw = Array.isArray(paramsId) ? paramsId[0] : paramsId;
  if (raw && raw.toLowerCase() !== "demo") {
    return raw.trim();
  }

  return "";
}
