import type { RouteObject } from "react-router-dom";
import { Layout } from "../Layout";
import { AppPrivateRoute } from "./AppPrivateRoute";
import { settingsRoutes } from "./settings/SettingsRoutes";
import { appRoutes } from "../utils/appRoutes";
import { Error } from "./error/Error";
import { lazy } from "react";

const Dashboard = lazy(() =>
  import("./dashboard/Dashboard").then((m) => ({ default: m.default })),
);
const Categories = lazy(() =>
  import("./categories/Categories").then((m) => ({ default: m.default })),
);
const Orders = lazy(() =>
  import("./orders/Orders").then((m) => ({ default: m.default })),
);
const Products = lazy(() =>
  import("./products/Products").then((m) => ({ default: m.default })),
);
const Returns = lazy(() =>
  import("./returns/Returns").then((m) => ({ default: m.default })),
);
const Tags = lazy(() =>
  import("./tags/Tags").then((m) => ({ default: m.default })),
);
const UsersPermissions = lazy(() =>
  import("./users-permissions/UsersPermissions").then((m) => ({
    default: m.default,
  })),
);
const Profile = lazy(() =>
  import("./profile/Profile").then((m) => ({ default: m.default })),
);

export const PrivateRoutes: RouteObject = {
  element: <Layout />,
  children: [
    {
      path: appRoutes.dashboard.path,
      element: <AppPrivateRoute component={<Dashboard />} />,
    },
    {
      path: appRoutes.products.path,
      element: <AppPrivateRoute component={<Products />} />,
    },
    {
      path: appRoutes.categories.path,
      element: <AppPrivateRoute component={<Categories />} />,
    },
    {
      path: appRoutes.tags.path,
      element: <AppPrivateRoute component={<Tags />} />,
    },
    {
      path: appRoutes.orders.path,
      element: <AppPrivateRoute component={<Orders />} />,
    },
    {
      path: appRoutes.returns.path,
      element: <AppPrivateRoute component={<Returns />} />,
    },
    settingsRoutes,
    {
      path: appRoutes.profile.path,
      element: <AppPrivateRoute component={<Profile />} />,
    },
    {
      path: appRoutes.usersPermissions.path,
      element: <AppPrivateRoute component={<UsersPermissions />} />,
    },
    {
      path: "*",
      element: <AppPrivateRoute redirect="/" replace />,
    },
  ],
  errorElement: <Error />,
};
