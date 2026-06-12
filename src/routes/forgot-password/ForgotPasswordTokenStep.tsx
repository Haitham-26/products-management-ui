import type React from "react";
import { AuthContainer } from "../../components/AuthContainer";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { Toast } from "../../utils/Toast";
import { userActions } from "../../redux/user/user.slice";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import type { ForgotPasswordTokenDto } from "../../model/user/dto/ForgotPasswordTokenDto";
import { VerificationCodeInput } from "../../components/VerificationCodeInput";
import styled from "styled-components";
import { ResendVerificationButton } from "../../components/ResendTokenButton";

const LAST_RESEND_LOCAL_STORAGE_KEY = "forgot-password-token-last-resend-time";

const TokenInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(${({ theme }) => theme.spacing.md} / 2);
`;

export const ForgotPasswordTokenStep: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

      Toast.success(
        "We verified your email, now you can create a new password!",
      );

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
      title="Reset password"
      description="Enter your email to reset your password. We will send you an email with a verification code to verify your email in the next step."
      formItems={[
        <TokenInputContainer>
          <Controller
            control={control}
            name="token"
            rules={{
              required: "Token is required",
              minLength: {
                value: 6,
                message: "Token must be at 6 characters",
              },
              maxLength: {
                value: 6,
                message: "Token must be at 6 characters",
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
          Verify & Continue
        </Button>,
      ]}
    />
  );
};
