import { create } from "zustand";

type ToastData = {
  success: boolean;
  message: string;
  email?: string;
};

type AccountState = {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;

  toast: ToastData;
  setToast: (value: ToastData) => void;

  token: string;
  setToken: (value: string) => void;

  userAccount: object;
  getUserAccount: (value: object) => void;
};

export const useAuthStore = create<AccountState>((set) => ({
  isLogin: true,
  toast: {
    success: false,
    message: "",
  },
  token: localStorage.getItem("token") ?? "",
  userAccount: {},

  setIsLogin: (value) => set({ isLogin: value }),
  setToast: (value) => set({ toast: value }),
  setToken: (value) => {
    localStorage.setItem("token", value);
    set({ token: value });
  },
  getUserAccount: (value) => set({ userAccount: value }),
}));
