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
import { CreationDateFilters } from "../../../model/shared/types/CreationDateFilters.enum";
import { Checkbox } from "antd";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import camelCase from "lodash/camelCase";

const getStatusOptions = (t: TFunction) => [
  { label: t("common.all"), value: null },
  ...Object.values(OrderStatus).map((s) => ({
    label: t(`orders.status.${camelCase(s)}`),
    value: s,
  })),
];

const getCreationDateOptions = (t: TFunction) => [
  {
    label: t("common.default"),
    value: null,
  },
  {
    label: t("common.filters.creationDate.newest"),
    value: CreationDateFilters.NEWEST,
  },
  {
    label: t("common.filters.creationDate.oldest"),
    value: CreationDateFilters.OLDEST,
  },
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
  const [totalAmountRange, setTotalAmountRange] = useState<Range>(null);
  const [totalProfitRange, setTotalProfitRange] = useState<Range>(null);

  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });

    setTotalAmountRange(null);
    setTotalProfitRange(null);
  }, [setSearchParams]);

  return (
    <PopoverBody>
      <PopoverContent>
        <Section>
          <Label>{t("common.filters.creationDate.title")}</Label>
          <Select
            placeholder={t("common.default")}
            value={filters.creationDate}
            onChange={(val) => applyFilter("creationDate", val)}
            options={getCreationDateOptions(t)}
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
          <Label>{t("orders.fields.totalAmount")}</Label>
          <RangeRow>
            <Input
              type="number"
              placeholder={t("common.min")}
              value={totalAmountRange?.min || ""}
              onChange={(e) => {
                setTotalAmountRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }));
                applyFilter(
                  "minTotalAmount",
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
              value={totalAmountRange?.max || ""}
              onChange={(e) => {
                setTotalAmountRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }));
                applyFilter(
                  "maxTotalAmount",
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
