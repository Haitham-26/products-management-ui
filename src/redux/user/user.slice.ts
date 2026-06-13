import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../AppThunk";
import type { LoginResponseDto } from "../../model/shared/dto/LoginResponseDto";
import type { LoginDto } from "../../model/user/dto/LoginDto";
import { UserAxios } from "../../axios/user/user.axios";
import type { SignUpEmailDto } from "../../model/user/dto/SignUpEmailDto";
import type { SignUpTokenDto } from "../../model/user/dto/SignUpTokenDto";
import type { User } from "../../model/user/types/User";
import type { GenericWithUserId } from "../../model/shared/dto/GenericWithUserId";
import type { UpdateMembersPermissionsDto } from "../../model/user/dto/UpdateMembersPermissionsDto";
import type { ForgotPasswordEmailDto } from "../../model/user/dto/ForgotPasswordEmailDto";
import type { ForgotPasswordTokenDto } from "../../model/user/dto/ForgotPasswordTokenDto";
import type { ForgotPasswordNewDto } from "../../model/user/dto/ForgotPasswordNewDto";
import type { SignUpResendTokenDto } from "../../model/user/dto/SignUpResendTokenDto";
import type { UpdateUserDto } from "../../model/user/dto/UpdateUserDto";
import type { ResetPasswordDto } from "../../model/user/dto/ResetPasswordDto";

interface UserState {
  user?: User;
  organizationMembers?: Partial<User>[];
}

const initialState: UserState = {
  user: undefined,
  organizationMembers: undefined,
};

const getUserById = AppThunk<User, GenericWithUserId>(
  "/user",
  UserAxios.getUserById,
);

const updateUser = AppThunk<void, UpdateUserDto>(
  "/user/update",
  UserAxios.updateUser,
);

const login = AppThunk<LoginResponseDto, LoginDto>(
  "/auth/login",
  UserAxios.login,
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

const resetPassword = AppThunk<void, ResetPasswordDto>(
  "/user/reset-password",
  UserAxios.resetPassword,
);

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

const getOrganizationMembers = AppThunk<Partial<User>[], GenericWithUserId>(
  "/organization/members",
  UserAxios.getOrganizationMembers,
);

const updateMembersPermissions = AppThunk<void, UpdateMembersPermissionsDto>(
  "/organization/members/update",
  UserAxios.updateMembersPermissions,
);

const logout = AppThunk<void, void>("/auth/logout", async () => {
  localStorage.clear();
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
    });
    addCase(signUpToken.fulfilled, (state, action) => {
      state.user = action.payload.user;
    });
    addCase(getUserById.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    addCase(getOrganizationMembers.fulfilled, (state, action) => {
      state.organizationMembers = action.payload;
    });
    addCase(logout.fulfilled, () => initialState);
  },
});

const userActions = {
  getUserById,
  updateUser,
  login,
  signUpEmail,
  signUpToken,
  signUpResendToken,
  resetPassword,
  forgotPasswordEmail,
  forgotPasswordToken,
  forgotPasswordNew,
  getOrganizationMembers,
  updateMembersPermissions,
  logout,
};

export { userActions };

export default userSlice.reducer;
