import { createContext, useContext } from "react";
import type { NotificationInstance } from "antd/es/notification/interface";

export const ToastContext = createContext<NotificationInstance | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
};
