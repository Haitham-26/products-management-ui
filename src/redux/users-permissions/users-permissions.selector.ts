import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const usersPermissionsState = (state: RootState) => state.usersPermissions;

const selectMembers = createSelector(
  usersPermissionsState,
  (state) => state?.members || [],
);
const selectOwnerInvitations = createSelector(
  usersPermissionsState,
  (state) => state?.ownerInvitations || [],
);
const selectJoinOrgInvitations = createSelector(
  usersPermissionsState,
  (state) => state?.joinOrgInvitations || [],
);
const selectOwnerInvitationsLoading = createSelector(
  usersPermissionsState,
  (state) => state?.ownerInvitationsLoading,
);

const selectOrganizationMembers = createSelector(
  usersPermissionsState,
  (state) => state?.members || [],
);

const usersPermissionsSliceSelectors = {
  selectMembers,
  selectOwnerInvitations,
  selectOrganizationMembers,
  selectJoinOrgInvitations,
  selectOwnerInvitationsLoading,
};

export default usersPermissionsSliceSelectors;
