import type React from "react";
import styled from "styled-components";
import { Input } from "../../components/Input";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useAppDispatch } from "../../redux/store";
import type { LoginDto } from "../../model/user/dto/LoginDto";
import { userActions } from "../../redux/user/user.slice";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/Button";
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
    <Card>
      <Brand>Productly</Brand>

      <Header>
        <h1>Welcome back</h1>
        <p>Sign in to manage your products</p>
      </Header>

      <Form>
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

        <Button loading={loading} onClick={handleSubmit(onLogin)}>
          Login
        </Button>
      </Form>

      <Footer>
        Don’t have an account? <Link to="/signup">Create one</Link>
      </Footer>
    </Card>
  );
};
