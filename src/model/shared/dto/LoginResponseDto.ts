import type { User } from "../../user/types/User";

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: User;
}
