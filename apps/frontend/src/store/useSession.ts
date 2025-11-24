import { create } from 'zustand';

type Role = 'admin' | 'council' | 'observer';

type SessionState = {
  role: Role;
  setRole: (role: Role) => void;
};

export const useSession = create<SessionState>((set) => ({
  role: 'council',
  setRole: (role) => set({ role })
}));
