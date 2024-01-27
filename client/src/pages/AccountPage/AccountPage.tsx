import { MdEmail } from 'react-icons/md';
import { Login, Register } from '@features';
import { IconWrapper } from '@components';
import { useAuthStore } from '@store';

export function AccountPage() {
  const setIsLogin = useAuthStore((state) => state.setIsLogin);
  const isLogin = useAuthStore((state) => state.isLogin);

  return (
    <div className='flex flex-col items-center w-full h-full md:h-screen md:flex-row justify-evenly'>
      <IconWrapper color='green' className='sm:text-[20em] text-[15em]'>
        <MdEmail />
      </IconWrapper>

      <div className='p-5 mb-10 border-2 rounded-2xl border-slate-200'>
        {isLogin ? (
          <>
            <Login />
            <a
              className='block text-center no-underline link hover:text-blue-400'
              onClick={() => setIsLogin(!isLogin)}
            >
              Create a new account
            </a>
          </>
        ) : (
          <>
            <Register />
            <a
              className='block text-center no-underline link hover:text-blue-400'
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
