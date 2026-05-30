import type { User } from "../../types/User";

export interface PendingInvitation {
  _id: string;
  email: User["email"];
  createdAt: Date;
  updatedAt: Date;
}
