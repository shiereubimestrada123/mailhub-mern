import { create } from 'zustand';

type AuthState = {
  // isLogin: boolean;
  // setIsLogin: (isLogin: boolean) => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  // isLogin: false,
  // setIsLogin: () => {
  //   set(() => ({ isLogin: true }));
  // },
}));
