import type React from "react";
import { Navigate } from "react-router-dom";

type AppPublicRouteProps = {
  component?: React.ReactNode;
  redirect?: string;
  replace?: boolean;
};

export const AppPublicRoute: React.FC<AppPublicRouteProps> = ({
  component,
  redirect,
  replace,
}) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  if (redirect) {
    return <Navigate to={redirect} replace={replace} />;
  }

  return component;
};
