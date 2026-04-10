export const formatDate = (date: Date | string, showHour = false) => {
  const d = new Date(date);

  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(showHour && {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
};
