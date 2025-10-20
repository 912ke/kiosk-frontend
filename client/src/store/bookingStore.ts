import { create } from 'zustand';

interface BookingState {
  hallId?: number;
  hostIds: number[];
  date: string;
  from: string;
  to: string;
  duration: number;
  count: number;
  setBookingData: (data: Partial<BookingState>) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  hostIds: [],
  date: '',
  from: '',
  to: '',
  duration: 60,
  count: 1,
  setBookingData: (data) => set((state) => ({ ...state, ...data })),
  clearBooking: () => set({ 
    hallId: undefined,
    hostIds: [], 
    date: '', 
    from: '', 
    to: '', 
    duration: 60, 
    count: 1 
  }),
}));
