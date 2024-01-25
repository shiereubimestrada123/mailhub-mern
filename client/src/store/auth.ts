import { create } from 'zustand';

type ToastData = {
  success: boolean;
  message: string;
  email?: string;
  // Add other properties as needed
};

type AccountState = {
  toast: ToastData;
  setToast: (value: ToastData) => void;
};

export const useAuthStore = create<AccountState>((set) => ({
  toast: {
    success: false,
    message: '',
  },
  setToast: (value) => set({ toast: value }),
}));
