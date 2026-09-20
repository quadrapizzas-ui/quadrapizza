import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MockUser {
  id: number;
  name: string;
  role: string;
  email: string;
  pin: string;
  active: boolean;
}

interface AuthState {
  users: MockUser[];
  activeUser: MockUser | null;
  setUsers: (users: MockUser[]) => void;
  loginByPin: (pin: string, requiredRole?: string) => boolean;
  logout: () => void;
  updateUser: (userId: number, data: Partial<MockUser>) => void;
}

const INITIAL_USERS: MockUser[] = [
  { id: 1, name: "Hector Zanier", role: "Gerencia",  email: "hector@quadrapizza.com", pin: "0000", active: true  },
  { id: 2, name: "Ana Maria",     role: "Recepción", email: "ana@quadrapizza.com",    pin: "1234", active: true  },
  { id: 3, name: "Carlos Gomez", role: "Cocina",    email: "carlos@quadrapizza.com", pin: "2222", active: true  },
  { id: 4, name: "Mario Rossi",  role: "Delivery",  email: "mario@quadrapizza.com",  pin: "3333", active: false },
  { id: 5, name: "Lucas Rodriguez", role: "Cocina", email: "lucas@quadrapizza.com", pin: "4444", active: true },
  { id: 6, name: "Sofia Martinez", role: "Recepción", email: "sofia@quadrapizza.com", pin: "5555", active: true },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: INITIAL_USERS,
      activeUser: null,
      
      setUsers: (users) => set({ users }),
      
      loginByPin: (pin, requiredRole) => {
        const user = get().users.find((u) => {
          if (!u.active || u.pin !== pin) return false;
          if (requiredRole && requiredRole !== "Admin" && requiredRole !== "Gerencia") {
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
      name: 'quadra-auth-storage-v3',
    }
  )
);
