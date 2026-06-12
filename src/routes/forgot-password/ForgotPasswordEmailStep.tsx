import type React from "react";
import { AuthContainer } from "../../components/AuthContainer";
import { Controller, useForm } from "react-hook-form";
import type { ForgotPasswordEmailDto } from "../../model/user/dto/ForgotPasswordEmailDto";
import { useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { Toast } from "../../utils/Toast";
import { userActions } from "../../redux/user/user.slice";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

export const ForgotPasswordEmailStep: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { control, getValues, handleSubmit, watch } =
    useForm<ForgotPasswordEmailDto>({
      defaultValues: {
        email: "",
      },
    });

  const email = watch("email");

  const onSubmit = async () => {
    try {
      setLoading(true);

      const { email } = getValues();

      await dispatch(userActions.forgotPasswordEmail({ email })).unwrap();

      Toast.success(
        "We sent the verification code to your email, please check your inbox",
      );

      navigate("/forgot-password/token", { state: { email }, replace: true });
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Reset password"
      description="Enter your email to reset your password. We will send you an email with a verification code to verify your email in the next step."
      formItems={[
        <Controller
          control={control}
          name="email"
          rules={{ required: "Please enter your email" }}
          render={({ field, fieldState: { error } }) => (
            <Input
              title="Email"
              placeholder="example@gmail.com"
              type="email"
              required
              valid={!error}
              errorMessage={error?.message}
              {...field}
            />
          )}
        />,
        <Button
          onClick={handleSubmit(onSubmit)}
          loading={loading}
          disabled={!email.length}
        >
          Continue
        </Button>,
      ]}
    />
  );
};
