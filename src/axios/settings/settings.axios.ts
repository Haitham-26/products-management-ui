import type { UpdateSettingsDto } from "../../model/settings/dto/UpdateSettingsDto";
import type { Settings } from "../../model/settings/types/Settings";
import AppAxios from "../AppAxios";

export class SettingsAxios {
  static getSettings() {
    return AppAxios.get<Settings>("/settings").then(({ data }) => data);
  }

  static updateSettings(dto: UpdateSettingsDto) {
    return AppAxios.patch<void>("/settings/update", dto).then(
      ({ data }) => data,
    );
  }
}
