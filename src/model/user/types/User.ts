import type { SignUpMethods } from "./SignUpMethods";
import type { UserPermissions } from "./UserPermissions";
import type { UserRoles } from "./UserRoles.enum";

export interface User {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  signUpMethod: SignUpMethods;
  avatar?: string;
  permissions?: UserPermissions;
  roles: UserRoles[];
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}
