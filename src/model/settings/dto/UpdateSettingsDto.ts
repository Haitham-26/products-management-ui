import type { GenericWithUserId } from "../../shared/GenericWithUserId";

export interface UpdateSettingsDto extends GenericWithUserId {
  currency?: string;
  inventory?: {
    defaultMinStock?: number;
  };
}
