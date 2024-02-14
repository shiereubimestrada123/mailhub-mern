import { create } from "zustand";

type ToastData = {
  success: boolean;
  message: string;
  email?: string;
};

type User = {
  _id: string;
  createdAt: Date;
  email: string;
  updatedAt: Date;
  name: {
    firstName: string;
    lastName: string;
    middleName?: string;
  };
};

type AccountState = {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;

  toast: ToastData;
  setToast: (value: ToastData) => void;

  token: string;
  setToken: (value: string) => void;

  userAccount: {
    user: User;
  };
  getUserAccount: (value: { user: User }) => void;
};

export const useAuthStore = create<AccountState>((set) => ({
  isLogin: true,
  toast: {
    success: false,
    message: "",
  },
  token: localStorage.getItem("token") ?? "",
  userAccount: {
    user: {
      _id: "",
      createdAt: new Date(),
      email: "",
      updatedAt: new Date(),
      name: {
        firstName: "",
        lastName: "",
      },
    },
  },

  setIsLogin: (value) => set({ isLogin: value }),
  setToast: (value) => set({ toast: value }),
  setToken: (value) => {
    localStorage.setItem("token", value);
    set({ token: value });
  },
  getUserAccount: (value) => set({ userAccount: value }),
}));
