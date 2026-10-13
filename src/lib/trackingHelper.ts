import { MockOrder } from "@/types/models";

/**
 * Codifica un resumen mínimo del pedido en Base64 seguro para URLs
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
    if (typeof window !== "undefined" && typeof window.btoa === "function") {
      return encodeURIComponent(window.btoa(unescape(encodeURIComponent(json))));
    }
    return "";
  } catch {
    return "";
  }
}

/**
 * Decodifica el snapshot del pedido enviado en la URL
 */
export function decodeOrderSnapshot(encoded: string): MockOrder | null {
  try {
    if (!encoded) return null;
    const json = decodeURIComponent(escape(window.atob(decodeURIComponent(encoded))));
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
  } catch {
    return null;
  }
}

/**
 * Obtiene la URL completa y segura para el seguimiento del cliente
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
  return `${origin}/estado-pedido/${order.id}?id=${order.id}${dataQuery}`;
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
