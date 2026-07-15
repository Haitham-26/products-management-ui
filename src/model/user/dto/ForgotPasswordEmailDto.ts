import type { AppLangs } from "../../app/types/AppLangs.enum";

export interface ForgotPasswordEmailDto {
  email: string;
  lang: AppLangs;
  dir: "rtl" | "ltr";
}
