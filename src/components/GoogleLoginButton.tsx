import { useGoogleLogin } from "@react-oauth/google";
import type React from "react";
import { useAppDispatch } from "../redux/store";
import { userActions } from "../redux/user/user.slice";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppToast } from "./toast/useAppToast";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { AppLangs } from "../model/app/types/AppLangs.enum";
import { Button } from "./Button";
import { Image } from "./Image";
import { Images } from "../assets";
import styled from "styled-components";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GoogleRedirectPaths } from "../model/user/types/GoogleRedirectPaths.enum";

const StyledButton = styled(Button)`
  background-color: transparent;
  padding: 0;
  width: 2.5rem;
  height: 2.5rem;
  border: ${({ theme }) => `1px solid ${theme.colors.border}`};
  border-radius: ${({ theme }) => theme.radius.circle};

  ${({ loading, theme }) =>
    loading
      ? `
    background-color: ${theme.colors.primary}15;
    border-color: ${theme.colors.primary}15;

    img {
      opacity: 0.1;
    }
  `
      : ""}

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}15;
    background-color: ${({ theme }) => theme.colors.primary}15;
  }
`;

export const GoogleLoginButton: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handledCode = useRef(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const Toast = useAppToast();
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const login = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: `${window.location.origin}${pathname}`,
  });

  const handleSuccess = useCallback(
    async (code: string) => {
      try {
        setLoading(true);

        await dispatch(
          userActions.googleLogin({
            code,
            lang: (i18n.language || AppLangs.EN) as AppLangs,
            redirectPath: pathname as GoogleRedirectPaths,
          }),
        ).unwrap();

        navigate("/", { replace: true });

        Toast.success(t("login.success"));
      } catch (e) {
        console.log(e);
        Toast.apiError(e);
      } finally {
        setLoading(false);
      }
    },
    [Toast, dispatch, navigate, t, pathname],
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (!code || handledCode.current) {
      return;
    }

    handledCode.current = true;

    url.searchParams.delete("code");
    window.history.replaceState({}, "", url.pathname);

    handleSuccess(code);
  }, [handleSuccess]);

  return (
    <StyledButton
      onClick={() => login()}
      loading={loading}
      spinnerColor="primary"
    >
      <Image src={Images.Google} width={20} height={20} />
    </StyledButton>
  );
};
