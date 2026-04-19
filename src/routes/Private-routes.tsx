import type { RouteObject } from "react-router-dom";
import { Layout } from "../Layout";
import { AppPrivateRoute } from "./AppPrivateRoute";
import { Dashboard } from "./dashboard/Dashboard";
import { Products } from "./products/Products";
import { Categories } from "./categories/Categories";
import { Tags } from "./tags/Tags";
import { Orders } from "./orders/Orders";

export const PrivateRoutes: RouteObject = {
  element: <Layout />,
  children: [
    {
      path: "/",
      element: <AppPrivateRoute component={<Dashboard />} />,
    },
    {
      path: "/products",
      element: <AppPrivateRoute component={<Products />} />,
    },
    {
      path: "/categories",
      element: <AppPrivateRoute component={<Categories />} />,
    },
    {
      path: "/tags",
      element: <AppPrivateRoute component={<Tags />} />,
    },
    {
      path: "/orders",
      element: <AppPrivateRoute component={<Orders />} />,
    },
    {
      path: "*",
      element: <AppPrivateRoute redirect="/" replace />,
    },
  ],
  errorElement: <div>Something wrong happened</div>,
};
