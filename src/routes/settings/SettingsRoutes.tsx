import { type RouteObject } from "react-router-dom";
import { SettingsLayout } from "./components/SettingsLayout";
import { GeneralSettings } from "./sections/GeneralSettings";
import { AppPrivateRoute } from "../AppPrivateRoute";
import { SettingsKeys } from "../../model/settings/types/SettingsKeys.enum";
import { InventorySettings } from "./sections/InventorySettings";

export const settingsRoutes: RouteObject = {
  path: "/settings",
  element: <SettingsLayout />,
  children: [
    {
      index: true,
      element: <AppPrivateRoute redirect={SettingsKeys.GENERAL} replace />,
    },
    {
      path: SettingsKeys.GENERAL,
      element: <AppPrivateRoute component={<GeneralSettings />} />,
    },
    {
      path: SettingsKeys.INVENTORY,
      element: <AppPrivateRoute component={<InventorySettings />} />,
    },
  ],
};
