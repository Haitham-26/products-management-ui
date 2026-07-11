import type { User } from "../../types/User";

export interface JoinOrgInvitation {
  _id: string;
  inviter: {
    name: User["name"];
    company?: User["company"];
  };
  createdAt: Date;
  updatedAt: Date;
}
