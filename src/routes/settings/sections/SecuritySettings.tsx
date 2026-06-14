import type React from "react";
import { styled } from "styled-components";
import { Fragment, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../components/Button";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import userSliceSelectors from "../../../redux/user/user.selector";
import { Toast } from "../../../utils/Toast";
import { Input } from "../../../components/Input";
import { userActions } from "../../../redux/user/user.slice";
import type { ResetPasswordDto } from "../../../model/user/dto/ResetPasswordDto";
import { SettingsSection } from "../components/SettingsSection";

const StyledButton = styled(Button)`
  width: fit-content;
  margin-inline-start: auto;
`;

export const SecuritySettings: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const user = useAppSelector(userSliceSelectors.selectUser);

  const dispatch = useAppDispatch();
  const { control, handleSubmit, getValues, reset, watch } = useForm<
    ResetPasswordDto & { confirmPassword: string }
  >({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [currentPassword, newPassword, confirmPassword] = watch([
    "currentPassword",
    "newPassword",
    "confirmPassword",
  ]);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const { currentPassword, newPassword } = getValues();

      await dispatch(
        userActions.resetPassword({
          userId: user._id,
          currentPassword,
          newPassword,
        }),
      ).unwrap();

      Toast.success("Password updated successfully");
      reset();
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsSection
      title="Update Password"
      description="Ensure your account stays secure. Your new password must be at least 8 characters long and should contain a mix of letters, numbers, and symbols."
      content={
        <Fragment>
          <Controller
            control={control}
            name="currentPassword"
            rules={{
              required: "Current password is required",
              minLength: {
                value: 6,
                message: "Password must be at least  characters long",
              },
              maxLength: {
                value: 64,
                message: "Password must be at most 64 characters long",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <Input
                title="Current Password"
                type="password"
                placeholder="Enter current password"
                {...field}
                valid={!error}
                errorMessage={error?.message}
                autoComplete="current-password"
                maxLength={64}
                required
              />
            )}
          />
          <Controller
            control={control}
            name="newPassword"
            rules={{
              required: "New password is required",
              minLength: {
                value: 6,
                message: "Password must be at least  characters long",
              },
              maxLength: {
                value: 64,
                message: "Password must be at most 64 characters long",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <Input
                title="New Password"
                type="password"
                placeholder="Enter new password"
                {...field}
                valid={!error}
                errorMessage={error?.message}
                autoComplete="new-password"
                maxLength={64}
                required
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: "Please confirm your new password",
              minLength: {
                value: 6,
                message: "Password must be at least  characters long",
              },
              maxLength: {
                value: 64,
                message: "Password must be at most 64 characters long",
              },
              validate: (value) =>
                value === getValues("newPassword") ||
                "The passwords do not match",
            }}
            render={({ field, fieldState: { error } }) => (
              <Input
                title="Confirm New Password"
                type="password"
                placeholder="Re-enter new password"
                {...field}
                valid={!error}
                errorMessage={error?.message}
                autoComplete="new-password"
                maxLength={64}
                required
              />
            )}
          />

          <StyledButton
            onClick={handleSubmit(onSubmit)}
            loading={loading}
            disabled={!currentPassword || !newPassword || !confirmPassword}
          >
            Update Password
          </StyledButton>
        </Fragment>
      }
    />
  );
};
