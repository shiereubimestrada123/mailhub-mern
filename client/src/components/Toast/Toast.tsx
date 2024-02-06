import { useState, useEffect } from "react";

type ToastType = {
  onClose?: () => void;
  alertType?: boolean;
  message: string;
  position: string;
};

export function Toast({ onClose, alertType, message, position }: ToastType) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVisible(false);

      onClose && onClose();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [onClose]);

  const alertPrefix = alertType ? "alert-success" : "alert-info";

  return visible ? (
    <div className={`toast ${position}`}>
      <div className={`alert ${alertPrefix}`}>
        <span>{message}</span>
      </div>
    </div>
  ) : null;
}
