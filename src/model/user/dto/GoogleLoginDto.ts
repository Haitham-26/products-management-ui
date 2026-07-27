import type { AppLangs } from "../../app/types/AppLangs.enum";

export interface GoogleLoginDto {
  idToken: string;
  lang: AppLangs;
}
