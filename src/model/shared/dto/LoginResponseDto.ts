import type { User } from "../../user/types/User";

export interface LoginResponseDto {
  accessToken: string;
  user: User;
}
