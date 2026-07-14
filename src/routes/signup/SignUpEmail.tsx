import type React from "react";
import { Input } from "../../components/Input";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { userActions } from "../../redux/user/user.slice";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/Button";
import type { SignUpEmailDto } from "../../model/user/dto/SignUpEmailDto";
import { AuthContainer } from "../../components/AuthContainer";
import styled from "styled-components";
import { GoogleLoginButton } from "../../components/GoogleLoginButton";
import { Trans, useTranslation } from "react-i18next";
import { useAppToast } from "../../components/toast/useAppToast";

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(${({ theme }) => theme.spacing.md} / 2);
  align-items: center;
`;

const OAuthSectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: calc(${({ theme }) => theme.spacing.md} / 2);
  width: 100%;
  margin-top: calc(${({ theme }) => theme.spacing.lg} / 2);
  margin-bottom: calc(${({ theme }) => theme.spacing.lg} / 2);

  hr {
    flex: 1;
    height: 1px;
    border: none;
    background-color: ${({ theme }) => theme.colors.border};
  }

  span {
    font-size: calc(${({ theme }) => theme.typography.small} / 1.1);
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const SignUpEmail: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const Toast = useAppToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { control, handleSubmit, getValues } = useForm<SignUpEmailDto>();

  const onSignUp = async () => {
    try {
      setLoading(true);

      const dto = getValues();

      await dispatch(userActions.signUpEmail(dto)).unwrap();

      navigate("/signup/email-verification", { state: { email: dto.email } });

      Toast.success(t("signup.email.success"));
    } catch (e) {
      console.error(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      title={t("signup.email.title")}
      description={t("signup.email.description")}
      formItems={[
        <Controller
          control={control}
          name="name"
          rules={{ required: t("errors.general.required") }}
          render={({ field, fieldState }) => (
            <Input
              title={t("common.name")}
              placeholder={t("signup.email.name.placeholder")}
              errorMessage={fieldState.error?.message}
              required
              {...field}
            />
          )}
        />,
        <Controller
          control={control}
          name="company"
          render={({ field, fieldState }) => (
            <Input
              title={t("common.company")}
              placeholder={t("signup.email.company.placeholder")}
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />,
        <Controller
          control={control}
          name="email"
          rules={{ required: t("errors.general.required") }}
          render={({ field, fieldState }) => (
            <Input
              title={t("common.email")}
              placeholder="you@example.com"
              type="email"
              errorMessage={fieldState.error?.message}
              required
              {...field}
            />
          )}
        />,

        <Controller
          control={control}
          name="password"
          rules={{ required: t("errors.general.required") }}
          render={({ field, fieldState }) => (
            <Input
              title={t("common.password")}
              type="password"
              placeholder="••••••••"
              errorMessage={fieldState.error?.message}
              required
              {...field}
            />
          )}
        />,
        <Button loading={loading} onClick={handleSubmit(onSignUp)}>
          {t("signup.email.submit")}
        </Button>,
      ]}
      footerContent={
        <Footer>
          <span>
            <Trans
              i18nKey="signup.email.hasAccount"
              components={[<Link to="/login" />]}
            />
          </span>

          <OAuthSectionTitle>
            <hr />
            <span>{t("common.or").toUpperCase()}</span>
            <hr />
          </OAuthSectionTitle>

          <GoogleLoginButton />
        </Footer>
      }
    />
  );
};
