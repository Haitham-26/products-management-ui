import type { GenericWithUserId } from "../../../shared/dto/GenericWithUserId";

interface Email {
  content: string;
}

export interface InviteMembersDto extends GenericWithUserId {
  emails: Email[];
}
