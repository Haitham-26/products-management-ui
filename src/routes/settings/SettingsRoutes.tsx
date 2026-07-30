import { type RouteObject } from "react-router-dom";
import { SettingsLayout } from "./components/SettingsLayout";
import { AppPrivateRoute } from "../AppPrivateRoute";
import { SettingsKeys } from "../../model/settings/types/SettingsKeys.enum";
import { SecuritySettingsRoute } from "./SecuritySettingsRoute";
import { appRoutes } from "../../utils/appRoutes";
import { lazy } from "react";

const GeneralSettings = lazy(() =>
  import("./sections/GeneralSettings").then((m) => ({ default: m.default })),
);
const InventorySettings = lazy(() =>
  import("./sections/InventorySettings").then((m) => ({ default: m.default })),
);

export const settingsRoutes: RouteObject = {
  path: appRoutes.settings.path,
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
    // SecuritySettings component is lazy loaded inside the SecuritySettingsRoute
    {
      path: SettingsKeys.SECURITY,
      element: <SecuritySettingsRoute />,
    },
  ],
};
