import type React from "react";
import { useAppSelector } from "../../redux/store";
import userSliceSelectors from "../../redux/user/user.selector";
import { AppPrivateRoute } from "../AppPrivateRoute";
import { SignUpMethods } from "../../model/user/types/SignUpMethods";
import { SettingsKeys } from "../../model/settings/types/SettingsKeys.enum";
import { lazy } from "react";

const SecuritySettings = lazy(() =>
  import("./sections/SecuritySettings").then((m) => ({ default: m.default })),
);

export const SecuritySettingsRoute: React.FC = () => {
  const user = useAppSelector(userSliceSelectors.selectUser)!;

  return (
    <AppPrivateRoute
      component={<SecuritySettings />}
      guard={{
        isAllowed: user.signUpMethod === SignUpMethods.EMAIL,
        redirect: `/settings/${SettingsKeys.GENERAL}`,
      }}
    />
  );
};
