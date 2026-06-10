import type { RouteObject } from "react-router-dom";
import { PublicLayout } from "../PublicLayout";
import { Login } from "./login/Login";
import { SignUpEmail } from "./signup/SignUpEmail";
import { AppPublicRoute } from "./AppPublicRoute";
import { SignUpToken } from "./signup/SignUpToken";
import { ForgotPasswordEmailStep } from "./forgot-password/ForgotPasswordEmailStep";
import { ForgotPasswordTokenStep } from "./forgot-password/ForgotPasswordTokenStep";
import { ForgotPasswordNewStep } from "./forgot-password/ForgotPasswordNew";

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
      path: "/forgot-password",
      element: <AppPublicRoute component={<ForgotPasswordEmailStep />} />,
    },
    {
      path: "/forgot-password/token",
      element: <AppPublicRoute component={<ForgotPasswordTokenStep />} />,
    },
    {
      path: "/forgot-password/new",
      element: <AppPublicRoute component={<ForgotPasswordNewStep />} />,
    },
    {
      path: "*",
      element: <AppPublicRoute redirect="/" replace />,
    },
  ],
  errorElement: <div>Something wrong happened</div>,
};
