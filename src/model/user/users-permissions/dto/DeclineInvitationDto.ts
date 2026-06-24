import type { GenericWithUserId } from "../../../shared/dto/GenericWithUserId";

export interface DeclineInvitationDto extends GenericWithUserId {
  invitationId: string;
}
