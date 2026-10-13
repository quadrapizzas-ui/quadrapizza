import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MockUser {
  id: number;
  name: string;
  dni: string;
  role: string;
  email: string;
  pin: string;
  active: boolean;
}

interface AuthState {
  users: MockUser[];
  activeUser: MockUser | null;
  setUsers: (users: MockUser[]) => void;
  getUserByDni: (dni: string, requiredRole?: string) => MockUser | null;
  loginByDniAndPin: (dni: string, pin: string, requiredRole?: string) => boolean;
  loginByPin: (pin: string, requiredRole?: string) => boolean;
  logout: () => void;
  updateUser: (userId: number, data: Partial<MockUser>) => void;
}

const INITIAL_USERS: MockUser[] = [
  { id: 1, name: "Hector Zanier", role: "Gerencia",  email: "hector@quadrapizza.com", dni: "40299684", pin: "1234", active: true  },
  { id: 2, name: "Ana Maria",     role: "Recepción", email: "ana@quadrapizza.com",    dni: "40299684", pin: "1234", active: true  },
  { id: 3, name: "Carlos Gomez", role: "Cocina",    email: "carlos@quadrapizza.com", dni: "40299684", pin: "1234", active: true  },
  { id: 4, name: "Mario Rossi",  role: "Delivery",  email: "mario@quadrapizza.com",  dni: "40299684", pin: "1234", active: true },
  { id: 5, name: "Lucas Rodriguez", role: "Cocina", email: "lucas@quadrapizza.com", dni: "40299684", pin: "1234", active: true },
  { id: 6, name: "Sofia Martinez", role: "Recepción", email: "sofia@quadrapizza.com", dni: "40299684", pin: "1234", active: true },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: INITIAL_USERS,
      activeUser: null,
      
      setUsers: (users) => set({ users }),

      getUserByDni: (dni, requiredRole) => {
        const cleanDni = dni.trim().replace(/\D/g, '');
        const matchingUsers = get().users.filter((u) => {
          if (!u.active) return false;
          const userDni = (u.dni || "").trim().replace(/\D/g, '');
          return userDni === cleanDni;
        });

        if (matchingUsers.length === 0) return null;

        if (requiredRole) {
          // Priorizar coincidencia exacta de rol para el sector actual
          const exactRoleUser = matchingUsers.find((u) => u.role === requiredRole);
          if (exactRoleUser) return exactRoleUser;

          // Luego gerentes o administradores con permisos globales
          const managerUser = matchingUsers.find((u) => u.role === "Gerencia" || u.role === "Admin");
          if (managerUser) return managerUser;

          return null;
        }

        return matchingUsers[0];
      },

      loginByDniAndPin: (dni, pin, requiredRole) => {
        const user = get().getUserByDni(dni, requiredRole);
        if (user && user.pin === pin) {
          set({ activeUser: user });
          return true;
        }
        return false;
      },
      
      loginByPin: (pin, requiredRole) => {
        const user = get().users.find((u) => {
          if (!u.active || u.pin !== pin) return false;
          if (requiredRole) {
            if (u.role === "Gerencia" || u.role === "Admin") return true;
            return u.role === requiredRole;
          }
          return true;
        });
        if (user) {
          set({ activeUser: user });
          return true;
        }
        return false;
      },
      
      logout: () => set({ activeUser: null }),
      
      updateUser: (userId, data) => set((state) => ({
        users: state.users.map((u) => u.id === userId ? { ...u, ...data } : u)
      })),
    }),
    {
      name: 'quadra-auth-storage-v5',
      version: 5,
      migrate: (persistedState: any) => {
        if (!persistedState || !Array.isArray(persistedState.users)) return persistedState;
        persistedState.users = persistedState.users.map((u: any) => ({
          ...u,
          dni: "40299684",
          pin: "1234",
        }));
        return persistedState;
      },
    }
  )
);
