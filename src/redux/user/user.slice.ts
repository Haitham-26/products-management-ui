import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../AppThunk";
import type { LoginResponseDto } from "../../model/shared/LoginResponseDto";
import type { LoginDto } from "../../model/user/dto/LoginDto";
import { UserAxios } from "../../axios/user/user.axios";
import type { SignUpEmailDto } from "../../model/user/dto/SignUpEmailDto";
import type { SignUpTokenDto } from "../../model/user/dto/SignUpTokenDto";
import type { User } from "../../model/user/types/User";

interface UserState {
  user?: User;
}

const initialState: UserState = {
  user: undefined,
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

const logout = AppThunk<void, void>("/auth/logout", async () => {
  localStorage.removeItem("token");
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
    addCase(logout.fulfilled, () => initialState);
  },
});

const userActions = {
  login,
  signUpEmail,
  signUpToken,
  logout,
};

export { userActions };

export default userSlice.reducer;
