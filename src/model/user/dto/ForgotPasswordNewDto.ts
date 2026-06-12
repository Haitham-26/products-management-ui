import type { ForgotPasswordTokenDto } from "./ForgotPasswordTokenDto";

export interface ForgotPasswordNewDto extends ForgotPasswordTokenDto {
  newPassword: string;
}
