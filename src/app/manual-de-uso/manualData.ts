export type ModuleKey =
  | "todos"
  | "catalogo"
  | "recepcion"
  | "cocina"
  | "delivery"
  | "gerencia"
  | "tracking"
  | "flujo";

export interface FieldDetail {
  name: string;
  type: "text" | "number" | "select" | "checkbox" | "button" | "kpi" | "etiqueta" | "file";
  required?: boolean;
  description: string;
  exampleOrOptions?: string;
  effect: string;
}

export interface ContainerDetail {
  name: string;
  purpose: string;
  metricsOrDataShown: string[];
  controlsOrButtons?: string[];
  interpretationTip?: string;
}

export interface SubSection {
  title: string;
  shortTitle?: string;
  badge?: string;
  route?: string;
  description: string;
  containers?: ContainerDetail[];
  fieldsAndCheckboxes?: FieldDetail[];
  buttonsAndControls?: {
    name: string;
    description: string;
    type?: "action" | "info" | "alert" | "nav";
  }[];
  steps?: string[];
  tips?: string[];
}

export interface DocModule {
  id: ModuleKey;
  title: string;
  shortTitle: string;
  roleBadge: string;
  roleColor: {
    bg: string;
    text: string;
    border: string;
    glow: string;
    accent: string;
  };
  iconName: string;
  route: string;
  displayRoute?: string;
  summary: string;
  sections: SubSection[];
}

export const MODULES_DATA: DocModule[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. CATÁLOGO Y TIENDA WEB
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "catalogo",
    title: "1. Catálogo y Tienda Web Pública",
    shortTitle: "Catálogo",
    roleBadge: "Clientes & Público General",
    roleColor: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/30",
      glow: "shadow-amber-500/10",
      accent: "#f59e0b",
    },
    iconName: "ShoppingBag",
    route: "/",
    displayRoute: "/",
    summary:
      "Tienda web autogestionada para clientes. Permite explorar el menú, personalizar tamaños y sabores de pizzas por metro, agregar extras, calcular costos de envío por barrio, pagar con recargo automático con tarjeta y enviar el pedido directamente al WhatsApp oficial del local.",
    sections: [
      {
        title: "Cabecera Pública, Buscador y Categorías",
        shortTitle: "Cabecera y Menú",
        badge: "Navegación Web",
        route: "/",
        description:
          "Barra superior de navegación que acompaña al cliente durante toda su visita a la tienda web.",
        containers: [
          {
            name: "Barra Superior Fija",
            purpose: "Identidad del negocio, acceso al buscador y apertura del carrito de compras.",
            metricsOrDataShown: [
              "Logo oficial y nombre comercial de Quadra Pizza.",
              "Contador numérico de ítems en carrito en tiempo real.",
              "Acceso rápido al manual y accesos directos al ERP."
            ],
            controlsOrButtons: [
              "Logo Quadra Pizza: Recarga la página y vuelve al inicio del catálogo.",
              "Botón 'Ver Carrito': Abre el panel lateral deslizable con los productos seleccionados."
            ],
            interpretationTip: "El contador del carrito se actualiza instantáneamente cada vez que el cliente suma productos o extras."
          },
          {
            name: "Buscador Predictivo Central",
            purpose: "Localizar productos de forma inmediata sin necesidad de recorrer todas las categorías.",
            metricsOrDataShown: [
              "Filtro en tiempo real por nombre de producto o ingredientes clave."
            ],
            controlsOrButtons: [
              "Campo de texto interactivo con limpieza rápida (ícono X)."
            ],
            interpretationTip: "Escribir palabras como 'muzza', 'cebolla' o 'empanada' filtra la grilla al instante."
          },
          {
            name: "Selector de Pestañas de Categorías",
            purpose: "Organizar el catálogo en familias gastronómicas ordenadas.",
            metricsOrDataShown: [
              "Pizzas Tradicionales y Especiales.",
              "Empanadas y Canastitas.",
              "Bebidas y Cervezas.",
              "Menú del Día y Promociones.",
              "Postres y Dulces."
            ],
            interpretationTip: "Los productos cuyo stock esté marcado en 0 en el sistema se ocultan automáticamente del catálogo para evitar cancelaciones."
          }
        ],
        tips: [
          "Si un producto no tiene stock disponible en el ERP, el sistema lo remueve automáticamente de la tienda pública sin intervención manual."
        ]
      },
      {
        title: "Ventana de Configuración y Personalización del Producto",
        shortTitle: "Personalizar Sabores",
        badge: "Ventana Emergente",
        description:
          "Ventana interactiva que se abre al hacer clic sobre cualquier producto de la grilla para configurar cantidades, sabores, formatos y adicionales.",
        fieldsAndCheckboxes: [
          {
            name: "Selector de Formato (Unidad / 1/2 Docena / Docena)",
            type: "select",
            required: true,
            description: "Permite seleccionar el tamaño o presentación del producto, especialmente en empanadas.",
            exampleOrOptions: "Unidad | Media Docena (6 u.) | Docena (12 u.)",
            effect: "Ajusta automáticamente el precio unitario aplicando descuentos comerciales por volumen."
          },
          {
            name: "Configurador Quadra Pizza (Sabores por Fila)",
            type: "select",
            required: true,
            description: "Para productos de tipo Quadra (pizzas rectangulares por metro), permite armar las filas con variedades disponibles.",
            exampleOrOptions: "Fila 1: Muzzarella fija / Fila 2: Calabresa / Fila 3: Jamón y Morrones",
            effect: "Garantiza que la comanda ingrese a cocina con la distribución milimétrica de sabores que pidió el cliente."
          },
          {
            name: "Checkboxes de Extras y Adicionales",
            type: "checkbox",
            required: false,
            description: "Lista de ingredientes extra que el cliente puede tildar para sumar a su pizza o producto.",
            exampleOrOptions: "[x] Queso Extra ($1.200) / [x] Fainá Tradicional ($1.500) / [x] Salsa Picante ($800)",
            effect: "Cada extra tildado suma su costo al precio unitario del producto y se detalla en la comanda."
          },
          {
            name: "Selector de Cantidad (+ / -)",
            type: "button",
            required: true,
            description: "Control numérico para especificar cuántas unidades o docenas del producto configurado se desean ingresar.",
            exampleOrOptions: "1, 2, 3...",
            effect: "Multiplica el valor del producto configurado con sus extras."
          },
          {
            name: "Botón 'Agregar al Pedido'",
            type: "button",
            required: true,
            description: "Confirma la personalización del ítem y lo incorpora al carrito de compras.",
            effect: "Valida que todas las variedades requeridas estén seleccionadas y abre el panel del carrito."
          }
        ],
        steps: [
          "El cliente hace clic en la tarjeta del producto deseado.",
          "Selecciona el formato (unidad o docena si corresponde).",
          "Elige los sabores para cada fila en caso de ser una pizza Quadra.",
          "Marca los checkboxes de extras que desee sumar.",
          "Ajusta la cantidad con los botones (+) o (-).",
          "Toca 'Agregar al Pedido'. El ítem queda listo en el carrito."
        ]
      },
      {
        title: "Carrito de Compras y Confirmación de Pedido por WhatsApp",
        shortTitle: "Carrito y WhatsApp",
        badge: "Confirmación en 2 Pasos",
        description:
          "Panel lateral deslizable (panel lateral deslizable) donde el cliente revisa su pedido, ingresa sus datos de entrega, selecciona el método de pago y despacha la orden hacia el WhatsApp del local.",
        containers: [
          {
            name: "Paso 1: Tu Pedido (Revisión)",
            purpose: "Verificación de ítems cargados antes de completar los datos de entrega.",
            metricsOrDataShown: [
              "Lista de productos con su formato (unidad/docena), sabores de filas elegidos y extras detallados.",
              "Subtotales parciales por producto.",
              "Botones (+ / -) para alterar cantidades sobre la marcha.",
              "Botón papelera roja para eliminar un producto del carrito."
            ],
            controlsOrButtons: ["Botón 'Continuar con el Pedido': Pasa al Paso 2."]
          },
          {
            name: "Paso 2: Datos de Entrega y Medio de Pago",
            purpose: "Completar la información logística y financiera del cliente.",
            metricsOrDataShown: [
              "Campos de contacto del cliente.",
              "Selector de modalidad: Retiro en Local vs Envío a Domicilio.",
              "Selector de Barrio/Zona con cálculo automático del costo de entrega.",
              "Selector de Medio de Pago con desglose de recargo financiero.",
              "Contenedor de Totales con desglose de Subtotal, Envío, Recargo y Total Final."
            ]
          }
        ],
        fieldsAndCheckboxes: [
          {
            name: "Nombre y Apellido",
            type: "text",
            required: true,
            description: "Nombre del cliente para rotular la comanda y saludarlo en el seguimiento.",
            exampleOrOptions: "Valeria Gómez",
            effect: "Queda registrado en la base de clientes y en el ticket fiscal."
          },
          {
            name: "Teléfono WhatsApp",
            type: "text",
            required: false,
            description: "Número de teléfono móvil del cliente para coordinar la entrega y recibir el tracking.",
            exampleOrOptions: "3516123456",
            effect: "Permite al cadete llamarlo con 1 clic desde su móvil y enviar links de estado."
          },
          {
            name: "Modalidad de Entrega (Retiro vs Envío)",
            type: "select",
            required: true,
            description: "Define si el cliente retira por el local o solicita delivery.",
            exampleOrOptions: "Retiro en local ($0) | Envío a domicilio (Tarifa por Barrio)",
            effect: "Si es Retiro, el costo de envío es $0. Si es Envío, habilita los campos de dirección y selector de barrio."
          },
          {
            name: "Dirección y Detalles de Entrega",
            type: "text",
            required: true,
            description: "Calle, número, piso, departamento y referencias para el repartidor.",
            exampleOrOptions: "Av. San Martín 1250, Piso 4 Depto B (timbre 4B)",
            effect: "Se imprime en la comanda del repartidor y se enlaza con el GPS de navegación."
          },
          {
            name: "Selector de Barrio / Zona de Entrega",
            type: "select",
            required: true,
            description: "Desplegable con las zonas de cobertura configuradas en el sistema.",
            exampleOrOptions: "Centro ($800) | Villa Belgrano ($1.500) | B° Privado La Arboleda ($1.000)",
            effect: "Suma automáticamente el costo de flete exacto al total a pagar."
          },
          {
            name: "Método de Pago",
            type: "select",
            required: true,
            description: "Forma en que el cliente abonará su compra.",
            exampleOrOptions: "Efectivo | Transferencia Bancaria | Tarjeta de Crédito",
            effect: "Si se elige 'Tarjeta de Crédito', el sistema aplica y muestra un recargo automático del 15% sobre el importe total."
          }
        ],
        buttonsAndControls: [
          {
            name: "Botón 'Confirmar y Enviar por WhatsApp'",
            description: "Registra la comanda en el ERP con ID único (#YYMMDD-XXX), genera el mensaje en texto enriquecido y abre la app de WhatsApp conectada con el local.",
            type: "action"
          },
          {
            name: "Botón 'Seguir Estado en Vivo'",
            description: "Aparece en la pantalla de confirmación para abrir la URL pública /estado-pedido?id=... y ver el tracking en vivo.",
            type: "action"
          },
          {
            name: "Botón 'Copiar enlace de seguimiento'",
            description: "Copia al portapapeles el enlace con el snapshot del pedido para guardarlo o compartirlo.",
            type: "action"
          }
        ],
        tips: [
          "El mensaje de WhatsApp generado incluye automáticamente el enlace al tracking en vivo del pedido para que el cliente lo tenga siempre a mano.",
          "El número de destino del WhatsApp está centralizado en el local y puede ser modificado en cualquier momento desde Recepción o Gerencia."
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. RECEPCIÓN Y PUNTO DE VENTA (POS)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "recepcion",
    title: "2. Recepción y Punto de Venta",
    shortTitle: "Recepción",
    roleBadge: "Cajeros & Mostrador",
    roleColor: {
      bg: "bg-sky-500/10",
      text: "text-sky-400",
      border: "border-sky-500/30",
      glow: "shadow-sky-500/10",
      accent: "#38bdf8",
    },
    iconName: "Store",
    route: "/recepcion",
    displayRoute: "/recepcion",
    summary:
      "Terminal operativo de mostrador para emitir ventas rápidas de salón y teléfono, supervisar el tablero Kanban de comandas, administrar deudores y cuentas corrientes, controlar stock, editar el catálogo y efectuar el arqueo de caja del turno.",
    sections: [
      {
        title: "Barra Superior y Navegación del Cajero",
        shortTitle: "Barra Superior y Sesión",
        badge: "Estructura Recepción",
        description:
          "Barra superior presente en todas las pantallas del módulo de Recepción para supervisar la sesión activa.",
        containers: [
          {
            name: "Barra Superior de Recepción",
            purpose: "Control de sesión, reloj de turno y navegación rápida entre las páginas de mostrador.",
            metricsOrDataShown: [
              "Logo oficial y título 'Recepción - Terminal Mostrador'.",
              "Reloj digital de alta precisión en tiempo real (HH:MM).",
              "Identificación del cajero logueado con avatar e indicador de estado verde.",
              "Botón 'Cerrar Sesión' (rojo con ícono Cerrar Sesión)."
            ],
            controlsOrButtons: [
              "Logo: Enlace directo al catálogo público de clientes.",
              "Botón 'Cerrar Sesión': Desconecta al usuario activo de la memoria y regresa a la pantalla de teclado numérico.",
              "Menú Hamburguesa (Mobile/Tablet): Abre el panel de pestañas en pantallas táctiles pequeñas."
            ],
            interpretationTip: "Cada venta y cobro emitido se asocia automáticamente al cajero activo mostrado en la barra superior para que el cierre de caja sea 100% auditable."
          }
        ],
        tips: [
          "Para cambiar de cajero al finalizar el turno, simplemente hacer clic en 'Cerrar Sesión' e ingresar con el nuevo PIN de 4 dígitos."
        ]
      },
      {
        title: "Nueva Venta (Punto de Venta de Comandas)",
        shortTitle: "Nueva Venta",
        badge: "/recepcion/nueva-venta",
        route: "/recepcion/nueva-venta",
        description:
          "Pantalla de toma de pedidos optimizada para registrar comandas de mostrador o telefónicas en menos de 30 segundos.",
        containers: [
          {
            name: "Panel Central de Catálogo y Productos",
            purpose: "Búsqueda y selección táctil de productos para incorporar a la orden.",
            metricsOrDataShown: [
              "Barra de búsqueda con filtro predictivo.",
              "Filtros de Categorías Nivel 1 (Pizzas, Empanadas, Bebidas, etc.) y Nivel 2 (Subcategorías).",
              "Tarjetas de producto con foto, nombre, precio y disponibilidad."
            ]
          },
          {
            name: "Panel Lateral de la Comanda (Carrito del Punto de Venta)",
            purpose: "Construcción de la orden, datos del cliente, método de entrega, pago y cálculo de vuelto.",
            metricsOrDataShown: [
              "Lista de ítems con botones (+ / -) y botón de Nota especial.",
              "Subtotal productos, costo de flete, recargo por tarjeta y Total Final.",
              "Cálculo del vuelto en efectivo destacado en color verde brillante."
            ]
          }
        ],
        fieldsAndCheckboxes: [
          {
            name: "Autocompletado de Clientes Frecuentes",
            type: "text",
            required: false,
            description: "Campo para tipear nombre o teléfono del cliente. Muestra sugerencias instantáneas.",
            exampleOrOptions: "Juan Pérez | 3515112233",
            effect: "Al seleccionar un cliente sugerido, se rellenan automáticamente su nombre, teléfono, dirección y barrio habitual."
          },
          {
            name: "Nota para Cocina (Ícono Mensaje en cada ítem)",
            type: "button",
            required: false,
            description: "Permite escribir especificaciones culinarias puntuales para el pizzero.",
            exampleOrOptions: "'bien tostada', 'sin orégano', 'cortar en 12 porciones', 'cebolla suave'",
            effect: "La aclaración se imprime en amarillo en la pantalla de cocina de Cocina y en el ticket fiscal."
          },
          {
            name: "Selector de Entrega (Retiro vs Delivery)",
            type: "select",
            required: true,
            description: "Define si el cliente retira en mostrador o si se envía con cadete.",
            exampleOrOptions: "Retiro en Local ($0) | Envío a Domicilio (calcula costo por barrio)",
            effect: "Suma automáticamente la tarifa de envío configurada para ese barrio."
          },
          {
            name: "Selector de Medio de Pago",
            type: "select",
            required: true,
            description: "Canal por el cual ingresa el dinero.",
            exampleOrOptions: "Efectivo | Mercado Pago / QR | Transferencia Bancaria | Tarjeta de Crédito",
            effect: "Si se selecciona 'Tarjeta de Crédito', aplica automáticamente el recargo del 15% sobre el total."
          },
          {
            name: "Calculadora de Vuelto (Campo 'Dinero Recibido')",
            type: "number",
            required: false,
            description: "Importe en efectivo entregado por el cliente en billetes.",
            exampleOrOptions: "Total: $14.500 ➔ Recibido: $20.000",
            effect: "Calcula en color verde fosforescente el vuelto exacto ($5.500) para evitar errores del cajero."
          }
        ],
        buttonsAndControls: [
          {
            name: "Botón 'Enviar a Cocina / Confirmar Pedido'",
            description: "Crea la orden con ID único, impacta en tiempo real en la pantalla de cocina (o la saltea si es solo bebidas) y abre la ventana de confirmación.",
            type: "action"
          },
          {
            name: "Botón 'Seguir Estado en Vivo'",
            description: "Abre la URL directa /estado-pedido?id=... en una nueva pestaña para ver la pantalla del cliente.",
            type: "action"
          },
          {
            name: "Botón 'Copiar enlace de seguimiento'",
            description: "Copia la URL completa para enviarla por chat o pegarla en el navegador.",
            type: "action"
          },
          {
            name: "Botón 'Enviar por WhatsApp'",
            description: "Abre la conversación de WhatsApp con el número del cliente con el texto y link de seguimiento listos para enviar.",
            type: "action"
          },
          {
            name: "Botón 'Nuevo Pedido'",
            description: "Limpia completamente el carrito y resetea los campos para comenzar la siguiente venta.",
            type: "action"
          }
        ],
        tips: [
          "Salteo Automático de Cocina: Si una venta SOLO contiene bebidas, cervezas o postres, el sistema detecta que no requiere cocción y la pasa directamente al estado 'Listo' sin molestar a los pizzeros.",
          "Ventas Fiadas: Se puede confirmar un pedido con estado de pago 'Pendiente' (fiado). El pedido quedará registrado con alerta roja en el monitor y se sumará a la cuenta corriente del cliente en Deudores."
        ]
      },
      {
        title: "Estado de Pedidos (Kanban de Mostrador)",
        shortTitle: "Estado de Pedidos",
        badge: "/recepcion/estado-pedidos",
        route: "/recepcion/estado-pedidos",
        description:
          "Tablero de control en 5 columnas para monitorear el ciclo de vida completo de cada pedido del turno.",
        containers: [
          {
            name: "Columnas del Tablero Kanban",
            purpose: "Flujo operativo de estados del pedido.",
            metricsOrDataShown: [
              "1. Confirmados: Pedidos recién tomados esperando turno de cocina.",
              "2. En Cocina: Comandas en elaboración activa en hornos.",
              "3. Listos: Pedidos terminados en mesada esperando retiro o cadete.",
              "4. En Camino: Pedidos despachados con repartidor en viaje.",
              "5. Completados: Pedidos entregados al cliente con éxito."
            ]
          },
          {
            name: "Tarjeta de Pedido (Tarjeta de Mostrador)",
            purpose: "Identificación integral del pedido, tiempos y estado de pago.",
            metricsOrDataShown: [
              "Enlace clickeable al ID: #{order.id} (abre el seguimiento en vivo del cliente).",
              "Etiqueta de Modalidad: 🛵 Envío vs 🏪 Retiro.",
              "Etiqueta '🥤 Solo Bebidas': Indica pedidos que omitieron la cocina.",
              "Etiqueta de Pago: '✓ PAGADO' (verde) vs '⚠️ IMPAGO' (rojo brillante pulsante con borde rojo).",
              "Cronómetro de Espera: Minutos transcurridos con alerta amarilla a los 15' y llama roja a los 30'.",
              "Cliente, Dirección, Medio de Pago, Lista de productos con cantidades y Total en $."
            ],
            controlsOrButtons: [
              "Enlace #{order.id}: Abre /estado-pedido?id=... en pestaña nueva.",
              "Botón 'Copiar Link': Copia el link de tracking con snapshot completo.",
              "Botón 'Enviar Seguimiento por WhatsApp': Abre chat con el cliente con mensaje automático.",
              "Botón 'Pasar a Cocina': Avanza pedidos confirmados a elaboración.",
              "Botón 'Marcar como Listo': Avanza comandas a empaquetado.",
              "Botón 'Despachar (En Camino)': Asigna salida para delivery.",
              "Botón 'Entregar al Cliente / Mostrador': Finaliza la entrega.",
              "Botón 'Marcar como Pagado': Salda pedidos que estaban fiados.",
              "Botón 'Cancelar Pedido': Anula la comanda y la remueve del flujo."
            ],
            interpretationTip: "Las tarjetas de pedidos impagos tienen un diseño 100% rojo con resplandor para que ningún cajero entregue un pedido sin verificar el cobro."
          }
        ],
        tips: [
          "Cualquier cambio de estado realizado en este tablero se refleja en menos de 1 segundo en la pantalla del cliente gracias a la sincronización en tiempo real."
        ]
      },
      {
        title: "Clientes Deudores y Cuentas Corrientes",
        shortTitle: "Deudores y Pagos",
        badge: "/recepcion/deudores",
        route: "/recepcion/deudores",
        description:
          "Panel para auditar fiados, saldos adeudados, registrar pagos parciales (entregas a cuenta) y saldar deudas totales.",
        containers: [
          {
            name: "3 Contenedores Superiores de Métricas",
            purpose: "Visibilidad inmediata de la cartera de crédito del local.",
            metricsOrDataShown: [
              "1. Deuda Total en Calle: Importe monetario acumulado de todas las órdenes fiadas.",
              "2. Clientes con Saldo Deudor: Cantidad total de clientes con deuda activa.",
              "3. Órdenes Pendientes de Cobro: Total de comandas individuales sin abonar."
            ],
            interpretationTip: "Permite saber al instante cuánto dinero del negocio está pendiente de cobro en la calle."
          },
          {
            name: "Lista de Fichas de Deudores",
            purpose: "Gestión individualizada por cliente con historial de comandas adeudadas.",
            metricsOrDataShown: [
              "Nombre del cliente y etiqueta de cliente registrado/verificado.",
              "Teléfono con enlace directo a llamada telefónica.",
              "Botón de WhatsApp con mensaje prearmado que informa el saldo adeudado exacto.",
              "Dirección habitual y fecha de la deuda más antigua.",
              "Desplegable de órdenes impagas con fecha, ítems, total y estado."
            ]
          }
        ],
        fieldsAndCheckboxes: [
          {
            name: "Ventana 'Registrar Entrega a Cuenta (Pago Parcial)'",
            type: "number",
            required: true,
            description: "Permite asentar un cobro parcial que reduce la deuda total del cliente.",
            exampleOrOptions: "Deuda: $20.000 ➔ Entrega: $10.000",
            effect: "Imputa el monto a las órdenes más viejas primero (orden cronológico) y recalcula el saldo restante."
          },
          {
            name: "Selector de Medio de Pago para Entrega a Cuenta",
            type: "select",
            required: true,
            description: "Canal utilizado por el cliente para realizar el pago parcial.",
            exampleOrOptions: "Efectivo | Mercado Pago | Transferencia | Tarjeta de Crédito",
            effect: "Si se elige 'Tarjeta de Crédito', el sistema aplica matemáticamente el 15% de recargo sobre el importe abonado."
          },
          {
            name: "Ventana 'Editar Datos del Cliente'",
            type: "text",
            required: true,
            description: "Permite actualizar Nombre, Apellido, Teléfono y Dirección del deudor.",
            effect: "Actualiza los datos canónicos en el maestro de clientes de todo el sistema."
          }
        ],
        buttonsAndControls: [
          {
            name: "Botón 'Entrega a Cuenta'",
            description: "Abre la ventana para registrar un pago parcial con desglose de medio de pago y recargo de tarjeta.",
            type: "action"
          },
          {
            name: "Botón 'Saldar Deuda Total'",
            description: "Cancela el 100% de las órdenes adeudadas del cliente en un solo paso eligiendo el medio de cobro.",
            type: "action"
          },
          {
            name: "Botón 'WhatsApp Recordatorio'",
            description: "Abre un chat con el cliente con un mensaje amable que detalla el saldo adeudado y las órdenes pendientes.",
            type: "action"
          }
        ],
        tips: [
          "Matemática de Tarjeta en Deudores: Si un cliente debe $10.000 y entrega $10.000 con tarjeta de crédito, el sistema descuenta $10.000 de su deuda y calcula $1.500 de recargo (15%), indicando que en el posnet deben cobrarse $11.500."
        ]
      },
      {
        title: "Control de Stock en Mostrador",
        shortTitle: "Control de Stock",
        badge: "/recepcion/stock",
        route: "/recepcion/stock",
        description:
          "Panel para consultar existencias de mercadería, detectar faltantes y realizar ajustes rápidos de inventario.",
        containers: [
          {
            name: "Contenedores Superiores de Métricas (Desplazamiento Libre)",
            purpose: "Visión panorámica del estado del inventario sin tapar la pantalla.",
            metricsOrDataShown: [
              "1. Total Insumos Registrados.",
              "2. Insumos en Estado Crítico / Agotados (en rojo de alerta).",
              "3. Insumos con Stock Saludable / Óptimo (en verde).",
              "4. Cambios Pendientes por Guardar (contador en naranja).",
              "5. Teléfono de Compras / Encargado para alertas directas."
            ]
          },
          {
            name: "Tabla de Insumos con Controles Táctiles",
            purpose: "Edición rápida de cantidades en mostrador.",
            metricsOrDataShown: [
              "Nombre del insumo y categoría.",
              "Stock mínimo de seguridad.",
              "Stock actual en tiempo real.",
              "Controles (+) y (-) para modificar cantidades con indicador de valor temporal no guardado.",
              "Botón flotante 'Guardar Cambios' con persistencia inmediata."
            ]
          }
        ],
        tips: [
          "Los contenedores superiores ya no están fijos: se desplazan con el desplazamiento continuo para dejar máximo espacio visual a la tabla de productos."
        ]
      },
      {
        title: "Gestor del Catálogo y WhatsApp Oficial",
        shortTitle: "Catálogo y Teléfono",
        badge: "/recepcion/catalogo",
        route: "/recepcion/catalogo",
        description:
          "Hub de control para cambiar el teléfono oficial de WhatsApp del negocio y acceder a la administración del menú.",
        containers: [
          {
            name: "Panel de Teléfono Oficial de Pedidos",
            purpose: "Garantizar que todos los pedidos del catálogo web se dirijan al número de WhatsApp correcto.",
            metricsOrDataShown: [
              "Número de WhatsApp activo (+54 9 3513 05-9413).",
              "Estado de conexión con la tienda pública."
            ],
            controlsOrButtons: [
              "Botón 'Cambiar Teléfono': Abre el campo de edición.",
              "Botón 'Guardar Teléfono': Aplica y persiste el nuevo número en el catálogo web de forma inmediata."
            ]
          },
          {
            name: "4 Accesos Rápidos de Catálogo",
            purpose: "Navegar hacia las secciones de configuración de la carta.",
            metricsOrDataShown: [
              "1. Productos (total de ítems cargados y creador).",
              "2. Categorías (árbol de familias del menú).",
              "3. Tarifas de Envíos (precios por barrio/zona).",
              "4. Extras y Adicionales (queso extra, condimentos, fainá)."
            ]
          }
        ]
      },
      {
        title: "Cierre de Caja y Arqueo de Turno",
        shortTitle: "Cierre de Caja",
        badge: "/recepcion/cierre-caja",
        route: "/recepcion/cierre-caja",
        description:
          "Balance contable obligatorio que realiza el cajero antes de entregar el turno o cerrar el local.",
        containers: [
          {
            name: "Resumen de Ventas por Medio de Pago",
            purpose: "Auditar los ingresos acumulados durante el turno del cajero.",
            metricsOrDataShown: [
              "Total Efectivo recaudado.",
              "Total Mercado Pago / QR ingresado.",
              "Total Transferencias Bancarias confirmadas.",
              "Total Tarjetas de Crédito / Débito cobradas.",
              "TOTAL GENERAL FACTURADO DEL TURNO."
            ]
          },
          {
            name: "Arqueo de Efectivo Físico",
            purpose: "Comparar lo que el sistema calculó contra el dinero real en el cajón.",
            metricsOrDataShown: [
              "Campo para tipear 'Efectivo Real Recontado'.",
              "Cálculo automático de Diferencia: Sobrante (en verde) o Faltante (en rojo de alerta)."
            ],
            controlsOrButtons: [
              "Botón 'Confirmar y Cerrar Caja': Guarda el arqueo en el historial contable, desloguea al cajero y bloquea el terminal para el próximo turno."
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. COCINA Y Monitor de Cocina (KITCHEN DISPLAY SYSTEM)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "cocina",
    title: "3. Cocina y Monitor de Pedidos",
    shortTitle: "Cocina",
    roleBadge: "Pizzeros & Cocina",
    roleColor: {
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/30",
      glow: "shadow-orange-500/10",
      accent: "#f97316",
    },
    iconName: "ChefHat",
    route: "/cocina/monitor-pedidos",
    displayRoute: "/cocina",
    summary:
      "Pantalla táctil para la línea de producción y hornos. Permite visualizar comandas en tiempo real, filtrar notas especiales de clientes, cronometrar tiempos de horneado y omitir pedidos que no requieren cocción (Solo Bebidas).",
    sections: [
      {
        title: "Ingreso a Cocina y Barra Superior de Producción",
        shortTitle: "Barra Superior y Sesión",
        badge: "Acceso & Seguridad",
        description:
          "Ingreso ágil mediante teclado numérico de 4 dígitos y cabecera con control de sesión.",
        buttonsAndControls: [
          {
            name: "teclado numérico Táctil de 4 Dígitos",
            description: "Permite a los cocineros iniciar sesión tocando 4 números grandes sin teclado físico.",
            type: "action"
          },
          {
            name: "Botón 'Credenciales Rápidas (Demo)'",
            description: "Rellena automáticamente el PIN de prueba del pizzero para capacitación y pruebas del sistema.",
            type: "action"
          },
          {
            name: "Botón 'Cerrar Sesión' en Barra Superior",
            description: "Cierra la sesión del cocinero activo y devuelve la pantalla al teclado numérico de bloqueo.",
            type: "alert"
          }
        ]
      },
      {
        title: "Monitor de Cocina Adaptable Horizontal",
        shortTitle: "Monitor de Cocina",
        badge: "/cocina/monitor-pedidos",
        route: "/cocina/monitor-pedidos",
        description:
          "Pantalla de comandas en vivo con diseño adaptativo optimizado para verse de costado (apaisado/horizontal) en tablets y celulares.",
        containers: [
          {
            name: "Diseño Adaptable en Pantalla Horizontal",
            purpose: "Aprovechar al máximo el ancho de pantalla en tablets de cocina y teléfonos móviles.",
            metricsOrDataShown: [
              "Al poner el celular o tablet de costado (horizontal), las tarjetas se reorganizan automáticamente en columnas panorámicas visibles sin desbordar la pantalla.",
              "Tipografía grande de alta legibilidad a varios metros de distancia del horno."
            ]
          },
          {
            name: "Tarjeta de Comanda de Cocina (Monitor de Cocina Tarjeta)",
            purpose: "Instrucciones de horneado y armado para el pizzero.",
            metricsOrDataShown: [
              "Número de comanda grande (#261013-012).",
              "Hora de ingreso y cronómetro de minutos transcurridos.",
              "Alerta de tiempo: Verde normal ➔ Amarillo a los 15 min ➔ Rojo con llama titilante a los 30 min.",
              "Lista de pizzas con formato, tamaño y desglose fila por fila de sabores Quadra.",
              "NOTAS ESPECIALES destacadas en color amarillo fluorescente ('bien dorada', 'sin cebolla')."
            ],
            controlsOrButtons: [
              "Botón 'Tomar / En Preparación': Marca la orden como tomada y notifica al cliente que sus pizzas entraron al horno.",
              "Botón 'Marcar como Listo': Confirma que la comida salió del horno, está empaquetada y lista para retiro o delivery."
            ]
          }
        ],
        tips: [
          "Salteo Automático: Los pedidos que solo contienen gaseosas, aguas o postres envasados NO aparecen en esta pantalla para no interrumpir el trabajo de los pizzeros."
        ]
      },
      {
        title: "Stock Crítico de Cocina",
        shortTitle: "Stock Crítico",
        badge: "/cocina/stock-critico",
        route: "/cocina/stock-critico",
        description:
          "Muestra exclusivamente los insumos que afectan la cocina (harina, muzzarella, salsa, cajas de pizza) para alertar antes de que se agoten durante el despacho.",
        tips: [
          "Permite al jefe de cocina avisar al cajero o gerente con un toque si un ingrediente está por acabarse para pausar ventas de ese sabor."
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. DELIVERY Y LOGÍSTICA DE REPARTO
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "delivery",
    title: "4. Delivery y Logística de Envíos",
    shortTitle: "Delivery",
    roleBadge: "Cadetes & Repartidores",
    roleColor: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      glow: "shadow-emerald-500/10",
      accent: "#10b981",
    },
    iconName: "Bike",
    route: "/delivery/mis-viajes",
    displayRoute: "/delivery",
    summary:
      "Aplicación móvil para repartidores con tablero Kanban horizontal de 4 columnas, botón de llamada telefónica directa al cliente, enlace a mapa GPS, control de cobranzas en puerta y confirmación de entrega en tiempo real.",
    sections: [
      {
        title: "Ingreso a Delivery y Barra Superior",
        shortTitle: "Barra Superior y Sesión",
        badge: "Acceso Móvil",
        description:
          "Acceso rápido mediante PIN numérico para cadetes y barra superior con control de sesión.",
        buttonsAndControls: [
          {
            name: "teclado numérico Táctil de Repartidor",
            description: "Permite desbloquear la app tocando 4 números grandes.",
            type: "action"
          },
          {
            name: "Botón 'Credenciales Rápidas (Demo)'",
            description: "Ingreso inmediato con usuario de cadete para pruebas de ruta.",
            type: "action"
          },
          {
            name: "Botón 'Cerrar Sesión' en Barra Superior",
            description: "Cierra la sesión del cadete y regresa al PIN pad.",
            type: "alert"
          }
        ]
      },
      {
        title: "Mis Viajes (Tablero de 4 Columnas de Envíos)",
        shortTitle: "Mis Viajes",
        badge: "/delivery/mis-viajes",
        route: "/delivery/mis-viajes",
        description:
          "Tablero ágil diseñado para celulares en posición vertical y horizontal, organizado en 4 etapas lógicas de viaje.",
        containers: [
          {
            name: "4 Columnas de Viajes (Diseño Horizontal Responsivo)",
            purpose: "Acomodarse perfectamente cuando el repartidor coloca el teléfono de costado en el soporte de la moto.",
            metricsOrDataShown: [
              "1. Disponibles: Pedidos listos en mostrador esperando cadete.",
              "2. Asignados: Viajes tomados por el cadete antes de salir.",
              "3. En Camino: Pedidos que están viajando en la moto hacia el cliente.",
              "4. Entregados: Historial de entregas completadas en el turno."
            ]
          },
          {
            name: "Tarjeta de Viaje del Repartidor",
            purpose: "Toda la información necesaria para llegar y entregar sin demoras.",
            metricsOrDataShown: [
              "Nombre y apellido del cliente.",
              "Dirección completa, barrio y aclaraciones de piso/depto.",
              "Indicador de Pago claro: '✓ PAGADO' (no cobrar nada) vs '⚠️ COBRAR EN PUERTA: $X' (cobrar importe exacto en efectivo o transferencia)."
            ],
            controlsOrButtons: [
              "Botón Llamar (tel:phone): Inicia llamada telefónica directa al cliente con 1 solo toque desde el celular.",
              "Botón Mapa / GPS: Abre la ubicación en la app de mapas para navegación por satélite.",
              "Botón 'Iniciar Viaje (En Camino)': Pasa el pedido a 'En Camino' y actualiza la moto en el tracking en vivo del cliente.",
              "Botón 'Confirmar Entrega (Entregado)': Marca la entrega exitosa y finaliza el viaje."
            ],
            interpretationTip: "El cadete siempre sabe antes de bajar de la moto si debe cobrar dinero o si el pedido ya fue abonado electrónicamente."
          }
        ],
        tips: [
          "Al presionar 'Iniciar Viaje', la pantalla del cliente salta automáticamente a '¡En Camino! Tu pedido va en viaje', tranquilizando al comprador."
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. GERENCIA Y ADMINISTRACIÓN CENTRAL
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "gerencia",
    title: "5. Gerencia y Administración Central",
    shortTitle: "Gerencia",
    roleBadge: "Dueños & Administradores",
    roleColor: {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/30",
      glow: "shadow-purple-500/10",
      accent: "#a855f7",
    },
    iconName: "TrendingUp",
    route: "/gerencia/dashboard",
    displayRoute: "/gerencia",
    summary:
      "Suite integral para la toma de decisiones estratégicas. Incluye métricas ejecutivas, auditoría de ventas, finanzas con cálculo de CMV y márgenes netos, creador de productos campo por campo, gestión de personal, clientes y control de deudores.",
    sections: [
      {
        title: "Barra Superior de Gerencia, Selector de Período y Sesión",
        shortTitle: "Barra Superior y Período",
        badge: "Estructura Gerencia",
        description:
          "Barra superior presente en todas las páginas de Gerencia para filtrar períodos de análisis y controlar la seguridad.",
        containers: [
          {
            name: "Barra Superior de Gerencia",
            purpose: "Filtro global de fechas, estado de cuenta y botón de salida.",
            metricsOrDataShown: [
              "Título de pantalla y sector activo.",
              "Selector de Período Desplegable: Permite alternar entre meses individuales o el año completo.",
              "Reloj en vivo.",
              "Botón 'Cerrar Sesión' (rojo)."
            ],
            controlsOrButtons: [
              "Selector de Mes/Año: Filtra automáticamente todas las métricas, ventas y gastos del período elegido.",
              "Botón 'Cerrar Sesión': Invalida la sesión administrativa y redirige al inicio de sesión seguro."
            ]
          }
        ]
      },
      {
        title: "Panel de Control e Indicadores Globales",
        shortTitle: "Panel de Control",
        badge: "/gerencia/dashboard",
        route: "/gerencia/dashboard",
        description:
          "Tablero de mando con indicadores clave de rendimiento del negocio.",
        containers: [
          {
            name: "Tarjetas de Métricas Globales",
            purpose: "Pulso del negocio en tiempo real.",
            metricsOrDataShown: [
              "Facturación Total Acumulada del período.",
              "Cantidad Total de Pedidos atendidos.",
              "Ticket Promedio por compra.",
              "Clientes Activos y recurrentes.",
              "Gráficos de ventas por canal (Web vs Mostrador vs Delivery) y distribución de horas pico."
            ]
          }
        ]
      },
      {
        title: "Finanzas y Rentabilidad (Explicación de Contenedores y Pestañas)",
        shortTitle: "Finanzas (Contenedores)",
        badge: "/gerencia/finanzas",
        route: "/gerencia/finanzas",
        description:
          "Centro neurálgico económico del negocio con cálculo automático de costos de mercadería, gastos fijos, punto de equilibrio y superávit/déficit neto.",
        containers: [
          {
            name: "Contenedor 1: Facturación Bruta (Devengada)",
            purpose: "Total económico de todas las ventas emitidas en el período seleccionado.",
            metricsOrDataShown: [
              "Monto en pesos de todas las órdenes (pagadas y fiadas).",
              "Etiqueta de Crecimiento %: Comparativa contra el mes inmediatamente anterior (▲ verde o ▼ rojo).",
              "Alerta de Saldos Pendientes: Desglose en rojo de fiados/deudores pendientes de cobro."
            ],
            interpretationTip: "Si la facturación bruta es alta pero hay mucho saldo en 'Pendiente de cobro', significa que hay demasiado dinero en la calle que debe gestionarse en Deudores."
          },
          {
            name: "Contenedor 2: Efectivo Ingresado (Cobrado)",
            purpose: "Dinero que realmente ingresó a la caja o cuentas bancarias del negocio.",
            metricsOrDataShown: [
              "Monto neto cobrado en pesos.",
              "Badge de efectividad de cobranza (%): Relación entre lo cobrado y lo facturado.",
              "Etiqueta de Crecimiento % respecto al mes anterior."
            ],
            interpretationTip: "Representa el flujo de fondos real disponible para hacer frente a compras y gastos."
          },
          {
            name: "Contenedor 3: Costos + Gastos (Total de Egresos)",
            purpose: "Cálculo global de todas las salidas de dinero y consumo de materia prima del negocio.",
            metricsOrDataShown: [
              "Monto total en pesos de egresos.",
              "Composición: Costo de Mercadería Vendida (CMV) + Gastos Fijos + Gastos Variables."
            ],
            interpretationTip: "Permite dimensionar la estructura de costos total de la pizzería."
          },
          {
            name: "Contenedor 4: Margen Bruto (Mercadería)",
            purpose: "Ganancia directa generada por la venta de productos antes de pagar gastos de estructura.",
            metricsOrDataShown: [
              "Monto en pesos (Ingresos Cobrados menos CMV).",
              "Porcentaje de Margen Bruto sobre ventas.",
              "Fórmula: Margen = (Cobrado - CMV) / Cobrado * 100."
            ],
            interpretationTip: "Muestra si los precios de venta son saludables en relación al costo de los ingredientes."
          },
          {
            name: "Contenedor 5: Ganancia Neta (Superávit / Déficit)",
            purpose: "Resultado final de explotación del negocio tras absorber todos los gastos.",
            metricsOrDataShown: [
              "Monto final neto en pesos.",
              "Rótulo dinámico: 'Ganancia Neta (Superávit)' en verde si es positivo, o 'Resultado Neto (Déficit)' en rojo si es negativo.",
              "Porcentaje de Margen Neto final.",
              "Badge de evolución % mensual."
            ],
            interpretationTip: "Es el dinero limpio que genera la empresa para reinversión o retiro de socios."
          },
          {
            name: "Contenedor 6: Estructura de Egresos (Barra Segmentada)",
            purpose: "Desglose porcentual y visual de adónde se va el dinero.",
            metricsOrDataShown: [
              "Barra horizontal interactiva tricolor (Ámbar = CMV, Azul = Fijos, Violeta = Variables).",
              "Costo de Mercadería (CMV): Materia prima directa consumida en las pizzas vendidas.",
              "Gastos Fijos: Alquiler, sueldos fijos, servicios, internet, abonos.",
              "Gastos Variables: Envases, bolsas, comisiones, fletes, reparaciones imprevistas."
            ]
          },
          {
            name: "Contenedor 7: Cobranzas por Medio de Pago",
            purpose: "Distribución del dinero según el canal de cobro utilizado.",
            metricsOrDataShown: [
              "Efectivo ($ y cantidad de transacciones).",
              "Mercado Pago / QR ($ y transacciones).",
              "Transferencia Bancaria ($ y transacciones).",
              "Tarjetas de Crédito / Débito (con recargo del 15% aplicado)."
            ]
          },
          {
            name: "Contenedor 8: Indicadores Clave y Punto de Equilibrio",
            purpose: "Brújula de supervivencia y metas de facturación.",
            metricsOrDataShown: [
              "Ticket Promedio por pedido ($).",
              "Tasa de Absorción de Gastos (% de los ingresos que se destinan a pagar costos).",
              "Punto de Equilibrio ($): Facturación exacta necesaria para cubrir los costos fijos y no perder dinero.",
              "Avance hacia el Punto de Equilibrio (%): Porcentaje de la meta mensual cubierta hasta la fecha."
            ]
          },
          {
            name: "Contenedor 9: Gráfico de Evolución Semanal",
            purpose: "Seguimiento semana por semana del mes.",
            metricsOrDataShown: [
              "Comparativa de barras entre Ingresos Cobrados (azul) y Egresos Totales (rojo) para las semanas 1, 2, 3 y 4+ del período."
            ]
          }
        ],
        fieldsAndCheckboxes: [
          {
            name: "Pestaña 'Gastos y Egresos' - Botón 'Nuevo Gasto'",
            type: "button",
            required: true,
            description: "Abre la ventana para registrar compras, pagos de servicios o sueldos.",
            effect: "Abre el formulario de carga de gastos."
          },
          {
            name: "Campo Concepto del Gasto",
            type: "text",
            required: true,
            description: "Descripción del gasto realizado.",
            exampleOrOptions: "Alquiler Local Central | 50kg Harina 000 | Factura Edenor | Bolsas delivery",
            effect: "Identifica el movimiento en el libro diario de gastos."
          },
          {
            name: "Campo Importe del Gasto ($)",
            type: "number",
            required: true,
            description: "Monto total abonado en pesos.",
            exampleOrOptions: "150000",
            effect: "Suma al total de egresos y recalcula la ganancia neta."
          },
          {
            name: "Selector de Tipo de Gasto (Fijo vs Variable)",
            type: "select",
            required: true,
            description: "Clasificación contable del gasto.",
            exampleOrOptions: "Fijo (alquiler, abonos) | Variable (mercadería extra, descartables)",
            effect: "Los fijos alimentan el cálculo del Punto de Equilibrio; los variables se imputan al costo operacional."
          },
          {
            name: "Selector de Categoría del Gasto",
            type: "select",
            required: true,
            description: "Rubro del egreso.",
            exampleOrOptions: "Proveedores y Mercadería | Servicios e Impuestos | Sueldos y Honorarios | Mantenimiento | Varios",
            effect: "Permite emitir reportes por rubro."
          },
          {
            name: "Selector de Estado del Gasto (Pagado vs Pendiente)",
            type: "select",
            required: true,
            description: "Define si el dinero ya salió de caja o si es una factura por pagar a plazo.",
            exampleOrOptions: "Pagado | Pendiente de Pago",
            effect: "Los pendientes no descuentan flujo de caja inmediato pero sí devengan costo."
          },
          {
            name: "Pestaña 'Costos de Producto (CMV)' - Edición Rápida",
            type: "number",
            required: false,
            description: "Permite cambiar el costo de materia prima de cada pizza o producto directamente en la tabla.",
            effect: "Actualiza el CMV histórico y recalcula el margen bruto de todas las ventas de ese producto."
          }
        ],
        tips: [
          "Si la ganancia neta es negativa, revisar el Punto de Equilibrio para saber cuántas pizzas más faltan vender en el mes para ingresar en zona de ganancia."
        ]
      },
      {
        title: "Creación y Edición de Productos (Campo por Campo, Check por Check)",
        shortTitle: "Crear Producto",
        badge: "/gerencia/catalogo/productos",
        route: "/gerencia/catalogo/productos",
        description:
          "Guía detallada de todos los campos, selectores y casillas de verificación presentes en la ventana de creación y modificación de productos.",
        fieldsAndCheckboxes: [
          {
            name: "Nombre del Producto",
            type: "text",
            required: true,
            description: "Nombre comercial del producto que verá el cliente y los cocineros.",
            exampleOrOptions: "Pizza Napolitana Especial | Docena de Empanadas de Carne",
            effect: "Obligatorio. Se muestra en el catálogo web, monitor de cocina, recibos y reportes de ventas."
          },
          {
            name: "Descripción Comercial e Ingredientes",
            type: "text",
            required: false,
            description: "Detalle de ingredientes, preparación y presentación.",
            exampleOrOptions: "Salsa de tomate casera, muzzarella premium, rodajas de tomate natural, ajo y albahaca fresca.",
            effect: "Aparece debajo del producto en el catálogo web para seducir al comprador."
          },
          {
            name: "Categoría y Subcategoría",
            type: "select",
            required: true,
            description: "Asigna el producto dentro del árbol del menú del negocio.",
            exampleOrOptions: "Categoría Padre: Pizzas ➔ Subcategoría: Especiales",
            effect: "Agrupa el producto en los filtros de la web y en el punto de venta de recepción."
          },
          {
            name: "Tipo de Venta",
            type: "select",
            required: true,
            description: "Define la mecánica de comercialización del producto.",
            exampleOrOptions: "Unidad (pizzas/bebidas) | Docena (empanadas con 1/2 y docena) | Combo (promoción cerrada) | Quadra (por metro con filas)",
            effect: "Habilita los campos de precio y configuración específicos de esa modalidad."
          },
          {
            name: "Precio de Venta por Unidad ($)",
            type: "number",
            required: true,
            description: "Precio unitario final de venta al público en salón y web.",
            exampleOrOptions: "7800",
            effect: "Es el valor base que se carga al carrito cuando el cliente pide 1 unidad."
          },
          {
            name: "Precio por Media Docena ($) y Docena ($)",
            type: "number",
            required: false,
            description: "Precios especiales por 6 y 12 unidades (habilitados si el tipo de venta es Docena).",
            exampleOrOptions: "Media Docena: $5.000 | Docena: $9.500",
            effect: "Aplica descuentos por volumen automáticamente cuando el cliente elige esos formatos."
          },
          {
            name: "Costo de Materia Prima por Unidad ($)",
            type: "number",
            required: false,
            description: "Costo de insumos e ingredientes necesarios para fabricar una unidad.",
            exampleOrOptions: "2800",
            effect: "Se utiliza en Finanzas para calcular el Costo de Mercadería Vendida (CMV) y el Margen Bruto del negocio."
          },
          {
            name: "Casilla [✓] 'Producto en Oferta / Promoción'",
            type: "checkbox",
            required: false,
            description: "Indica si el producto está en descuento especial.",
            exampleOrOptions: "[x] Tildado ➔ Habilita campo 'Precio Anterior Tachado'",
            effect: "Muestra una cinta roja de 'OFERTA' en la tienda web con el precio tachado al lado del precio actual."
          },
          {
            name: "Campo 'Precio Anterior Tachado ($)'",
            type: "number",
            required: false,
            description: "Precio antiguo que se muestra tachado para destacar el ahorro.",
            exampleOrOptions: "9500 (tachado) ➔ Precio actual: 7800",
            effect: "Aumenta la tasa de conversión en la tienda web."
          },
          {
            name: "Casilla [✓] 'Stock Disponible (En Stock)'",
            type: "checkbox",
            required: false,
            description: "Control de disponibilidad inmediata para venta.",
            exampleOrOptions: "[x] Activo: Se vende normalmente / [ ] Desmarcado: Sin stock",
            effect: "Si está desmarcado, el producto desaparece automáticamente del catálogo web y se bloquea en recepción."
          },
          {
            name: "Check 'Requiere Cocina (Salteo Automático de Cocina)'",
            type: "checkbox",
            required: false,
            description: "Define si el producto requiere elaboración en horno o cocina.",
            exampleOrOptions: "[x] Tildado para pizzas, empanadas y lomos / [ ] Desmarcado para gaseosas, cervezas y postres",
            effect: "Si se desmarca, las comandas que contengan este producto saltean la pantalla de cocina y pasan directo a 'Listos'."
          },
          {
            name: "Selector de Imagen (Subir Archivo vs Enlace URL)",
            type: "file",
            required: false,
            description: "Permite subir una foto local o pegar un link de imagen de alta resolución.",
            exampleOrOptions: "Cargar archivo WebP/PNG o pegar URL https://...",
            effect: "Muestra la fotografía en el menú web del cliente."
          },
          {
            name: "Configuración Quadra (Filas Fijas vs Personalizables)",
            type: "select",
            required: false,
            description: "Para pizzas por metro: define cuántas filas tienen sabor impuesto y cuántas puede elegir el cliente.",
            exampleOrOptions: "Filas Fijas: 1 (Muzzarella) | Filas Personalizables: 2 (a elección del cliente)",
            effect: "Genera los selectores de sabores correspondientes en la ventana de compra."
          },
          {
            name: "Lista de Variedades y Sabores Propios",
            type: "button",
            required: false,
            description: "Tabla para sumar las opciones de sabor disponibles con sus nombres y adicionales.",
            exampleOrOptions: "Carne Suave, Jamón y Queso, Pollo al Verdeo, Roquefort",
            effect: "Alimenta la lista de opciones que el cliente puede tildar."
          }
        ],
        steps: [
          "Ingresar a Gerencia ➔ Catálogo ➔ Productos.",
          "Hacer clic en el botón superior '+ Nuevo Producto'.",
          "Ingresar Nombre y Descripción.",
          "Seleccionar Categoría y Tipo de Venta.",
          "Ingresar Precios de Venta y Costos de Producción.",
          "Verificar el casilla 'Requiere Cocina' (marcar si lleva horno, desmarcar si es bebida).",
          "Marcar la casilla 'Producto en Oferta' si se desea destacar con precio anterior tachado.",
          "Seleccionar la imagen del producto.",
          "Si es Quadra o Docena, configurar filas o variedades.",
          "Hacer clic en 'Guardar Producto'. Quedará activo de inmediato en todo el ERP."
        ]
      },
      {
        title: "Gestión de Personal y Seguridad (Usuarios)",
        shortTitle: "Usuarios y Seguridad",
        badge: "/gerencia/usuarios",
        route: "/gerencia/usuarios",
        description:
          "Control de accesos y roles del equipo de trabajo.",
        containers: [
          {
            name: "Directorio de Usuarios",
            purpose: "Alta, baja y modificación de permisos de empleados.",
            metricsOrDataShown: [
              "Nombre y apellido del empleado.",
              "Rol asignado: Gerente, Cajero, Cocinero o Repartidor.",
              "PIN de 4 dígitos asignado para ingreso táctil en terminales.",
              "Estado activo/inactivo."
            ],
            controlsOrButtons: [
              "Botón '+ Nuevo Usuario': Crea un perfil de acceso.",
              "Botón Editar PIN: Actualiza la clave de 4 dígitos.",
              "Botón Desactivar / Eliminar: Revoca el acceso al sistema."
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. SEGUIMIENTO EN VIVO PARA EL CLIENTE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "tracking",
    title: "6. Seguimiento en Vivo para el Cliente (/estado-pedido)",
    shortTitle: "Seguimiento",
    roleBadge: "Clientes & Repartidores",
    roleColor: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/30",
      glow: "shadow-rose-500/10",
      accent: "#f43f5e",
    },
    iconName: "Clock",
    route: "/estado-pedido?id=demo",
    displayRoute: "/estado-pedido?id=[id]",
    summary:
      "Portal público interactivo para que el cliente siga la elaboración y viaje de su comanda en tiempo real desde su celular, sin necesidad de llamar por teléfono.",
    sections: [
      {
        title: "Línea de Tiempo y Sincronización en Tiempo Real",
        shortTitle: "Seguimiento en Vivo",
        badge: "Seguimiento en Vivo",
        route: "/estado-pedido",
        description:
          "Pantalla con barra de progreso animada de 4 etapas que avanza automáticamente cuando el personal mueve la orden en el ERP.",
        containers: [
          {
            name: "Línea de Progreso de 4 Pasos",
            purpose: "Mantener informado al cliente con textos cálidos y animados.",
            metricsOrDataShown: [
              "Paso 1: ¡Pedido Confirmado! (Recibimos tu pedido en el sistema).",
              "Paso 2: ¡Manos a la Obra! (O '¡Preparando tus Bebidas!' si no lleva horno).",
              "Paso 3: ¡En Camino! (Con icono de moto para delivery) o ¡Listo para Retirar! (con icono de local para retiro en mostrador).",
              "Paso 4: ¡Entregado! (Comanda finalizada con éxito)."
            ],
            interpretationTip: "La barra tiene sincronización reactiva por almacenamiento: el cliente no necesita recargar la página; el camión y los íconos se iluminan solos al cambiar de estado."
          },
          {
            name: "Detalle del Pedido y Cobranza",
            purpose: "Comprobante de lo que el cliente pidió y pagó.",
            metricsOrDataShown: [
              "Lista completa de pizzas, docenas, bebidas y extras con cantidades.",
              "Subtotal productos, costo de flete por barrio y recargo de tarjeta (15%).",
              "TOTAL A PAGAR destacado.",
              "Dirección de entrega o indicación de retiro en sucursal."
            ]
          }
        ],
        tips: [
          "El enlace es compatible con todos los navegadores móviles y se genera con la sintaxis universal /estado-pedido?id=ID&data=... para abrirse al instante desde cualquier WhatsApp."
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. FLUJO COMPLETO DE UNA COMANDA
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: "flujo",
    title: "7. Flujo Integral de una Comanda (De Punta a Punta)",
    shortTitle: "Flujo de Orden",
    roleBadge: "Visión Global",
    roleColor: {
      bg: "bg-indigo-500/10",
      text: "text-indigo-400",
      border: "border-indigo-500/30",
      glow: "shadow-indigo-500/10",
      accent: "#6366f1",
    },
    iconName: "Layers",
    route: "/manual-de-uso",
    displayRoute: "Flujo Integral",
    summary:
      "Ciclo de vida operativo completo que recorre una orden desde que nace en la web o recepción hasta que se entrega, cobra y audita en los reportes de finanzas.",
    sections: [
      {
        title: "Paso a Paso del Flujo Operativo",
        shortTitle: "Ciclo Paso a Paso",
        badge: "Ciclo de Vida",
        description:
          "Secuencia cronológica que conecta todos los módulos del sistema Quadra Pizza ERP.",
        steps: [
          "Paso 1: El cliente envía su pedido desde el catálogo web por WhatsApp o el cajero lo toma en Recepción (Nueva Venta).",
          "Paso 2: La orden recibe un ID único (#YYMMDD-XXX) y el cliente recibe su link de seguimiento en vivo (/estado-pedido?id=...).",
          "Paso 3: Si contiene pizzas o empanadas, la comanda aparece al instante en el Monitor de Cocina de Cocina con cronómetro y notas en amarillo. (Si es solo bebidas, saltea cocina directo a Listo).",
          "Paso 4: El pizzero toma la orden ('En Preparación') y al sacarla del horno presiona 'Listo'. El tracking del cliente avanza solo.",
          "Paso 5: Si es con envío, el repartidor la ve en 'Mis Viajes', presiona 'Iniciar Viaje' y la lleva al domicilio con ayuda del mapa GPS y botón de llamada telefónica.",
          "Paso 6: El repartidor cobra en puerta si estaba impaga y toca 'Confirmar Entrega'.",
          "Paso 7: El cajero realiza el arqueo en Cierre de Caja y el Gerente audita en Finanzas el ingreso, el costo de mercadería (CMV) y la ganancia neta generada."
        ],
        tips: [
          "Este circuito sincronizado elimina errores de comunicación entre cajeros, cocineros y repartidores, reduciendo los tiempos de espera a menos de la mitad."
        ]
      }
    ]
  }
];
