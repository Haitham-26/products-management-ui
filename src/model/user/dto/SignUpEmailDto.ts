import type { AppLangs } from "../../app/types/AppLangs.enum";

export interface SignUpEmailDto {
  name: string;
  email: string;
  company?: string;
  password: string;
  lang: AppLangs;
  dir: "rtl" | "ltr";
}
