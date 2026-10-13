"use server"
// Server Action de Next.js. Esto es código Backend real protegido.
import { logger } from "@/lib/logger";
import { z } from "zod";

const orderSchema = z.object({
  customer: z.object({
    name: z.string().min(2, "Nombre requerido"),
    phone: z.string().min(6, "Teléfono requerido"),
  }),
  delivery_type: z.enum(["delivery", "takeaway"]),
  delivery_address: z.string().optional(),
  delivery_cost: z.number().default(0),
  payment_method: z.string().min(1),
  subtotal: z.number().min(0),
  total: z.number().min(0),
  cash_amount: z.number().optional().nullable(),
  items: z.array(z.object({
    name: z.string(),
    price: z.number(),
    quantity: z.number().min(1),
    modifiers: z.record(z.string(), z.any()).optional(),
  })).min(1, "Debe haber al menos 1 item"),
});

export async function submitOrderToWebhook(orderDataRaw: any) {
  // Validate payload with Zod
  const parsed = orderSchema.safeParse(orderDataRaw);
  if (!parsed.success) {
    logger.warn("Payload de orden inválido", { errors: parsed.error.format() });
    return { success: false, error: "Datos de orden inválidos", details: parsed.error.issues };
  }
  const orderData = parsed.data;
  // Te sugiero poner esto en el .env.local: N8N_WEBHOOK_URL="https://n8n.tu-servidor.com/webhook/quadrapizza-order"
  const webhookUrl = process.env.N8N_WEBHOOK_URL || "https://webhook.site/test-mock-url"; 
  
  if (!webhookUrl) {
    throw new Error("N8N_WEBHOOK_URL no está configurada");
  }

  // 1. Armamos un String formateado (Markdown) que es lo que Typebot o WhatsApp usarán para el resumen en texto.
  const formattedItemsString = orderData.items.map((item: any) => {
    let modifiersText = "";
    if (item.modifiers && Object.keys(item.modifiers).length > 0) {
      const mods = Object.entries(item.modifiers).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join(" | ");
      modifiersText = `\n  ↳ _${mods}_`;
    }
    return `🔸 ${item.quantity}x *${item.name}* -> $${item.price * item.quantity}${modifiersText}`;
  }).join("\n");

  const ticketMarkdown = `
🛒 *NUEVO PEDIDO WEB* 🛒
-------------------------
👤 *Cliente:* ${orderData.customer.name}
📱 *Tel/WA:* ${orderData.customer.phone}

🚚 *Modo:* ${orderData.delivery_type === 'delivery' ? 'Envío a Domicilio' : 'Retiro por Local'}
📍 *Dirección:* ${orderData.delivery_address || 'No Aplica'}

*Resumen Items:*
${formattedItemsString}
-------------------------
💳 *Abona con:* ${orderData.payment_method === 'cash' ? 'Efectivo' : 'Transferencia / MP'}
💰 *Total Final:* *$${orderData.total}*
-------------------------
`;

  // 2. El Payload JSON completo para n8n
  const payload = {
    metadata: {
      source: "quadra_app_web",
      timestamp: new Date().toISOString(),
      order_id: crypto.randomUUID(), // ID transaccional único
    },
    customer: orderData.customer,
    delivery: {
      type: orderData.delivery_type,
      address: orderData.delivery_address,
      cost: orderData.delivery_cost
    },
    payment: {
      method: orderData.payment_method,
      subtotal: orderData.subtotal,
      total: orderData.total,
      cash_amount_provided: orderData.payment_method === 'cash' ? orderData.cash_amount : null
    },
    raw_items: orderData.items, // Datos crudos por si n8n necesita iterar e insertar a Google Sheets o tabla
    bot_ready_text: ticketMarkdown // Texto pre-masticado para inyectar directo a WhatsApp/Typebot
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      logger.error("Fallo respuesta de n8n", { statusText: res.statusText });
      return { success: false, error: "Error en Webhook N8N" };
    }

    return { success: true, orderId: payload.metadata.order_id };
  } catch (err: any) {
    logger.error("Fallo de red a n8n:", { error: err.message });
    return { success: false, error: err.message };
  }
}
