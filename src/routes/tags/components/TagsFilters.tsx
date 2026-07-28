import type React from "react";
import styled from "styled-components";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons/faRotateLeft";
import type { GetTagsDto } from "../../../model/tag/dto/GetTagsDto";
import { Select } from "../../../components/Select";
import { SortKind } from "../../../model/shared/types/SortKind.enum";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import camelCase from "lodash/camelCase";
import { DatePeriodFilters } from "../../../model/shared/types/DatePeriodFilters.enum";

const getSortByOptions = (t: TFunction) => [
  {
    label: t("common.default"),
    value: null,
  },
  {
    label: t("common.filters.sortBy.newest"),
    value: SortKind.NEWEST,
  },
  {
    label: t("common.filters.sortBy.oldest"),
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

const Body = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
`;

const Content = styled.div`
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

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Separator = styled.hr`
  height: 1px;
  border-color: ${({ theme }) => theme.colors.border}50;
`;

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

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
`;

type Range = {
  min?: number;
  max?: number;
} | null;

type TagsFiltersProps = {
  filters: Partial<GetTagsDto>;
  activeFiltersCount: number;
  applyFilter: (
    key: keyof GetTagsDto,
    value: GetTagsDto[keyof GetTagsDto],
    debounce?: boolean,
  ) => void;
};

export const TagsFilters: React.FC<TagsFiltersProps> = ({
  filters,
  activeFiltersCount,
  applyFilter,
}) => {
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

  return (
    <Body>
      <Content>
        <Section>
          <Label>{t("common.sortBy")}</Label>
          <Select
            placeholder={t("common.default")}
            value={filters.sortBy}
            onChange={(val) => applyFilter("sortBy", val)}
            options={getSortByOptions(t)}
          />
        </Section>

        <Section>
          <Label>{t("common.creationDate")}</Label>
          <Select
            placeholder={t("common.allTimes")}
            value={filters.datePeriod}
            onChange={(val) => applyFilter("datePeriod", val)}
            options={getDatePeriodOptions(t)}
          />
        </Section>

        <Separator />

        <Section>
          <Label>{t("tags.fields.usageCount")}</Label>
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
        </Section>
      </Content>

      {activeFiltersCount ? (
        <FiltersClearContainer>
          <Separator />
          <Footer>
            <Button icon={faRotateLeft} onClick={resetFilters}>
              {t("common.clearAll")}
            </Button>
          </Footer>
        </FiltersClearContainer>
      ) : null}
    </Body>
  );
};
