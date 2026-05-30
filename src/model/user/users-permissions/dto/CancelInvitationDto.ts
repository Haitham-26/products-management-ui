import type { GenericWithUserId } from "../../../shared/GenericWithUserId";

export interface CancelInvitationDto extends GenericWithUserId {
  invitationId: string;
}
