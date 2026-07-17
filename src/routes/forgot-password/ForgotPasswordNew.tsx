import type React from "react";
import { AuthContainer } from "../../components/AuthContainer";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { userActions } from "../../redux/user/user.slice";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import type { ForgotPasswordNewDto } from "../../model/user/dto/ForgotPasswordNewDto";
import { useTranslation } from "react-i18next";
import { useAppToast } from "../../components/toast/useAppToast";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;

export const ForgotPasswordNewStep: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const Toast = useAppToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
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

      Toast.success(t("forgotPassword.new.success"));

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
      title={t("forgotPassword.new.title")}
      description={t("forgotPassword.new.description")}
      formItems={[
        <Controller
          control={control}
          name="newPassword"
          rules={{
            required: t("errors.general.required"),
            minLength: {
              value: MIN_PASSWORD_LENGTH,
              message: t("forgotPassword.new.errors.password.short", {
                length: MIN_PASSWORD_LENGTH,
              }),
            },
            maxLength: {
              value: MAX_PASSWORD_LENGTH,
              message: t("forgotPassword.new.errors.password.long", {
                length: MAX_PASSWORD_LENGTH,
              }),
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              title={t("forgotPassword.new.newPassword")}
              placeholder="••••••••"
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
            required: t("errors.general.required"),
            minLength: {
              value: MIN_PASSWORD_LENGTH,
              message: t("forgotPassword.new.errors.password.short", {
                length: MIN_PASSWORD_LENGTH,
              }),
            },
            maxLength: {
              value: MAX_PASSWORD_LENGTH,
              message: t("forgotPassword.new.errors.password.long", {
                length: MAX_PASSWORD_LENGTH,
              }),
            },
            validate: (value) =>
              value === newPassword ||
              t("forgotPassword.new.errors.password.mismatch"),
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              title={t("forgotPassword.new.confirmPassword")}
              placeholder="••••••••"
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
          {t("common.confirm")}
        </Button>,
      ]}
    />
  );
};
