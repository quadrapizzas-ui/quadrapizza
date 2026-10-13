"use client";

import { useEffect } from "react";
import { useOrdersStore } from "@/lib/store/ordersStore";
import { useCustomersStore } from "@/lib/store/customersStore";
import { useCierresStore } from "@/lib/store/cierresStore";
import { useGastosStore, generateMockGastos } from "@/lib/store/gastosStore";
import { useStockStore } from "@/lib/store/stockStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useProductsStore } from "@/lib/store/productsStore";
import { logger } from "@/lib/logger";
import { generateMockOrders } from "@/lib/mockOrders";
import { MockCustomer } from "@/types/models";

import { syncCurrentShiftData } from "@/lib/demoData";

/**
 * Este componente es invisible en la UI.
 * Su único propósito es escuchar el evento "storage" del navegador
 * para sincronizar los estados de Zustand entre múltiples pestañas 
 * del mismo navegador y asegurar que los datos de prueba estén disponibles.
 */
export function TabSync() {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "quadra-mock-orders-v11") {
        logger.info("Storage sync event received - Rehydrating ordersStore");
        useOrdersStore.persist.rehydrate();
      }
      if (e.key === "quadra-mock-customers-v8") {
        logger.info("Storage sync event received - Rehydrating customersStore");
        useCustomersStore.persist.rehydrate();
      }
      if (e.key === "quadra-cierres-storage-v4") {
        logger.info("Storage sync event received - Rehydrating cierresStore");
        useCierresStore.persist.rehydrate();
      }
      if (e.key === "quadra-gastos-storage-v2") {
        logger.info("Storage sync event received - Rehydrating gastosStore");
        useGastosStore.persist.rehydrate();
      }
      if (e.key === "quadra-mock-stock-v2") {
        logger.info("Storage sync event received - Rehydrating stockStore");
        useStockStore.persist.rehydrate();
      }
      if (e.key === "quadra-products-storage-v1") {
        logger.info("Storage sync event received - Rehydrating productsStore");
        useProductsStore.persist.rehydrate();
      }
      if (e.key === "quadra-auth-storage-v5" || e.key === "quadra-auth-storage-v4" || e.key === "quadra-auth-storage-v3" || e.key === "quadra-auth-v1") {
        logger.info("Storage sync event received - Rehydrating authStore");
        useAuthStore.persist.rehydrate();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Inyección automática y sincronización de datos de prueba del turno actual
  useEffect(() => {
    syncCurrentShiftData();
  }, []);

  return null;
}

