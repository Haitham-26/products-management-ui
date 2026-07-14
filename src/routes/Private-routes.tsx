import type { RouteObject } from "react-router-dom";
import { Layout } from "../Layout";
import { AppPrivateRoute } from "./AppPrivateRoute";
import { Dashboard } from "./dashboard/Dashboard";
import { Products } from "./products/Products";
import { Categories } from "./categories/Categories";
import { Tags } from "./tags/Tags";
import { Orders } from "./orders/Orders";
import { settingsRoutes } from "./settings/SettingsRoutes";
import { UsersPermissions } from "./users-permissions/UsersPermissions";
import { Profile } from "./profile/Profile";
import { appRoutes } from "../utils/appRoutes";

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
  errorElement: <div>Something wrong happened</div>,
};
