import type React from "react";
import { useAppSelector } from "../../redux/store";
import userSliceSelectors from "../../redux/user/user.selector";
import { AppPrivateRoute } from "../AppPrivateRoute";
import { SecuritySettings } from "./sections/SecuritySettings";
import { SignUpMethods } from "../../model/user/types/SignUpMethods";
import { SettingsKeys } from "../../model/settings/types/SettingsKeys.enum";

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
