import type React from "react";
import styled from "styled-components";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons/faRotateLeft";
import type { GetOrdersDto } from "../../../model/order/dto/GetOrdersDto";
import { Select } from "../../../components/Select";
import { OrderStatus } from "../../../model/order/types/OrderStatus.enum";
import capitalize from "lodash/capitalize";
import { OrderVisibility } from "../../../model/order/types/OrderVisibility.enum";
import { CreationDateFilters } from "../../../model/shared/types/CreationDateFilters.enum";

const statusOptions = [
  { label: "All", value: null },
  ...Object.values(OrderStatus).map((s) => ({
    label: capitalize(s),
    value: s,
  })),
];

const creationDateOptions = [
  {
    label: "Default",
    value: null,
  },
  {
    label: "Newest First",
    value: CreationDateFilters.NEWEST,
  },
  {
    label: "Oldest First",
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
`;

const PopoverSeparator = styled.hr`
  height: 1px;
  border-color: ${({ theme }) => theme.colors.border}50;
`;

// const Row = styled.div`
//   display: flex;
//   gap: ${({ theme }) => theme.spacing.xs};
// `;

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
  const [totalPriceRange, setTotalPriceRange] = useState<Range>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return (
    <PopoverBody>
      <PopoverContent>
        <Section>
          <Label>Creation date</Label>
          <Select
            placeholder="Default"
            value={filters.creationDate}
            onChange={(val) => applyFilter("creationDate", val)}
            options={creationDateOptions}
          />
        </Section>

        <PopoverSeparator />

        <Section>
          <Select
            title="Status"
            options={statusOptions}
            value={filters.status}
            onChange={(value) => applyFilter("status", value)}
          />
        </Section>

        <Section>
          <Label>Total price</Label>
          <RangeRow>
            <Input
              type="number"
              placeholder="Min"
              value={totalPriceRange?.min || ""}
              onChange={(e) => {
                setTotalPriceRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }));
                applyFilter(
                  "minTotalPrice",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
                );
              }}
              min={0}
            />
            <RangeDash>–</RangeDash>
            <Input
              type="number"
              placeholder="Max"
              value={totalPriceRange?.max || ""}
              onChange={(e) => {
                setTotalPriceRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }));
                applyFilter(
                  "maxTotalPrice",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
                );
              }}
              min={0}
            />
          </RangeRow>
        </Section>

        <Section>
          <Select
            title="Visibility"
            options={[
              { label: "All", value: null },
              { label: "Active", value: OrderVisibility.ACTIVE },
              { label: "Archived", value: OrderVisibility.ARCHIVED },
            ]}
            value={filters.visibility}
            onChange={(value) => applyFilter("visibility", value)}
          />
        </Section>
      </PopoverContent>

      {activeFiltersCount ? (
        <Footer>
          <Button icon={faRotateLeft} onClick={resetFilters}>
            Clear all
          </Button>
        </Footer>
      ) : null}
    </PopoverBody>
  );
};
