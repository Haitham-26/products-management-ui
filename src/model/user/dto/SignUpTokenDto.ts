import type { AppLangs } from "../../app/types/AppLangs.enum";

export interface SignUpTokenDto {
  email: string;
  token: string;
  lang: AppLangs;
}
