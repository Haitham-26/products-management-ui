import type React from "react";
import { AuthContainer } from "../../components/AuthContainer";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { userActions } from "../../redux/user/user.slice";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import type { ForgotPasswordTokenDto } from "../../model/user/dto/ForgotPasswordTokenDto";
import { VerificationCodeInput } from "../../components/VerificationCodeInput";
import styled from "styled-components";
import { ResendVerificationButton } from "../../components/ResendTokenButton";
import { Trans, useTranslation } from "react-i18next";
import { useAppToast } from "../../components/toast/useAppToast";

const LAST_RESEND_LOCAL_STORAGE_KEY = "forgot-password-token-last-resend-time";

const TokenInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(${({ theme }) => theme.spacing.md} / 2);
`;

const BoldSpan = styled.span`
  font-weight: bold;
`;

export const ForgotPasswordTokenStep: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const Toast = useAppToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    state: { email },
  } = useLocation();
  const { control, getValues, handleSubmit, watch } =
    useForm<ForgotPasswordTokenDto>({
      defaultValues: {
        email,
        token: "",
      },
    });

  const token = watch("token");

  const resendToken = () => {
    return dispatch(
      userActions.forgotPasswordEmail({ email: getValues("email") }),
    ).unwrap();
  };

  const onSubmit = async () => {
    try {
      setLoading(true);

      const dto = getValues();

      await dispatch(userActions.forgotPasswordToken(dto)).unwrap();

      Toast.success(t("forgotPassword.token.success"));

      localStorage.removeItem(LAST_RESEND_LOCAL_STORAGE_KEY);

      navigate("/forgot-password/new", { state: dto, replace: true });
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  return (
    <AuthContainer
      title={t("forgotPassword.token.title")}
      description={
        <Trans
          i18nKey="forgotPassword.token.description"
          values={{ email }}
          components={[<BoldSpan />]}
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
        <Button
          onClick={handleSubmit(onSubmit)}
          loading={loading}
          disabled={!token.length || token.length < 6}
        >
          {t("forgotPassword.token.submit")}
        </Button>,
      ]}
    />
  );
};
