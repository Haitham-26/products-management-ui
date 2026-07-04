import type React from "react";
import { Navigate } from "react-router-dom";

type AppPrivateRouteProps = {
  component?: React.ReactNode;
  redirect?: string;
  replace?: boolean;
  guard?: {
    isAllowed: boolean;
    redirect: string;
    replace?: boolean;
  };
};

export const AppPrivateRoute: React.FC<AppPrivateRouteProps> = ({
  component,
  redirect,
  replace,
  guard,
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (redirect) {
    return <Navigate to={redirect} replace={replace} />;
  }

  if (guard && !guard.isAllowed) {
    return <Navigate to={guard.redirect} replace={guard.replace || true} />;
  }

  return component;
};
