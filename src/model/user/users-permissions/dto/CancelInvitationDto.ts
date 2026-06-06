import type { GenericWithUserId } from "../../../shared/dto/GenericWithUserId";

export interface CancelInvitationDto extends GenericWithUserId {
  invitationId: string;
}
