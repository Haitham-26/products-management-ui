import type React from "react";
import { Input } from "../../components/Input";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useAppDispatch } from "../../redux/store";
import type { LoginDto } from "../../model/user/dto/LoginDto";
import { userActions } from "../../redux/user/user.slice";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/Button";
import { AuthContainer } from "../../components/AuthContainer";
import styled from "styled-components";
import { GoogleLoginButton } from "../../components/GoogleLoginButton";
import { Trans, useTranslation } from "react-i18next";
import { useAppToast } from "../../components/toast/useAppToast";

const PasswordWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(${({ theme }) => theme.spacing.md} / 2);
  align-items: flex-end;
`;

const ForgotPasswordLink = styled(Link)`
  font-size: calc(${({ theme }) => theme.typography.small} / 1.1);
`;

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

export const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const Toast = useAppToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { control, handleSubmit, getValues } = useForm<LoginDto>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLogin = async () => {
    try {
      setLoading(true);

      await dispatch(userActions.login(getValues())).unwrap();

      navigate("/", { replace: true });

      Toast.success(t("login.success"));
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      title={t("login.title")}
      description={t("login.description")}
      formItems={[
        <Controller
          control={control}
          name="email"
          rules={{ required: t("errors.general.required") }}
          render={({ field, fieldState: { error } }) => (
            <Input
              title={t("common.email")}
              placeholder="you@example.com"
              errorMessage={error?.message}
              valid={!error}
              type="email"
              required
              {...field}
            />
          )}
        />,

        <PasswordWrapper>
          <Controller
            control={control}
            name="password"
            rules={{
              required: t("errors.general.required"),
              minLength: {
                value: 8,
                message: t("login.errors.password.min", { length: 8 }),
              },
              maxLength: {
                value: 64,
                message: t("login.errors.password.max", { length: 64 }),
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <Input
                title={t("common.password")}
                type="password"
                placeholder="••••••••"
                errorMessage={error?.message}
                valid={!error}
                required
                {...field}
              />
            )}
          />

          <ForgotPasswordLink to="/forgot-password">
            {t("login.forgotPassword")}
          </ForgotPasswordLink>
        </PasswordWrapper>,

        <Button loading={loading} onClick={handleSubmit(onLogin)}>
          {t("common.login")}
        </Button>,
      ]}
      footerContent={
        <Footer>
          <span>
            <Trans
              i18nKey="login.noAccount"
              components={[<Link to="/signup" />]}
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
