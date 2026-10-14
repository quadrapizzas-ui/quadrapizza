import { MockOrder } from "@/types/models";
import { getBusinessDay } from "@/lib/businessDay";

const getMinutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60000).toISOString();

export const generateTodayOrders = (): MockOrder[] => {
  const now = new Date();
  const todayStr = now.toISOString().slice(2, 10).replace(/-/g, "");

  return [
    {
      id: `${todayStr}-012`,
      items: [
        { name: "Quadra 1 (1 Variedad Extra)", quantity: 1, price: 9000 },
        { name: "Súper Lomito Quadra con Papas", quantity: 1, price: 9200 },
        { name: "Coca-Cola 1.5L", quantity: 1, price: 2500 }
      ],
      paymentMethod: "Mercado Pago",
      paymentStatus: "pagado",
      clientFirstName: "Valeria",
      clientLastName: "Gómez",
      phone: "3516123456",
      address: "B° Privado La Arboleda, Mz 3 Lote 12",
      total: 21700,
      deliveryFee: 1000,
      createdAt: getMinutesAgo(3),
      mockAge: "Hace 3 min",
      status: "confirmado",
      cajero_id: 2,
      cajero_name: "Ana Maria"
    },
    {
      id: `${todayStr}-011`,
      items: [
        { name: "Quadra 1 (1 Variedad Extra)", quantity: 1, price: 9000 },
        { name: "Coca-Cola 1.5L", quantity: 1, price: 2500 }
      ],
      paymentMethod: "Efectivo",
      paymentStatus: "pendiente",
      clientFirstName: "Martín",
      clientLastName: "López",
      phone: "3512987654",
      address: "Retiro en local",
      total: 11500,
      deliveryFee: 0,
      createdAt: getMinutesAgo(8),
      mockAge: "Hace 8 min",
      status: "confirmado",
      cajero_id: 2,
      cajero_name: "Ana Maria"
    },
    {
      id: `${todayStr}-010`,
      items: [
        { name: "Quadra 2 (2 Variedades Extra)", quantity: 1, price: 10500 },
        { name: "Cerveza Quilmes 1L", quantity: 1, price: 3200 }
      ],
      paymentMethod: "Transferencia",
      paymentStatus: "pagado",
      clientFirstName: "Lucía",
      clientLastName: "Fernández",
      phone: "3513456789",
      address: "Calle Los Tilos 432",
      total: 14700,
      deliveryFee: 1000,
      createdAt: getMinutesAgo(16),
      mockAge: "Hace 16 min",
      status: "en-cocina",
      cajero_id: 2,
      cajero_name: "Ana Maria"
    },
    {
      id: `${todayStr}-009`,
      items: [
        { name: "Súper Lomito Quadra con Papas", quantity: 1, price: 9200 },
        { name: "Coca-Cola 1.5L", quantity: 1, price: 2500 }
      ],
      paymentMethod: "Efectivo",
      paymentStatus: "pendiente",
      clientFirstName: "Facundo",
      clientLastName: "Cabrera",
      phone: "3514433221",
      address: "Retiro en local",
      total: 11700,
      deliveryFee: 0,
      createdAt: getMinutesAgo(22),
      mockAge: "Hace 22 min",
      status: "en-cocina",
      cajero_id: 2,
      cajero_name: "Ana Maria"
    },
    {
      id: `${todayStr}-008`,
      items: [
        { name: "Quadra 3 (3 Variedades)", quantity: 1, price: 12000 },
        { name: "Burger Quadra Egg Special", quantity: 1, price: 7200 }
      ],
      paymentMethod: "Efectivo",
      paymentStatus: "pendiente",
      clientFirstName: "Juan",
      clientLastName: "Pérez",
      phone: "3515112233",
      address: "Av. San Martín 1250, Depto 4A",
      total: 20200,
      deliveryFee: 1000,
      createdAt: getMinutesAgo(32),
      mockAge: "Hace 32 min",
      status: "listo",
      cajero_id: 2,
      cajero_name: "Ana Maria"
    },
    {
      id: `${todayStr}-007`,
      items: [
        { name: "Burger Doble Bacon Beast", quantity: 1, price: 8600 },
        { name: "Coca-Cola 1.5L", quantity: 1, price: 2500 }
      ],
      paymentMethod: "Mercado Pago",
      paymentStatus: "pagado",
      clientFirstName: "Sofía",
      clientLastName: "Martínez",
      phone: "3517998877",
      address: "Retiro en local",
      total: 11100,
      deliveryFee: 0,
      createdAt: getMinutesAgo(40),
      mockAge: "Hace 40 min",
      status: "listo",
      cajero_id: 2,
      cajero_name: "Ana Maria"
    },
    {
      id: `${todayStr}-006`,
      items: [
        { name: "Quadra 2 (2 Variedades Extra)", quantity: 1, price: 10500 },
        { name: "Coca-Cola 1.5L", quantity: 1, price: 2500 }
      ],
      paymentMethod: "Efectivo",
      paymentStatus: "pendiente",
      clientFirstName: "Carlos",
      clientLastName: "Benítez",
      phone: "3518223344",
      address: "Belgrano 740, B° Yocsina",
      total: 13500,
      deliveryFee: 500,
      createdAt: getMinutesAgo(48),
      mockAge: "Hace 48 min",
      status: "en-camino",
      cajero_id: 2,
      cajero_name: "Ana Maria"
    },
    {
      id: `${todayStr}-005`,
      items: [
        { name: "Quadra 1 (1 Variedad Extra)", quantity: 1, price: 9000 },
        { name: "Tiramisú Artesanal", quantity: 2, price: 2400 }
      ],
      paymentMethod: "Transferencia",
      paymentStatus: "pagado",
      clientFirstName: "Camila",
      clientLastName: "Díaz",
      phone: "3519334455",
      address: "Calle 9 de Julio 180",
      total: 14800,
      deliveryFee: 1000,
      createdAt: getMinutesAgo(58),
      mockAge: "Hace 58 min",
      status: "en-camino",
      cajero_id: 2,
      cajero_name: "Ana Maria"
    },
    {
      id: `${todayStr}-004`,
      items: [
        { name: "Quadra 1 (1 Variedad Extra)", quantity: 1, price: 9000 },
        { name: "Cerveza Quilmes 1L", quantity: 1, price: 3200 }
      ],
      paymentMethod: "Efectivo",
      paymentStatus: "pagado",
      clientFirstName: "Gonzalo",
      clientLastName: "Torres",
      phone: "3514778899",
      address: "Retiro en local",
      total: 12200,
      deliveryFee: 0,
      createdAt: getMinutesAgo(75),
      mockAge: "Hace 1 hora",
      status: "completado",
      cajero_id: 2,
      cajero_name: "Ana Maria"
    },
    {
      id: `${todayStr}-003`,
      items: [
        { name: "Súper Lomito Quadra con Papas", quantity: 1, price: 9200 },
        { name: "Burger Quadra Egg Special", quantity: 1, price: 7200 }
      ],
      paymentMethod: "Mercado Pago",
      paymentStatus: "pagado",
      clientFirstName: "Mariano",
      clientLastName: "Rossi",
      phone: "3513114477",
      address: "Av. Colón 2340",
      total: 17400,
      deliveryFee: 1000,
      createdAt: getMinutesAgo(95),
      mockAge: "Hace 1 hora y media",
      status: "completado",
      cajero_id: 2,
      cajero_name: "Ana Maria"
    },
    {
      id: `${todayStr}-002`,
      items: [
        { name: "Quadra 3 (3 Variedades)", quantity: 1, price: 12000 },
        { name: "Coca-Cola 1.5L", quantity: 1, price: 2500 }
      ],
      paymentMethod: "Transferencia",
      paymentStatus: "pagado",
      clientFirstName: "Florencia",
      clientLastName: "Vega",
      phone: "3517332211",
      address: "Rivadavia 560",
      total: 15500,
      deliveryFee: 1000,
      createdAt: getMinutesAgo(120),
      mockAge: "Hace 2 horas",
      status: "completado",
      cajero_id: 2,
      cajero_name: "Ana Maria"
    },
    {
      id: `${todayStr}-001`,
      items: [
        { name: "Lomito Cordobés en Pan Árabe", quantity: 1, price: 8400 }
      ],
      paymentMethod: "Efectivo",
      paymentStatus: "pendiente",
      clientFirstName: "Diego",
      clientLastName: "Rodríguez",
      phone: "3516554433",
      address: "Calle Falsa 123",
      total: 9400,
      deliveryFee: 1000,
      createdAt: getMinutesAgo(150),
      mockAge: "Hace 2 horas y media",
      status: "cancelado",
      cajero_id: 2,
      cajero_name: "Ana Maria"
    }
  ];
};

export const generateMockOrders = (): MockOrder[] => {
  const now = new Date();
  const todaysOrders = generateTodayOrders();

  // ─── 2. PEDIDOS HISTÓRICOS (Últimos 60 días para gráficos, ventas y finanzas) ───
  const historicalOrders: MockOrder[] = [];
  const clientPool = [
    { firstName: "Valeria", lastName: "Gómez", phone: "3516123456", address: "B° Privado La Arboleda, Mz 3 Lote 12" },
    { firstName: "Martín", lastName: "López", phone: "3512987654", address: "Retiro en local" },
    { firstName: "Lucía", lastName: "Fernández", phone: "3513456789", address: "Calle Los Tilos 432" },
    { firstName: "Juan", lastName: "Pérez", phone: "3515112233", address: "Av. San Martín 1250, Depto 4A" },
    { firstName: "Sofía", lastName: "Martínez", phone: "3517998877", address: "Retiro en local" },
    { firstName: "Carlos", lastName: "Benítez", phone: "3518223344", address: "Belgrano 740, B° Yocsina" },
    { firstName: "Camila", lastName: "Díaz", phone: "3519334455", address: "Calle 9 de Julio 180" },
    { firstName: "Gonzalo", lastName: "Torres", phone: "3514778899", address: "Retiro en local" },
    { firstName: "Diego", lastName: "Rodríguez", phone: "3516554433", address: "Calle Falsa 123" },
    { firstName: "Mariano", lastName: "Rossi", phone: "3513114477", address: "Av. Colón 2340" },
    { firstName: "Florencia", lastName: "Vega", phone: "3517332211", address: "Rivadavia 560" },
    { firstName: "Rodrigo", lastName: "Morales", phone: "3512449988", address: "Retiro en local" }
  ];

  const catalogItems = [
    { name: "Quadra 1 (1 Variedad Extra)", price: 9000 },
    { name: "Quadra 2 (2 Variedades Extra)", price: 10500 },
    { name: "Quadra 3 (3 Variedades)", price: 12000 },
    { name: "Burger Quadra Egg Special", price: 7200 },
    { name: "Burger Doble Bacon Beast", price: 8600 },
    { name: "Lomito Cordobés en Pan Árabe", price: 8400 },
    { name: "Súper Lomito Quadra con Papas", price: 9200 },
    { name: "Copa Quadra Mini Burgers (x4)", price: 6800 },
    { name: "Sándwich de Milanesa Completo", price: 7500 },
    { name: "Coca-Cola 1.5L", price: 2500 },
    { name: "Cerveza Quilmes 1L", price: 3200 }
  ];

  const paymentMethods = ["Efectivo", "Transferencia", "Mercado Pago", "Tarjeta de crédito"];

  // Generamos pedidos para los últimos 60 días
  for (let daysAgo = 1; daysAgo <= 60; daysAgo++) {
    const orderDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const dateCode = orderDate.toISOString().slice(2, 10).replace(/-/g, "");

    // Cantidad de pedidos ese día (entre 8 y 16 pedidos por jornada)
    const isWeekend = orderDate.getDay() === 5 || orderDate.getDay() === 6 || orderDate.getDay() === 0;
    const ordersCount = isWeekend ? 14 : 9;

    for (let seq = 1; seq <= ordersCount; seq++) {
      const client = clientPool[(daysAgo * 3 + seq) % clientPool.length];
      const item1 = catalogItems[(daysAgo + seq) % catalogItems.length];
      const item2 = catalogItems[(daysAgo * 2 + seq + 1) % catalogItems.length];
      const hasSecondItem = (seq % 2 === 0);

      const items = [{ name: item1.name, quantity: 1, price: item1.price }];
      if (hasSecondItem) {
        items.push({ name: item2.name, quantity: 1, price: item2.price });
      }

      const isDelivery = !client.address.toLowerCase().includes("local");
      const deliveryFee = isDelivery ? 1000 : 0;
      const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
      const total = subtotal + deliveryFee;

      const pMethod = paymentMethods[(seq + daysAgo) % paymentMethods.length];
      const orderHour = 20 + (seq % 4); // 20:00 a 23:00 hs
      const orderMin = (seq * 13) % 60;

      const timestamp = new Date(
        orderDate.getFullYear(),
        orderDate.getMonth(),
        orderDate.getDate(),
        orderHour,
        orderMin,
        0
      ).toISOString();

      historicalOrders.push({
        id: `${dateCode}-${String(seq).padStart(3, "0")}`,
        items,
        paymentMethod: pMethod,
        paymentStatus: "pagado",
        clientFirstName: client.firstName,
        clientLastName: client.lastName,
        phone: client.phone,
        address: client.address,
        deliveryFee,
        total,
        createdAt: timestamp,
        mockAge: `Hace ${daysAgo} día${daysAgo > 1 ? "s" : ""}`,
        status: "completado",
        cajero_id: daysAgo % 2 === 0 ? 2 : 1,
        cajero_name: daysAgo % 2 === 0 ? "Ana Maria" : "Hector Zanier"
      });
    }
  }

  return [...todaysOrders, ...historicalOrders];
};
