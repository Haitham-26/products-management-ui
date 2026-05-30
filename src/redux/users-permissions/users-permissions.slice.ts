import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../AppThunk";
import type { User } from "../../model/user/types/User";
import type { InviteMembersDto } from "../../model/user/users-permissions/dto/InviteMembersDto";
import { UsersPermissionsAxios } from "../../axios/users-permissions/users-permissions.axios";
import { userActions } from "../user/user.slice";

interface UsersPermissionsState {
  members: Partial<User>[];
  pendingInvitations: unknown[];
}

const initialState: UsersPermissionsState = {
  members: [],
  pendingInvitations: [],
};

const inviteMembers = AppThunk<void, InviteMembersDto>(
  "/users-permissions/invite-members",
  UsersPermissionsAxios.inviteMembers,
);

export const usersPermissionsSlice = createSlice({
  name: "usersPermissions",
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(userActions.logout.fulfilled, () => initialState);
  },
});

const usersPermissionsActions = {
  inviteMembers,
};

export { usersPermissionsActions };

export default usersPermissionsSlice.reducer;
