import type { User } from "../../user/types/User";

export interface LoginResponseDto {
  token: string;
  user: User;
}
