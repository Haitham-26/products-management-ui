import type { UpdateSettingsDto } from "../../model/settings/dto/UpdateSettingsDto";
import type { Settings } from "../../model/settings/types/Settings";
import type { GenericWithUserId } from "../../model/shared/GenericWithUserId";
import AppAxios from "../AppAxios";

export class SettingsAxios {
  static getSettings(dto: GenericWithUserId) {
    return AppAxios.post<Settings>("/settings", dto).then(({ data }) => data);
  }

  static updateSettings(dto: UpdateSettingsDto) {
    return AppAxios.patch<void>("/settings/update", dto).then(
      ({ data }) => data,
    );
  }
}
