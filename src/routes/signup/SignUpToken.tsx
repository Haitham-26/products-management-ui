import type React from "react";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { userActions } from "../../redux/user/user.slice";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/Button";
import type { SignUpTokenDto } from "../../model/user/dto/SignUpTokenDto";
import { Toast } from "../../utils/Toast";
import { VerificationCodeInput } from "../../components/VerificationCodeInput";
import { AuthContainer } from "../../components/AuthContainer";
import styled from "styled-components";
import { ResendVerificationButton } from "../../components/ResendTokenButton";
import { Trans, useTranslation } from "react-i18next";

const LAST_RESEND_LOCAL_STORAGE_KEY = "signup-token-last-resend-time";

const TokenInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(${({ theme }) => theme.spacing.md} / 2);
`;

const BoldSpan = styled.span`
  font-weight: 600;
`;

export const SignUpToken: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state } = useLocation();
  const { control, handleSubmit, getValues } = useForm<SignUpTokenDto>({
    defaultValues: {
      email: state?.email,
      token: "",
    },
  });

  const resendToken = () => {
    return dispatch(
      userActions.signUpResendToken({ email: getValues("email") }),
    ).unwrap();
  };

  const onSignUp = async () => {
    try {
      setLoading(true);

      await dispatch(userActions.signUpToken(getValues())).unwrap();

      localStorage.removeItem(LAST_RESEND_LOCAL_STORAGE_KEY);

      navigate("/dashboard", { replace: true });

      Toast.success(t("signup.token.success"));
    } catch (e) {
      console.error(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!state?.email) {
      navigate("/", { replace: true });
    }
  }, [state?.email, navigate]);

  return (
    <AuthContainer
      title={t("signup.token.title")}
      description={
        <Trans
          i18nKey="signup.token.description"
          components={[<BoldSpan />]}
          values={{ email: state?.email }}
        />
      }
      formItems={[
        <TokenInputContainer>
          <Controller
            control={control}
            name="token"
            rules={{
              required: t("errors.general.required"),
              minLength: {
                value: 6,
                message: t("errors.token.length"),
              },
              maxLength: {
                value: 6,
                message: t("errors.token.length"),
              },
            }}
            render={({ field, fieldState }) => (
              <VerificationCodeInput
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />

          <ResendVerificationButton
            localStorageKey={LAST_RESEND_LOCAL_STORAGE_KEY}
            onResend={resendToken}
          />
        </TokenInputContainer>,

        <Button loading={loading} onClick={handleSubmit(onSignUp)}>
          {t("signup.token.submit")}
        </Button>,
      ]}
    />
  );
};
