import type { InvitationStatus } from "./InvitationStatus.enum";

export interface OwnerInvitation {
  _id: string;
  inviterId: string;
  inviteeEmail: string;
  status: InvitationStatus;
  sentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
