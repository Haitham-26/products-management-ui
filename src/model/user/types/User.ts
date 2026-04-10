import type { SignUpMethods } from "./SignUpMethods";

export interface User {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  signUpMethod: SignUpMethods;
  avatar?: string;

  createdAt: string;
  updatedAt: string;
}
