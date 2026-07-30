import type { AppLangs } from "../../app/types/AppLangs.enum";
import type { GoogleRedirectPaths } from "../types/GoogleRedirectPaths.enum";

export interface GoogleLoginDto {
  code: string;
  lang: AppLangs;
  redirectPath: GoogleRedirectPaths;
}
