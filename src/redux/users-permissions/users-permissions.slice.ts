import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../AppThunk";
import type { User } from "../../model/user/types/User";
import type { InviteMembersDto } from "../../model/user/users-permissions/dto/InviteMembersDto";
import { UsersPermissionsAxios } from "../../axios/users-permissions/users-permissions.axios";
import { userActions } from "../user/user.slice";
import type { PendingInvitation } from "../../model/user/users-permissions/types/PendingInvitation";
import type { GetPendingInvitationsResponseDto } from "../../model/user/users-permissions/dto/GetPendingInvitationsResponseDto";
import type { GenericWithUserId } from "../../model/shared/dto/GenericWithUserId";
import type { CancelInvitationDto } from "../../model/user/users-permissions/dto/CancelInvitationDto";

interface UsersPermissionsState {
  members: Partial<User>[];
  pendingInvitations: PendingInvitation[];
}

const initialState: UsersPermissionsState = {
  members: [],
  pendingInvitations: [],
};

const inviteMembers = AppThunk<void, InviteMembersDto>(
  "/users-permissions/invite-members",
  UsersPermissionsAxios.inviteMembers,
);

const getPendingInvitations = AppThunk<
  GetPendingInvitationsResponseDto,
  GenericWithUserId
>(
  "/users-permissions/pending-invitations",
  UsersPermissionsAxios.getPendingInvitations,
);

const cancelInvitation = AppThunk<void, CancelInvitationDto>(
  "/users-permissions/cancel-invitation",
  UsersPermissionsAxios.cancelInvitation,
);

export const usersPermissionsSlice = createSlice({
  name: "usersPermissions",
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(getPendingInvitations.fulfilled, (state, action) => {
      state.pendingInvitations = action.payload.invitations;
    });
    addCase(getPendingInvitations.rejected, (state) => {
      state.pendingInvitations = [
        {
          _id: "1",
          email: "clslknvlksd@gmail.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
    });

    addCase(userActions.logout.fulfilled, () => initialState);
  },
});

const usersPermissionsActions = {
  inviteMembers,
  getPendingInvitations,
  cancelInvitation,
};

export { usersPermissionsActions };

export default usersPermissionsSlice.reducer;
