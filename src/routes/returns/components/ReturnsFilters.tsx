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

const Footer = styled.div`
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
    <Body>
      <Content>
        <Section>
          <Label>{t("common.sortBy")}</Label>
          <Select
            placeholder={t("common.default")}
            value={filters.sortBy}
            onChange={(val) => applyFilter("sortBy", val)}
            options={getSortByDateOptions(t)}
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
          <Label>{t("common.status")}</Label>
          <Select
            placeholder={t("common.all")}
            value={filters.status}
            onChange={(val) => applyFilter("status", val)}
            options={getStatusOptions(t)}
          />
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
