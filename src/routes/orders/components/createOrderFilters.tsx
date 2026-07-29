import styled from "styled-components";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "../../../components/Input";
import type { GetOrdersDto } from "../../../model/order/dto/GetOrdersDto";
import { Select } from "../../../components/Select";
import { OrderStatus } from "../../../model/order/types/OrderStatus.enum";
import { Checkbox } from "antd";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import camelCase from "lodash/camelCase";
import {
  getDatePeriodOptions,
  getSortByOptions,
} from "../../../utils/filtersSelectOptions";
import type { FiltersPopoverProps } from "../../../components/FiltersPopover";

const getStatusOptions = (t: TFunction) => [
  { label: t("common.all"), value: null },
  ...Object.values(OrderStatus).map((s) => ({
    label: t(`orders.status.${camelCase(s)}`),
    value: s,
  })),
];

const Label = styled.label`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};

  &:not(:first-child) {
    margin-top: ${({ theme }) => theme.spacing.xs};
  }
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

export default function CreateOrderFilters({
  activeFiltersCount,
  filters,
  applyFilter,
}: OrdersFiltersProps): FiltersPopoverProps {
  const [totalRevenueRange, setTotalRevenueRange] = useState<Range>({
    min: filters.minTotalRevenue ?? 0,
    max: filters.maxTotalRevenue ?? 0,
  });
  const [totalProfitRange, setTotalProfitRange] = useState<Range>({
    min: filters.minTotalProfit ?? 0,
    max: filters.maxTotalProfit ?? 0,
  });

  const [netRevenueRange, setNetRevenueRange] = useState<Range>({
    min: filters.minNetRevenue ?? 0,
    max: filters.maxNetRevenue ?? 0,
  });
  const [netProfitRange, setNetProfitRange] = useState<Range>({
    min: filters.minNetProfit ?? 0,
    max: filters.maxNetProfit ?? 0,
  });

  const { t } = useTranslation();
  const [, setSearchParams] = useSearchParams();

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });

    setTotalRevenueRange(null);
    setTotalProfitRange(null);
    setNetRevenueRange(null);
    setNetProfitRange(null);
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
            options={getStatusOptions(t)}
            value={filters.status}
            onChange={(value) => applyFilter("status", value)}
          />
        ),
      },
      {
        type: "separator",
      },
      {
        type: "item",
        title: t("orders.fields.totalRevenue"),
        children: (
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
        ),
      },
      {
        type: "item",
        title: t("orders.fields.totalProfit"),
        children: (
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
        ),
      },
      {
        type: "separator",
      },
      {
        type: "item",
        title: t("orders.fields.netRevenue"),
        children: (
          <RangeRow>
            <Input
              type="number"
              placeholder={t("common.min")}
              value={netRevenueRange?.min || ""}
              onChange={(e) => {
                setNetRevenueRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }));
                applyFilter(
                  "minNetRevenue",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
                );
              }}
            />
            <RangeDash>–</RangeDash>
            <Input
              type="number"
              placeholder={t("common.max")}
              value={netRevenueRange?.max || ""}
              onChange={(e) => {
                setNetRevenueRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }));
                applyFilter(
                  "maxNetRevenue",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
                );
              }}
            />
          </RangeRow>
        ),
      },
      {
        type: "item",
        title: t("orders.fields.netProfit"),
        children: (
          <RangeRow>
            <Input
              type="number"
              placeholder={t("common.min")}
              value={netProfitRange?.min || ""}
              onChange={(e) => {
                setNetProfitRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }));
                applyFilter(
                  "minNetProfit",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
                );
              }}
            />
            <RangeDash>–</RangeDash>
            <Input
              type="number"
              placeholder={t("common.max")}
              value={netProfitRange?.max || ""}
              onChange={(e) => {
                setNetProfitRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }));
                applyFilter(
                  "maxNetProfit",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
                );
              }}
            />
          </RangeRow>
        ),
      },
      {
        type: "separator",
      },
      {
        type: "item",
        children: (
          <Checkbox
            checked={filters.showArchived}
            onChange={(e) => applyFilter("showArchived", e.target.checked)}
          >
            <Label>{t("orders.filters.showArchived")}</Label>
          </Checkbox>
        ),
      },
    ],
    activeFiltersCount,
    onResetFilters: resetFilters,
  };
}
