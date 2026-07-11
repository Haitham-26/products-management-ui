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
import { useTranslation } from "react-i18next";

export const ForgotPasswordEmailStep: React.FC = () => {
  const [loading, setLoading] = useState(false);

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

      const { email } = getValues();

      await dispatch(userActions.forgotPasswordEmail({ email })).unwrap();

      Toast.success(t("forgotPassword.email.success"));

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
