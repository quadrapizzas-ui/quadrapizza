"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Search,
  ShoppingBag,
  ChefHat,
  Bike,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  MapPin,
  Phone,
  Navigation,
  ShieldCheck,
  DollarSign,
  Wallet,
  Users,
  Package,
  FileText,
  ArrowRight,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Layers,
  Copy,
  Check,
  Info,
  HelpCircle,
  Tag,
  Store,
  CreditCard,
  Banknote,
  Smartphone,
  Printer,
  X,
  Sliders,
  Receipt,
  RotateCcw
} from "lucide-react";

// ── Tipos y Datos ─────────────────────────────────────────────────────────────

type ModuleKey =
  | "todos"
  | "catalogo"
  | "recepcion"
  | "cocina"
  | "delivery"
  | "gerencia"
  | "tracking"
  | "flujo";

interface SubSection {
  title: string;
  badge?: string;
  description: string;
  buttonsAndControls?: {
    name: string;
    description: string;
    type?: "action" | "info" | "alert" | "nav";
  }[];
  steps?: string[];
  tips?: string[];
}

interface DocModule {
  id: ModuleKey;
  title: string;
  roleBadge: string;
  roleColor: {
    bg: string;
    text: string;
    border: string;
    glow: string;
    accent: string;
  };
  icon: React.ElementType;
  route: string;
  displayRoute?: string;
  summary: string;
  sections: SubSection[];
}

const MODULES_DATA: DocModule[] = [
  {
    id: "catalogo",
    title: "1. Catálogo Online y Tienda Web",
    roleBadge: "Clientes & Público",
    roleColor: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/30",
      glow: "shadow-amber-500/10",
      accent: "#f59e0b",
    },
    icon: ShoppingBag,
    route: "/",
    summary:
      "Tienda online para que el cliente arme su pedido con sabores personalizados, extras, promociones y lo envíe directamente al WhatsApp del local.",
    sections: [
      {
        title: "Cabecera y Buscador Predictivo",
        badge: "Navegación",
        description:
          "Permite localizar productos rápidamente y acceder al carrito en cualquier momento.",
        buttonsAndControls: [
          {
            name: "Buscador de Productos",
            description: "Filtra al instante por nombre o ingrediente al escribir al menos 3 caracteres.",
            type: "action",
          },
          {
            name: "Botón del Carrito",
            description: "Muestra la cantidad de productos seleccionados y abre el panel lateral de compra.",
            type: "action",
          },
          {
            name: "Pestañas de Categorías",
            description: "Permite explorar rápidamente Pizzas, Empanadas, Bebidas, Menú del Día y Postres.",
            type: "nav",
          },
        ],
        tips: [
          "Si un producto no tiene stock en el sistema, desaparece automáticamente del catálogo público para evitar cancelaciones.",
        ],
      },
      {
        title: "Modal de Configuración del Producto",
        badge: "Personalización",
        description:
          "Ventana interactiva que se abre al tocar un producto para seleccionar tamaños, sabores y extras.",
        buttonsAndControls: [
          {
            name: "Selector de Formato (Unidad / 1/2 Docena / Docena)",
            description: "Especial para empanadas o combos. Recalcula el precio dinámicamente con descuento por volumen.",
            type: "action",
          },
          {
            name: "Configurador de Quadra Pizza (Sabores por Fila)",
            description: "Permite elegir sabores fijos y personalizar las filas variables con las variedades disponibles.",
            type: "action",
          },
          {
            name: "Listado de Extras (+Checkboxes)",
            description: "Agregados como queso extra, fainá, huevo o salsas con indicación clara del costo adicional.",
            type: "action",
          },
          {
            name: "Controles de Cantidad (+ / -)",
            description: "Define el número de unidades a ingresar al pedido.",
            type: "action",
          },
          {
            name: "Botón 'Agregar al Pedido'",
            description: "Valida que todas las filas y variedades estén seleccionadas y suma el ítem al carrito.",
            type: "action",
          },
        ],
      },
      {
        title: "Carrito de Compras y Checkout por WhatsApp",
        badge: "Checkout",
        description:
          "Proceso guiado de 2 pasos donde el cliente revisa su pedido, ingresa sus datos y lo despacha a WhatsApp.",
        buttonsAndControls: [
          {
            name: "Paso 1: Tu Pedido",
            description: "Detalle de ítems cargados, modificación de cantidades (+/-) y botón papelera para eliminar.",
            type: "action",
          },
          {
            name: "Método de Entrega (Retiro vs Envío)",
            description: "Retiro en local (costo $0) o Envío a domicilio (calcula el delivery según el barrio seleccionado).",
            type: "action",
          },
          {
            name: "Selector de Método de Pago",
            description: "Efectivo, Transferencia o Tarjeta de crédito (aplica automáticamente un 15% de recargo visible).",
            type: "action",
          },
          {
            name: "Botón 'Confirmar y Enviar por WhatsApp'",
            description: "Genera el mensaje en texto enriquecido y abre la app de WhatsApp conectada con la pizzería.",
            type: "action",
          },
        ],
        tips: [
          "El mensaje incluye dirección, detalles, barrio, desglose por producto y el importe total a cobrar.",
        ],
      },
    ],
  },
  {
    id: "recepcion",
    title: "2. Recepción y Punto de Venta (POS)",
    roleBadge: "Cajeros & Mostrador",
    roleColor: {
      bg: "bg-sky-500/10",
      text: "text-sky-400",
      border: "border-sky-500/30",
      glow: "shadow-sky-500/10",
      accent: "#38bdf8",
    },
    icon: Store,
    route: "/recepcion",
    summary:
      "Centro operativo para emitir ventas de salón/teléfono, controlar el tablero Kanban, cobrar, consultar stock y cerrar la caja.",
    sections: [
      {
        title: "Nueva Venta (Carga de Comandas)",
        badge: "/recepcion/nueva-venta",
        description:
          "Interfaz táctil de alta velocidad para registrar pedidos en menos de 30 segundos.",
        buttonsAndControls: [
          {
            name: "Búsqueda y Filtros Nivel 1 y 2",
            description: "Acceso instantáneo a categorías padre y subcategorías para hallar productos.",
            type: "nav",
          },
          {
            name: "Botón de Nota para Cocina (Ícono Mensaje)",
            description: "Permite añadir especificaciones puntuales por producto (ej: 'bien cocida', 'sin aceitunas').",
            type: "action",
          },
          {
            name: "Autocompletado de Clientes Frecuentes",
            description: "Al tipear nombre o teléfono, sugiere clientes y rellena automáticamente dirección y barrio.",
            type: "info",
          },
          {
            name: "Calculadora de Vuelto en Efectivo",
            description: "Calcula en color verde brillante el vuelto exacto a entregar según el dinero recibido.",
            type: "info",
          },
          {
            name: "Botón 'Enviar a Cocina'",
            description: "Guarda la comanda con ID único, impacta en tiempo real en la pantalla de cocina y genera el tracking.",
            type: "action",
          },
          {
            name: "Botones 'Copiar Enlace' y 'Enviar por WhatsApp'",
            description: "Aparecen tras confirmar el pedido para enviar al cliente su enlace de seguimiento en vivo con 1 clic.",
            type: "action",
          },
        ],
        tips: [
          "Si el cliente paga con Tarjeta de Crédito, el recargo del 15% se calcula de manera transparente.",
          "Cada venta queda vinculada al cajero logueado para que el cierre de turno sea 100% exacto.",
        ],
      },
      {
        title: "Estado de Pedidos (Kanban de Recepción)",
        badge: "/recepcion/estado-pedidos",
        description:
          "Tablero con 5 columnas que permite supervisar el avance de todas las órdenes del turno.",
        buttonsAndControls: [
          {
            name: "Columnas del Tablero",
            description: "Confirmados ➔ En Cocina ➔ Listos ➔ En Camino ➔ Completados.",
            type: "info",
          },
          {
            name: "Identidad Visual 100% Roja (Impagos)",
            description: "Bordes brillantes, fondo y badge '⚠️ IMPAGO' en rojo para pedidos sin cobrar. Se pueden entregar y completar fiados.",
            type: "alert",
          },
          {
            name: "Alertas de Tiempo Transcurrido",
            description: "Alerta amarilla a los 15 min y llama parpadeante roja al superar los 30 min de espera.",
            type: "alert",
          },
          {
            name: "Botón 'Marcar como Pagado'",
            description: "Actualiza pedidos con cobranza pendiente una vez recibido el comprobante o efectivo.",
            type: "action",
          },
          {
            name: "Botón 'Cancelar Pedido'",
            description: "Excluye el pedido del flujo de producción y de los totales de caja.",
            type: "alert",
          },
          {
            name: "Badge '🥤 Solo Bebidas' (Bypass de Cocina)",
            description: "Las órdenes que únicamente contienen bebidas o productos sin cocción omiten la pantalla de Cocina y avanzan directamente a 'Listos' o despacho inmediato.",
            type: "info",
          },
        ],
        tips: [
          "Los pedidos que solo contienen bebidas no pasan por la cocina: se preparan directamente en mostrador y quedan disponibles al instante para entrega o delivery.",
        ],
      },
      {
        title: "Clientes Deudores & Cuentas Corrientes",
        badge: "/recepcion/deudores",
        description:
          "Módulo central para auditar y gestionar cobranzas de pedidos entregados fiados o con pago pendiente.",
        buttonsAndControls: [
          {
            name: "KPIs de Deuda Activa",
            description: "Suma de cuentas por cobrar, cantidad de deudores únicos y pedidos impagos.",
            type: "info",
          },
          {
            name: "Botón 'Editar' (✏️ en Deudor)",
            description: "Permite rectificar en el acto el nombre original registrado, teléfono y dirección del deudor, sincronizando todas sus comandas sin salir del panel.",
            type: "action",
          },
          {
            name: "Búsqueda Flexible sin Tildes",
            description: "Permite buscar clientes y deudores por nombre o teléfono sin necesidad de escribir tildes o acentos.",
            type: "info",
          },
          {
            name: "Botón 'Reclamar por WhatsApp'",
            description: "Abre chat con saludo respetuoso, monto total adeudado, pedidos asociados y alias de pago.",
            type: "action",
          },
          {
            name: "Botones 'Cobrar Todo' y 'Saldar Pedido'",
            description: "Permiten cancelar la deuda completa del cliente o saldar una orden individual.",
            type: "action",
          },
        ],
        tips: [
          "El sistema asocia unívocamente el teléfono del cliente a su perfil canónico, acumulando todas sus deudas en un solo lugar.",
          "Cualquier modificación voluntaria del nombre realizada en la tarjeta de deudor actualiza automáticamente el perfil del cliente y todas sus órdenes.",
        ],
      },
      {
        title: "Control de Clientes, Insumos y Menú",
        badge: "Gestión",
        description:
          "Herramientas auxiliares de recepción para administrar el negocio en el día a día.",
        buttonsAndControls: [
          {
            name: "Base de Clientes (/clientes)",
            description: "Alta automática en primer pedido (fija el 'nombre original registrado'). En compras futuras protege contra apodos o errores de tipeo, permitiendo además la edición voluntaria en cualquier momento con sincronización histórica.",
            type: "action",
          },
          {
            name: "Stock de Insumos (/stock)",
            description: "Ajuste rápido (+/-) de materias primas con guardado en lote y aviso de faltantes por WhatsApp a Gerencia.",
            type: "action",
          },
          {
            name: "Administración del Catálogo (/catalogo)",
            description: "Pausar o activar stock de productos al instante, editar precios, configurar si requiere cocción en Cocina KDS o despacho directo, zonas de envío y extras.",
            type: "action",
          },
        ],
      },
      {
        title: "Cierre de Caja del Turno",
        badge: "/recepcion/cierre-caja",
        description:
          "Arqueo financiero al terminar la jornada o cambio de guardia del cajero.",
        buttonsAndControls: [
          {
            name: "Balance Automático de Efectivo",
            description: "Suma de ventas en efectivo + Fondo Fijo inicial (caja chica editable, por defecto $20.000).",
            type: "info",
          },
          {
            name: "Fiado / A Cobrar del Turno",
            description: "Lista desplegable en rojo con los pedidos fiados del turno para que el cajero rinda cuentas sin desbalancear el efectivo.",
            type: "alert",
          },
          {
            name: "Desglose Digital",
            description: "Total separado de Mercado Pago, transferencias bancarias y tarjetas.",
            type: "info",
          },
          {
            name: "Botón 'Cerrar Turno' e Imprimir Ticket",
            description: "Asienta el cierre de forma inmutable en el historial y emite comprobante de auditoría.",
            type: "action",
          },
        ],
      },
    ],
  },
  {
    id: "cocina",
    title: "3. Cocina y Pantalla KDS (Kitchen Display System)",
    roleBadge: "Maestros Pizzeros",
    roleColor: {
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/30",
      glow: "shadow-orange-500/10",
      accent: "#f97316",
    },
    icon: ChefHat,
    route: "/cocina",
    summary:
      "Monitor táctil de comanda digital para armar y hornear pedidos con temporizadores de demora y sin usar papel.",
    sections: [
      {
        title: "Monitor KDS de Comandas",
        badge: "/cocina/monitor-pedidos",
        description:
          "Organiza las órdenes en 3 etapas visuales con tipografía gigante y modo oscuro de alto contraste.",
        buttonsAndControls: [
          {
            name: "Columna 1: Pendientes (Confirmados)",
            description: "Nuevas comandas ingresadas desde recepción o web.",
            type: "info",
          },
          {
            name: "Botón '▶ Empezar'",
            description: "Pasa la orden a 'En Preparación' y actualiza el tracking del cliente indicando que ya cocinan su comida.",
            type: "action",
          },
          {
            name: "Columna 2: En Preparación",
            description: "Pizzas y empanadas que actualmente se están armando o están dentro del horno.",
            type: "info",
          },
          {
            name: "Botón '✓ Listo'",
            description: "Pasa la orden a 'Listo p/ Envío' y notifica a los repartidores que pueden retirar el paquete.",
            type: "action",
          },
          {
            name: "Columna 3: Listo p/ Envío",
            description: "Pedidos empaquetados en mostrador esperando cadete o cliente presencial.",
            type: "info",
          },
          {
            name: "Botón '✓ Despachado'",
            description: "Finaliza la comanda liberando la pantalla de cocina.",
            type: "action",
          },
          {
            name: "Temporizador de Demora",
            description: "Indica minutos transcurridos. Amarillo de 10 a 20 min; llama roja parpadeante pasados los 20 min.",
            type: "alert",
          },
        ],
        tips: [
          "Filtro inteligente de cocina: Los pedidos que solo contienen bebidas/gaseosas no ingresan a este monitor para evitar saturar al pizzero.",
          "En pedidos mixtos (ej: Pizza + Cerveza), los ítems a hornear se destacan en grande para cocción y las bebidas se muestran en pastillas secundarias azules como acompañamiento frío.",
          "Las notas especiales cargadas en recepción aparecen destacadas con ícono de mensaje para que no se pase ningún detalle (ej: 'sin orégano').",
        ],
      },
      {
        title: "Visor de Stock Crítico",
        badge: "/cocina/stock-critico",
        description:
          "Pantalla de consulta rápida con el nivel de materias primas básicas en tiempo real.",
        buttonsAndControls: [
          {
            name: "Semáforo de Insumos",
            description: "Muzzarella, masa, salsa, pan, jamón, huevos con barras porcentuales de consumo.",
            type: "info",
          },
          {
            name: "Alerta de Faltante",
            description: "Resalta en rojo brillante si el stock cae por debajo del umbral de seguridad.",
            type: "alert",
          },
        ],
      },
    ],
  },
  {
    id: "delivery",
    title: "4. Delivery y Repartidores",
    roleBadge: "Cadetes & Motos",
    roleColor: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      glow: "shadow-emerald-500/10",
      accent: "#10b981",
    },
    icon: Bike,
    route: "/delivery",
    summary:
      "Aplicación móvil pensada para smartphones que asiste al cadete en ruta: autoasignación, GPS a la puerta, llamada y confirmación de cobro.",
    sections: [
      {
        title: "Gestión de Salidas y Rutas",
        badge: "/delivery/mis-viajes",
        description:
          "Organiza los viajes de la noche en 4 pestañas de navegación con botones grandes operables con una sola mano.",
        buttonsAndControls: [
          {
            name: "Pestaña 'En Cocina'",
            description: "Vista previa informativa de pedidos que aún están en el horno para anticipar próximos destinos.",
            type: "info",
          },
          {
            name: "Pestaña 'A Retirar'",
            description: "Pedidos listos en mostrador esperando cadete.",
            type: "info",
          },
          {
            name: "Botón 'Tomar Viaje'",
            description: "Asigna el pedido a la moto del cadete y lo mueve a 'En Camino' (el cliente ve que ya va en viaje).",
            type: "action",
          },
          {
            name: "Pestaña 'En Camino'",
            description: "Pedidos activos en tránsito.",
            type: "info",
          },
          {
            name: "Pestaña 'Entregados'",
            description: "Historial completo de entregas exitosas del cadete durante su turno.",
            type: "info",
          },
        ],
      },
      {
        title: "Navegación, Cobranza y Entrega Segura",
        badge: "En Destino",
        description:
          "Acciones que ejecuta el repartidor al llegar al domicilio del cliente.",
        buttonsAndControls: [
          {
            name: "Botón 'Navegar' (Brújula)",
            description: "Abre automáticamente Google Maps con la dirección exacta en Córdoba para iniciar el GPS por voz.",
            type: "action",
          },
          {
            name: "Botón 'Llamar'",
            description: "Disca directamente al teléfono del cliente para avisarle que el pedido está en la puerta.",
            type: "action",
          },
          {
            name: "Insignia de Pago (PAGADO vs A COBRAR)",
            description: "Verde si ya está cobrado; Naranja con monto gigante si debe cobrar en efectivo o posnet.",
            type: "alert",
          },
          {
            name: "Botón 'Entregado' con Ventana de Seguridad",
            description: "Despliega una confirmación preventiva que recuerda el monto a cobrar antes de entregar el paquete.",
            type: "action",
          },
        ],
        tips: [
          "Nunca entregues el paquete sin verificar el badge: si dice 'A COBRAR', el sistema te indicará el importe exacto con delivery incluido.",
        ],
      },
    ],
  },
  {
    id: "gerencia",
    title: "5. Gerencia y Administración Estratégica",
    roleBadge: "Dueños & Encargados",
    roleColor: {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/30",
      glow: "shadow-purple-500/10",
      accent: "#a855f7",
    },
    icon: TrendingUp,
    route: "/gerencia",
    summary:
      "Control integral de métricas de facturación, curvas de venta, gastos operativos, CMV, rentabilidad neta y administración de usuarios.",
    sections: [
      {
        title: "Dashboard de Rendimiento Comercial",
        badge: "/gerencia/dashboard",
        description:
          "KPIs ejecutivos en tiempo real con selector de períodos (Hoy, Semanal, Mensual, Anual).",
        buttonsAndControls: [
          {
            name: "Tarjetas de Facturación y Pedidos del Día",
            description: "Ventas de hoy, volumen de comandas, pedidos en curso y ticket promedio a 30 días.",
            type: "info",
          },
          {
            name: "Ranking Top 5 Productos",
            description: "Artículos más vendidos del mes en unidades y recaudación generada.",
            type: "info",
          },
          {
            name: "Curva de Ventas por Hora / Día / Mes",
            description: "Gráfico interactivo de barras para detectar horas pico de demanda.",
            type: "nav",
          },
          {
            name: "Gráficos de Canales y Formas de Pago",
            description: "Gráficos circulares que contrastan Delivery vs Salón y la proporción de cada método de cobro.",
            type: "nav",
          },
        ],
      },
      {
        title: "Finanzas, Rentabilidad y Gastos",
        badge: "/gerencia/finanzas",
        description:
          "Auditoría profunda de la rentabilidad del negocio dividida en 4 pestañas especializadas.",
        buttonsAndControls: [
          {
            name: "Pestaña 'Dashboard Financiero'",
            description: "Calcula Facturación, Cobrado Real, CMV (insumos), Gastos Operativos y la Ganancia Neta y Margen %.",
            type: "info",
          },
          {
            name: "Evolución Semanal del Mes",
            description: "Gráfico comparativo semana por semana entre ingresos cobrados y costos/gastos.",
            type: "nav",
          },
          {
            name: "Pestaña 'Gastos Operativos'",
            description: "Registro de egresos fijos y variables (proveedores, alquiler, sueldos, servicios, marketing).",
            type: "action",
          },
          {
            name: "Pestaña 'Cierres de Caja'",
            description: "Histórico de cada arqueo firmado por los cajeros con fecha, hora, montos y cantidad de pedidos.",
            type: "info",
          },
          {
            name: "Pestaña 'Costos y CMV'",
            description: "Tabla de rentabilidad por producto donde se puede editar el costo de elaboración y precio de venta.",
            type: "action",
          },
        ],
      },
      {
        title: "Auditoría de Ventas y Gestión de Personal",
        badge: "Seguridad",
        description:
          "Control de usuarios, asignación de roles y trazabilidad de cada orden.",
        buttonsAndControls: [
          {
            name: "Historial de Ventas (/ventas)",
            description: "Buscador y visor desplegable con auditoría completa de quién cargó cada venta, ítems y notas.",
            type: "action",
          },
          {
            name: "Control de Personal (/usuarios)",
            description: "Alta de empleados, asignación de roles (Gerencia, Recepción, Cocina, Delivery), número de DNI y asignación de PIN de 4 dígitos único para el acceso seguro en dos pasos.",
            type: "action",
          },
        ],
      },
    ],
  },
  {
    id: "tracking",
    title: "6. Seguimiento en Vivo para el Cliente",
    roleBadge: "Experiencia Cliente",
    roleColor: {
      bg: "bg-indigo-500/10",
      text: "text-indigo-400",
      border: "border-indigo-500/30",
      glow: "shadow-indigo-500/10",
      accent: "#6366f1",
    },
    icon: Clock,
    route: "/estado-pedido/101",
    displayRoute: "/estado-pedido/[id]",
    summary:
      "Enlace público que el cliente recibe por WhatsApp para seguir el estado de su pizza en tiempo real sin llamar al local.",
    sections: [
      {
        title: "Línea de Tiempo y Estados en Tiempo Real",
        badge: "Página Pública",
        description:
          "Detecta si el pedido es para Delivery o Retiro en Local y actualiza automáticamente los pasos:",
        steps: [
          "1. ¡Pedido Confirmado! ⏱️ — Recibido y anotado con éxito.",
          "2. ¡Manos a la Obra! 👨‍🍳 — Horneándose en la cocina.",
          "3. ¡En Camino! 🛵 (o ¡Listo para Retirar! 🏪) — Asignando repartidor / esperando en sucursal.",
          "4. ¡Entregado! ❤️ — Pedido entregado y agradecimiento final.",
        ],
        buttonsAndControls: [
          {
            name: "Detalle Económico Completo",
            description: "Lista de productos pedidos, cantidades, costo de envío, recargo si pagó con tarjeta y total final.",
            type: "info",
          },
          {
            name: "Tarjeta de Destino",
            description: "Muestra la dirección de entrega o el aviso de esperarlo en la sucursal de Quadra Pizza.",
            type: "info",
          },
          {
            name: "Ticket Virtual Imprimible (/ticket/[id])",
            description: "Comprobante con formato de ticket térmico blanco clásico compatible con impresoras de 58mm y 80mm.",
            type: "action",
          },
        ],
      },
    ],
  },
  {
    id: "flujo",
    title: "7. Flujo Integral E2E y Buenas Prácticas",
    roleBadge: "Guía de Procesos",
    roleColor: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/30",
      glow: "shadow-rose-500/10",
      accent: "#f43f5e",
    },
    icon: Layers,
    route: "#",
    summary:
      "La secuencia completa que conecta a todos los sectores desde que el cliente pide hasta que se cierra la caja.",
    sections: [
      {
        title: "Secuencia Paso a Paso de una Orden",
        badge: "Paso a Paso",
        description: "Cómo interactúan los módulos en una noche de servicio normal:",
        steps: [
          "Paso 1: El cliente pide por web o WhatsApp, o se acerca al mostrador. El cajero ingresa a /recepcion/nueva-venta, selecciona productos, extras, sabores y forma de pago. Presiona 'Enviar a Cocina'.",
          "Paso 2: El cliente recibe automáticamente su enlace de seguimiento en vivo (/estado-pedido/ID).",
          "Paso 3: La comanda ingresa de inmediato al monitor de cocina (/cocina/monitor-pedidos). El pizzero toca '▶ Empezar' y el cliente ve en su celular '¡Manos a la Obra!'.",
          "Paso 4: El pizzero hornea la comida y toca '✓ Listo'. La comanda pasa a la pestaña 'A Retirar'.",
          "Paso 5: El cadete abre /delivery/mis-viajes, ve el pedido listo y toca 'Tomar Viaje'. El tracking del cliente pasa a '¡En Camino!'.",
          "Paso 6: El cadete toca 'Navegar' para abrir Google Maps y 'Llamar' al llegar. Cobra el monto estipulado si está 'A COBRAR', toca 'Entregado' y confirma la entrega.",
          "Paso 7: La orden finaliza en el sistema. Al terminar la noche, el cajero realiza el 'Cierre de Caja' auditado en /recepcion/cierre-caja.",
        ],
        tips: [
          "Control de Demoras: El cronómetro de comandas alerta en amarillo a los 10-15 min y en rojo con fuego pasados los 20-30 min.",
          "Seguridad de Cobro: Los cadetes nunca deben entregar un pedido marcado en naranja 'A COBRAR' sin recibir el dinero.",
          "Pausar Productos: Si un producto se queda sin insumos un fin de semana, desactivar su stock en /recepcion/catalogo/productos.",
        ],
      },
    ],
  },
];

// ── Componente Principal ──────────────────────────────────────────────────────

export default function ManualDeUsoPage() {
  const [activeModule, setActiveModule] = useState<ModuleKey>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Filtrado reactivo por texto y pestaña
  const filteredModules = useMemo(() => {
    return MODULES_DATA.filter((mod) => {
      // Filtro por pestaña
      if (activeModule !== "todos" && mod.id !== activeModule) return false;

      // Filtro por búsqueda de texto
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();

      const matchTitle = mod.title.toLowerCase().includes(q);
      const matchSummary = mod.summary.toLowerCase().includes(q);
      const matchSections = mod.sections.some(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.buttonsAndControls?.some(
            (b) =>
              b.name.toLowerCase().includes(q) ||
              b.description.toLowerCase().includes(q)
          ) ||
          s.tips?.some((t) => t.toLowerCase().includes(q))
      );

      return matchTitle || matchSummary || matchSections;
    });
  }, [activeModule, searchQuery]);

  const copyManualUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* ── Top Bar / Header ── */}
      <header className="sticky top-0 z-50 bg-[#0c0c10]/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
          >
            <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-zinc-700/60 shadow-md">
              <Image
                src="/logo.jpg"
                alt="Logo Quadra"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-sm tracking-tight text-white group-hover:text-orange-400 transition-colors">
                Quadra <span className="text-orange-500">Pizza</span>
              </span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                ERP Manual
              </span>
            </div>
          </Link>

          <span className="hidden sm:inline-block w-px h-5 bg-zinc-800" />
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-wider">
            <Sparkles size={11} /> Documentación Interactiva
          </span>
        </div>

        {/* Acciones directas */}
        <div className="flex items-center gap-2">
          <button
            onClick={copyManualUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold rounded-xl border border-zinc-800 transition active:scale-95"
            title="Copiar enlace del manual"
          >
            {copiedLink ? (
              <Check size={14} className="text-emerald-400" />
            ) : (
              <Copy size={14} />
            )}
            <span className="hidden md:inline">
              {copiedLink ? "¡Copiado!" : "Compartir Manual"}
            </span>
          </button>

          <Link
            href="/recepcion"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black rounded-xl transition shadow-lg shadow-orange-950/40 active:scale-95"
          >
            <span>Ir al Sistema</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden border-b border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 via-zinc-950 to-[#070709] px-4 sm:px-8 py-10 sm:py-14">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-orange-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 text-xs font-bold">
            <BookOpen size={14} className="text-orange-400" />
            Guía de Operación y Manual de Usuario
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Manual de Uso Oficial{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
              Quadra Pizza ERP
            </span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Explorá cada pantalla, sección, botón y flujo de trabajo del sistema.
            Diseñado para capacitar a cajeros, cocineros, repartidores y administradores.
          </p>

          {/* Buscador Central */}
          <div className="pt-2 max-w-xl mx-auto">
            <div className="relative group">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-400 transition-colors"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar botón, sección o función (ej: 'vuelto', 'kds', 'gps', 'caja')..."
                className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-2xl pl-11 pr-10 py-3.5 text-sm font-medium text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-orange-500/80 focus:ring-4 focus:ring-orange-500/10 shadow-2xl transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white bg-zinc-800 rounded-lg"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Selector Rápido de Módulos (Tabs) ── */}
      <div className="sticky top-[57px] z-40 bg-[#070709]/95 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveModule("todos")}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
              activeModule === "todos"
                ? "bg-zinc-100 text-zinc-950 border-white shadow-sm"
                : "bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
            }`}
          >
            <Layers size={13} />
            <span>Todos</span>
          </button>

          {MODULES_DATA.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                  isActive
                    ? `${mod.roleColor.bg} ${mod.roleColor.text} ${mod.roleColor.border} shadow-md`
                    : "bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                <Icon size={14} />
                <span>{mod.title.replace(/^\d+\.\s*/, "")}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Contenido Principal ── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 space-y-12">
        {filteredModules.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-8 space-y-3">
            <HelpCircle size={40} className="mx-auto text-zinc-600" />
            <h3 className="text-lg font-black text-zinc-200">
              No se encontraron coincidencias para &quot;{searchQuery}&quot;
            </h3>
            <p className="text-zinc-500 text-xs max-w-sm mx-auto">
              Probá con otras palabras clave como &quot;comanda&quot;, &quot;recargo&quot;, &quot;vuelto&quot;, &quot;stock&quot; o borrá la búsqueda.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveModule("todos");
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl text-white transition"
            >
              <RotateCcw size={13} />
              Restablecer búsqueda
            </button>
          </div>
        ) : (
          filteredModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <section
                key={mod.id}
                id={mod.id}
                className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl transition hover:border-zinc-700/80"
              >
                {/* ── Header del Módulo ── */}
                <div
                  className={`p-6 sm:p-8 border-b border-zinc-800/80 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden`}
                >
                  <div
                    className={`absolute -right-10 -bottom-10 w-44 h-44 rounded-full opacity-10 blur-3xl pointer-events-none`}
                    style={{ backgroundColor: mod.roleColor.accent }}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${mod.roleColor.bg} ${mod.roleColor.text} border ${mod.roleColor.border} shadow-sm`}
                        >
                          <Icon size={18} />
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${mod.roleColor.bg} ${mod.roleColor.text} ${mod.roleColor.border}`}
                        >
                          {mod.roleBadge}
                        </span>
                        {mod.route !== "#" && (
                          <span className="font-mono text-[11px] text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800">
                            {mod.displayRoute || mod.route}
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {mod.title}
                      </h2>
                      <p className="text-zinc-400 text-sm max-w-3xl leading-relaxed">
                        {mod.summary}
                      </p>
                    </div>

                    {mod.route !== "#" && (
                      <Link
                        href={mod.route}
                        className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold rounded-xl border border-zinc-700/80 transition active:scale-95 shadow-sm"
                      >
                        <span>Abrir Sección</span>
                        <ExternalLink size={13} />
                      </Link>
                    )}
                  </div>
                </div>

                {/* ── Subsecciones / Pantallas ── */}
                <div className="p-6 sm:p-8 space-y-8">
                  {mod.sections.map((sec, sIdx) => (
                    <div
                      key={sIdx}
                      className="bg-zinc-950/60 border border-zinc-800/60 rounded-2xl p-5 sm:p-6 space-y-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-lg font-black text-zinc-100 tracking-tight">
                            {sec.title}
                          </h3>
                          {sec.badge && (
                            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">
                              {sec.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                        {sec.description}
                      </p>

                      {/* Lista de pasos si existen */}
                      {sec.steps && sec.steps.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <p className="text-xs font-black uppercase tracking-wider text-zinc-400">
                            Secuencia Operativa:
                          </p>
                          <div className="space-y-2">
                            {sec.steps.map((st, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-3 p-3 bg-zinc-900/60 border border-zinc-800/70 rounded-xl text-xs sm:text-sm text-zinc-300"
                              >
                                <span className="w-5 h-5 rounded-full bg-zinc-800 text-orange-400 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                <span className="leading-snug">{st}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Botones y Controles Clave */}
                      {sec.buttonsAndControls &&
                        sec.buttonsAndControls.length > 0 && (
                          <div className="space-y-3 pt-2">
                            <p className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                              <Sliders size={13} className="text-orange-400" />
                              Botones y Controles Principales:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {sec.buttonsAndControls.map((ctrl, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="p-3.5 bg-zinc-900 border border-zinc-800/80 rounded-xl flex flex-col justify-between gap-1.5 hover:border-zinc-700 transition"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                                      {ctrl.name}
                                    </span>
                                    {ctrl.type === "alert" && (
                                      <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                                        Importante
                                      </span>
                                    )}
                                    {ctrl.type === "action" && (
                                      <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                                        Acción
                                      </span>
                                    )}
                                    {ctrl.type === "info" && (
                                      <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                                        Dato
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-zinc-400 leading-relaxed">
                                    {ctrl.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Tips y Alertas */}
                      {sec.tips && sec.tips.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 space-y-1.5">
                          {sec.tips.map((t, tIdx) => (
                            <div
                              key={tIdx}
                              className="flex items-start gap-2.5 text-xs text-orange-200"
                            >
                              <Info
                                size={15}
                                className="text-orange-400 shrink-0 mt-0.5"
                              />
                              <span className="leading-snug">{t}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 px-4 sm:px-8 text-center text-xs text-zinc-500 space-y-2">
        <p className="font-bold text-zinc-400">
          Quadra Pizza ERP — Sistema de Gestión Gastronómica Integral
        </p>
        <p>
          Este manual se actualiza en conjunto con las versiones y mejoras del
          sistema.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link
            href="/recepcion"
            className="text-orange-400 hover:text-orange-300 font-bold"
          >
            Recepción
          </Link>
          <span className="text-zinc-700">•</span>
          <Link
            href="/cocina"
            className="text-orange-400 hover:text-orange-300 font-bold"
          >
            Cocina
          </Link>
          <span className="text-zinc-700">•</span>
          <Link
            href="/delivery"
            className="text-orange-400 hover:text-orange-300 font-bold"
          >
            Delivery
          </Link>
          <span className="text-zinc-700">•</span>
          <Link
            href="/gerencia"
            className="text-orange-400 hover:text-orange-300 font-bold"
          >
            Gerencia
          </Link>
        </div>
      </footer>
    </div>
  );
}
