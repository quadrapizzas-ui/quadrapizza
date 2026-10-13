"use client";

import { useOrdersStore } from "@/lib/store/ordersStore";
import { useCustomersStore } from "@/lib/store/customersStore";
import { useGastosStore, generateMockGastos } from "@/lib/store/gastosStore";
import { useCierresStore } from "@/lib/store/cierresStore";
import { useStockStore } from "@/lib/store/stockStore";
import { useAuthStore } from "@/lib/store/authStore";
import { generateMockOrders, generateTodayOrders } from "@/lib/mockOrders";
import { getBusinessDay } from "@/lib/businessDay";
import { MockCustomer } from "@/types/models";
import { logger } from "@/lib/logger";

/**
 * Asegura que hoy siempre tenga pedidos activos del turno actual.
 * Si ya hay pedidos históricos pero ninguno para hoy, inyecta los de hoy sin borrar la historia.
 * Si la base está completamente vacía, inyecta el set completo (hoy + 60 días).
 */
export function syncCurrentShiftData(): void {
  try {
    const ordersStore = useOrdersStore.getState();
    const customersStore = useCustomersStore.getState();
    const gastosStore = useGastosStore.getState();
    const authStore = useAuthStore.getState();

    // 1. Asegurar pedidos
    const currentOrders = ordersStore.orders;
    const todayBusinessDayTime = getBusinessDay().getTime();
    const hasTodayOrders = currentOrders.some(
      (o) => getBusinessDay(o.createdAt).getTime() === todayBusinessDayTime
    );

    if (currentOrders.length === 0) {
      logger.info("[DemoData] Inyectando pedidos completos (hoy + historial 60 días)...");
      ordersStore.setOrders(generateMockOrders());
    } else if (!hasTodayOrders) {
      logger.info("[DemoData] Turno de hoy sin pedidos. Inyectando pedidos frescos para el turno actual...");
      const freshTodayOrders = generateTodayOrders();
      ordersStore.setOrders([...freshTodayOrders, ...currentOrders]);
    }

    // 2. Asegurar clientes
    if (customersStore.customers.length === 0) {
      logger.info("[DemoData] Inyectando clientes de prueba...");
      const allOrders = useOrdersStore.getState().orders;
      const custMap = new Map<string, MockCustomer>();

      allOrders.forEach((o, idx) => {
        const key = o.phone || `${o.clientFirstName}-${o.clientLastName}`;
        if (!custMap.has(key)) {
          custMap.set(key, {
            id: `cust-mock-${idx}`,
            firstName: o.clientFirstName,
            lastName: o.clientLastName || "",
            phone: o.phone || `351${Math.floor(1000000 + Math.random() * 9000000)}`,
            address: o.address,
            orders: 1,
            total: o.status !== "cancelado" ? o.total : 0,
            lastOrder: o.createdAt,
          });
        } else {
          const existing = custMap.get(key)!;
          existing.orders += 1;
          if (o.status !== "cancelado") {
            existing.total += o.total;
          }
          if (new Date(o.createdAt).getTime() > new Date(existing.lastOrder).getTime()) {
            existing.lastOrder = o.createdAt;
            if (o.address && !o.address.toLowerCase().includes("local")) {
              existing.address = o.address;
            }
          }
        }
      });
      customersStore.setCustomers(Array.from(custMap.values()));
    }

    // 3. Asegurar gastos
    if (gastosStore.gastos.length === 0) {
      logger.info("[DemoData] Inyectando gastos de prueba...");
      gastosStore.setGastos(generateMockGastos());
    }

    // 4. Asegurar que Mario Rossi (Delivery) esté activo
    const users = authStore.users;
    const mario = users.find((u) => u.id === 4);
    if (mario && !mario.active) {
      authStore.updateUser(4, { active: true });
    }
  } catch (err) {
    logger.error("Error sincronizando datos demo:", err);
  }
}

/**
 * Restablece TODOS los datos de prueba a un estado fresco, perfecto para presentaciones o pruebas interactivas.
 */
export function resetAllDemoData(): void {
  try {
    logger.info("[DemoData] Forzando reinicio total de datos de prueba...");
    const freshOrders = generateMockOrders();
    useOrdersStore.getState().setOrders(freshOrders);

    // Clientes basados en los pedidos
    const custMap = new Map<string, MockCustomer>();
    freshOrders.forEach((o, idx) => {
      const key = o.phone || `${o.clientFirstName}-${o.clientLastName}`;
      if (!custMap.has(key)) {
        custMap.set(key, {
          id: `cust-mock-${idx}`,
          firstName: o.clientFirstName,
          lastName: o.clientLastName || "",
          phone: o.phone || `351${Math.floor(1000000 + Math.random() * 9000000)}`,
          address: o.address,
          orders: 1,
          total: o.status !== "cancelado" ? o.total : 0,
          lastOrder: o.createdAt,
        });
      } else {
        const existing = custMap.get(key)!;
        existing.orders += 1;
        if (o.status !== "cancelado") {
          existing.total += o.total;
        }
        if (new Date(o.createdAt).getTime() > new Date(existing.lastOrder).getTime()) {
          existing.lastOrder = o.createdAt;
          if (o.address && !o.address.toLowerCase().includes("local")) {
            existing.address = o.address;
          }
        }
      }
    });
    useCustomersStore.getState().setCustomers(Array.from(custMap.values()));

    // Gastos
    useGastosStore.getState().setGastos(generateMockGastos());

    // Usuarios: Activar a Mario Rossi
    useAuthStore.getState().updateUser(4, { active: true });

    logger.info("[DemoData] ¡Datos restablecidos exitosamente!");
  } catch (err) {
    logger.error("Error al reiniciar datos demo:", err);
  }
}
