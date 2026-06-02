import type React from "react";
import styled from "styled-components";
import { Input } from "../../components/Input";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { userActions } from "../../redux/user/user.slice";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/Button";
import type { SignUpEmailDto } from "../../model/user/dto/SignUpEmailDto";
import { Toast } from "../../utils/Toast";

const Card = styled.div`
  width: 100%;
  max-width: 24rem;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Brand = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 1.75rem;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;
`;

const Header = styled.div`
  text-align: center;

  h1 {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.typography.small};
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Footer = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.small};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
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
    } catch (e) {
      console.error(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Brand>Productly</Brand>

      <Header>
        <h1>Welcome back</h1>
        <p>Create an account</p>
      </Header>

      <Form>
        <Controller
          control={control}
          name="name"
          rules={{ required: "Name is required" }}
          render={({ field, fieldState }) => (
            <Input
              title="Name"
              placeholder="John Doe"
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />

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
        />

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

        <Button loading={loading} onClick={handleSubmit(onSignUp)}>
          Sign Up
        </Button>
      </Form>

      <Footer>
        Already have an account? <Link to="/login">Login</Link>
      </Footer>
    </Card>
  );
};
