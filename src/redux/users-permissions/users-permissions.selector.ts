import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const usersPermissionsState = (state: RootState) => state.usersPermissions;

const selectMembers = createSelector(
  usersPermissionsState,
  (state) => state?.members || [],
);
const selectPendingInvitations = createSelector(
  usersPermissionsState,
  (state) => state?.pendingInvitations || [],
);

const usersPermissionsSliceSelectors = {
  selectMembers,
  selectPendingInvitations,
};

export default usersPermissionsSliceSelectors;
