import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Toast } from "@components";
import { useAuthStore } from "@store";
// import { useQuery } from "@tanstack/react-query";
import { get } from "@utils";

function App() {
  const navigate = useNavigate();
  const toast = useAuthStore((state) => state.toast);
  const setToast = useAuthStore((state) => state.setToast);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) return navigate("/account");
    navigate("/email/inbox");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      const responseData = await get("/user");
      return responseData;
    };

    fetchData();
  }, []);

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
