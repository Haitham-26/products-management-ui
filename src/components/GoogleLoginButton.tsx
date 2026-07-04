import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import type React from "react";
import { Toast } from "../utils/Toast";
import { useAppDispatch } from "../redux/store";
import { userActions } from "../redux/user/user.slice";
import { useNavigate } from "react-router-dom";

export const GoogleLoginButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      if (!idToken) {
        Toast.error("Invalid Google token");
        return;
      }

      await dispatch(userActions.googleLogin({ idToken })).unwrap();

      navigate("/", { replace: true });
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
    />
  );
};
