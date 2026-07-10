import type { GenericWithUserId } from "../../../shared/dto/GenericWithUserId";

export interface GenericWithInvitationId extends GenericWithUserId {
  invitationId: string;
}
