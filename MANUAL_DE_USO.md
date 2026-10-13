# 📖 Manual de Uso Integral del Sistema ERP - Quadra Pizza

Bienvenido al **Manual de Uso Oficial de Quadra Pizza ERP**. Este documento es una guía exhaustiva que detalla el funcionamiento, arquitectura, módulos, pantallas, botones y flujos de trabajo de todo el ecosistema operativo de la pizzería.

---

## 📑 Tabla de Contenidos

1. [Visión General y Arquitectura del Sistema](#1-visión-general-y-arquitectura-del-sistema)
2. [Roles de Acceso y Credenciales](#2-roles-de-acceso-y-credenciales)
3. [Módulo 1: Catálogo Online y Tienda Web para Clientes](#3-módulo-1-catálogo-online-y-tienda-web-para-clientes)
4. [Módulo 2: Recepción y Punto de Venta (POS)](#4-módulo-2-recepción-y-punto-de-venta-pos)
   - 4.1 [Nueva Venta y Creación de Pedidos](#41-nueva-venta-y-creación-de-pedidos)
   - 4.2 [Estado de Pedidos (Tablero Kanban de Recepción)](#42-estado-de-pedidos-tablero-kanban-de-recepción)
   - 4.3 [Base de Clientes](#43-base-de-clientes)
   - 4.4 [Control de Stock de Insumos](#44-control-de-stock-de-insumos)
   - 4.5 [Administración del Catálogo](#45-administración-del-catálogo)
   - 4.6 [Cierre de Caja del Turno](#46-cierre-de-caja-del-turno)
5. [Módulo 3: Cocina y KDS (Kitchen Display System)](#5-módulo-3-cocina-y-kds-kitchen-display-system)
   - 5.1 [Monitor de Comandas en Vivo](#51-monitor-de-comandas-en-vivo)
   - 5.2 [Visor de Stock Crítico de Insumos](#52-visor-de-stock-crítico-de-insumos)
6. [Módulo 4: Delivery y Repartidores](#6-módulo-4-delivery-y-repartidores)
   - 6.1 [Flujo de Despacho y Pestañas de Turno](#61-flujo-de-despacho-y-pestañas-de-turno)
   - 6.2 [Navegación GPS, Cobranzas y Entrega](#62-navegación-gps-cobranzas-y-entrega)
7. [Módulo 5: Gerencia y Administración Estratégica](#7-módulo-5-gerencia-y-administración-estratégica)
   - 7.1 [Dashboard Ejecutivo e Indicadores Clave (KPIs)](#71-dashboard-ejecutivo-e-indicadores-clave-kpis)
   - 7.2 [Historial y Auditoría de Ventas](#72-historial-y-auditoría-de-ventas)
   - 7.3 [Finanzas, Gastos, CMV y Cierres Históricos](#73-finanzas-gastos-cmv-y-cierres-históricos)
   - 7.4 [Gestión de Personal y Seguridad (Usuarios y PINs)](#74-gestión-de-personal-y-seguridad-usuarios-y-pins)
8. [Módulo 6: Seguimiento en Vivo del Pedido para el Cliente (Tracking)](#8-módulo-6-seguimiento-en-vivo-del-pedido-para-el-cliente-tracking)
   - 8.1 [Línea de Tiempo y Estados en Tiempo Real](#81-línea-de-tiempo-y-estados-en-tiempo-real)
   - 8.2 [Comprobante y Ticket Virtual Imprimible](#82-comprobante-y-ticket-virtual-imprimible)
9. [Flujo Integral del Pedido (Paso a Paso de Extremo a Extremo)](#9-flujo-integral-del-pedido-paso-a-paso-de-extremo-a-extremo)

---

## 1. Visión General y Arquitectura del Sistema

El ERP de **Quadra Pizza** está diseñado como una plataforma integrada de alta disponibilidad, pensada para sincronizar en tiempo real todas las etapas de un local gastronómico moderno:
1. **Atención al Cliente**: Autogestión del pedido mediante catálogo digital web y WhatsApp.
2. **Recepción y Caja**: Facturación rápida, control de clientes, cálculo de vueltos y despacho.
3. **Cocina (KDS)**: Pantalla de comandas táctil que reemplaza el papel y minimiza demoras.
4. **Logística y Delivery**: Aplicación móvil para repartidores con geolocalización y control de cobro en mano.
5. **Seguimiento para el Cliente**: Enlace dinámico que informa en vivo el estado exacto de su comida.
6. **Gerencia**: Monitoreo analítico del negocio, curvas de venta, gastos operativos, rentabilidad y CMV.

```
                    ┌──────────────────────────────────────────────┐
                    │      CATÁLOGO WEB PÚBLICO (Cliente)          │
                    │   Pedidos online enviados por WhatsApp       │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 RECEPCIÓN (Caja / POS)                                 │
│  - Carga pedidos de salón, teléfono o WhatsApp                                         │
│  - Calcula vueltos, medios de pago y costos de delivery                                │
│  - Emite enlace de seguimiento al cliente y envía comanda a cocina                    │
└──────────────────────────┬─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              COCINA (Monitor KDS)                                      │
│  - Recepciona comanda en tiempo real con temporizador de demoras                       │
│  - Avanza: Confirmado ➔ En Preparación ➔ Listo para despacho                           │
└──────────────────────────┬─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────┬────────────────────────────────────┐
│          DELIVERY (Módulo Repartidores)           │          RETIRO EN LOCAL           │
│  - Toma pedido de "A Retirar"                     │  - Cliente retira en mostrador     │
│  - Navegación GPS a destino                       │  - Cajero marca como entregado     │
│  - Cobro en puerta y confirmación de entrega      │                                    │
└──────────────────────────┬────────────────────────┴────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      TRACKING EN VIVO (Para el Cliente)                                │
│  - Visualización del estado en tiempo real (Confirmado / Horno / Camino / Entregado)   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Roles de Acceso y Credenciales

El sistema protege las secciones operativas mediante un inicio de sesión numérico de **PIN de 4 dígitos**, diseñado para ser veloz y operable mediante pantallas táctiles:

| Rol | Ruta de Ingreso | Permisos y Alcance |
| :--- | :--- | :--- |
| **Cliente (Público)** | `/` y `/estado-pedido/[id]` | Acceso libre sin contraseña. Consulta catálogo, arma carritos y realiza seguimiento de su pedido. |
| **Recepción** | `/recepcion/login` | Carga de ventas, Kanban de pedidos, base de clientes, inventario de insumos, administración de catálogo y cierre de caja diario. |
| **Cocina** | `/cocina/login` | Pantalla KDS para ver comandas en preparación, avanzar estados y consultar stock crítico de insumos. |
| **Delivery** | `/delivery/login` | Gestión de salidas, toma de viajes listos, navegación GPS, validación de cobranzas y confirmación de entrega. |
| **Gerencia** | `/gerencia/login` | Dashboard ejecutivo de métricas, análisis financiero (ingresos, CMV, gastos fijos/variables, márgenes), gestión de usuarios y personal. |

---

## 3. Módulo 1: Catálogo Online y Tienda Web para Clientes

**Ruta pública:** `/`

El catálogo web permite a los clientes navegar por los productos de Quadra Pizza desde cualquier celular, tablet o computadora, armar su pedido a medida y enviarlo directamente al WhatsApp oficial del local.

### 3.1 Cabecera (Header)
- **Logo y Marca Quadra Pizza**: Al hacer clic recarga la tienda o regresa al inicio del catálogo.
- **Botón del Carrito flotante/superior**:
  - Muestra un ícono de bolsa de compras con una insignia (*badge*) que indica en tiempo real la cantidad de productos cargados.
  - Al presionarlo, abre el panel lateral derecho del pedido (`CartSidebar`).

### 3.2 Buscador en Tiempo Real
- **Barra de Búsqueda**:
  - Al ingresar al menos 3 caracteres, filtra al instante todos los productos cuyo nombre o descripción coincidan con el texto ingresado.
  - Permite localizar rápidamente pizzas específicas, sabores de empanadas, postres o bebidas.

### 3.3 Secciones Destacadas
La página principal organiza el menú en carruseles y secciones atractivas:
- **En Oferta**: Productos en promoción especial identificados con una etiqueta roja de "OFERTA" y precio rebajado.
- **Menú del Día**: Platos recomendados del día con precios preferenciales.
- **Déjate Tentar**: Productos adicionales, postres y complementos de almacén pensados para aumentar el ticket medio.
- **Bebidas**: Gaseosas, cervezas, aguas y jugos disponibles.

### 3.4 Catálogo Completo y Filtros por Categoría
- **Pestañas de Categoría Superior (Nivel 1)**: Botones como "Todos", "Pizzas", "Empanadas", "Bebidas", "Postres", etc.
- **Subcategorías (Nivel 2)**: Al seleccionar una categoría que posee subdivisiones, se despliega una barra secundaria para afinar la búsqueda.
- **Tarjetas de Producto**:
  - Imagen del producto en alta definición.
  - Título y descripción de ingredientes.
  - Precio formateado en Pesos Argentinos ($ ARS).
  - Indicador de tipo de venta (por unidad, por docena, combo o Quadra).
  - Botón táctil para configurar y agregar.

### 3.5 Modal de Personalización del Producto (`AddToCartModal`)
Al hacer clic sobre cualquier producto, se despliega una ventana interactiva según el tipo de producto:
1. **Selector de Formato / Unidades**:
   - Para empanadas o productos fraccionables: botones para elegir **Por Unidad**, **Media Docena** o **Docena**, recalculando el precio automáticamente.
2. **Selección de Sabores (Quadra Pizza)**:
   - Permite combinar distintos sabores dentro de la misma pizza rectangular:
   - **Filas Fijas**: Muestra los sabores fijos que incluye la promo.
   - **Filas Personalizables**: Desplegables individuales por cada fila para seleccionar entre las variedades disponibles en stock (Muzzarella, Jamón y Morrones, Fugazza, Calabresa, etc.).
3. **Variedades Específicas**: Selector para elegir variedades simples o especiales (con o sin costo extra).
4. **Extras y Agregados**:
   - Lista de adicionales compatibles (Faina, Huevo duro extra, Queso extra, Aceitunas extra, Salsas, etc.).
   - Casilla de verificación (*checkbox*) con indicación clara del costo adicional (`+$XXX`).
5. **Selector de Cantidad**: Botones de `+` y `-` para definir cuántas unidades o docenas se añaden.
6. **Botón "Agregar al Pedido"**: Incorpora la selección al carrito y cierra la ventana.

### 3.6 Carrito de Compras y Checkout por WhatsApp (`CartSidebar`)
Al abrir el carrito se presentan dos pasos guiados:

#### Paso 1: Tu Pedido
- Lista pormenorizada de los ítems seleccionados.
- Cada tarjeta muestra:
  - Imagen, nombre del producto y formato (unidad/docena).
  - Detalle de sabores elegidos y extras seleccionados.
  - Controles de cantidad `+` y `-` para modificar sobre la marcha.
  - Botón con ícono de papelera para eliminar el ítem.
  - Subtotal parcial por ítem y Subtotal acumulado general.
- Botón **"Continuar Pedido"**: Pasa al paso de datos de entrega.

#### Paso 2: Detalles de Entrega y Pago
- **Datos del Cliente**:
  - *Nombre* (obligatorio) y *Apellido*.
- **Método de Entrega**:
  - **🏠 Retiro en el local**: No tiene costo de envío adicional.
  - **🛵 Envío a domicilio**: Al seleccionarlo, se despliegan los campos de entrega:
    - *Selector de Barrio / Zona*: Menú desplegable con los barrios habilitados y su respectivo costo de delivery (ej: Nueva Córdoba +$1.500, General Paz +$1.800).
    - *Dirección*: Calle y número (obligatorio).
    - *Detalles*: Piso, departamento, timbre o indicaciones para el repartidor.
- **Método de Pago**:
  - **Efectivo**: Sin recargo.
  - **Transferencia**: Sin recargo.
  - **Tarjeta de crédito**: Aplica automáticamente un recargo financiero del 15% sobre el total, visualizado claramente en el resumen.
- **Resumen Financiero**:
  - Subtotal de productos.
  - Costo de envío (si aplica).
  - Recargo por tarjeta (si aplica).
  - **TOTAL FINAL**: Importe neto a abonar.
- **Botón "Confirmar y Enviar por WhatsApp"**:
  - Valida que los datos obligatorios estén completos.
  - Redacta un mensaje formateado en Markdown con todo el detalle del pedido, dirección, forma de pago y totales.
  - Abre automáticamente la aplicación de WhatsApp o WhatsApp Web conectado al número oficial del local para despachar el mensaje.

---

## 4. Módulo 2: Recepción y Punto de Venta (POS)

**Ruta:** `/recepcion`  
**Acceso:** PIN de 4 dígitos en `/recepcion/login`.

Es el centro operativo de la caja y atención al cliente. Permite cargar pedidos de mostrador, registrar llamadas telefónicas, validar pagos, monitorear el flujo de comandas, administrar clientes y realizar el cierre de caja del turno.

### Barra de Navegación Superior
- **Logo y Marca**: Identificador "Recepción" en tono azul celeste.
- **Reloj Digital en Vivo**: Hora oficial argentina para control estricto de turnos.
- **Enlaces de Sección**:
  - Nueva Venta (`/recepcion/nueva-venta`)
  - Estado Pedidos (`/recepcion/estado-pedidos`)
  - Deudores (`/recepcion/deudores`) ⚠️
  - Clientes (`/recepcion/clientes`)
  - Stock (`/recepcion/stock`)
  - Catálogo (`/recepcion/catalogo`)
  - Cierre de Caja (`/recepcion/cierre-caja`)
- **Usuario Activo**: Muestra el nombre y avatar del cajero en turno.
- **Botón Cerrar Sesión (LogOut)**: Finaliza la sesión de recepción y regresa a la pantalla de PIN.

---

### 4.1 Nueva Venta y Creación de Pedidos (`/recepcion/nueva-venta`)

Diseñada para que el cajero cargue una comanda en menos de 30 segundos.

```
┌──────────────────────────────────────────────┬───────────────────────────────┐
│               CATÁLOGO TÁCTIL                │         PEDIDO ACTUAL         │
│  [ Buscar producto...                      ] │  Cliente: Sin asignar         │
│  [Todos] [Pizzas] [Empanadas] [Bebidas]      │  ───────────────────────────  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐      │  1x Pizza Muzzarella  $9.500  │
│  │ Foto     │ │ Foto     │ │ Foto     │      │     [Nota] [ - 1 + ] [Elim]   │
│  │ Pizza Muz│ │ Empanadas│ │ Coca Cola│      │  ───────────────────────────  │
│  │ $9.500   │ │ $1.200   │ │ $2.500   │      │  Subtotal:           $9.500   │
│  └──────────┘ └──────────┘ └──────────┘      │  [   CONFIRMAR PEDIDO   ]     │
└──────────────────────────────────────────────┴───────────────────────────────┘
```

#### Pantalla Principal de Nueva Venta
1. **Buscador de Productos**: Filtro instantáneo por texto.
2. **Pestañas de Categoría (Nivel 1 y Nivel 2)**: Navegación veloz entre familias de productos.
3. **Grilla de Artículos**: Tarjetas táctiles grandes que muestran imagen, nombre, precio y tipo de venta.
4. **Modal de Configuración**: Al tocar un producto configurable, permite elegir unidades (1/2 docena o docena), seleccionar filas de sabores de Quadra, elegir variedades y marcar extras.
5. **Panel Lateral del "Pedido Actual"**:
   - Lista de productos añadidos con sus cantidades, sabores y adicionales.
   - **Botón de Nota para Cocina (Ícono de Mensaje)**: Permite añadir aclaraciones puntuales por producto (ejemplo: *"bien cocida"*, *"sin aceitunas"*, *"cebolla aparte"*). La nota aparecerá destacada en amarillo en la pantalla de cocina.
   - **Botón de Eliminación (Papelera)** y Controles `+` / `-`.
   - **Subtotal acumulado**.
   - **Botón "Confirmar Pedido"**: Abre la ventana de cierre de orden.

#### Modal de Finalización y Envío de la Orden
Al presionar "Confirmar Pedido" se abre una ventana con los siguientes controles:
- **Autocompletado Inteligente de Clientes**:
  - Al ingresar al menos 2 letras del nombre o 2 dígitos del teléfono, el sistema despliega un menú con sugerencias de clientes ya registrados en la base de datos.
  - Al tocar un cliente sugerido, se completan automáticamente el nombre, apellido, teléfono, dirección y barrio habituales.
- **Método de Entrega**:
  - Botón **🏠 Retiro en local**.
  - Botón **🛵 Envío a domicilio**: Despliega el selector de Barrio/Zona (con su costo asociado), campo de Calle/Altura y campo de Detalles adicionales (piso, dpto).
- **Método de Pago**:
  - Botones de selección rápida: **Efectivo**, **Transferencia**, **Tarjeta de crédito** (calcula 15% de recargo).
- **Estado del Pago**:
  - Botón **Pendiente / A cobrar**: Para pedidos que se cobran contra entrega en efectivo o tarjeta con posnet móvil.
  - Botón **Ya pagado**: Para transferencias verificadas en el momento o pagos anticipados en caja.
- **Calculadora de Vuelto en Efectivo**:
  - Si el pago es en efectivo y está pendiente, aparece el campo **"Dinero recibido"**.
  - Al ingresar el monto con el que abona el cliente (ej: $20.000), el sistema calcula y muestra en color verde brillante el **"Vuelto a entregar"** exacto.
- **Resumen Final**: Desglose de subtotal, costo de envío, recargos y Total general.
- **Botón "Enviar a Cocina"**:
  - Genera el pedido con un identificador único numérico (ej: `#104`).
  - Envía la comanda instantáneamente al Monitor KDS de Cocina.
  - Asigna la venta al cajero logueado para la rendición de caja.

#### Pantalla de Confirmación Exitosa
Tras enviar a cocina, se presenta una pantalla de confirmación con tres botones estratégicos:
1. **Copiar enlace de seguimiento**: Copia al portapapeles la URL pública de tracking para pegarla en cualquier chat.
2. **Enviar por WhatsApp**: Abre directamente WhatsApp con un mensaje predeterminado que contiene el saludo y el link de seguimiento en vivo listo para enviar al cliente.
3. **Nuevo Pedido**: Limpia el carrito y prepara la pantalla para la siguiente comanda.

---

### 4.2 Estado de Pedidos (Tablero Kanban de Recepción) (`/recepcion/estado-pedidos`)

Monitor visual en tiempo real que organiza todos los pedidos del turno en un flujo de 5 etapas:

```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ CONFIRMADOS  │  EN COCINA   │    LISTOS    │  EN CAMINO   │ COMPLETADOS  │
│     (3)      │     (2)      │     (1)      │     (2)      │     (14)     │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ #104 [Envío] │ #102 [Local] │ #101 [Envío] │ #99  [Envío] │ #98 [Local]  │
│ Juan Pérez   │ María Gómez  │ Lucas Díaz   │ Pedro V.     │ Ana Clara    │
│ 15' ⚠️       │ 8'           │ 22' 🔥       │ 12'          │ 45'          │
│ $18.500      │ $9.200       │ $14.000      │ $21.000      │ $8.400       │
│ [⚠️ IMPAGO]  │ [✓ PAGADO]   │ [⚠️ IMPAGO]  │ [✓ PAGADO]   │ [⚠️ IMPAGO]  │
│ [Ver Más]    │ [Ver Más]    │ [Ver Más]    │ [Ver Más]    │ [Ver Más]    │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

#### Identidad Visual 100% Roja para Pedidos Impagos
- **Detección Automática**: Todo pedido con pago pendiente (`paymentStatus === "pendiente"`) se dibuja **totalmente en rojo**:
  - **Borde de tarjeta**: Borde de 2px en rojo vivo con resplandor suave (`shadow-[0_0_20px_-3px_rgba(239,68,68,0.45)]`).
  - **Cabecera**: Tinte oscuro rojizo de alta visibilidad.
  - **Badge de Pago**: Distintivo rojo parpadeante `⚠️ IMPAGO`.
  - **Monto y Nombre**: Resaltados en contraste rojo de advertencia.
- **Permisividad Operativa de Entrega (Fiado)**:
  - Un pedido **puede avanzar por todas las etapas y marcarse como Completado / Entregado aun sin haber sido pagado**.
  - Si el cliente retira o recibe su comida sin pagar, la tarjeta se mueve a la columna **Completados**, pero **se mantiene 100% en rojo** e ingresa automáticamente a la cuenta corriente del cliente en la sección de **Deudores**.

#### Estructura de cada Tarjeta de Pedido
- **Cabecera de la Tarjeta**:
  - Número de orden (`#ID`).
  - Distintivo de canal: `🛵 Envío` o `🏪 Retiro`.
  - Distintivo de pago: `⚠️ IMPAGO` (rojo animado) o `✓ PAGADO` (verde esmeralda).
  - **Cronómetro de Demora en Minutos**:
    - Normal (blanco/gris): Menor a 15 minutos.
    - Advertencia (amarillo con ícono de triángulo `⚠️`): Entre 15 y 30 minutos de espera.
    - Crítico (rojo palpitante con ícono de fuego `🔥`): Supera los 30 minutos desde su creación.
- **Cuerpo de la Tarjeta**:
  - Nombre completo del cliente (en rojo si adeuda).
  - Dirección de entrega y medio de pago.
  - Monto total.
  - Lista resumida de productos.
- **Botón "Ver Más / Ocultar"**: Al expandir la tarjeta se revelan controles avanzados:
  - **Copiar enlace**: Para reenviar el tracking al cliente ante cualquier consulta.
  - **Entregar / Completar Pedido**: Permite dar por concluido el pedido incluso sin exigir el pago previo.
  - **Marcar como Pagado**: Si el cliente abona su saldo, este botón actualiza el pago a "Pagado" de inmediato, pasando la tarjeta a colores neutros.
  - **Cancelar Pedido**: Da de baja el pedido, quitándolo del flujo de producción y excluyéndolo de la recaudación.

---

### 4.3 Clientes Deudores & Cuentas Corrientes (`/recepcion/deudores` y `/gerencia/deudores`)

Sección especializada para el seguimiento y cobranza de pedidos entregados fiados o con pago pendiente:
- **Tarjetas de Métricas Superiores**:
  - *Total Deuda Activa*: Saldo total en pesos pendiente de cobro en todo el negocio.
  - *Clientes con Deuda*: Cantidad de clientes únicos con órdenes impagas.
  - *Pedidos Impagos*: Conteo de órdenes no abonadas.
  - *Promedio por Deuda*: Deuda media por cliente.
- **Buscador y Ordenamiento**:
  - Permite buscar por nombre, apellido, teléfono o número de orden.
  - Ordenar por mayor deuda acumulada, menor deuda o pedidos más antiguos.
- **Ficha de Cliente Deudor**:
  - Nombre canónico, teléfono, dirección habitual y monto total de deuda acumulada en tipografía roja gigante.
  - **Botón "Editar" (ícono de lápiz ✏️)**: Permite rectificar en el acto el **Nombre Oficial Registrado**, Apellido, Teléfono o Dirección del cliente deudor. Al guardar, el cambio se propaga de forma inmediata a la ficha y a todas las órdenes y comprobantes asociados sin salir del panel.
  - **Búsqueda Flexible**: Permite buscar deudores por nombre o teléfono sin exigir tildes ni acentos.
  - **Botón "Reclamar por WhatsApp"**: Abre automáticamente WhatsApp Web / App con un mensaje respetuoso predeterminado indicando el monto total adeudado, los números de pedidos y el alias de transferencia (`quadra.pizza.mp`).
  - **Botón "Cobrar Todo"**: Despliega un modal de confirmación y permite cancelar todos los pedidos impagos del cliente en un solo clic.
- **Acordeón Desplegable de Pedidos**:
  - Muestra cada comanda impaga individual con su fecha, hora, productos y monto.
  - Botón individual **"Saldar Pedido"**: Para cuando el cliente realiza un pago parcial cancelando una orden específica.

---

### 4.4 Identificación y Normalización Canónica de Clientes por Teléfono (`/recepcion/clientes`)

Módulo de administración de clientes con regla estricta de identificación telefónica y nombres registrados:
- **El Teléfono como Clave Primaria Canónica**:
  - **Alta en Primer Pedido ("Nombre Original Registrado")**: Cuando un cliente pide por primera vez y su número de teléfono no existe en la base de datos, los datos tipeados (Nombre y Apellido) se asocian de forma automática como el **"nombre original registrado" canónico** del perfil.
  - **Inmutabilidad frente a Errores de Tipeo Sucesivos**: Debido a que los clientes suelen ingresar variaciones o errores de tipeo al pedir en compras posteriores por la tienda web o por teléfono (ej: "Juan", "Juancito", "J. Pérez"), el sistema **preserva y respeta el nombre original registrado**, evitando duplicar clientes en la base de datos o sobreescribir el perfil con apodos.
  - **Modificación Voluntaria y Explícita (Sujeto a Modificación)**: En caso de requerirse o desearse rectificar el nombre oficial (ej: corregir una falta de ortografía del primer pedido), cualquier operador de Recepción o Gerencia puede editar el perfil en cualquier momento desde la Base de Clientes o desde el panel de Deudores. La modificación actualiza el nombre canónico oficial y sincroniza automáticamente todas sus órdenes asociadas.
- **Buscador en Tiempo Real**: Permite filtrar por nombre, apellido o número de teléfono sin exigir tildes ni mayúsculas/minúsculas.
- **Botón "Nuevo Cliente"**: Abre un formulario para registrar Nombre, Apellido, Teléfono, Dirección, Barrio habitual y Referencias de entrega.
- **Tabla de Clientes**:
  - Contacto, dirección, total de órdenes históricas y monto acumulado.
  - Botón **Editar** (ícono de lápiz): Para corregir datos, actualizar domicilios y rectificar el nombre registrado.
  - Botón **Eliminar** (ícono de papelera): Posee un mecanismo de seguridad que impide eliminar un cliente si actualmente posee pedidos activos en preparación o viaje.

---

### 4.4 Control de Stock de Insumos (`/recepcion/stock`)

Módulo de inventario para controlar materias primas e ingredientes (Kilos de muzzarella, jamón, harina, latas de salsa, cajas de pizza, etc.).
- **Métricas de Cabecera**: Total de artículos, cantidad de insumos saludables, insumos críticos y cambios pendientes sin guardar.
- **Buscador y Filtro por Categorías**: Filtra por lácteos, fiambres, harinas, packaging, etc.
- **Ajuste Veloz**:
  - Botones `+` y `-` que incrementan según la unidad (de a 1 unidad/docena o de a 0.1 kg/litro).
  - Campo editable para ingresar el número exacto.
- **Botón "Guardar Cambios"**: Realiza una actualización por lote (*batch save*) de todos los insumos modificados.
- **Gestión de Insumos**: Botón para dar de alta nuevos insumos, definir su unidad de medida y establecer el **Stock Mínimo** de alerta.
- **Alerta WhatsApp a Gerencia**: Botón que prepara un informe de faltantes críticos y permite enviarlo por WhatsApp al número del encargado o proveedor.

---

### 4.5 Administración del Catálogo (`/recepcion/catalogo`)

Tablero para mantener al día el menú de la pizzería:
1. **Productos (`/productos`)**:
   - Alta y edición de comidas y bebidas.
   - Carga de imágenes (URL o subida).
   - Definición de precios y costos (unidad, media docena, docena).
   - Interruptor (*switch*) de **Stock**: Permite pausar un producto al instante si se agotó (desaparece de la tienda pública).
   - Interruptor de **Oferta**: Activa la insignia destacada de oferta en la web.
2. **Categorías (`/categorias`)**:
   - Creación de categorías padre y subcategorías jerárquicas.
   - Ordenamiento y borrado con protección en cascada.
3. **Zonas de Envío (`/envios`)**:
   - Listado de barrios habilitados para reparto.
   - Definición del costo de delivery por barrio (ej: Centro, Alta Córdoba, Alberdi, Cerro de las Rosas).
4. **Extras (`/extras`)**:
   - Alta de agregados (queso extra, faina, salsa especial, etc.) y fijación de su precio de venta.

---

### 4.6 Cierre de Caja del Turno (`/recepcion/cierre-caja`)

Herramienta contable indispensable para la rendición de cuentas al terminar la jornada o cambio de turno:
- **Filtro de Seguridad por Turno**: Filtra exclusivamente las órdenes procesadas por el cajero conectado durante el día operativo en curso.
- **Tarjetas de Liquidación**:
  - **Total de Ventas**: Suma de todos los pedidos no cancelados del turno.
  - **Total Cobrado**: Dinero efectivamente recaudado.
  - **Total Pendiente**: Pedidos en viaje aún no rendidos por los cadetes.
  - **Efectivo en Caja**: Sumatoria de ventas en efectivo + **Fondo Fijo de Caja** (caja chica inicial configurable, por defecto $20.000).
  - **Medios Digitales**: Recaudación a través de Mercado Pago, transferencias y tarjetas de débito/crédito.
- **Desglose por Método de Pago**: Tabla discriminada por Efectivo, Mercado Pago y Tarjetas.
- **Lista de Pedidos Auditables**: Acordeón desplegable con cada orden del turno para control de diferencias.
- **Flujo de Cierre de Turno**:
  1. El cajero hace clic en **"Cerrar Turno"**.
  2. El sistema solicita confirmación del balance.
  3. Al confirmar, guarda el cierre de forma inmutable en el historial de gerencia con fecha, hora, nombre del cajero y montos.
  4. Muestra un comprobante de cierre final con botón para **Imprimir Ticket de Cierre**.

---

## 5. Módulo 3: Cocina y KDS (Kitchen Display System)

**Ruta:** `/cocina`  
**Acceso:** PIN de Cocina en `/cocina/login`.

El módulo de cocina está diseñado para montarse en tablets de pared o monitores táctiles junto a la mesa de armado y hornos. Utiliza un tema visual ultra-oscuro de alto contraste y tipografías gigantes para máxima legibilidad a distancia.

### 5.1 Monitor de Comandas en Vivo (`/cocina/monitor-pedidos`)

Reemplaza los tickets de papel térmico, evitando pérdidas de comandas y errores de lectura:

```
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│       PENDIENTES        │     EN PREPARACIÓN      │     LISTO P/ ENVÍO      │
│  Pedidos recién entrados│  Cocinándose en el horno│  Esperando al repartidor│
├─────────────────────────┼─────────────────────────┼─────────────────────────┤
│ ┌─────────────────────┐ │ ┌─────────────────────┐ │ ┌─────────────────────┐ │
│ │ #104      🛵Delivery│ │ │ #102        🏠Local │ │ │ #101      🛵Delivery│ │
│ │ 3' minutos          │ │ │ 14' min       ⚠️    │ │ │ 22' min       🔥    │ │
│ │ Juan Pérez          │ │ │ María Gómez         │ │ │ Lucas Díaz          │ │
│ │ 1x Quadra Jamón/Fug │ │ │ 2x Muzzarella       │ │ │ 1x Docena Empanadas │ │
│ │ 📝 "Masa bien fina" │ │ │                     │ │ │                     │ │
│ │ [ ▶ EMPEZAR ]       │ │ │ [ ✓ LISTO ]         │ │ │ [ ✓ DESPACHADO ]    │ │
│ └─────────────────────┘ │ └─────────────────────┘ │ └─────────────────────┘ │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

#### Elementos de cada Comanda en Cocina
- **Barra Superior de la Comanda**:
  - Número de Pedido gigante (ej: `#104`).
  - Tipo de entrega: `🛵 Delivery` o `🏠 Local`.
  - **Temporizador Visual**:
    - Normal (Gris): Menos de 10 minutos.
    - Advertencia (Amarillo `⚠️`): Entre 10 y 20 minutos.
    - Crítico (Rojo con llama parpadeante `🔥`): Más de 20 minutos en cocina.
- **Detalle de la Comanda**:
  - Nombre del cliente.
  - Lista de productos con la cantidad destacada en un recuadro de alta visibilidad.
  - Sabores seleccionados desglosados renglón por renglón.
  - **Notas Especiales**: Destacadas en recuadro con ícono de mensaje para que el pizzero no olvide especificaciones del cliente.
- **Botón de Acción Táctil Gigante**:
  - En *Pendientes*: Botón amarillo **`▶ Empezar`** ➔ Mueve la orden a "En Preparación" (el cliente ve en su tracking que ya están cocinando).
  - En *En Preparación*: Botón verde **`✓ Listo`** ➔ Mueve la orden a "Listo p/ Envío" (avisa al delivery o al cliente que ya salió del horno).
  - En *Listo p/ Envío*: Botón oscuro **`✓ Despachado`** ➔ Da por completada la comanda en cocina.

#### Modos de Visualización
- **En Tablets / Monitores de Pared**: Tablero completo de 3 columnas simultáneas.
- **En Teléfonos Móviles**: Barra superior de 3 pestañas con insignias numéricas para cambiar de columna con un toque.

---

### 5.2 Visor de Stock Crítico de Insumos (`/cocina/stock-critico`)

Pantalla informativa de solo lectura para el personal de cocina:
- Muestra el stock disponible de ingredientes esenciales (Muzzarella, Salsa, Masa, Huevos, Jamón, Pan, etc.).
- Barra de progreso porcentual que compara el stock real frente al mínimo de seguridad.
- Si un insumo entra en zona crítica, resalta en rojo para que los cocineros preparen reemplazos o avisen a recepción antes de que se agote.

---

## 6. Módulo 4: Delivery y Repartidores

**Ruta:** `/delivery`  
**Acceso:** PIN de Delivery en `/delivery/login`.

Una aplicación web móvil diseñada para su uso en smartphones por parte de los cadetes y motociclistas del local. Presenta botones de gran tamaño que pueden ser accionados fácilmente incluso con guantes.

### 6.1 Flujo de Despacho y Pestañas de Turno (`/delivery/mis-viajes`)

La pantalla organiza los pedidos del turno en cuatro pestañas horizontales:

```
┌───────────────┬───────────────┬───────────────┬───────────────┐
│   EN COCINA   │   A RETIRAR   │   EN CAMINO   │  ENTREGADOS   │
│ (Informativo) │(Listos p/salir│ (Viajes activos│(Historial día)│
└───────────────┴───────┬───────┴───────────────┴───────────────┘
                        │
                  Tocar "Tomar Viaje"
                        │
                        ▼
               Pasa a "EN CAMINO"
            (Navegar GPS + Llamar al cliente)
                        │
                        ▼
               Tocar "Entregado"
            (Confirma cobro en mano)
```

1. **🍕 En Cocina**: Pedidos asignados a envío que todavía están en el horno. Permite a los cadetes anticipar cuántos pedidos van a salir pronto.
2. **🏪 A Retirar**: Pedidos listos en mostrador esperando cadete.
   - Muestra el barrio, cliente y total.
   - **Botón "Tomar Viaje"**: Al presionarlo, el cadete se autoasigna la orden y el pedido pasa a estado *En Camino* (el cliente ve en su celular que el cadete ya partió).
3. **🛵 En Camino**: Viajes que el repartidor lleva actualmente en su moto.
4. **✅ Entregados**: Historial de todas las entregas exitosas del cadete durante la noche.

### 6.2 Navegación GPS, Cobranzas y Entrega

Cada tarjeta en la pestaña **En Camino** contiene herramientas de asistencia en ruta:
- **Indicador de Cobro Destacado**:
  - Si el pedido está `PAGADO` (en verde): Informa que no debe cobrar nada al cliente.
  - Si el pedido está `A COBRAR` (en naranja): Indica en tipografía grande el importe exacto a cobrar en mano (`Total: $XX.XXX`) y el desglose del costo de envío.
- **Botón "Llamar"**: Al tocarlo, abre la aplicación de teléfono del celular marcando el número del cliente para contactarlo al llegar al domicilio.
- **Botón "Navegar" (Ícono de Brújula)**: Abre instantáneamente **Google Maps** con la dirección exacta del cliente en Córdoba, iniciando la navegación por voz paso a paso.
- **Botón "Entregado"**:
  - Al presionarlo, despliega una **pantalla de confirmación preventiva**.
  - Si el pedido era a cobrar, advierte al repartidor: *"Recordá cobrar $XX.XXX en Efectivo antes de entregar"*.
  - Al presionar **"Confirmar"**, el pedido pasa al estado de *Completado*, finalizando el circuito logístico.

---

## 7. Módulo 5: Gerencia y Administración Estratégica

**Ruta:** `/gerencia`  
**Acceso:** PIN de Administrador en `/gerencia/login`.

Panel directivo para el dueño o administrador del negocio. Otorga control sobre las finanzas, ventas globales, auditoría de personal y configuración del negocio.

### 7.1 Dashboard Ejecutivo e Indicadores Clave (KPIs) (`/gerencia/dashboard`)

Proporciona una radiografía comercial del negocio:
- **Tarjetas de Rendimiento del Día**:
  - *Ventas de Hoy*: Facturación total acumulada en la jornada.
  - *Pedidos de Hoy*: Volumen total de órdenes procesadas.
  - *Pedidos Activos*: Comandas actualmente en cocina o viaje.
  - *Ticket Promedio*: Gasto medio por cliente durante los últimos 30 días.
- **Top 5 Productos Más Vendidos**: Ranking del mes con cantidad de unidades vendidas y recaudación generada por cada plato.
- **Gráficos Interactivos con Selector de Período (Hoy / Semanal / Mensual / Anual)**:
  - **Curva de Ventas en el Tiempo**: Evolución hora por hora del día, por día de la semana o mes a mes.
  - **Distribución por Canal de Entrega**: Proporción porcentual entre *Delivery* y *Retiro en el local*.
  - **Distribución por Método de Pago**: Proporción entre *Efectivo*, *Mercado Pago*, *Tarjeta de Crédito* y *Transferencias*.

---

### 7.2 Historial y Auditoría de Ventas (`/gerencia/ventas`)

Registro histórico inmutable de cada transacción:
- **Filtros Avanzados**: Búsqueda por ID de orden, por nombre de cliente y filtro por estado (Completados, En Proceso o Cancelados).
- **Tabla Detallada**:
  - ID de comanda, cliente, hora de carga, estado, forma de pago y monto.
  - Al hacer clic sobre cualquier fila, se expande la auditoría completa:
    - Cajero responsable que cargó la venta.
    - Teléfono y dirección de entrega.
    - Costo de envío aplicado.
    - Detalle producto por producto con precios unitarios y notas.

---

### 7.3 Finanzas, Gastos, CMV y Cierres Históricos (`/gerencia/finanzas`)

El corazón financiero del ERP de Quadra Pizza, estructurado en 4 pestañas:

#### Pestaña 1: Dashboard Financiero
- **Selector de Período**: Permite analizar cualquier mes histórico o el año consolidado.
- **Métricas de Rentabilidad**:
  - *Facturación Bruta*: Total de ventas del período.
  - *Ingresos Reales Cobrados*: Ventas con pago efectivamente acreditado.
  - *CMV (Costo de Mercadería Vendida)*: Costo de los ingredientes e insumos de los platos vendidos.
  - *Gastos Operativos*: Suma de gastos fijos y variables del local.
  - *Ganancia Neta Real*: `Ingresos Cobrados - (CMV + Gastos)`.
  - *Margen Operativo Porcentual*: Rentabilidad neta sobre la facturación.
- **Gráfico de Evolución Semanal del Mes**: Compara semana a semana los ingresos cobrados contra los costos y gastos.
- **Gráfico de Comparativa Anual**: Barras mes a mes que muestran ingresos vs egresos y el balance neto anual.

#### Pestaña 2: Gastos Operativos
- Permite cargar todos los egresos del negocio más allá de los ingredientes:
  - Categorías: *Proveedores y Mercadería*, *Alquiler e Inmuebles*, *Servicios e Impuestos*, *Sueldos y Personal*, *Mantenimiento y Equipamiento*, *Marketing*, *Otros*.
  - Clasificación: **Fijo** (alquiler, abonos) o **Variable** (reparaciones, compras imprevistas).
  - Estado: **Pagado** o **Pendiente**.
- Botón **"Nuevo Gasto"**, edición y eliminación de asientos contables.

#### Pestaña 3: Cierres de Caja Históricos
- Auditoría consolidada de todos los cierres de turno enviados desde recepción.
- Muestra la fecha exacta, cajero firmante, total facturado, total en efectivo rendido, dinero digital y volumen de pedidos procesados.

#### Pestaña 4: Costos de Productos y CMV
- Tabla con todos los productos del menú donde se analiza la rentabilidad unitaria:
  - Precio de venta al público.
  - Costo de elaboración (ingredientes / packaging).
  - Margen monetario por unidad vendida ($).
  - Margen de ganancia porcentual (%).
- Botón **"Editar Costo"**: Permite ajustar los costos unitarios o actualizar los precios de venta, impactando inmediatamente en los cálculos de CMV.

---

### 7.4 Gestión de Personal y Seguridad (Usuarios y PINs) (`/gerencia/usuarios`)

Control de accesos para los empleados del negocio:
- **Directorio de Personal**: Listado de todos los trabajadores, su correo electrónico, estado (Activo / Inactivo) y rol asignado (*Gerencia*, *Recepción*, *Cocina*, *Delivery*).
- **Botón "Nuevo Usuario"**:
  - Permite crear un colaborador asignándole nombre, email, rol y un **PIN exclusivo de 4 dígitos**.
  - El sistema valida automáticamente que el PIN no esté en uso por otro miembro del equipo.
- **Botones de Edición y Eliminación**: Para cambiar permisos, actualizar PINs olvidados o dar de baja colaboradores temporales.

---

## 8. Módulo 6: Seguimiento en Vivo del Pedido para el Cliente (Tracking)

**Ruta pública:** `/estado-pedido/[id]`  
**Acceso:** Público mediante el link único generado al confirmar la orden.

Permite al cliente vivir una experiencia moderna, reduciendo la ansiedad de espera y evitando llamadas telefónicas reiteradas al local preguntando *"dónde está el pedido"*.

### 8.1 Línea de Tiempo y Estados en Tiempo Real

La pantalla detecta automáticamente si el pedido es para **Envío a Domicilio** o para **Retiro en Local**, adaptando los textos y pasos visuales:

#### Para Pedidos con Envío a Domicilio (Delivery)
1. **¡Pedido Confirmado!** ⏱️
   - *Mensaje:* "¡Mil gracias por elegirnos, [Nombre]! Ya anotamos todo para mimarte hoy."
   - Indica que el cajero cargó la orden y fue recepcionada con éxito.
2. **¡Manos a la Obra!** 👨‍🍳
   - *Mensaje:* "Nuestros pizzeros están preparando tu pedido con muchísimo amor y cuidado."
   - Se ilumina cuando cocina presiona `▶ Empezar` en el monitor KDS.
3. **¡En Camino!** 🛵
   - *Mensaje:* "Asignando al mejor repartidor..." o "¡Tu pedido ya salió, [Nombre]! Va en viaje con mucho cuidado para que lo disfrutes."
   - Se activa cuando cocina finaliza el pedido y el repartidor presiona `Tomar Viaje`.
4. **¡Entregado!** ✅
   - *Mensaje:* "¡Que lo disfrutes muchísimo! Gracias por dejarnos ser parte de tu mesa hoy. ❤️"
   - Se marca cuando el cadete confirma la entrega en mano.

#### Para Pedidos con Retiro en Sucursal
1. **¡Pedido Confirmado!** ⏱️
2. **¡Manos a la Obra!** 👨‍🍳
3. **¡Listo para Retirar!** 🏪
   - *Mensaje:* "¡Tu pedido está súper calentito y esperándote con los brazos abiertos, [Nombre]!"
4. **¡Entregado!** ✅

#### Información Adicional en la Pantalla de Tracking
- Número de orden visible en la cabecera (ej: `#104`).
- Detalle completo de los productos adquiridos con sus cantidades y subtotales.
- Desglose del costo de envío y recargos por medio de pago.
- **Total final abonado o a abonar**.
- Tarjeta de destino con la dirección acordada o la indicación de retiro en el local.

---

### 8.2 Comprobante y Ticket Virtual Imprimible

**Ruta:** `/ticket/[id]`

Si el cliente o el personal requieren un ticket formal, esta ruta emula el formato de un ticket térmico clásico de pizzería sobre papel blanco:
- Encabezado con imagotipo de Quadra Pizza.
- Identificador de comanda y fecha/hora exacta.
- Datos del cliente, teléfono y forma de pago.
- Tabla detallada de productos y adicionales.
- Pie de ticket con leyenda de agradecimiento y total en números grandes.
- Compatible con impresión directa desde el navegador (`Ctrl + P`) para impresoras térmicas de 58mm y 80mm.

---

## 9. Flujo Integral del Pedido (Paso a Paso de Extremo a Extremo)

A continuación se describe la secuencia completa de una orden en una noche de servicio:

```
[ PASO 1: ENTRADA DEL PEDIDO ]
El cliente ingresa a la web (o escribe al WhatsApp / se acerca al mostrador).
El cajero en /recepcion/nueva-venta carga los productos, extras y sabores.
Completa los datos del cliente, selecciona envío o retiro y método de pago.
Hace clic en "Enviar a Cocina".
     │
     ├─► El cliente recibe su enlace de seguimiento: quadrapizza.com/estado-pedido/104
     │
     ▼
[ PASO 2: COCINA ]
La comanda aparece en el monitor KDS (/cocina/monitor-pedidos) en "Pendientes".
El cocinero toca "▶ Empezar". La comanda pasa a "En Preparación".
El cliente ve en su celular: "¡Manos a la Obra!".
El cocinero hornea la pizza, emplata y toca "✓ Listo".
     │
     ▼
[ PASO 3: DESPACHO Y LOGÍSTICA ]
El repartidor abre su celular en /delivery/mis-viajes en "A Retirar".
Observa el pedido #104 listo en mostrador y toca "Tomar Viaje".
El pedido pasa a "En Camino". El cliente ve en su celular: "¡En Camino!".
El repartidor toca "Navegar" para ir con Google Maps hasta el domicilio.
Al llegar, toca "Llamar" para avisar que está en la puerta.
Cobra el dinero en efectivo indicado en la pantalla.
Toca "Entregado" y confirma el cobro.
     │
     ▼
[ PASO 4: FINALIZACIÓN Y AUDITORÍA ]
El pedido se marca como "Completado" en el Kanban de recepción y en el celular del cliente.
La venta impacta en los gráficos del Dashboard de Gerencia.
Al finalizar el turno, el cajero va a /recepcion/cierre-caja, verifica los totales y toca "Cerrar Turno".
Gerencia puede revisar en /gerencia/finanzas el balance del día, el CMV consumido y la ganancia neta.
```

---

## 💡 Consejos y Buenas Prácticas Operativas

1. **Gestión de Demoras**: Si un pedido supera los 15 minutos en recepción o los 10 minutos en cocina, el sistema avisará con íconos amarillos (`⚠️`). Si supera los 30 o 20 minutos respectivamente, se encenderá el fuego rojo palpitante (`🔥`). Utilice estas alertas visuales para priorizar las órdenes demoradas.
2. **Control de Cobranza en Moto**: Los repartidores deben fijarse siempre en el badge de cobranza de cada tarjeta:
   - Verde `PAGADO`: No solicitar dinero al cliente.
   - Naranja `A COBRAR`: Exigir el cobro antes de soltar la mercadería.
3. **Pausar Productos sin Stock**: Si se agota un ingrediente o bebida un fin de semana, ingresar a `/recepcion/catalogo/productos` y desactivar el interruptor de stock. El producto desaparecerá al instante de la tienda pública evitando reclamos.
4. **Cierre de Turno Puntual**: Realizar el cierre de turno antes de cambiar de cajero para que cada empleado sea responsable de su propia rendición de efectivo y pedidos procesados.

---
*Manual redactado y actualizado para Quadra Pizza ERP.*
