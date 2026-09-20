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
}

interface CierresState {
  cierres: MockCierre[];
  addCierre: (cierre: Omit<MockCierre, 'id' | 'fecha_cierre'>) => void;
  getCierresByCajero: (cajero_id: number) => MockCierre[];
}

const generateMockCierres = (): MockCierre[] => {
  const cierres: MockCierre[] = [];
  for(let i = 0; i < 60; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i - 1);
    cierres.push({
      id: uuidv4(),
      cajero_id: Math.random() > 0.5 ? 2 : 1,
      cajero_name: Math.random() > 0.5 ? "Ana Maria" : "Hector Zanier",
      fecha_cierre: date.toISOString(),
      monto_total: Math.floor(50000 + Math.random() * 150000),
      efectivo_total: Math.floor(20000 + Math.random() * 80000),
      otros_medios_total: Math.floor(20000 + Math.random() * 80000),
      cantidad_pedidos: Math.floor(10 + Math.random() * 40)
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
      name: 'quadra-cierres-storage-v3'
    }
  )
);
