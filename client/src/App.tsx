import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Toast } from '@components';
import { useAuthStore } from '@store';

import { useQuery } from '@tanstack/react-query';
import { get } from '@utils';

function App() {
  const navigate = useNavigate();
  const toast = useAuthStore((state) => state.toast);
  const setToast = useAuthStore((state) => state.setToast);
  const token = useAuthStore((state) => state.token);
  console.log('Token:', token);
  useEffect(() => {
    if (window.location.pathname === '/') navigate('/account');
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get('/user', {
          Authorization: `Bearer ${token}`,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    };

    fetchData();
  }, [token]);

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
