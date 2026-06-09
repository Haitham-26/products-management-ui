import type React from "react";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { userActions } from "../../redux/user/user.slice";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/Button";
import type { SignUpTokenDto } from "../../model/user/dto/SignUpTokenDto";
import { Toast } from "../../utils/Toast";
import { VerificationCodeInput } from "../../components/VerificationCodeInput";
import { Text } from "../../components/Text";

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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const SignUpToken: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { control, handleSubmit, getValues } = useForm<SignUpTokenDto>({
    defaultValues: {
      email: state?.email,
      token: "",
    },
  });

  const onSignUp = async () => {
    try {
      setLoading(true);

      await dispatch(userActions.signUpToken(getValues())).unwrap();

      navigate("/dashboard", { replace: true });

      Toast.success("Account verified successfully");
    } catch (e) {
      console.error(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!state?.email) {
      navigate("/", { replace: true });
    }
  }, [state?.email, navigate]);

  return (
    <Card>
      <Brand>Productly</Brand>

      <Header>
        <Text fontSize="title" fontWeight="bold">
          Confirm your email
        </Text>
        <Text color="textSecondary">
          We sent the verification code to your email{" "}
          <strong>"{state?.email}"</strong>, please enter it below.
        </Text>
      </Header>

      <Form>
        <Controller
          control={control}
          name="token"
          rules={{
            required: "Token is required",
            minLength: {
              value: 6,
              message: "Token must be at 6 characters",
            },
            maxLength: {
              value: 6,
              message: "Token must be at 6 characters",
            },
          }}
          render={({ field, fieldState }) => (
            <VerificationCodeInput
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />

        <Button loading={loading} onClick={handleSubmit(onSignUp)}>
          Verify & Continue
        </Button>
      </Form>
    </Card>
  );
};
