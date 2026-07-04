import type React from "react";
import { Input } from "../../components/Input";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { userActions } from "../../redux/user/user.slice";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/Button";
import type { SignUpEmailDto } from "../../model/user/dto/SignUpEmailDto";
import { Toast } from "../../utils/Toast";
import { AuthContainer } from "../../components/AuthContainer";
import styled from "styled-components";
import { GoogleLoginButton } from "../../components/GoogleLoginButton";

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

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { control, handleSubmit, getValues } = useForm<SignUpEmailDto>();

  const onSignUp = async () => {
    try {
      setLoading(true);

      const dto = getValues();

      await dispatch(userActions.signUpEmail(dto)).unwrap();
      navigate("/signup/email-verification", { state: { email: dto.email } });

      Toast.success("We sent you an email to verify your account");
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
      description="Create an account"
      formItems={[
        <Controller
          control={control}
          name="name"
          rules={{ required: "Name is required" }}
          render={({ field, fieldState }) => (
            <Input
              title="Name"
              placeholder="Haitham"
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
              title="Company name"
              placeholder="Inventix"
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />,
        <Controller
          control={control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field, fieldState }) => (
            <Input
              title="Email"
              placeholder="you@example.com"
              errorMessage={fieldState.error?.message}
              required
              {...field}
            />
          )}
        />,

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
              required
              {...field}
            />
          )}
        />,
        <Button loading={loading} onClick={handleSubmit(onSignUp)}>
          Create account
        </Button>,
      ]}
      footerContent={
        <Footer>
          <span>
            Already have an account? <Link to="/login">Login</Link>
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
