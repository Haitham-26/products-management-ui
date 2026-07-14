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
import { useTranslation } from "react-i18next";

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 64;

const StyledButton = styled(Button)`
  width: fit-content;
  margin-inline-start: auto;
`;

export const SecuritySettings: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const user = useAppSelector(userSliceSelectors.selectUser);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
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

      Toast.success(t("settings.update.success"));
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
      title={t("settings.pages.security.password.title")}
      description={t("settings.pages.security.password.description")}
      content={
        <Fragment>
          <Controller
            control={control}
            name="currentPassword"
            rules={{
              required: t("errors.general.required"),
              minLength: {
                value: MIN_PASSWORD_LENGTH,
                message: t("settings.pages.security.password.errors.short", {
                  length: MIN_PASSWORD_LENGTH,
                }),
              },
              maxLength: {
                value: MAX_PASSWORD_LENGTH,
                message: t("settings.pages.security.password.errors.long", {
                  length: MAX_PASSWORD_LENGTH,
                }),
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <Input
                title={t("settings.pages.security.password.current.title")}
                type="password"
                placeholder={t(
                  "settings.pages.security.password.current.placeholder",
                )}
                {...field}
                valid={!error}
                errorMessage={error?.message}
                autoComplete="current-password"
                maxLength={MAX_PASSWORD_LENGTH}
                required
              />
            )}
          />
          <Controller
            control={control}
            name="newPassword"
            rules={{
              required: t("errors.general.required"),
              minLength: {
                value: MIN_PASSWORD_LENGTH,
                message: t("settings.pages.security.password.errors.short", {
                  length: MIN_PASSWORD_LENGTH,
                }),
              },
              maxLength: {
                value: MAX_PASSWORD_LENGTH,
                message: t("settings.pages.security.password.errors.long", {
                  length: MAX_PASSWORD_LENGTH,
                }),
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <Input
                title={t("settings.pages.security.password.new.title")}
                type="password"
                placeholder={t(
                  "settings.pages.security.password.new.placeholder",
                )}
                {...field}
                valid={!error}
                errorMessage={error?.message}
                autoComplete="new-password"
                maxLength={MAX_PASSWORD_LENGTH}
                required
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: t("errors.general.required"),
              minLength: {
                value: MIN_PASSWORD_LENGTH,
                message: t("settings.pages.security.password.errors.short", {
                  length: MIN_PASSWORD_LENGTH,
                }),
              },
              maxLength: {
                value: MAX_PASSWORD_LENGTH,
                message: t("settings.pages.security.password.errors.long", {
                  length: MAX_PASSWORD_LENGTH,
                }),
              },
              validate: (value) =>
                value === getValues("newPassword") ||
                t("settings.pages.security.password.errors.password.mismatch"),
            }}
            render={({ field, fieldState: { error } }) => (
              <Input
                title={t("settings.pages.security.password.confirm.title")}
                type="password"
                placeholder={t(
                  "settings.pages.security.password.confirm.placeholder",
                )}
                {...field}
                valid={!error}
                errorMessage={error?.message}
                autoComplete="new-password"
                maxLength={MAX_PASSWORD_LENGTH}
                required
              />
            )}
          />

          <StyledButton
            onClick={handleSubmit(onSubmit)}
            loading={loading}
            disabled={!currentPassword || !newPassword || !confirmPassword}
          >
            {t("common.save")}
          </StyledButton>
        </Fragment>
      }
    />
  );
};
