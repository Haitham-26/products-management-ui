import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const organizationState = (state: RootState) => state.organization;

const selectMembers = createSelector(
  organizationState,
  (state) => state?.members || [],
);
const selectOwnerInvitations = createSelector(
  organizationState,
  (state) => state?.ownerInvitations || [],
);
const selectJoinOrgInvitations = createSelector(
  organizationState,
  (state) => state?.joinOrgInvitations || [],
);
const selectOwnerInvitationsLoading = createSelector(
  organizationState,
  (state) => state?.ownerInvitationsLoading,
);

const selectOrganizationMembers = createSelector(
  organizationState,
  (state) => state?.members || [],
);
const selectOrganizationMembersLoading = createSelector(
  organizationState,
  (state) => state?.membersLoading,
);

const organizationSliceSelectors = {
  selectMembers,
  selectOwnerInvitations,
  selectOrganizationMembers,
  selectJoinOrgInvitations,
  selectOwnerInvitationsLoading,
  selectOrganizationMembersLoading,
};

export default organizationSliceSelectors;
