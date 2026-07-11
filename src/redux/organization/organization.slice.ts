import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../AppThunk";
import type { User } from "../../model/user/types/User";
import type { GenericWithMemberId } from "../../model/user/dto/GenericWithMemberId";
import type { OwnerInvitation } from "../../model/user/organization/types/OwnerInvitation";
import type { JoinOrgInvitation } from "../../model/user/organization/types/JoinOrgInvitation";
import type { InviteMembersDto } from "../../model/user/organization/dto/InviteMembersDto";
import { OrganizationAxios } from "../../axios/users-permissions/organization.axios";
import type { GetOwnerInvitationsResponseDto } from "../../model/user/organization/dto/GetOwnerInvitationsResponseDto";
import type { GetJoinOrgInvitationsResponseDto } from "../../model/user/organization/dto/GetJoinOrgInvitationsResponseDto";
import type { GenericWithInvitationId } from "../../model/user/organization/dto/GenericWithInvitationId";
import type { UpdateMembersPermissionsDto } from "../../model/user/dto/UpdateMembersPermissionsDto";
import { userActions } from "../user/user.slice";

interface OrganizationState {
  members: Partial<User>[];
  membersLoading: boolean;
  ownerInvitations: OwnerInvitation[];
  joinOrgInvitations: JoinOrgInvitation[];
  ownerInvitationsLoading: boolean;
}

const initialState: OrganizationState = {
  members: [],
  membersLoading: false,
  ownerInvitations: [],
  joinOrgInvitations: [],
  ownerInvitationsLoading: false,
};

const inviteMembers = AppThunk<void, InviteMembersDto>(
  "/organization/owner/invite-members",
  OrganizationAxios.inviteMembers,
);

const getOwnerInvitations = AppThunk<GetOwnerInvitationsResponseDto, void>(
  "/organization/owner/invitations",
  OrganizationAxios.getOwnerInvitations,
);

const getJoinOrgInvitations = AppThunk<GetJoinOrgInvitationsResponseDto, void>(
  "/organization/member/invitations",
  OrganizationAxios.getJoinOrgInvitations,
);

const cancelInvitation = AppThunk<void, GenericWithInvitationId>(
  "/organization/owner/invitation/cancel",
  OrganizationAxios.cancelInvitation,
);

const declineInvitation = AppThunk<void, GenericWithInvitationId>(
  "/organization/member/invitation/decline",
  OrganizationAxios.declineInvitation,
);

const acceptInvitation = AppThunk<void, GenericWithInvitationId>(
  "/organization/member/invitation/accept",
  OrganizationAxios.acceptInvitation,
);

const getOrganizationMembers = AppThunk<Partial<User>[], void>(
  "/organization/members",
  OrganizationAxios.getOrganizationMembers,
);

const manageMembersPermissions = AppThunk<void, UpdateMembersPermissionsDto>(
  "/organization/owner/members/manage",
  OrganizationAxios.manageMembersPermissions,
);

const removeMember = AppThunk<void, GenericWithMemberId>(
  "/organization/owner/members/remove",
  OrganizationAxios.removeMember,
);

const leaveOrg = AppThunk<void, void>(
  "/organization/member/leave",
  OrganizationAxios.leaveOrg,
);

export const organizationSlice = createSlice({
  name: "organization",
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

    addCase(getJoinOrgInvitations.fulfilled, (state, action) => {
      state.joinOrgInvitations = action.payload.invitations;
    });

    addCase(getOrganizationMembers.pending, (state) => {
      state.membersLoading = true;
    });
    addCase(getOrganizationMembers.fulfilled, (state, action) => {
      state.members = action.payload;
      state.membersLoading = false;
    });
    addCase(getOrganizationMembers.rejected, (state) => {
      state.membersLoading = false;
    });

    addCase(acceptInvitation.fulfilled, (state) => {
      state.joinOrgInvitations = [];
    });

    addCase(leaveOrg.fulfilled, (state) => {
      state.members = [];
    });

    addCase(userActions.logout.fulfilled, () => initialState);
  },
});

const organizationActions = {
  inviteMembers,
  getOwnerInvitations,
  getJoinOrgInvitations,
  cancelInvitation,
  declineInvitation,
  acceptInvitation,
  getOrganizationMembers,
  manageMembersPermissions,
  removeMember,
  leaveOrg,
};

export { organizationActions };

export default organizationSlice.reducer;
