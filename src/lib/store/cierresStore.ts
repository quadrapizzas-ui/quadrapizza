import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface MockCierre {
  id: string;
  cajero_id: number;
  cajero_name: string;
  fecha_cierre: string;
  monto_total: number;
  efectivo_total: number;
  otros_medios_total: number;
  cantidad_pedidos: number;
  deuda_pendiente_total?: number;
}

interface CierresState {
  cierres: MockCierre[];
  addCierre: (cierre: Omit<MockCierre, 'id' | 'fecha_cierre'>) => void;
  getCierresByCajero: (cajero_id: number) => MockCierre[];
}

const generateMockCierres = (): MockCierre[] => {
  const cierres: MockCierre[] = [];
  const now = new Date();

  for (let i = 1; i <= 60; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const isWeekend = date.getDay() === 5 || date.getDay() === 6 || date.getDay() === 0;
    const cantidadPedidos = isWeekend ? 14 : 9;
    const montoTotal = isWeekend ? 172000 : 115000;
    const efectivoTotal = Math.round(montoTotal * 0.45);
    const otrosMediosTotal = montoTotal - efectivoTotal;

    // Horario habitual de cierre de turno: 01:30 AM del día siguiente al turno
    const closeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 1, 35, 0);

    cierres.push({
      id: uuidv4(),
      cajero_id: i % 2 === 0 ? 2 : 1,
      cajero_name: i % 2 === 0 ? "Ana Maria" : "Hector Zanier",
      fecha_cierre: closeDate.toISOString(),
      monto_total: montoTotal,
      efectivo_total: efectivoTotal,
      otros_medios_total: otrosMediosTotal,
      cantidad_pedidos: cantidadPedidos
    });
  }
  return cierres;
};

export const useCierresStore = create<CierresState>()(
  persist(
    (set, get) => ({
      cierres: generateMockCierres(),
      addCierre: (cierre) => set((state) => ({
        cierres: [
          ...state.cierres,
          {
            ...cierre,
            id: uuidv4(),
            fecha_cierre: new Date().toISOString()
          }
        ]
      })),
      getCierresByCajero: (cajero_id) => get().cierres.filter(c => c.cajero_id === cajero_id)
    }),
    {
      name: 'quadra-cierres-storage-v4'
    }
  )
);
