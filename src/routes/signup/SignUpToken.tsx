import type React from "react";
import { Controller, useForm } from "react-hook-form";
import { Fragment, useEffect, useState } from "react";
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

      Toast.success("Account verified successfully");
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
      title="Confirm your email"
      description={
        <Fragment>
          We sent the verification code to your email
          <BoldSpan> "{state?.email}"</BoldSpan>, please enter it below.
        </Fragment>
      }
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
        <Button loading={loading} onClick={handleSubmit(onSignUp)}>
          Verify & Continue
        </Button>,
      ]}
    />
  );
};
