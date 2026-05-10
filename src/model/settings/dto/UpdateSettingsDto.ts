import type { GenericWithUserId } from "../../shared/GenericWithUserId";

export interface UpdateSettingsDto extends GenericWithUserId {
  inventory?: {
    defaultMinStock?: number;
  };
}
