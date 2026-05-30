import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { User } from "../../model/user/types/User";

const userState = (state: RootState) => state.user;

const selectUser = createSelector(
  userState,
  (state) => (state?.user || {}) as User,
);
const selectUserId = createSelector(userState, (state) => state?.user?._id);
const selectUserPermissions = createSelector(
  userState,
  (state) => state?.user?.permissions || [],
);
const selectOrganizationMembers = createSelector(
  userState,
  (state) => state?.organizationMembers || [],
);
const selectIsOrganization = createSelector(
  userState,
  (state) => state?.user?.organizationId?.length,
);

const userSliceSelectors = {
  selectUser,
  selectUserId,
  selectUserPermissions,
  selectOrganizationMembers,
  selectIsOrganization,
};

export default userSliceSelectors;
