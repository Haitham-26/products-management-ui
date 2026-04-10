import type { RouteObject } from "react-router-dom";
import { PublicLayout } from "../PublicLayout";
import { Login } from "./login/Login";
import { SignUpEmail } from "./signup/SignUpEmail";
import { AppPublicRoute } from "./AppPublicRoute";
import { SignUpToken } from "./signup/SignUpToken";

export const PublicRoutes: RouteObject = {
  element: <PublicLayout />,
  children: [
    {
      path: "/",
      element: <AppPublicRoute component={<Login />} />,
    },
    {
      path: "/login",
      element: <AppPublicRoute component={<Login />} />,
    },
    {
      path: "/signup",
      element: <AppPublicRoute component={<SignUpEmail />} />,
    },
    {
      path: "/signup/email-verification",
      element: <AppPublicRoute component={<SignUpToken />} />,
    },
    {
      path: "*",
      element: <AppPublicRoute redirect="/" replace />,
    },
  ],
  errorElement: <div>Something wrong happened</div>,
};
