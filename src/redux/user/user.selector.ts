import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { User } from "../../model/user/types/User";
import { UserRoles } from "../../model/user/types/UserRoles.enum";

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
const selectIsOrgMember = createSelector(userState, (state) =>
  Boolean(
    state?.user?.organizationId?.length &&
    state.user.roles.includes(UserRoles.MEMBER),
  ),
);

const userSliceSelectors = {
  selectUser,
  selectUserId,
  selectUserPermissions,
  selectIsOrgMember,
};

export default userSliceSelectors;
