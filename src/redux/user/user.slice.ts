import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../AppThunk";
import type { LoginResponseDto } from "../../model/shared/dto/LoginResponseDto";
import type { LoginDto } from "../../model/user/dto/LoginDto";
import { UserAxios } from "../../axios/user/user.axios";
import type { SignUpEmailDto } from "../../model/user/dto/SignUpEmailDto";
import type { SignUpTokenDto } from "../../model/user/dto/SignUpTokenDto";
import type { User } from "../../model/user/types/User";
import type { ForgotPasswordEmailDto } from "../../model/user/dto/ForgotPasswordEmailDto";
import type { ForgotPasswordTokenDto } from "../../model/user/dto/ForgotPasswordTokenDto";
import type { ForgotPasswordNewDto } from "../../model/user/dto/ForgotPasswordNewDto";
import type { SignUpResendTokenDto } from "../../model/user/dto/SignUpResendTokenDto";
import type { UpdateUserDto } from "../../model/user/dto/UpdateUserDto";
import type { ResetPasswordDto } from "../../model/user/dto/ResetPasswordDto";
import type { GoogleLoginDto } from "../../model/user/dto/GoogleLoginDto";

interface UserState {
  user?: User;
}

const initialState: UserState = {
  user: undefined,
};

const getUserById = AppThunk<User, void>("/user", UserAxios.getUserById);

const updateUser = AppThunk<void, UpdateUserDto>(
  "/user/update",
  UserAxios.updateUser,
);

const login = AppThunk<LoginResponseDto, LoginDto>(
  "/auth/login",
  UserAxios.login,
);

const googleLogin = AppThunk<LoginResponseDto, GoogleLoginDto>(
  "/auth/google-login",
  UserAxios.googleLogin,
);

const signUpEmail = AppThunk<void, SignUpEmailDto>(
  "/auth/signup/email",
  UserAxios.signUpEmail,
);

const signUpToken = AppThunk<LoginResponseDto, SignUpTokenDto>(
  "/auth/signup/token",
  UserAxios.signUpToken,
);
const signUpResendToken = AppThunk<void, SignUpResendTokenDto>(
  "/auth/signup/resend-token",
  UserAxios.signUpResendToken,
);

const resetPassword = AppThunk<
  Pick<LoginResponseDto, "accessToken">,
  ResetPasswordDto
>("/user/reset-password", UserAxios.resetPassword);

const forgotPasswordEmail = AppThunk<void, ForgotPasswordEmailDto>(
  "/auth/forgot-password/email",
  UserAxios.forgotPasswordEmail,
);
const forgotPasswordToken = AppThunk<void, ForgotPasswordTokenDto>(
  "/auth/forgot-password/token",
  UserAxios.forgotPasswordToken,
);
const forgotPasswordNew = AppThunk<void, ForgotPasswordNewDto>(
  "/auth/forgot-password/new",
  UserAxios.forgotPasswordNew,
);

const logout = AppThunk<void, void>("/logout", UserAxios.logout);

const storeAuthTokens = (tokens: Pick<LoginResponseDto, "accessToken">) => {
  localStorage.setItem("accessToken", tokens.accessToken);
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      storeAuthTokens(action.payload);
    });
    addCase(googleLogin.fulfilled, (state, action) => {
      state.user = action.payload.user;
      storeAuthTokens(action.payload);
    });
    addCase(signUpToken.fulfilled, (state, action) => {
      state.user = action.payload.user;
      storeAuthTokens(action.payload);
    });
    // The server updates the token and sends it back
    // so the logged in users tokens becomes invalid
    addCase(resetPassword.fulfilled, (_state, action) => {
      storeAuthTokens(action.payload);
    });
    addCase(getUserById.fulfilled, (state, action) => {
      state.user = action.payload;
    });

    addCase(logout.fulfilled, () => initialState);
  },
});

const userActions = {
  getUserById,
  updateUser,
  login,
  googleLogin,
  signUpEmail,
  signUpToken,
  signUpResendToken,
  resetPassword,
  forgotPasswordEmail,
  forgotPasswordToken,
  forgotPasswordNew,
  logout,
};

export { userActions };

export default userSlice.reducer;
