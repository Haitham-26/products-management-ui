import type { GenericWithUserId } from "../../shared/GenericWithUserId";
import type { UserPermissions } from "../types/UserPermissions";

export type UpdateMembersPermissionsDto = GenericWithUserId & {
  members: Record<string, UserPermissions>;
};
