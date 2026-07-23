import type { AppLangs } from "../../app/types/AppLangs.enum";

export interface Settings {
  _id: string;
  userId: string;
  inventory: {
    defaultMinStock: number;
  };
  lang: AppLangs;
  timeZone?: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}
