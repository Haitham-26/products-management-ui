import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";

export interface ResetPasswordDto extends GenericWithUserId {
  currentPassword: string;
  newPassword: string;
}
