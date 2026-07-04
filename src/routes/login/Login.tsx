import type React from "react";
import { Input } from "../../components/Input";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useAppDispatch } from "../../redux/store";
import type { LoginDto } from "../../model/user/dto/LoginDto";
import { userActions } from "../../redux/user/user.slice";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/Button";
import { Toast } from "../../utils/Toast";
import { AuthContainer } from "../../components/AuthContainer";
import styled from "styled-components";
import { GoogleLoginButton } from "../../components/GoogleLoginButton";

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

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
    } catch (e) {
      console.error(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Welcome back"
      description="Sign in to manage your products"
      formItems={[
        <Controller
          control={control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field, fieldState }) => (
            <Input
              title="Email"
              placeholder="you@example.com"
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />,

        <PasswordWrapper>
          <Controller
            control={control}
            name="password"
            rules={{ required: "Password is required" }}
            render={({ field, fieldState }) => (
              <Input
                title="Password"
                type="password"
                placeholder="••••••••"
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />

          <ForgotPasswordLink to="/forgot-password">
            Forgot password?
          </ForgotPasswordLink>
        </PasswordWrapper>,

        <Button loading={loading} onClick={handleSubmit(onLogin)}>
          Login
        </Button>,
      ]}
      footerContent={
        <Footer>
          <span>
            Don’t have an account? <Link to="/signup">Create one</Link>
          </span>

          <OAuthSectionTitle>
            <hr />
            <span>OR</span>
            <hr />
          </OAuthSectionTitle>

          <GoogleLoginButton />
        </Footer>
      }
    />
  );
};
