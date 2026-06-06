import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { UserPermissions } from "../types/UserPermissions";

export type UpdateMembersPermissionsDto = GenericWithUserId & {
  members: Record<string, UserPermissions>;
};
