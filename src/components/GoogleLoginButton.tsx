import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import type React from "react";
import { useAppDispatch } from "../redux/store";
import { userActions } from "../redux/user/user.slice";
import { useNavigate } from "react-router-dom";
import { useAppToast } from "./toast/useAppToast";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { AppLangs } from "../model/app/types/AppLangs.enum";

export const GoogleLoginButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const Toast = useAppToast();
  const { t } = useTranslation();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      if (!idToken) {
        Toast.error("Invalid Google token");
        return;
      }

      await dispatch(
        userActions.googleLogin({
          idToken,
          lang: (i18n.language || AppLangs.EN) as AppLangs,
        }),
      ).unwrap();

      navigate("/", { replace: true });

      Toast.success(t("login.success"));
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        console.log("Login Failed");
      }}
      type="icon"
      shape="circle"
      ux_mode="popup"
    />
  );
};
