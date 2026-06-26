import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../AppThunk";
import type { User } from "../../model/user/types/User";
import type { InviteMembersDto } from "../../model/user/users-permissions/dto/InviteMembersDto";
import { UsersPermissionsAxios } from "../../axios/users-permissions/users-permissions.axios";
import { userActions } from "../user/user.slice";
import type { OwnerInvitation } from "../../model/user/users-permissions/types/OwnerInvitation";
import type { GetOwnerInvitationsResponseDto } from "../../model/user/users-permissions/dto/GetOwnerInvitationsResponseDto";
import type { GenericWithUserId } from "../../model/shared/dto/GenericWithUserId";
import type { UpdateMembersPermissionsDto } from "../../model/user/dto/UpdateMembersPermissionsDto";
import type { GetJoinOrgInvitationsResponseDto } from "../../model/user/users-permissions/dto/GetJoinOrgInvitationsResponseDto";
import type { JoinOrgInvitation } from "../../model/user/users-permissions/types/JoinOrgInvitation";
import type { GenericWithInvitationId } from "../../model/user/users-permissions/dto/GenericWithInvitationId";

interface UsersPermissionsState {
  members: Partial<User>[];
  ownerInvitations: OwnerInvitation[];
  joinOrgInvitations: JoinOrgInvitation[];
  ownerInvitationsLoading: boolean;
}

const initialState: UsersPermissionsState = {
  members: [],
  ownerInvitations: [],
  joinOrgInvitations: [],
  ownerInvitationsLoading: false,
};

const inviteMembers = AppThunk<void, InviteMembersDto>(
  "/users-permissions/invite-members",
  UsersPermissionsAxios.inviteMembers,
);

const getOwnerInvitations = AppThunk<
  GetOwnerInvitationsResponseDto,
  GenericWithUserId
>(
  "/users-permissions/owner-invitations",
  UsersPermissionsAxios.getOwnerInvitations,
);

const getJoinOrgInvitatios = AppThunk<
  GetJoinOrgInvitationsResponseDto,
  GenericWithUserId
>(
  "/users-permissions/join-org-invitations",
  UsersPermissionsAxios.getJoinOrgInvitatios,
);

const cancelInvitation = AppThunk<void, GenericWithInvitationId>(
  "/users-permissions/cancel-invitation",
  UsersPermissionsAxios.cancelInvitation,
);

const declineInvitation = AppThunk<void, GenericWithInvitationId>(
  "/users-permissions/decline-invitation",
  UsersPermissionsAxios.declineInvitation,
);

const acceptInvitation = AppThunk<void, GenericWithInvitationId>(
  "/users-permissions/accept-invitation",
  UsersPermissionsAxios.acceptInvitation,
);

const getOrganizationMembers = AppThunk<Partial<User>[], GenericWithUserId>(
  "/organization/members",
  UsersPermissionsAxios.getOrganizationMembers,
);

const updateMembersPermissions = AppThunk<void, UpdateMembersPermissionsDto>(
  "/organization/members/update",
  UsersPermissionsAxios.updateMembersPermissions,
);

export const usersPermissionsSlice = createSlice({
  name: "usersPermissions",
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(getOwnerInvitations.pending, (state) => {
      state.ownerInvitationsLoading = true;
    });
    addCase(getOwnerInvitations.fulfilled, (state, action) => {
      state.ownerInvitations = action.payload.invitations;
      state.ownerInvitationsLoading = false;
    });
    addCase(getOwnerInvitations.rejected, (state) => {
      state.ownerInvitationsLoading = false;
    });

    addCase(getJoinOrgInvitatios.fulfilled, (state, action) => {
      state.joinOrgInvitations = action.payload.invitations;
    });

    addCase(getOrganizationMembers.fulfilled, (state, action) => {
      state.members = action.payload;
    });

    addCase(userActions.logout.fulfilled, () => initialState);
  },
});

const usersPermissionsActions = {
  inviteMembers,
  getOwnerInvitations,
  getJoinOrgInvitatios,
  cancelInvitation,
  declineInvitation,
  acceptInvitation,
  getOrganizationMembers,
  updateMembersPermissions,
};

export { usersPermissionsActions };

export default usersPermissionsSlice.reducer;
