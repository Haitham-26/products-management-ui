import type { AppLangs } from "../../app/types/AppLangs.enum";
import type { GoogleRedirectURLs } from "../types/GoogleRedirectURLs.enum";

export interface GoogleLoginDto {
  code: string;
  lang: AppLangs;
  redirectUrl: GoogleRedirectURLs;
}
