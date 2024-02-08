import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Toast } from "@components";
import { useAuthStore } from "@store";
import { get } from "@utils";

function App() {
  const navigate = useNavigate();
  const toast = useAuthStore((state) => state.toast);
  const setToast = useAuthStore((state) => state.setToast);
  const token = useAuthStore((state) => state.token);
  const getUserAccount = useAuthStore((state) => state.getUserAccount);

  useEffect(() => {
    if (!token) return navigate("/account");
    navigate("/email/inbox");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      const responseData = await get("/account/user");
      getUserAccount(responseData);
    };

    fetchData();
  }, [token]);

  const handleToastClose = () => {
    setToast({ success: false, message: "" });
  };

  return (
    <div data-theme="light">
      {!!toast.message && (
        <Toast
          position="toast-top toast-center"
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
