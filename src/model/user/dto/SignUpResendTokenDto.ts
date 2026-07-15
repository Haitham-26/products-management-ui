import type { AppLangs } from "../../app/types/AppLangs.enum";

export interface SignUpResendTokenDto {
  email: string;
  lang: AppLangs;
  dir: "rtl" | "ltr";
}
