import type { SignUpMethods } from "./SignUpMethods";
import type { UserPermissions } from "./UserPermissions";

export interface User {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  signUpMethod: SignUpMethods;
  avatar?: string;
  permissions?: UserPermissions;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}
