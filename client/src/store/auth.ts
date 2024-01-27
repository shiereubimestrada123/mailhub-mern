import { create } from 'zustand';

type ToastData = {
  success: boolean;
  message: string;
  email?: string;
};

type AccountState = {
  toast: ToastData;
  setToast: (value: ToastData) => void;

  token: string;
  setToken: (value: string) => void;
};

export const useAuthStore = create<AccountState>((set) => ({
  toast: {
    success: false,
    message: '',
  },
  token: localStorage.getItem('token') ?? '',

  setToast: (value) => set({ toast: value }),
  setToken: (value) => {
    localStorage.setItem('token', value);
    set({ token: value });
  },
}));
