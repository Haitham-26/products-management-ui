import styled from "styled-components";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "../../../components/Input";
import type { GetTagsDto } from "../../../model/tag/dto/GetTagsDto";
import { Select } from "../../../components/Select";
import { useTranslation } from "react-i18next";
import {
  getDatePeriodOptions,
  getSortByOptions,
} from "../../../utils/filtersSelectOptions";
import type { FiltersPopoverProps } from "../../../components/FiltersPopover";

const RangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  input {
    flex: 1;
    min-width: 0;
  }
`;

const RangeDash = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
`;

type Range = {
  min?: number;
  max?: number;
} | null;

type TagFiltersProps = {
  filters: Partial<GetTagsDto>;
  activeFiltersCount: number;
  applyFilter: (
    key: keyof GetTagsDto,
    value: GetTagsDto[keyof GetTagsDto],
    debounce?: boolean,
  ) => void;
};

export function useTagFilters({
  filters,
  activeFiltersCount,
  applyFilter,
}: TagFiltersProps): FiltersPopoverProps {
  const [usageCountRange, setUsageCountRange] = useState<Range>({
    min: filters.minUsageCount ?? 0,
    max: filters.maxUsageCount ?? 0,
  });

  const [, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });

    setUsageCountRange(null);
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
      { type: "separator" },
      {
        type: "item",
        title: t("tags.fields.usageCount"),
        children: (
          <RangeRow>
            <Input
              type="number"
              placeholder={t("common.min")}
              value={usageCountRange?.min || ""}
              onChange={(e) => {
                setUsageCountRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }));
                applyFilter(
                  "minUsageCount",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
                );
              }}
              min={0}
            />
            <RangeDash>–</RangeDash>
            <Input
              type="number"
              placeholder={t("common.max")}
              value={usageCountRange?.max || ""}
              onChange={(e) => {
                setUsageCountRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }));
                applyFilter(
                  "maxUsageCount",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
                );
              }}
              min={0}
            />
          </RangeRow>
        ),
      },
    ],
    activeFiltersCount,
    onResetFilters: resetFilters,
  };
}
