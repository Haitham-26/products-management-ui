import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";

export interface GenericWithMemberId extends GenericWithUserId {
  memberId: string;
}
