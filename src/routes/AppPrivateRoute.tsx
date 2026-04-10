import type React from "react";
import { Navigate } from "react-router-dom";

type AppPrivateRouteProps = {
  component?: React.ReactNode;
  redirect?: string;
  replace?: boolean;
};

export const AppPrivateRoute: React.FC<AppPrivateRouteProps> = ({
  component,
  redirect,
  replace,
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (redirect) {
    return <Navigate to={redirect} replace={replace} />;
  }

  return component;
};
