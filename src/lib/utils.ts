import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeSearch(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Genera una URL de WhatsApp segura y compatible con todos los navegadores y dispositivos.
 * Evita el bug del acortador wa.me que corrompe emojis multi-byte (como 🍕, 📋) en rombos con signo de pregunta ().
 */
export function buildWhatsAppUrl(phone: string, text: string): string {
  const cleanNumber = phone.replace(/\D/g, "");
  const formattedNumber = cleanNumber.startsWith("54") ? cleanNumber : `549${cleanNumber}`;
  const encodedText = encodeURIComponent(text);

  if (typeof window !== "undefined" && typeof navigator !== "undefined") {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // En escritorio, web.whatsapp.com abre directamente el chat con los emojis preservados por JavaScript
    if (!isMobile) {
      return `https://web.whatsapp.com/send?phone=${formattedNumber}&text=${encodedText}`;
    }
  }

  // En móviles, api.whatsapp.com activa el intent/deep-link nativo de la app de WhatsApp
  return `https://api.whatsapp.com/send?phone=${formattedNumber}&text=${encodedText}`;
}
