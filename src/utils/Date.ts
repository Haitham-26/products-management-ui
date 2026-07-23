import i18n from "../i18n";
import type { Settings } from "../model/settings/types/Settings";

export const formatDate = (
  date: Date | string,
  showHour = false,
  timeZone: Settings["timeZone"],
) => {
  const d = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(showHour && {
      hour: "2-digit",
      minute: "2-digit",
    }),
    ...(timeZone ? { timeZone } : {}),
  };

  return showHour
    ? d.toLocaleString(i18n.language, options)
    : d.toLocaleDateString(i18n.language, options);
};
