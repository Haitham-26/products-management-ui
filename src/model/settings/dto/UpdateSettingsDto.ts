import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";

export interface UpdateSettingsDto extends GenericWithUserId {
  currency?: string;
  inventory?: {
    defaultMinStock?: number;
  };
}
