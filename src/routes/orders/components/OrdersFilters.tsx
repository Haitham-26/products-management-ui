import type React from "react";
import styled from "styled-components";
import { Fragment, useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons/faRotateLeft";
import type { GetOrdersDto } from "../../../model/order/dto/GetOrdersDto";
import { Select } from "../../../components/Select";
import { OrderStatus } from "../../../model/order/types/OrderStatus.enum";
import { SortKind } from "../../../model/shared/types/SortKind.enum";
import { Checkbox } from "antd";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import camelCase from "lodash/camelCase";
import { DatePeriodFilters } from "../../../model/shared/types/DatePeriodFilters.enum";

const getStatusOptions = (t: TFunction) => [
  { label: t("common.all"), value: null },
  ...Object.values(OrderStatus).map((s) => ({
    label: t(`orders.status.${camelCase(s)}`),
    value: s,
  })),
];

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

const PopoverBody = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
`;

const PopoverContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 16rem;
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
  color: ${({ theme }) => theme.colors.textSecondary};

  &:not(:first-child) {
    margin-top: ${({ theme }) => theme.spacing.xs};
  }
`;

const PopoverSeparator = styled.hr`
  height: 1px;
  border-color: ${({ theme }) => theme.colors.border}50;
  margin-top: ${({ theme }) => theme.spacing.sm};
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
  margin-top: ${({ theme }) => theme.spacing.md};
`;

type Range = {
  min?: number;
  max?: number;
} | null;

type OrdersFiltersProps = {
  activeFiltersCount: number;
  filters: Partial<GetOrdersDto>;
  applyFilter: (
    key: keyof GetOrdersDto,
    value: GetOrdersDto[keyof GetOrdersDto],
    debounce?: boolean,
  ) => void;
};

export const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  activeFiltersCount,
  filters,
  applyFilter,
}) => {
  const [totalRevenueRange, setTotalRevenueRange] = useState<Range>({
    min: filters.minTotalRevenue ?? 0,
    max: filters.maxTotalRevenue ?? 0,
  });
  const [totalProfitRange, setTotalProfitRange] = useState<Range>({
    min: filters.minTotalProfit ?? 0,
    max: filters.maxTotalProfit ?? 0,
  });

  const { t } = useTranslation();
  const [, setSearchParams] = useSearchParams();

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });

    setTotalRevenueRange(null);
    setTotalProfitRange(null);
  }, [setSearchParams]);

  return (
    <PopoverBody>
      <PopoverContent>
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

        <PopoverSeparator />

        <Section>
          <Select
            title={t("common.status")}
            options={getStatusOptions(t)}
            value={filters.status}
            onChange={(value) => applyFilter("status", value)}
          />
        </Section>

        <PopoverSeparator />

        <Section>
          <Label>{t("orders.fields.totalRevenue")}</Label>
          <RangeRow>
            <Input
              type="number"
              placeholder={t("common.min")}
              value={totalRevenueRange?.min || ""}
              onChange={(e) => {
                setTotalRevenueRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }));
                applyFilter(
                  "minTotalRevenue",
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
              value={totalRevenueRange?.max || ""}
              onChange={(e) => {
                setTotalRevenueRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }));
                applyFilter(
                  "maxTotalRevenue",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
                );
              }}
              min={0}
            />
          </RangeRow>

          <Label>{t("orders.fields.totalProfit")}</Label>
          <RangeRow>
            <Input
              type="number"
              placeholder={t("common.min")}
              value={totalProfitRange?.min || ""}
              onChange={(e) => {
                setTotalProfitRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }));
                applyFilter(
                  "minTotalProfit",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
                );
              }}
            />
            <RangeDash>–</RangeDash>
            <Input
              type="number"
              placeholder={t("common.max")}
              value={totalProfitRange?.max || ""}
              onChange={(e) => {
                setTotalProfitRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }));
                applyFilter(
                  "maxTotalProfit",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
                );
              }}
            />
          </RangeRow>
        </Section>

        <PopoverSeparator />

        <Section>
          <Checkbox
            checked={filters.showArchived}
            onChange={(e) => applyFilter("showArchived", e.target.checked)}
          >
            <Label>{t("orders.filters.showArchived")}</Label>
          </Checkbox>
        </Section>
      </PopoverContent>

      {activeFiltersCount ? (
        <Fragment>
          <PopoverSeparator />

          <Footer>
            <Button icon={faRotateLeft} onClick={resetFilters}>
              {t("common.clearAll")}
            </Button>
          </Footer>
        </Fragment>
      ) : null}
    </PopoverBody>
  );
};
