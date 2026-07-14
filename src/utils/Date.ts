import i18n from "../i18n";

export const formatDate = (date: Date | string, showHour = false) => {
  const d = new Date(date);

  return d.toLocaleDateString(i18n.language, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(showHour && {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
};
