import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Select } from "../../../components/Select";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import type { GetReturnsDto } from "../../../model/return/dto/GetReturnsDto";
import camelCase from "lodash/camelCase";
import { ReturnStatus } from "../../../model/return/types/ReturnStatus.enum";
import type { FiltersPopoverProps } from "../../../components/FiltersPopover";
import {
  getDatePeriodOptions,
  getSortByOptions,
} from "../../../utils/filtersSelectOptions";

const getStatusOptions = (t: TFunction) => [
  {
    label: t("common.all"),
    value: null,
  },
  ...Object.values(ReturnStatus).map((s) => ({
    label: t(`returns.fields.status.${camelCase(s)}`),
    value: s,
  })),
];

type ReturnFiltersProps = {
  filters: Partial<GetReturnsDto>;
  activeFiltersCount: number;
  applyFilter: (
    key: keyof GetReturnsDto,
    value: GetReturnsDto[keyof GetReturnsDto],
    debounce?: boolean,
  ) => void;
};

export function useReturnFilters({
  filters,
  activeFiltersCount,
  applyFilter,
}: ReturnFiltersProps): FiltersPopoverProps {
  const [, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return {
    items: [
      {
        type: "item",

        title: t("common.sortBy"),
        children: (
          <Select
            placeholder={t("common.default")}
            value={filters.sortBy}
            onChange={(val) => applyFilter("sortBy", val)}
            options={getSortByOptions()}
          />
        ),
      },
      {
        type: "item",
        title: t("common.creationDate"),
        children: (
          <Select
            placeholder={t("common.allTimes")}
            value={filters.datePeriod}
            onChange={(val) => applyFilter("datePeriod", val)}
            options={getDatePeriodOptions()}
          />
        ),
      },
      {
        type: "separator",
      },
      {
        type: "item",
        title: t("common.status"),
        children: (
          <Select
            placeholder={t("common.all")}
            value={filters.status}
            onChange={(val) => applyFilter("status", val)}
            options={getStatusOptions(t)}
          />
        ),
      },
    ],
    onResetFilters: resetFilters,
    activeFiltersCount,
  };
}
