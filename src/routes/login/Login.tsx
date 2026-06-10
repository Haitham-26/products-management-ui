import type React from "react";
import { Input } from "../../components/Input";
import { Controller, useForm } from "react-hook-form";
import { Fragment, useState } from "react";
import { useAppDispatch } from "../../redux/store";
import type { LoginDto } from "../../model/user/dto/LoginDto";
import { userActions } from "../../redux/user/user.slice";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/Button";
import { Toast } from "../../utils/Toast";
import { AuthContainer } from "../../components/AuthContainer";

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
        />,

        <Button loading={loading} onClick={handleSubmit(onLogin)}>
          Login
        </Button>,
      ]}
      footerContent={
        <Fragment>
          Don’t have an account? <Link to="/signup">Create one</Link>
        </Fragment>
      }
    />
  );
};
