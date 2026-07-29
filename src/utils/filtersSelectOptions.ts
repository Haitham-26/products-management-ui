import { t } from "i18next";
import camelCase from "lodash/camelCase";
import { DatePeriodFilters } from "../model/shared/types/DatePeriodFilters.enum";
import { SortKind } from "../model/shared/types/SortKind.enum";

export const getDatePeriodOptions = () => [
  {
    label: t("common.all"),
    value: null,
  },
  ...Object.values(DatePeriodFilters).map((d) => ({
    label: t(`common.${camelCase(d)}`),
    value: d,
  })),
];

export const getSortByOptions = () => [
  {
    label: t("common.default"),
    value: null,
  },
  ...Object.values(SortKind).map((s) => ({
    label: t(`common.filters.sortBy.${camelCase(s)}`),
    value: s,
  })),
];
