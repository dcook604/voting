import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'admin' | 'council' | 'observer';

type SessionState = {
  role: Role;
  email: string | null;
  setRole: (role: Role) => void;
  setEmail: (email: string) => void;
  logout: () => void;
};

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      role: (localStorage.getItem('user_role') as Role) || 'council',
      email: localStorage.getItem('user_email'),
      setRole: (role) => set({ role }),
      setEmail: (email) => {
        set({ email });
        localStorage.setItem('user_email', email);
      },
      logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_role');
        set({ role: 'council', email: null });
      }
    }),
    {
      name: 'session-storage'
    }
  )
);
