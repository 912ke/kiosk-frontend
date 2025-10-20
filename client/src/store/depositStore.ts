import { create } from 'zustand';

interface DepositState {
  amount: number;
  invoiceId?: string;
  status: 'idle' | 'pending' | 'success' | 'error';
  setAmount: (amount: number) => void;
  setInvoiceId: (id: string) => void;
  setStatus: (status: DepositState['status']) => void;
  clearDeposit: () => void;
}

export const useDepositStore = create<DepositState>((set) => ({
  amount: 0,
  status: 'idle',
  setAmount: (amount) => set({ amount }),
  setInvoiceId: (invoiceId) => set({ invoiceId }),
  setStatus: (status) => set({ status }),
  clearDeposit: () => set({ amount: 0, invoiceId: undefined, status: 'idle' }),
}));
