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

  const onSubmit = async () => {
    try {
      setLoading(true);

      const dto = getValues();

      await dispatch(userActions.forgotPasswordToken(dto)).unwrap();

      Toast.success(
        "We verified your email, now you can create a new password!",
      );

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
        <Controller
          control={control}
          name="token"
          rules={{ required: "Please enter your email" }}
          render={({ field, fieldState: { error } }) => (
            <VerificationCodeInput {...field} errorMessage={error?.message} />
          )}
        />,
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
