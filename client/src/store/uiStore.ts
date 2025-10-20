import { create } from 'zustand';

interface UIState {
  loading: boolean;
  error: string | null;
  lastActivity: number;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateActivity: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  loading: false,
  error: null,
  lastActivity: Date.now(),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  updateActivity: () => set({ lastActivity: Date.now() }),
}));
