import { MdEmail } from "react-icons/md";
import { Login, Register } from "@features";
import { IconWrapper } from "@components";
import { useAuthStore } from "@store";

export function AccountPage() {
  const setIsLogin = useAuthStore((state) => state.setIsLogin);
  const isLogin = useAuthStore((state) => state.isLogin);

  return (
    <div className="flex h-full w-full flex-col items-center justify-evenly md:h-screen md:flex-row">
      <IconWrapper color="green" className="text-[15em] sm:text-[20em]">
        <MdEmail />
      </IconWrapper>

      <div className="mb-10 rounded-2xl border-2 border-slate-200 p-5">
        {isLogin ? (
          <>
            <Login />
            <a
              className="link block text-center no-underline hover:text-blue-400"
              onClick={() => setIsLogin(!isLogin)}
            >
              Create a new account
            </a>
          </>
        ) : (
          <>
            <Register />
            <a
              className="link block text-center no-underline hover:text-blue-400"
              onClick={() => setIsLogin(!isLogin)}
            >
              Login an existing account
            </a>
          </>
        )}
      </div>
    </div>
  );
}
