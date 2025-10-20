import { create } from 'zustand';

interface ClientState {
  id?: string;
  phone: string;
  name: string;
  token?: string;
  setClient: (client: Partial<ClientState>) => void;
  clearClient: () => void;
}

export const useClientStore = create<ClientState>((set) => ({
  phone: '',
  name: '',
  setClient: (client) => set((state) => ({ ...state, ...client })),
  clearClient: () => set({ phone: '', name: '', id: undefined, token: undefined }),
}));
