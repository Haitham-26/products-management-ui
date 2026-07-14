import { ToastContext } from "./ToastContext";
import React from "react";
import { notification } from "antd";

export const ToastProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [api, contextHolder] = notification.useNotification();

  return (
    <ToastContext.Provider value={api}>
      {contextHolder}
      {children}
    </ToastContext.Provider>
  );
};
