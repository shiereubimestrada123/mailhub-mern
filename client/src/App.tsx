import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Toast } from '@components';
import { useAuthStore } from '@store';

function App() {
  const navigate = useNavigate();
  const toast = useAuthStore((state) => state.toast);
  const setToast = useAuthStore((state) => state.setToast);
  const token = useAuthStore((state) => state.token);
  console.log(token);
  useEffect(() => {
    if (window.location.pathname === '/') navigate('/account');
  }, []);

  const handleToastClose = () => {
    setToast({ success: false, message: '' });
  };

  return (
    <div data-theme='light'>
      {!!toast.message && (
        <Toast
          position='toast-top toast-center'
          alertType={toast.success}
          message={toast.message}
          onClose={handleToastClose}
        />
      )}
      <Outlet />
    </div>
  );
}

export default App;
