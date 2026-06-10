import type React from "react";
import { AuthContainer } from "../../components/AuthContainer";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { Toast } from "../../utils/Toast";
import { userActions } from "../../redux/user/user.slice";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import type { ForgotPasswordNewDto } from "../../model/user/dto/ForgotPasswordNewDto";

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 64;

export const ForgotPasswordNewStep: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    state: { email, token },
  } = useLocation();
  const { control, getValues, handleSubmit, watch } = useForm<
    ForgotPasswordNewDto & { newPasswordConfirm: string }
  >({
    defaultValues: {
      email,
      token,
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  const [newPassword, newPasswordConfirm] = watch([
    "newPassword",
    "newPasswordConfirm",
  ]);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const dto = getValues();

      await dispatch(userActions.forgotPasswordNew(dto)).unwrap();

      Toast.success(
        "Your password has been reset, you can now log in with your new password!",
      );

      navigate("/login", { replace: true });
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!email.length || !token.length) {
      navigate("/forgot-password/email", { replace: true });
    }
  }, [email, token, navigate]);

  return (
    <AuthContainer
      title="Reset password"
      description="Enter your new password and confirm it."
      formItems={[
        <Controller
          control={control}
          name="newPassword"
          rules={{
            required: "Please enter a new password",
            minLength: {
              value: MIN_PASSWORD_LENGTH,
              message: "The new password should be at least 6 characters long",
            },
            maxLength: {
              value: MAX_PASSWORD_LENGTH,
              message: "The new password should be at most 64 characters long",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              title="New password"
              placeholder="Enter your new password"
              type="password"
              required
              valid={!error}
              errorMessage={error?.message}
              minLength={MIN_PASSWORD_LENGTH}
              maxLength={MAX_PASSWORD_LENGTH}
              {...field}
            />
          )}
        />,
        <Controller
          control={control}
          name="newPasswordConfirm"
          rules={{
            required: "Please confirm your new password",
            minLength: {
              value: MIN_PASSWORD_LENGTH,
              message: "The password should be at least 6 characters long",
            },
            maxLength: {
              value: MAX_PASSWORD_LENGTH,
              message: "The password should be at most 64 characters long",
            },
            validate: (value) =>
              value === newPassword || "The passwords do not match",
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              title="New password confirmation"
              placeholder="Re-enter your new password"
              type="password"
              required
              valid={!error}
              errorMessage={error?.message}
              minLength={MIN_PASSWORD_LENGTH}
              maxLength={MAX_PASSWORD_LENGTH}
              {...field}
            />
          )}
        />,
        <Button
          onClick={handleSubmit(onSubmit)}
          loading={loading}
          disabled={!newPassword.length || !newPasswordConfirm.length}
        >
          Confirm new password
        </Button>,
      ]}
    />
  );
};
