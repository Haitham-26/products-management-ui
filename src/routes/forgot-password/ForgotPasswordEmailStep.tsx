import type React from "react";
import { AuthContainer } from "../../components/AuthContainer";
import { Controller, useForm } from "react-hook-form";
import type { ForgotPasswordEmailDto } from "../../model/user/dto/ForgotPasswordEmailDto";
import { useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { userActions } from "../../redux/user/user.slice";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useTranslation } from "react-i18next";
import { useAppToast } from "../../components/toast/useAppToast";
import i18n from "../../i18n";
import type { AppLangs } from "../../model/app/types/AppLangs.enum";

export const ForgotPasswordEmailStep: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const Toast = useAppToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
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

      const dto = getValues();

      dto.lang = i18n.language as AppLangs;
      dto.dir = i18n.dir(i18n.language);

      await dispatch(userActions.forgotPasswordEmail(dto)).unwrap();

      Toast.success(t("forgotPassword.email.success"));

      navigate("/forgot-password/token", {
        state: { email: dto.email },
        replace: true,
      });
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      title={t("forgotPassword.email.title")}
      description={t("forgotPassword.email.description")}
      formItems={[
        <Controller
          control={control}
          name="email"
          rules={{ required: t("errors.general.required") }}
          render={({ field, fieldState: { error } }) => (
            <Input
              title={t("common.email")}
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
          {t("common.continue")}
        </Button>,
      ]}
    />
  );
};
