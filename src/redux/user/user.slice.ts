import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../AppThunk";
import type { LoginResponseDto } from "../../model/shared/LoginResponseDto";
import type { LoginDto } from "../../model/user/dto/LoginDto";
import { UserAxios } from "../../axios/user/user.axios";
import type { SignUpEmailDto } from "../../model/user/dto/SignUpEmailDto";
import type { SignUpTokenDto } from "../../model/user/dto/SignUpTokenDto";
import type { User } from "../../model/user/types/User";
import type { GenericWithUserId } from "../../model/shared/GenericWithUserId";
import type { UpdateMembersPermissionsDto } from "../../model/user/dto/UpdateMembersPermissionsDto";

interface UserState {
  user?: User;
  organizationMembers?: Partial<User>[];
}

const initialState: UserState = {
  user: undefined,
  organizationMembers: undefined,
};

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

    addCase(getOrganizationMembers.fulfilled, (state, action) => {
      state.organizationMembers = action.payload;
    });
    addCase(logout.fulfilled, () => initialState);
  },
});

const userActions = {
  login,
  signUpEmail,
  signUpToken,
  getOrganizationMembers,
  updateMembersPermissions,
  logout,
};

export { userActions };

export default userSlice.reducer;
