import type { GenericWithUserId } from "../../../shared/GenericWithUserId";

interface Email {
  content: string;
}

export interface InviteMembersDto extends GenericWithUserId {
  emails: Email[];
}
