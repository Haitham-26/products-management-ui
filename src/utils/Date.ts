import dayjs from "dayjs";
import i18n from "../i18n";
import type { Settings } from "../model/settings/types/Settings";
import type { Dayjs } from "dayjs";
import type { TFunction } from "i18next";

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

export const getDateRangeLabel = (
  dateRange: [Dayjs, Dayjs],
  t: TFunction,
): string => {
  const [start, end] = dateRange;
  const isToday = start.isSame(end, "day") && start.isSame(dayjs(), "day");

  if (isToday) {
    return t("common.today");
  }

  return `${start.format("YY-M-D")} - ${end.format("YY-M-D")}`;
};
