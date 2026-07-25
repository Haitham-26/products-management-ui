import type React from "react";
import styled from "styled-components";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../../../components/Button";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons/faRotateLeft";
import { Select } from "../../../components/Select";
import { SortKind } from "../../../model/shared/types/SortKind.enum";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import type { GetReturnsDto } from "../../../model/return/dto/GetReturnsDto";
import { DatePeriodFilters } from "../../../model/shared/types/DatePeriodFilters.enum";
import camelCase from "lodash/camelCase";
import { ReturnStatus } from "../../../model/return/types/ReturnStatus.enum";

const getSortByDateOptions = (t: TFunction) => [
  {
    label: t("common.default"),
    value: null,
  },
  {
    label: t("common.filters.creationDate.newest"),
    value: SortKind.NEWEST,
  },
  {
    label: t("common.filters.creationDate.oldest"),
    value: SortKind.OLDEST,
  },
];

const getDatePeriodOptions = (t: TFunction) => [
  {
    label: t("common.all"),
    value: null,
  },
  ...Object.values(DatePeriodFilters).map((d) => ({
    label: t(`common.${camelCase(d)}`),
    value: d,
  })),
];

const getStatusOptions = (t: TFunction) => [
  {
    label: t("common.all"),
    value: null,
  },
  ...Object.values(ReturnStatus).map((s) => ({
    label: t(`returns.status.${camelCase(s)}`),
    value: s,
  })),
];

const PopoverBody = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
`;

const PopoverContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 16rem;
  max-height: 45vh;
  overflow-y: auto;
  padding-inline-end: ${({ theme }) => theme.spacing.sm};
`;

const FiltersClearContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const PopoverSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const PopoverLabel = styled.label`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PopoverSeparator = styled.hr`
  height: 1px;
  border-color: ${({ theme }) => theme.colors.border}50;
`;

const PopoverFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
`;

type ReturnsFiltersProps = {
  filters: Partial<GetReturnsDto>;
  activeFiltersCount: number;
  applyFilter: (
    key: keyof GetReturnsDto,
    value: GetReturnsDto[keyof GetReturnsDto],
    debounce?: boolean,
  ) => void;
};

export const ReturnsFilters: React.FC<ReturnsFiltersProps> = ({
  filters,
  activeFiltersCount,
  applyFilter,
}) => {
  const [, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return (
    <PopoverBody>
      <PopoverContent>
        <PopoverSection>
          <PopoverLabel>{t("common.filters.creationDate.title")}</PopoverLabel>
          <Select
            placeholder={t("common.default")}
            value={filters.sortBy}
            onChange={(val) => applyFilter("sortBy", val)}
            options={getSortByDateOptions(t)}
          />
        </PopoverSection>

        <PopoverSection>
          <PopoverLabel>{t("common.filters.datePeriod.title")}</PopoverLabel>
          <Select
            placeholder={t("common.all")}
            value={filters.datePeriod}
            onChange={(val) => applyFilter("datePeriod", val)}
            options={getDatePeriodOptions(t)}
          />
        </PopoverSection>

        <PopoverSeparator />

        <PopoverSection>
          <PopoverLabel>{t("common.filters.status.title")}</PopoverLabel>
          <Select
            placeholder={t("common.all")}
            value={filters.status}
            onChange={(val) => applyFilter("status", val)}
            options={getStatusOptions(t)}
          />
        </PopoverSection>
      </PopoverContent>

      {activeFiltersCount ? (
        <FiltersClearContainer>
          <PopoverSeparator />
          <PopoverFooter>
            <Button icon={faRotateLeft} onClick={resetFilters}>
              {t("common.clearAll")}
            </Button>
          </PopoverFooter>
        </FiltersClearContainer>
      ) : null}
    </PopoverBody>
  );
};
